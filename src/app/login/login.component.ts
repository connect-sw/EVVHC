import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../user/models/model';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  user: User = {id:'',name:''};
  constructor(private router: Router) {}

  loginAs(name: string): void {
      this.user.id = name;
      this.user.name = name;
      localStorage.setItem('loggedInUser', JSON.stringify(this.user));
      this.router.navigate(['/user/shift']);

  }
}
