import { CommonModule } from '@angular/common';
import { Component, AfterViewInit, OnDestroy, inject } from '@angular/core';
import {
  IonBadge,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonSpinner,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { navigateOutline } from 'ionicons/icons';
import * as L from 'leaflet';

import { LocationService } from '../../core/services/location.service';
import { LocationModel } from '../../core/models/location.model';

@Component({
  selector: 'app-mapa-page',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonIcon,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonBadge,
    IonSpinner,
  ],
})
export class MapaPage implements AfterViewInit, OnDestroy {
  private readonly locationService = inject(LocationService);

  private map: L.Map | null = null;
  private userMarker: L.Marker | null = null;
  private centerMarkers: L.Marker[] = [];

  isLoading = true;
  errorMessage: string | null = null;
  closestCenter: LocationModel | null = null;
  centers: LocationModel[] = [];

  constructor() {
    addIcons({ navigateOutline });
  }

  ngAfterViewInit(): void {
    // Small timeout to allow container element to render and settle in size
    setTimeout(() => {
      this.initMap();
      void this.loadMapAndLocation();
    }, 300);
  }

  ngOnDestroy(): void {
    this.cleanupMap();
  }

  private initMap(): void {
    if (this.map) return;

    // Start with a generic view (e.g. Ecuador center or global)
    this.map = L.map('map', {
      zoomControl: false, // Position zoom control later if needed
      attributionControl: false,
    }).setView([-0.180653, -78.467834], 13);

    // Zoom control in bottom right to not overlap tab bar
    L.control
      .zoom({
        position: 'topright',
      })
      .addTo(this.map);

    // Apply CartoDB Voyager tiles (clean, beautiful style, perfect for eco theme)
    L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      {
        maxZoom: 19,
      },
    ).addTo(this.map);
  }

  async loadMapAndLocation(): Promise<void> {
    this.isLoading = true;
    this.errorMessage = null;

    try {
      const position = await this.locationService.getCurrentPosition();

      if (!position) {
        throw new Error(
          'No se pudo acceder a tu ubicación. Por favor activa el GPS y otorga los permisos necesarios.',
        );
      }

      const { latitude, longitude } = position;

      // Update map view to user position
      if (this.map) {
        this.map.setView([latitude, longitude], 14.5);
      }

      // Add user marker
      this.setUserMarker(latitude, longitude);

      // Get recycling centers sorted by distance
      this.centers = this.locationService.getNearbyCenters(latitude, longitude);
      this.closestCenter = this.centers[0] || null;

      // Render recycling center markers
      this.setCenterMarkers(this.centers);
    } catch (error: any) {
      this.errorMessage =
        error.message || 'Error al obtener la ubicación o cargar el mapa.';
    } finally {
      this.isLoading = false;
    }
  }

  private setUserMarker(lat: number, lng: number): void {
    if (!this.map) return;

    // Remove existing user marker
    if (this.userMarker) {
      this.userMarker.remove();
    }

    const userIcon = L.divIcon({
      className: 'user-marker-icon',
      html: '<div class="user-pulse"></div>',
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });

    this.userMarker = L.marker([lat, lng], {
      icon: userIcon,
      zIndexOffset: 1000, // Keep user marker on top
    })
      .addTo(this.map)
      .bindPopup('<strong>Tú estás aquí</strong>');
  }

  private setCenterMarkers(centers: LocationModel[]): void {
    if (!this.map) return;

    // Clear existing markers
    this.centerMarkers.forEach((marker) => marker.remove());
    this.centerMarkers = [];

    const centerIcon = L.divIcon({
      className: 'center-marker-icon',
      html: '<div class="center-pin">♻️</div>',
      iconSize: [36, 36],
      iconAnchor: [18, 18],
    });

    centers.forEach((center) => {
      const marker = L.marker([center.latitude, center.longitude], {
        icon: centerIcon,
      })
        .addTo(this.map!)
        .bindPopup(
          `<strong>${center.name}</strong>
           ${center.address}<br>
           <strong>Distancia:</strong> ${center.distanceKm} km<br>
           <strong>Acepta:</strong> ${center.category}`,
        );

      this.centerMarkers.push(marker);
    });
  }

  openNavigation(center: LocationModel): void {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${center.latitude},${center.longitude}`;
    window.open(url, '_blank');
  }

  private cleanupMap(): void {
    if (this.userMarker) {
      this.userMarker.remove();
      this.userMarker = null;
    }
    this.centerMarkers.forEach((marker) => marker.remove());
    this.centerMarkers = [];

    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }
}
