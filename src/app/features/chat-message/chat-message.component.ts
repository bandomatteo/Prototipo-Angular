import { Component, Input } from '@angular/core';
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
export class ChatMessageComponent {
    @Input() message!: Message;
}
