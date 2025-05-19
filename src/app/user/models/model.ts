
export type UserRole = 'Caregiver' | 'Client';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  address?: string;
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
  clientName: string;
  loggedInUser: User;
  startTime: string;
  endTime?: string;
  startCoords: string;
  endCoords?: string;
  locationTrail?: string[];
}
