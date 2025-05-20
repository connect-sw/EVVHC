import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private hubConnection: signalR.HubConnection;

  // Stores the latest location and timestamp of all users
  private userPositions: { [id: string]: { lat: number; lng: number; lastUpdated: number } } = {};

  // Observable for components to react to updates
  private positionsSubject = new BehaviorSubject<{ [id: string]: { lat: number; lng: number; lastUpdated: number } }>({});
  public positions$ = this.positionsSubject.asObservable();

  private clientsPositionsSubject = new BehaviorSubject<{ [id: string]: { lat: number; lng: number } }>( {
    'Client A': { lat: 30.0444, lng: 31.2357 },
    'Client B': { lat: 30.0131, lng: 31.2089 }
  });
  public clientsPositions$ = this.clientsPositionsSubject.asObservable();

  constructor() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://evvhcapi.azurewebsites.net/locationHub')
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('✅ SignalR connected'))
      .catch(err => console.error('❌ SignalR connection error: ', err));

    this.hubConnection.on('ReceiveLocation', (id: string, lat: number, lng: number) => {
      console.log('📡 Received:', id, lat, lng);

      // Update internal user location map with timestamp
      this.userPositions[id] = {
        lat,
        lng,
        lastUpdated: Date.now()
      };

      // Optionally save to localStorage if it's the current user
      const currentUserRaw = localStorage.getItem('loggedInUser');
      if (currentUserRaw) {
        try {
          const currentUser = JSON.parse(currentUserRaw);
          if (currentUser.id === id) {
            localStorage.setItem(`lastCoords_${id}`, JSON.stringify({ lat, lng }));
          }
        } catch (e) {
          console.warn('Invalid loggedInUser format in localStorage');
        }
      }

      // Emit the full updated positions map
      this.positionsSubject.next({ ...this.userPositions });
    });
  }

  // Send location to backend with user ID
  sendLocation(id: string, lat: number, lng: number): void {
    this.hubConnection.invoke('SendLocation', id, lat, lng)
      .catch(err => console.error('🚨 Send error: ', err));
  }

  // Optional: expose current snapshot of user map
  getCurrentPositions(): { [id: string]: { lat: number; lng: number; lastUpdated: number } } {
    return { ...this.userPositions };
  }
}
