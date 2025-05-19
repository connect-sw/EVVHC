import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Shift } from '../models/model';

@Injectable({
  providedIn: 'root'
})
export class EvvService {
  private shifts: Shift[] = [
    {
      id: 'morning',
      title: 'Morning Shift',
      start: '08:00',
      end: '12:00',
      requirements: ['Vital signs check', 'Medication delivery', 'Meal prep'],
      region: { lat: 30.0444, lng: 31.2357, radiusKm: 10 },
      clients: [
        { id: 'c1', name: 'Mr. John Smith', address: '12 Nile St' },
        { id: 'c2', name: 'Mrs. Salma Naguib', address: '24 Ramses Ave' }
      ]
    },
    {
      id: 'evening',
      title: 'Evening Shift',
      start: '16:00',
      end: '20:00',
      requirements: ['Wound dressing', 'Assist with mobility'],
      region: { lat: 30.0444, lng: 31.2357, radiusKm: 10 },
      clients: [{ id: 'c3', name: 'Mr. Hossam Hassan' }]
    },
    {
      id: 'overnight',
      title: 'Overnight Shift',
      start: '22:00',
      end: '06:00',
      requirements: ['Overnight observation', 'Emergency readiness'],
      region: { lat: 30.0444, lng: 31.2357, radiusKm: 10 },
      clients: [{ id: 'c4', name: 'Mrs. Noura El-Azab' }]
    }
  ];

  // Store live loggedInUser or user location (from SignalR)
  private locationSubject = new BehaviorSubject<{ lat: number; lng: number } | null>(null);
  public location$ = this.locationSubject.asObservable();

  // Logged in user
  private userSubject = new BehaviorSubject<string | null>(localStorage.getItem('loggedInUser'));
  public user$ = this.userSubject.asObservable();

  constructor() {}

  getShifts(): Observable<Shift[]> {
    return of(this.shifts);
  }

  // Call this when SignalR receives live location
  setLocationManually(coords: { lat: number; lng: number }) {
    this.locationSubject.next(coords);
  }

  // Call this on login
  setUser(user: string) {
    localStorage.setItem('loggedInUser', user);
    this.userSubject.next(user);
  }

  getUser(): string | null {
    return this.userSubject.getValue();
  }

  signOut() {
    localStorage.removeItem('loggedInUser');
    this.userSubject.next(null);
  }

  // Haversine-based distance check
  isWithinCoverageArea(
    loggedInUser: { lat: number; lng: number },
    region: { lat: number; lng: number; radiusKm: number }
  ): boolean {
    const toRad = (x: number) => (x * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(region.lat - loggedInUser.lat);
    const dLon = toRad(region.lng - loggedInUser.lng);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(loggedInUser.lat)) *
        Math.cos(toRad(region.lat)) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance <= region.radiusKm;
  }
}
