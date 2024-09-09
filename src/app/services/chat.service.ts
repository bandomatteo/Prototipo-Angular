import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ChatRequestDTO } from '../interfaces/chat-request-dto';
import { ChatResponseDTO } from '../interfaces/chat-response-dto';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = 'http://localhost:8080/chat';  

  constructor(private http: HttpClient) {}

  sendMessage(data: ChatRequestDTO): Observable<ChatResponseDTO> {
    return this.http.post<ChatResponseDTO>(this.apiUrl, data);
  }

  uploadFile(formData: FormData): Observable<any> {
    return this.http.post('http://localhost:8080/loader/single', formData, {
        reportProgress: true,
        observe: 'events'
    });
}

}
