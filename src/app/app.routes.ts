import { Routes } from '@angular/router';
import { RegisterComponent } from './features/register/register.component';
import { LoginComponent } from './features/login/login.component';
import { ChatComponent } from './features/chat/chat.component';

export const routes: Routes = [
    {
        path: 'register', component: RegisterComponent
    },
    {
        path: 'login', component: LoginComponent
    },
    {
        path: 'chat', component: ChatComponent
    },
    { 
        path: '', redirectTo: 'chat', pathMatch: 'full' 
    },
    {
        path: '**', redirectTo: 'chat'
    }
];
