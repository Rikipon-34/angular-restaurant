import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}

  navigateToRegister() {
    this.router.navigate(['/register']);
  }

  navigateToMenu() {
    this.router.navigate(['/menu']);
  }
}
