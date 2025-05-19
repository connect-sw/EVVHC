import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private hubConnection: signalR.HubConnection;

  // Stores the latest location of all users
  private userPositions: { [id: string]: { lat: number; lng: number } } = {};

  // Observable for components to react to updates
  private positionsSubject = new BehaviorSubject<{ [id: string]: { lat: number; lng: number } }>({});
  public positions$ = this.positionsSubject.asObservable();
            
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

      // Update internal map
      this.userPositions[id] = { lat, lng };

      // Save latest for current user (optional)
      const currentUser = localStorage.getItem('loggedInUser');
      if (currentUser === id) {
        localStorage.setItem('lastCoords', JSON.stringify({ lat, lng }));
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
