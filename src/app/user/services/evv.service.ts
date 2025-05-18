import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

export interface Client {
  id: string;
  name: string;
  address?: string;
}

export interface Shift {
  id: string;
  title: string;
  start: string;
  end: string;
  requirements: string[];
  region: { lat: number; lng: number; radiusKm: number };
  clients: Client[];
}

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
    clients: [
      { id: 'c3', name: 'Mr. Hossam Hassan' }
    ]
  },
  {
    id: 'overnight',
    title: 'Overnight Shift',
    start: '22:00',
    end: '06:00',
    requirements: ['Overnight observation', 'Emergency readiness'],
    region: { lat: 30.0444, lng: 31.2357, radiusKm: 10 },
    clients: [
      { id: 'c4', name: 'Mrs. Noura El-Azab' }
    ]
  }
];


  // BehaviorSubject for live caregiver location
  private locationSubject = new BehaviorSubject<{ lat: number; lng: number } | null>(null);
  public location$ = this.locationSubject.asObservable();

  constructor() {
    this.trackLiveLocation(); // Start tracking on service load
  }

  // Return hardcoded shifts
  getShifts(): Observable<Shift[]> {
    return of(this.shifts);
  }

  // Simulate Geolocation live tracking
  private trackLiveLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          this.locationSubject.next(coords);
        },
        (error) => {
          console.error('Geolocation error:', error);
        },
        { enableHighAccuracy: true }
      );
    } else {
      console.warn('Geolocation not supported');
    }
  }

  // Haversine-based distance check
  isWithinCoverageArea(
    caregiver: { lat: number; lng: number },
    region: { lat: number; lng: number; radiusKm: number }
  ): boolean {
    const toRad = (x: number) => (x * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(region.lat - caregiver.lat);
    const dLon = toRad(region.lng - caregiver.lng);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(caregiver.lat)) *
        Math.cos(toRad(region.lat)) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance <= region.radiusKm;
  }
}
