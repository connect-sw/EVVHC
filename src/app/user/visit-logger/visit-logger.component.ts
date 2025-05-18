import { AfterViewInit, Component, OnInit, OnDestroy } from '@angular/core';
import { VisitService } from '../services/visit.service';
import { LocationService } from '../services/location.service';
import { Router } from '@angular/router';
import * as L from 'leaflet';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'assets/marker-icon-2x.png',
  iconUrl: 'assets/marker-icon.png',
  shadowUrl: 'assets/marker-shadow.png'
});

const greenIcon = new L.Icon({
  iconUrl: 'assets/leaflet/marker-icon-green.png',
  shadowUrl: 'assets/leaflet/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const redIcon = new L.Icon({
  iconUrl: 'assets/leaflet/marker-icon-red.png',
  shadowUrl: 'assets/leaflet/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

@Component({
  standalone: false,
  selector: 'app-visit-logger',
  templateUrl: './visit-logger.component.html',
  styleUrls: ['./visit-logger.component.scss']
})
export class VisitLoggerComponent implements OnInit, AfterViewInit, OnDestroy {
  map: any;
  currentLat: number | null = null;
  currentLng: number | null = null;
  checkInTime: string = '';
  watchId: number | null = null;

  loggedInUser: string = '';
  mapMarkers: { [user: string]: L.Marker } = {};

  shift: any;
  clients = [
    { name: 'Client A', lat: 30.0444, lng: 31.2357 },
    { name: 'Client B', lat: 30.0131, lng: 31.2089 }
  ];
  checkedInClient: string | null = null;

  constructor(
    private visitService: VisitService,
    private locationService: LocationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = localStorage.getItem('loggedInUser');
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }
    this.loggedInUser = user;
    this.shift = this.visitService.getSelectedShift();
    this.startWatchingLocation();

    this.locationService.positions$.subscribe((positions) => {
      if (!this.map) return;
      Object.entries(positions).forEach(([id, coords]) => {
        const label = id === this.loggedInUser ? `${id} (You)` : id;

        if (this.mapMarkers[id]) {
          this.mapMarkers[id].setLatLng([coords.lat, coords.lng]);
        } else {
          let customIcon = new L.Icon.Default();

          if (id === 'Client1') {
            customIcon = greenIcon;
          } else if (id === 'Client2') {
            customIcon = redIcon;
          }

          const marker = L.marker([coords.lat, coords.lng], { icon: customIcon })
            .addTo(this.map)
            .bindPopup(label)
            .openPopup();

          this.mapMarkers[id] = marker;
        }
      });
    });
  }

  ngOnDestroy(): void {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
    }
  }

  ngAfterViewInit(): void {
    const interval = setInterval(() => {
      const coords = localStorage.getItem('lastCoords');
      if (coords) {
        const { lat, lng } = JSON.parse(coords);
        this.currentLat = lat;
        this.currentLng = lng;
        this.initMap();
        clearInterval(interval);
      }
    }, 200);
  }

  startWatchingLocation(): void {
    if (!navigator.geolocation) {
      alert('Geolocation not supported.');
      return;
    }

    console.log('🌍 Starting watchPosition...');

    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const accuracy = position.coords.accuracy;

        console.log(`📍 New Position: ${latitude}, ${longitude} (accuracy: ${accuracy}m)`);

        if (accuracy > 1000) {
          console.warn('⚠️ Location accuracy is too low (IP-based or poor signal).');
          return;
        }

        const lastCoords = localStorage.getItem('lastCoords');
        const last = lastCoords ? JSON.parse(lastCoords) : null;

        if (!last || last.lat !== latitude || last.lng !== longitude) {
          localStorage.setItem('lastCoords', JSON.stringify({ lat: latitude, lng: longitude }));
        }

        this.currentLat = latitude;
        this.currentLng = longitude;
        this.checkInTime = new Date().toLocaleString();

        this.locationService.sendLocation(this.loggedInUser, latitude, longitude);
      },
      (error) => {
        console.error('❌ Geolocation error:', error.message);
        alert('⚠️ Location error: ' + error.message);
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

      setTimeout(() => this.map.invalidateSize(), 200);

      // Add static client markers
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

  signOut() {
    localStorage.removeItem('loggedInUser');
    this.router.navigate(['/login']);
  }
}
