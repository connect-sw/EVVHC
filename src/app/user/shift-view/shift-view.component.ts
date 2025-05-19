import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VisitService } from '../services/visit.service';
import { User } from '../../user/models/model';

@Component({
  standalone: false,
  selector: 'app-shift-view',
  templateUrl: './shift-view.component.html',
  styleUrls: ['./shift-view.component.scss']
})
export class ShiftViewComponent implements OnInit {
  shifts = [
    { id: 1, title: 'Morning Shift', start: '08:00', end: '12:00' },
    { id: 2, title: 'Evening Shift', start: '16:00', end: '20:00' },
    { id: 3, title: 'Overnight Shift', start: '22:00', end: '06:00' }
  ];

  loggedInUser: User | null = null;

  constructor(
    private visitService: VisitService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const userJson = localStorage.getItem('loggedInUser');
    if (!userJson) {
      this.router.navigate(['/login']);
      return;
    }

    try {
      this.loggedInUser = JSON.parse(userJson) as User;
    } catch (e) {
      alert('⚠️ Failed to load user info.');
      this.router.navigate(['/login']);
    }
  }

  selectShift(shift: any): void {
    this.visitService.selectShift(shift);
    this.router.navigate(['/user/logger']);
  }

  signOut(): void {
    localStorage.removeItem('loggedInUser');
    this.router.navigate(['/login']);
  }
}
