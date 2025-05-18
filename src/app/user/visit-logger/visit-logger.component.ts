import { AfterViewInit, Component, OnInit, OnDestroy } from '@angular/core';
import { VisitService } from '../services/visit.service';
import * as L from 'leaflet';
import { LocationService } from '../services/location.service';

@Component({
      standalone: false,
  selector: 'app-visit-logger',
  templateUrl: './visit-logger.component.html',
  styleUrls: ['./visit-logger.component.scss']
})
export class VisitLoggerComponent implements OnInit, AfterViewInit, OnDestroy {
  map: any;
  marker: any = null;
  currentLat: number | null = null;
  currentLng: number | null = null;
  checkInTime: string = '';
  isReadyToInitMap = false;
  watchId: number | null = null;

  shift: any;
  clients = [
    { name: 'Client A', lat: 30.0444, lng: 31.2357 },
    { name: 'Client B', lat: 30.0131, lng: 31.2089 }
  ];
  checkedInClient: string | null = null;

  constructor(
    private visitService: VisitService,
    private locationService: LocationService
  ) {}


  ngOnInit(): void {
    this.shift = this.visitService.getSelectedShift();
    this.startWatchingLocation();
  }

  ngOnDestroy(): void {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
    }
  }

  ngAfterViewInit(): void {
    const interval = setInterval(() => {
      if (this.isReadyToInitMap && this.currentLat && this.currentLng) {
        this.initMap();
        clearInterval(interval);
      }
    }, 100);
  }

  startWatchingLocation(): void {
    if (!navigator.geolocation) {
      alert("Geolocation not supported.");
      return;
    }

    console.log("🌍 Starting watchPosition...");

    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const accuracy = position.coords.accuracy;

        console.log(`📍 New Position: ${latitude}, ${longitude} (accuracy: ${accuracy}m)`);

        if (accuracy > 1000) {
          console.warn("⚠️ Location accuracy is too low (IP-based or poor signal).");
          return;
        }

        const lastCoords = localStorage.getItem('lastCoords');
        const last = lastCoords ? JSON.parse(lastCoords) : null;

        if (!last || last.lat !== latitude || last.lng !== longitude) {
          localStorage.setItem('lastCoords', JSON.stringify({ lat: latitude, lng: longitude }));
        }

        this.currentLat = latitude;
        this.currentLng = longitude;
        this.locationService.sendLocation('caregiver1', latitude, longitude);
        this.checkInTime = new Date().toLocaleString();
        this.isReadyToInitMap = true;

        if (this.map) {
          if (this.marker) {
            this.marker.setLatLng([latitude, longitude]);
          } else {
            this.marker = L.marker([latitude, longitude])
              .addTo(this.map)
              .bindPopup('CareGiver')
              .openPopup();
          }
          this.map.setView([latitude, longitude], this.map.getZoom() || 16);
        }
      },
      (error) => {
        console.error('❌ Geolocation error:', error.message);
        alert("⚠️ Location error: " + error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0
      }
    );
  }


  initMap(): void {
    const container = document.getElementById('map');
    if (container && container.innerHTML === '') {
      this.map = L.map(container).setView([this.currentLat!, this.currentLng!], 15);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
      }).addTo(this.map);

      this.marker = L.marker([this.currentLat!, this.currentLng!])
        .addTo(this.map)
        .bindPopup('You are here')
        .openPopup();

      setTimeout(() => this.map.invalidateSize(), 200);

      this.clients.forEach(client => {
        L.marker([client.lat, client.lng])
          .addTo(this.map)
          .bindPopup(`Client: ${client.name}`);
      });
    }
  }

  checkIn(client: string) {
    this.visitService.checkIn(client);
    this.checkedInClient = client;
  }

  checkOut(client: string) {
    this.visitService.checkOut(client);
    this.checkedInClient = null;
  }
}
