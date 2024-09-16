import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {  AuthenticationRequestDTO, } from '../interfaces/authentication-request-dto';
import { AuthenticationResponseDTO } from '../interfaces/authentication-response-dto';
import { RegisterRequestDTO } from '../interfaces/register-request-dto';

@Injectable({
  providedIn: 'root'  
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/v1/auth';  

  constructor(private http: HttpClient) {}

  register(data: RegisterRequestDTO): Observable<AuthenticationResponseDTO> {
    return this.http.post<AuthenticationResponseDTO>(`${this.apiUrl}/register`, data);
  }

  authenticate(data: AuthenticationRequestDTO): Observable<AuthenticationResponseDTO> {
    return this.http.post<AuthenticationResponseDTO>(`${this.apiUrl}/authenticate`, data);
  }

  isAuthenticated(): boolean {
    const token = sessionStorage.getItem('authToken'); 
    return token !== null; 
  }
}
