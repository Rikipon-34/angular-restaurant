import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-access',
  standalone: true,
  imports: [],
  templateUrl: './access.component.html',
  styleUrl: './access.component.css',
})
export class AccessComponent {
  constructor(private router: Router) {}

  navigateToLogin() {
    this.router.navigate(['login']);
  }
}
