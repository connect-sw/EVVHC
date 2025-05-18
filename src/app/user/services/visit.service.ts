import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface VisitLog {
  shiftTitle: string;
  clientName: string;
  caregiver: string;
  startTime: string;
  endTime?: string;
  startCoords: string;
  endCoords?: string;
  locationTrail?: string[];
}

@Injectable({ providedIn: 'root' })
export class VisitService {
  private currentShift: any = null;
  private visitLogs: VisitLog[] = [];
  private logsSubject = new BehaviorSubject<VisitLog[]>([]);

  logs$ = this.logsSubject.asObservable();

  constructor() {
    const stored = localStorage.getItem('evvLogs');
    if (stored) {
      this.visitLogs = JSON.parse(stored);
      this.logsSubject.next(this.visitLogs);
    }
  }

  selectShift(shift: any, caregiver = 'John Doe') {
    this.currentShift = {
      ...shift,
      caregiver,
      timestamp: new Date().toISOString(),
      startCoords: 'Lat: 30.0444, Lng: 31.2357', // replace with real coords
    };
  }

  getSelectedShift() {
    return this.currentShift;
  }

  checkIn(clientName: string) {
    const log: VisitLog = {
      shiftTitle: this.currentShift?.title,
      caregiver: this.currentShift?.caregiver,
      clientName,
      startTime: new Date().toISOString(),
      startCoords: this.currentShift?.startCoords,
    };
    this.visitLogs.push(log);
    this.logsSubject.next(this.visitLogs);
    this.saveLogs();
  }

  checkOut(clientName: string) {
    const log = this.visitLogs.find(l => l.clientName === clientName && !l.endTime);
    if (log) {
      log.endTime = new Date().toISOString();
      log.endCoords = 'Lat: 30.0450, Lng: 31.2360'; // simulated end
      this.logsSubject.next(this.visitLogs);
      this.saveLogs();
    }
  }

  clearLogs() {
    this.visitLogs = [];
    this.logsSubject.next([]);
    localStorage.removeItem('evvLogs');
  }

  private saveLogs() {
    localStorage.setItem('evvLogs', JSON.stringify(this.visitLogs));
  }
}
