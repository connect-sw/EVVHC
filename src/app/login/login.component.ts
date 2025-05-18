import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(private router: Router) {}

  loginAs(user: string): void {
    localStorage.setItem('loggedInUser', user);
    this.router.navigate(['/user/shift']);
  }
}
