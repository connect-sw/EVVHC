import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VisitService } from '../services/visit.service';

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

  loggedInUser: string = '';

  constructor(private visitService: VisitService, private router: Router) {}

  ngOnInit(): void {
    const user = localStorage.getItem('loggedInUser');
    if (!user) {
      this.router.navigate(['/login']);
    } else {
      this.loggedInUser = user;
    }
  }

  selectShift(shift: any) {
    this.visitService.selectShift(shift); // Caregiver pulled inside the service
    this.router.navigate(['/user/logger']);
  }

  signOut(): void {
    localStorage.removeItem('loggedInUser');
    this.router.navigate(['/login']);
  }
}
