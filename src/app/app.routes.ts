import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MenuComponent } from './menu/menu.component';
import { AccessComponent } from './access/access.component';
import { RegisterComponent } from './register/register.component';

export const routes: Routes = [
  { path: 'menu', component: MenuComponent },
  { path: 'login', component: LoginComponent },
  { path: 'access', component: AccessComponent },
  { path: 'register', component: RegisterComponent },
];
