import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'; 
import { MessageService } from 'primeng/api';
import { AuthService } from  '../../services/auth-service.service';
import { RegisterRequestDTO } from '../../interfaces/register-request-dto';
import { AuthenticationResponseDTO } from '../../interfaces/authentication-response-dto'; 
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageModule } from 'primeng/message';
import { Router } from '@angular/router';  

@Component({
  selector: 'app-register',
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
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please correct the errors in the form' });
      return;
    }

    const registerData: RegisterRequestDTO = this.registerForm.value;
    this.authService.register(registerData).subscribe(
      (response: AuthenticationResponseDTO) => { 
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Registration completed successfully' });
        console.log('Token ricevuto:', response.token);
        
        
        sessionStorage.setItem('authToken', response.token); 
        sessionStorage.setItem('userId', response.userId.toString());

        console.log('Id Salvato', sessionStorage.getItem('userId'));
        
        this.router.navigate(['/chat']);
      },
      () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Registration failed. Please try again.' });
      }
    );
  }
}
