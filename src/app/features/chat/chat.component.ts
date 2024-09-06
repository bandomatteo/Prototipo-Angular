import { Component, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { CommonModule } from '@angular/common';
import { ChatMessageComponent } from '../chat-message/chat-message.component';
import { ChatService } from '../../services/chat.service';
import { ChatRequestDTO } from '../../interfaces/chat-request-dto';
import { ChatResponseDTO } from '../../interfaces/chat-response-dto';
import { FileUploadModule, FileUpload } from 'primeng/fileupload';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { MessageModule } from 'primeng/message';
import { HttpResponse, HttpStatusCode } from '@angular/common/http';

@Component({
    selector: 'app-chat',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        InputTextModule,
        ScrollPanelModule,
        ChatMessageComponent,
        FileUploadModule,
        ToastModule,
        MessageModule // Aggiungi ToastModule e MessageModule
    ],
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.css'],
    providers: [ChatService, MessageService] // Aggiungi MessageService come provider
})
export class ChatComponent implements AfterViewChecked {
    messages: { text: string, sender: 'user' | 'bot' }[] = [];
    userInput: string = '';
    isUploading: boolean = false; // Nuova variabile per gestire il caricamento

    @ViewChild('messagesContainer') private messagesContainer!: ElementRef;
    @ViewChild('fileUploader') fileUploader!: FileUpload; // Riferimento al componente FileUpload

    constructor(
        private chatService: ChatService,
        private messageService: MessageService // Iniettiamo MessageService
    ) { }

    ngAfterViewChecked() {
        this.scrollToBottom();
    }

    sendMessage() {
        if (this.userInput.trim()) {
            const userMessage: { text: string; sender: 'user' | 'bot' } = {
                text: this.userInput,
                sender: 'user'
            };
            this.messages.push(userMessage);

            const chatRequest: ChatRequestDTO = {
                id: +localStorage.getItem('userId')!,
                message: this.userInput
            };

            this.chatService.sendMessage(chatRequest).subscribe(
                (response: ChatResponseDTO) => {
                    const botMessage: { text: string; sender: 'user' | 'bot' } = {
                        text: response.message,
                        sender: 'bot'
                    };
                    this.messages.push(botMessage);
                    this.scrollToBottom();

                    
                },
                (error) => {
                    // Gestione dell'errore per il limite di token
                    if (error.status === 400 || error.status === 403) {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Token Limit Exceeded',
                            detail: 'You have exceeded the maximum number of tokens for this request. Please try again with a shorter message or contact support.'
                        });
                    } else {
                        // Messaggio di errore generico
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Message sending failed. Please try again.' });
                    }
                }
            );

            this.userInput = '';
        }
    }

    onFileUpload(event: any) {
        if (this.isUploading) {
            // Evita l'upload multiplo
            this.messageService.add({ severity: 'info', summary: 'File Upload', detail: 'A file is already being uploaded. Please wait.' });
            return;
        }
    
        this.isUploading = true;  // Impedisce caricamenti multipli
    
        const uploadedFile = event.files[0];
    
        if (uploadedFile) {
            const formData: FormData = new FormData();
            formData.append('file', uploadedFile, uploadedFile.name);
            formData.append('userId', localStorage.getItem('userId')!);
    
            this.chatService.uploadFile(formData).subscribe({
                next: (response) => {
                    // Filtra solo l'evento di tipo _HttpResponse, ignora _HttpHeaderResponse
                    if (response instanceof HttpResponse) {  // Verifica se è la risposta completa
                        this.isUploading = false; // Resetta lo stato di caricamento
                        this.messageService.add({ severity: 'success', summary: 'File Upload', detail: 'File uploaded successfully' });
                        console.log('Upload completed successfully:', response);
                    }
                },
                error: (err) => {
                    this.isUploading = false; // Reset dello stato in caso di errore
                    console.error('Upload error:', err);
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'File upload failed. Please try again.' });
                }
            });
        } else {
            this.isUploading = false; // Resetta lo stato se non c'è alcun file
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No file selected' });
        }
    }
    






    private scrollToBottom(): void {
        try {
            this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
        } catch (err) {
            console.error('Could not scroll to bottom:', err);
        }
    }
}
