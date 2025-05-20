import { AfterViewInit, Component, OnInit, OnDestroy } from '@angular/core';
import { VisitService } from '../services/visit.service';
import { LocationService } from '../services/location.service';
import { Router } from '@angular/router';
import * as L from 'leaflet';
import { knownUsers } from '../../shared/users-list';
import { UserRole, User } from '../../user/models/model';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'assets/marker-icon-2x.png',
  iconUrl: 'assets/marker-icon.png',
  shadowUrl: 'assets/marker-shadow.png'
});

const smallGreenIcon = new L.Icon({
  iconUrl: 'assets/marker-icon-green.png',
  shadowUrl: 'assets/marker-shadow.png',
  iconSize: [20, 32],
  iconAnchor: [10, 32],
  popupAnchor: [1, -30],
  shadowSize: [30, 30]
});

const smallRedIcon = new L.Icon({
  iconUrl: 'assets/marker-icon-red.png',
  shadowUrl: 'assets/marker-shadow.png',
  iconSize: [20, 32],
  iconAnchor: [10, 32],
  popupAnchor: [1, -30],
  shadowSize: [30, 30]
});

const fallbackIcon = new L.Icon({
  iconUrl: 'assets/marker-icon.png',
  shadowUrl: 'assets/marker-shadow.png',
  iconSize: [20, 32],
  iconAnchor: [10, 32],
  popupAnchor: [1, -30],
  shadowSize: [30, 30]
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
  loggedInUser: User | null = null;
  mapMarkers: { [userId: string]: L.Marker } = {};
  shift: any;
  clients: any[] = [];
  users: User[] = [];
  checkedInClient: string | null = null;
  messege: string = '';

  constructor(
    private visitService: VisitService,
    private locationService: LocationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        console.log('🔄 App resumed from sleep/tab switch');
        setTimeout(() => {
          this.map?.invalidateSize();
        }, 300);
      }
    });

    const userJson = localStorage.getItem('loggedInUser');
    if (!userJson) {
      this.router.navigate(['/login']);
      return;
    }
    try {
      this.loggedInUser = JSON.parse(userJson);
    } catch {
      alert('Invalid user format.');
      this.router.navigate(['/login']);
      return;
    }

    this.shift = this.visitService.getSelectedShift();

    this.locationService.positions$.subscribe((positions) => {
      if (!this.map) return;

      Object.entries(positions).forEach(([id, coords]) => {
        const icon = id === this.loggedInUser?.id ? smallGreenIcon : smallRedIcon;
        const user = knownUsers.find(u => u.id === id);
        const label = user ? `${user.name} (${user.role})` : id;

        // 🛠️ Create new marker if needed
        if (!this.mapMarkers[id]) {
          const marker = L.marker([coords.lat, coords.lng], { icon }).addTo(this.map);
          marker.bindTooltip(label, {
            permanent: true,
            direction: 'top',
            offset: [0, -35]
          }).openTooltip();
          this.mapMarkers[id] = marker;
        }
        // ✅ Always update location even if marker exists
        this.mapMarkers[id].setLatLng([coords.lat, coords.lng]);
      });
    });

    this.startWatchingLocation();
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

  ngOnDestroy(): void {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
    }
  }

  startWatchingLocation(): void {
    if (!navigator.geolocation) {
      alert('Geolocation not supported.');
      return;
    }

    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const accuracy = position.coords.accuracy;

        if (accuracy > 1000) {
          console.warn('⚠️ Location accuracy is too low.', accuracy);
          this.messege = `⚠️ Location accuracy is too low (${accuracy}) – try a mobile for more accuracy`;
          return;
        } else {
          this.messege = '';
        }

        const lastCoords = localStorage.getItem('lastCoords');
        const last = lastCoords ? JSON.parse(lastCoords) : null;
        const isDifferent = !last || last.lat !== latitude || last.lng !== longitude;

        if (isDifferent) {
          localStorage.setItem('lastCoords', JSON.stringify({ lat: latitude, lng: longitude }));
          const history = JSON.parse(localStorage.getItem('locationHistory') || '[]');
          history.push({ lat: latitude, lng: longitude, timestamp: new Date().toISOString() });
          localStorage.setItem('locationHistory', JSON.stringify(history));
        }

        this.currentLat = latitude;
        this.currentLng = longitude;
        this.checkInTime = new Date().toLocaleString();

        if (this.map) {
          this.map.setView([latitude, longitude], this.map.getZoom());
        }

        this.locationService.sendLocation(this.loggedInUser!.id, latitude, longitude);
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

      this.locationService.clientsPositions$.subscribe(clientPositions => {
        Object.entries(clientPositions).forEach(([clientName, coords]) => {
          this.clients.push({ name: clientName, lat: coords.lat, lng: coords.lng });
          L.marker([coords.lat, coords.lng])
            .addTo(this.map)
            .bindPopup(`Client: ${clientName}`);
        });
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
