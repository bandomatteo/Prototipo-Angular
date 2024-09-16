import { Component, Input, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { CommonModule } from '@angular/common';

interface Message {
    text: string;
    sender: 'user' | 'bot';
}

@Component({
    selector: 'app-chat-message',
    standalone: true,
    imports: [CommonModule, CardModule, AvatarModule],
    templateUrl: './chat-message.component.html',
    styleUrls: ['./chat-message.component.css']
})
export class ChatMessageComponent implements AfterViewInit {
    @Input() message!: Message;
    @ViewChild('messagesContainer', { static: false }) private messagesContainer!: ElementRef;

    ngAfterViewInit() {
        this.scrollToBottom();
    }

    private scrollToBottom(): void {
        if (this.messagesContainer && this.messagesContainer.nativeElement) {
            this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
        } else {
            console.warn('messagesContainer is undefined or does not have a nativeElement');
        }
    }
}
