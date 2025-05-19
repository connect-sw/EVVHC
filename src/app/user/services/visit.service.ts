import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { VisitLog, User } from '../models/model';

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

  // Called when selecting a shift
  selectShift(shift: any) {
    const userJson = localStorage.getItem('loggedInUser');
    const loggedInUser: User = userJson ? JSON.parse(userJson) : { id: 'Unknown', name: 'Unknown', role: 'Caregiver' };

    const last = localStorage.getItem('lastCoords');
    const parsed = last ? JSON.parse(last) : null;
    const coords = parsed ? `Lat: ${parsed.lat}, Lng: ${parsed.lng}` : 'Unknown';

    this.currentShift = {
      ...shift,
      loggedInUser,
      timestamp: new Date().toISOString(),
      startCoords: coords
    };
  }

  getSelectedShift() {
    return this.currentShift;
  }

  checkIn(clientName: string) {
    const loggedInUser: User = this.currentShift?.loggedInUser
      || JSON.parse(localStorage.getItem('loggedInUser') || '{}');

    const last = localStorage.getItem('lastCoords');
    const parsed = last ? JSON.parse(last) : null;
    const coords = parsed ? `Lat: ${parsed.lat}, Lng: ${parsed.lng}` : 'Unknown';

    const log: VisitLog = {
      shiftTitle: this.currentShift?.title || 'N/A',
      clientName,
      loggedInUser,
      startTime: new Date().toISOString(),
      startCoords: coords
    };

    this.visitLogs.push(log);
    this.logsSubject.next(this.visitLogs);
    this.saveLogs();
  }

  checkOut(clientName: string) {
    const log = this.visitLogs.find(
      l => l.clientName === clientName && !l.endTime
    );

    if (log) {
      const last = localStorage.getItem('lastCoords');
      const parsed = last ? JSON.parse(last) : null;
      const coords = parsed ? `Lat: ${parsed.lat}, Lng: ${parsed.lng}` : 'Unknown';

      log.endTime = new Date().toISOString();
      log.endCoords = coords;

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
