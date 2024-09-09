import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../services/auth-service.service';
import { AuthenticationRequestDTO } from '../../interfaces/authentication-request-dto';
import { AuthenticationResponseDTO } from '../../interfaces/authentication-response-dto';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageModule } from 'primeng/message';
import { Router } from '@angular/router';  

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    ToastModule,
    MessageModule
  ],
  providers: [MessageService],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please correct the errors in the form' });
      return;
    }

    const loginData: AuthenticationRequestDTO = this.loginForm.value;
    this.authService.authenticate(loginData).subscribe(
      (response: AuthenticationResponseDTO) => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Login successful' });
        
        // Usa sessionStorage
        sessionStorage.setItem('authToken', response.token);
        sessionStorage.setItem('userId', response.userId.toString());

        console.log('Id Salvato', sessionStorage.getItem('userId'));
        this.router.navigate(['/chat']);
      },
      () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Login failed. Please try again.' });
      }
    );
  }
}
