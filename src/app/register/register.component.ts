import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  username: string = '';
  email: string = '';
  password: string = '';
  registrationForm: FormGroup;
  submitted: boolean = false;
  userForm: FormGroup;
  title: any;
  successMessage: string;
  errorMessage: string;
  isFormSubmitted = false;
  constructor(
    private router: Router,
    private http: HttpClient,
    private fb: FormBuilder
  ) {
    this.registrationForm = this.fb.group({
      userName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  navigateToAccess(): void {
    this.router.navigate(['/access']);
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
  submit() {
    this.isFormSubmitted = true;
    if (this.registrationForm.valid) {
      this.registerAndNavigate();
    }
  }
  registerAndNavigate() {
    if (this.registrationForm.valid) {
      const userData = this.registrationForm.value;
      const apiUrl = 'http://localhost:8080/user/register';
      this.http
        .post(apiUrl, userData, { responseType: 'text' as 'json' })
        .subscribe(
          (response: any) => {
            this.successMessage = 'Registration successful!';
            this.navigateToLogin();
          },
          (error: any) => {
            console.error('Registration failed:', error);
            if (error.status === 400) {
              this.errorMessage =
                'User with this email or firstName already exists';
            } else {
              this.errorMessage = 'Unexpected error occurred.';
            }
          }
        );
    }
  }
}
