import { Component, ViewChild, ElementRef, AfterViewChecked, ViewEncapsulation } from '@angular/core';
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
import { Router } from '@angular/router';  // Importa il router

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
        MessageModule 
    ],
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.css'],
    providers: [ChatService, MessageService],
    encapsulation: ViewEncapsulation.None  
})
export class ChatComponent implements AfterViewChecked {
    messages: { text: string, sender: 'user' | 'bot' }[] = [];
    userInput: string = '';
    isUploading: boolean = false; 
    errorCount: number = 0;  // Contatore degli errori consecutivi

    @ViewChild('messagesContainer') private messagesContainer!: ElementRef;
    @ViewChild('fileUploader') fileUploader!: FileUpload; 
    

    constructor(
        private chatService: ChatService,
        private messageService: MessageService,
        private router: Router  // Inietti il router
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
                id: +sessionStorage.getItem('userId')!,
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
    
                    this.errorCount = 0;  // Reset contatore errori dopo un successo
                },
                (error) => {
                    this.errorCount++;  // Incrementa il contatore degli errori
    
                    if (this.errorCount >= 3) {
                        // Mostra il messaggio di errore e attendi 3 secondi prima di reindirizzare
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Errore',
                            detail: 'Troppi errori. Sarai reindirizzato alla pagina di login in 3 secondi.'
                        });
    
                        // Attendi 3 secondi prima di cancellare sessionStorage e reindirizzare
                        setTimeout(() => {
                            sessionStorage.clear();
                            this.router.navigate(['/login']);
                        }, 3000); // 3 secondi di attesa
                    } else {
                        if (error.status === 400 || error.status === 403) {
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Errore',
                                detail: 'Si è verificato un errore durante l\'elaborazione della richiesta. Riprova più tardi.'
                            });
                        } else {
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Errore',
                                detail: 'Qualcosa è andato storto. Per favore riprova.'
                            });
                        }
                    }
                }
            );
    
            this.userInput = '';
        }
    }
    

    onFileUpload(event: any) {
        if (this.isUploading) {
            this.messageService.add({ severity: 'info', summary: 'File Upload', detail: 'A file is already being uploaded. Please wait.' });
            return;
        }
    
        this.isUploading = true;  
    
        const uploadedFile = event.files[0];
    
        if (uploadedFile) {
            const formData: FormData = new FormData();
            formData.append('file', uploadedFile, uploadedFile.name);
            formData.append('userId', sessionStorage.getItem('userId')!);  // Usa sessionStorage
    
            this.chatService.uploadFile(formData).subscribe({
                next: (response) => {
                    if (response instanceof HttpResponse) {  
                        this.isUploading = false; 
                        this.messageService.add({ severity: 'success', summary: 'File Upload', detail: 'File uploaded successfully' });
                        console.log('Upload completed successfully:', response);
                        
                        this.fileUploader.clear();
                    }
                },
                error: (err) => {
                    this.isUploading = false; 
                    console.error('Upload error:', err);
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'File upload failed. Please try again.' });
    
                    this.fileUploader.clear();
                }
            });
        } else {
            this.isUploading = false; 
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
