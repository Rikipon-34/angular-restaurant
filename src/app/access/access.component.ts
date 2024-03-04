import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-access',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule],
  templateUrl: './access.component.html',
  styleUrl: './access.component.css',
})
export class AccessComponent {
  loginForm: FormGroup;
  errorMessage: string;
  isFormSubmitted = false;
  successMessage: string;

  constructor(
    private router: Router,
    private http: HttpClient,
    private fb: FormBuilder
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  login() {
    this.isFormSubmitted = true;
    if (this.loginForm.valid) {
      const userData = this.loginForm.value;
      const apiUrl = 'http://localhost:8080/user/login';
      this.http.post(apiUrl, userData).subscribe(
        (response: any) => {
          this.successMessage = 'Autenticazione effettuata';
          setTimeout(() => {
            this.navigateToLogin();
          }, 3000);
        },
        (error: any) => {
          console.error('Login failed:', error);
          if (error.status === 401) {
            this.errorMessage = 'Email o password non valide';
          } else {
            this.errorMessage = 'Errore durante il login';
          }
        }
      );
    }
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
