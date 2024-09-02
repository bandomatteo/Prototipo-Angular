import { Component, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { CommonModule } from '@angular/common';
import { ChatMessageComponent } from '../chat-message/chat-message.component';

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
export class ChatComponent implements AfterViewChecked {
    messages: Message[] = [];
    userInput: string = '';

    @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

    ngAfterViewChecked() {
        this.scrollToBottom();
    }

    sendMessage() {
        if (this.userInput.trim()) {
            this.messages.push({ text: this.userInput, sender: 'user' });
            this.userInput = '';
            setTimeout(() => this.generateBotResponse(), 1000);
        }
    }

    generateBotResponse() {
        this.messages.push({ text: 'This is a response from ChatGPT!This is a response from ChatGPT!This is a response from ChatGPT!This is a response from ChatGPT!This is a response from ChatGPT!This is a response from ChatGPT!This is a response from ChatGPT!This is a response from ChatGPT!This is a response from ChatGPT!This is a response from ChatGPT!', sender: 'bot' });
        this.scrollToBottom();
    }

    private scrollToBottom(): void {
        try {
            this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
        } catch (err) {
            console.error('Could not scroll to bottom:', err);
        }
    }
}
