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

@Component({
    selector: 'app-chat',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        InputTextModule,
        ScrollPanelModule,
        ChatMessageComponent
    ],
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.css'],
    providers: [ChatService]
})
export class ChatComponent implements AfterViewChecked {
    messages: { text: string, sender: 'user' | 'bot' }[] = [];
    userInput: string = '';

    @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

    constructor(private chatService: ChatService) {}

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
    
            this.chatService.sendMessage(chatRequest).subscribe((response: ChatResponseDTO) => {
                const botMessage: { text: string; sender: 'user' | 'bot' } = { 
                    text: response.message, 
                    sender: 'bot' 
                };
                this.messages.push(botMessage);
                this.scrollToBottom();
            });
    
            this.userInput = '';
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
