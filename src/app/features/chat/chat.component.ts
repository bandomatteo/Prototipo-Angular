import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { CommonModule } from '@angular/common';
import { ChatMessageComponent } from '../chat-message/chat-message.component';

//TODO: Refactor
interface Message {
    text: string;
    sender: 'user' | 'bot';
}

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
    styleUrls: ['./chat.component.css']
})
export class ChatComponent {
    messages: Message[] = [  ];
    userInput: string = '';

    @ViewChild('messagesContainer') private messagesContainer!: ElementRef

    sendMessage() {
        if (this.userInput.trim()) {
            this.messages.push({ text: this.userInput, sender: 'user' });
            this.userInput = '';
            setTimeout(() => this.scrollToBottom(), 100);
            this.generateBotResponse();
        }
    }

    generateBotResponse() {
        
        setTimeout(() => {
            this.messages.push({ text: 'This is a response from ChatGPT!This is a response from ChatGPT!This is a response from ChatGPT!This is a response from ChatGPT!This is a response from ChatGPT!This is a response from ChatGPT!This is a response from ChatGPT!This is a response from ChatGPT!This is a response from ChatGPT!This is a response from ChatGPT!', sender: 'bot' });
            this.scrollToBottom();
        }, 1000);
    }

    private scrollToBottom(): void {
        try {
            this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
        } catch(err) { }
    }
}
