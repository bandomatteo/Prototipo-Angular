import { Component, Input, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
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
export class ChatMessageComponent implements AfterViewChecked {
    @Input() message!: Message;
    @ViewChild('messagesContainer', { static: false }) private messagesContainer!: ElementRef;

    ngAfterViewChecked() {
        this.scrollToBottom();
    }

    private scrollToBottom(): void {
        try {
            this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
        } catch (err) {
            console.error('Scroll to bottom failed:', err);
        }
    }
}
