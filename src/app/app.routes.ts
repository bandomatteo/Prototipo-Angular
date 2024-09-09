import { Routes } from '@angular/router';
import { RegisterComponent } from './features/register/register.component';
import { LoginComponent } from './features/login/login.component';
import { ChatComponent } from './features/chat/chat.component';
import { AuthGuard } from './guards/auth.guard'; // Importa la guardia

export const routes: Routes = [
    {
        path: 'register', component: RegisterComponent
    },
    {
        path: 'login', component: LoginComponent
    },
    {
        path: 'chat', component: ChatComponent, canActivate: [AuthGuard] 
    },
    { 
        path: '', redirectTo: 'chat', pathMatch: 'full' 
    },
    {
        path: '**', redirectTo: 'chat'
    }
];
