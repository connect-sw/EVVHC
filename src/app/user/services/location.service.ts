import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private hubConnection: signalR.HubConnection;

  // Stores the latest location of all users and clients
  private userPositions: { [id: string]: { lat: number; lng: number } } = {};
  //private clientsPositions: { [id: string]: { lat: number; lng: number } } = {};

  // Observable for components to react to updates
  private positionsSubject = new BehaviorSubject<{ [id: string]: { lat: number; lng: number } }>({});
  public positions$ = this.positionsSubject.asObservable();

  private clientsPositionsSubject = new BehaviorSubject<{ [id: string]: { lat: number; lng: number } }>({
    'Client A': { lat: 30.0444, lng: 31.2357 },
    'Client B': { lat: 30.0131, lng: 31.2089 }
  });
  public clientsPositions$ = this.clientsPositionsSubject.asObservable();

  constructor() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://evvhcapi.azurewebsites.net/locationHub') // Adjust port for production  evvhcapi.azurewebsites.net  // https://localhost:7059/locationHub
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('✅ SignalR connected'))
      .catch(err => console.error('❌ SignalR connection error: ', err));

    this.hubConnection.on('ReceiveLocation', (id: string, lat: number, lng: number) => {
      console.log('📡 Received:', id, lat, lng);
    debugger
      // Update internal map
      this.userPositions[id] = { lat, lng };

      // Save latest for current user
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

      // Broadcast the new positions to all subscribers
      this.positionsSubject.next({ ...this.userPositions });
    });
  }

  // Send location to backend with user ID
  sendLocation(id: string, lat: number, lng: number): void {
    this.hubConnection.invoke('SendLocation', id, lat, lng)
      .catch(err => console.error('🚨 Send error: ', err));
  }

  // Optional: expose current snapshot of user map
  getCurrentPositions(): { [id: string]: { lat: number; lng: number } } {
    return { ...this.userPositions };
  }
}
