

export interface User {
  id: string;
  name: string;
  lat?: number;
  lng?: number;
}


export interface Shift {
  id: string;
  title: string;
  start: string;
  end: string;
  requirements: string[];
  region: { lat: number; lng: number; radiusKm: number };
  clients: User[];
}

export interface VisitLog {
  shiftTitle: string;
  userName: string;
  loggedInUser: User;
  startTime: string;
  endTime?: string;
  startCoords: string;
  endCoords?: string;
  locationTrail?: string[];
}
