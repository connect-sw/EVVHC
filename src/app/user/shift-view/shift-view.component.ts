import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { VisitService } from '../services/visit.service';

@Component({
    standalone: false,
  selector: 'app-shift-view',
  templateUrl: './shift-view.component.html',
    styleUrls: ['./shift-view.component.scss']
})
export class ShiftViewComponent {
  shifts = [
    { id: 1, title: 'Morning Shift', start: '08:00', end: '12:00' },
    { id: 2, title: 'Evening Shift', start: '16:00', end: '20:00' },
    { id: 3, title: 'Overnight Shift', start: '22:00', end: '06:00' },
  ];

  constructor(private visitService: VisitService, private router: Router) {}

  selectShift(shift: any) {
    this.visitService.selectShift(shift);
    this.router.navigate(['/user/logger']);
  }
}
