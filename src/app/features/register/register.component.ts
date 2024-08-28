import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { PasswordModule } from 'primeng/password';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [InputGroupModule, InputGroupAddonModule, PasswordModule, FormsModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  registerForm: FormGroup;
  
 

  constructor(private formBuilder: FormBuilder, private http: HttpClient) { 
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    let bodyData = {
     "email": this.registerForm.value.email,
     "password": this.registerForm.value.password
    };

    console.log(bodyData)

    this.http.post('http://localhost:8080/api/v1/auth/register', bodyData).subscribe((response) => {
      
      console.log(response);
    });

  }
  
}
