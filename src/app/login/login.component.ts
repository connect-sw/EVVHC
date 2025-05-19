import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../user/models/model';
import { knownUsers } from '../shared/users-list';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(private router: Router) {}

  loginAs(role: string): void {
    const usr = knownUsers.find(u => u.role === role);
    if (usr) {
      localStorage.setItem('loggedInUser', JSON.stringify(usr));
      this.router.navigate(['/user/shift']);
    } else {
      alert('User not found!');
    }
  }
}
