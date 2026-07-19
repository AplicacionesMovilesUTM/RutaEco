export interface LocationModel {
  id?: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  distanceKm?: number;
  category?: string;
  isOpen?: boolean;
}
