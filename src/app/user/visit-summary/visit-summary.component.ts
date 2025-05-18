import { Component, OnInit } from '@angular/core';
import { VisitService, VisitLog } from '../services/visit.service';

@Component({
    standalone: false,
  selector: 'app-visit-summary',
  templateUrl: './visit-summary.component.html',
  styleUrls: ['./visit-summary.component.scss']
})
export class VisitSummaryComponent implements OnInit {
  logs: VisitLog[] = [];

  constructor(private visitService: VisitService) {}

  ngOnInit(): void {
    this.visitService.logs$.subscribe(logs => this.logs = logs);
  }

  clearLogs() {
    this.visitService.clearLogs();
  }
}
