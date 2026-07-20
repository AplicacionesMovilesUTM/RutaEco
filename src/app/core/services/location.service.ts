import { Injectable } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { Capacitor } from '@capacitor/core';
import { LocationModel } from '../models/location.model';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  // Mock recycling centers centered in a typical urban area.
  // We will dynamically adjust these or show them relative to the user's position.
  private readonly mockCenters: LocationModel[] = [
    {
      name: 'Punto Verde - Parque Central',
      address: 'Av. de los Eucaliptos y Calle Principal',
      latitude: -0.180653,
      longitude: -78.467834,
      category: 'Plásticos y Cartón',
      isOpen: true,
    },
    {
      name: 'Centro de Acopio EcoVidrio',
      address: 'Calle del Vidrio N45-12 y Pasaje C',
      latitude: -0.191234,
      longitude: -78.478901,
      category: 'Vidrio y Metales',
      isOpen: true,
    },
    {
      name: 'Recicladora Metropolitana',
      address: 'Av. de la República y Eloy Alfaro',
      latitude: -0.174321,
      longitude: -78.482123,
      category: 'Todo Tipo',
      isOpen: true,
    },
    {
      name: 'EcoPunto Comunitario',
      address: 'Calle de las Rosas y Av. 10 de Agosto',
      latitude: -0.203456,
      longitude: -78.490123,
      category: 'Papel, Cartón y Orgánicos',
      isOpen: false,
    },
    {
      name: 'Punto Limpio Norte',
      address: 'Av. Galo Plaza Lasso y Pasaje N55',
      latitude: -0.145678,
      longitude: -78.471234,
      category: 'Electrónicos y Metales',
      isOpen: true,
    },
  ];

  async getCurrentPosition(): Promise<{
    latitude: number;
    longitude: number;
  } | null> {
    try {
      if (Capacitor.isNativePlatform()) {
        // Request location permissions directly to force the OS dialog
        const request = await Geolocation.requestPermissions();
        if (
          request.location !== 'granted' &&
          request.coarseLocation !== 'granted'
        ) {
          throw new Error('Permisos de ubicación no concedidos.');
        }
      }

      let position;
      try {
        // Try precise high accuracy first
        position = await Geolocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 4000,
        });
      } catch (preciseError) {
        console.warn(
          'GPS preciso falló o expiró, usando ubicación aproximada de red:',
          preciseError,
        );
        // Fallback to coarse network location (works indoors)
        position = await Geolocation.getCurrentPosition({
          enableHighAccuracy: false,
          timeout: 8000,
        });
      }

      return {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };
    } catch (error) {
      console.error('Error al obtener la geolocalización:', error);
      return null;
    }
  }

  /**
   * Get list of recycling centers with distance computed relative to user's location.
   */
  getNearbyCenters(userLat: number, userLng: number): LocationModel[] {
    // If mock centers are too far from the user's location (different city/country),
    // we shift the coordinates of the mock centers so they are in the user's vicinity (1-5km).
    const centers = this.mockCenters.map((center, index) => {
      let lat = center.latitude;
      let lng = center.longitude;

      // Distance from user to Quito (the default mock coords)
      const distToDefault = this.calculateDistance(
        userLat,
        userLng,
        -0.18,
        -78.46,
      );
      if (distToDefault > 50) {
        // Shift centers to be near the user's actual location
        const offsets = [
          { lat: 0.005, lng: 0.005 },
          { lat: -0.008, lng: -0.006 },
          { lat: 0.002, lng: -0.009 },
          { lat: -0.012, lng: 0.008 },
          { lat: 0.015, lng: -0.002 },
        ];
        const offset = offsets[index % offsets.length];
        lat = userLat + offset.lat;
        lng = userLng + offset.lng;
      }

      const distanceKm = this.calculateDistance(userLat, userLng, lat, lng);

      return {
        ...center,
        latitude: lat,
        longitude: lng,
        distanceKm: Math.round(distanceKm * 100) / 100, // Round to 2 decimals
      };
    });

    // Sort by nearest first
    return centers.sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0));
  }

  /**
   * Calculate distance between two coordinates in kilometers using Haversine formula.
   */
  calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const R = 6371; // Earth radius in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}
////////////////////////////////////////////////////////////////
