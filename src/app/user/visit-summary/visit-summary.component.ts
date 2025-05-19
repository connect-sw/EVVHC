import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VisitService } from '../services/visit.service';
import { User, VisitLog } from '../models/model';

@Component({
  standalone: false,
  selector: 'app-visit-summary',
  templateUrl: './visit-summary.component.html',
  styleUrls: ['./visit-summary.component.scss']
})
export class VisitSummaryComponent implements OnInit {
  logs: VisitLog[] = [];
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
    } catch (error) {
      alert('❌ Failed to load user from local storage.');
      this.router.navigate(['/login']);
    }

    this.visitService.logs$.subscribe(logs => {
      this.logs = logs;
    });
  }

  clearLogs(): void {
    this.visitService.clearLogs();
  }

  signOut(): void {
    localStorage.removeItem('loggedInUser');
    this.router.navigate(['/login']);
  }
}
