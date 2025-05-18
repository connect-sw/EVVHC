import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private hubConnection: signalR.HubConnection;

  constructor() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:7059/locationHub') // Adjust port if needed
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('✅ SignalR connected'))
      .catch(err => console.error('❌ SignalR connection error: ', err));

    this.hubConnection.on('ReceiveLocation', (id, lat, lng) => {
      console.log('📡 Received:', id, lat, lng);
      // Do something with the received data (e.g. update map or save in a local storage)
    });
  }

  sendLocation(id: string, lat: number, lng: number): void {
    this.hubConnection.invoke('SendLocation', id, lat, lng)
      .catch(err => console.error('🚨 Send error: ', err));
  }
}
