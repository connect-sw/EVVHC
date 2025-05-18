import { Component, OnInit } from '@angular/core';
import { VisitService, VisitLog } from '../services/visit.service';
import { Router } from '@angular/router';

@Component({
  standalone: false,
  selector: 'app-visit-summary',
  templateUrl: './visit-summary.component.html',
  styleUrls: ['./visit-summary.component.scss']
})
export class VisitSummaryComponent implements OnInit {
  logs: VisitLog[] = [];
  loggedInUser: string = '';

  constructor(private visitService: VisitService, private router: Router) {}

  ngOnInit(): void {
    const user = localStorage.getItem('loggedInUser');
    if (!user) {
      this.router.navigate(['/login']);
    } else {
      this.loggedInUser = user;
    }

    this.visitService.logs$.subscribe(logs => (this.logs = logs));
  }

  clearLogs() {
    this.visitService.clearLogs();
  }

  signOut() {
    localStorage.removeItem('loggedInUser');
    this.router.navigate(['/login']);
  }
}
