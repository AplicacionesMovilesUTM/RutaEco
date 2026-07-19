import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonBadge,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonProgressBar,
  IonRow,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  arrowForwardOutline,
  cameraOutline,
  earthOutline,
  leafOutline,
  sparklesOutline,
  trophyOutline,
} from 'ionicons/icons';
import { map } from 'rxjs/operators';

import { FirestoreService } from '../../core/services/firestore.service';

@Component({
  selector: 'app-inicio-page',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonButton,
    IonIcon,
    IonText,
    IonBadge,
    IonProgressBar,
  ],
})
export class InicioPage {
  private readonly firestoreService = inject(FirestoreService);

  readonly classifications$ = this.firestoreService.watchUserClassifications();

  // Compute stats dynamically from the user's history
  readonly stats$ = this.classifications$.pipe(
    map((list) => {
      const totalScans = list.length;
      const points = totalScans * 15;

      // Determine level/rank
      let rank = 'Eco-Aspirante';
      let progress = 0;
      let nextLevelPoints = 50;

      if (points < 50) {
        rank = 'Eco-Semilla 🌱';
        progress = points / 50;
        nextLevelPoints = 50;
      } else if (points < 150) {
        rank = 'Reciclador Activo 🌿';
        progress = (points - 50) / 100;
        nextLevelPoints = 150;
      } else if (points < 300) {
        rank = 'Héroe Verde 🌳';
        progress = (points - 150) / 150;
        nextLevelPoints = 300;
      } else {
        rank = 'Eco-Guardián 🏆';
        progress = 1.0;
        nextLevelPoints = 300;
      }

      // Material breakdown
      let plastic = 0;
      let paper = 0;
      let glass = 0;
      let metal = 0;
      let other = 0;

      list.forEach((item) => {
        const mat = (item.material || '').toLowerCase();
        if (
          mat.includes('plast') ||
          mat.includes('plást') ||
          mat.includes('pet')
        ) {
          plastic++;
        } else if (
          mat.includes('papel') ||
          mat.includes('cart') ||
          mat.includes('caja')
        ) {
          paper++;
        } else if (mat.includes('vidr')) {
          glass++;
        } else if (
          mat.includes('metal') ||
          mat.includes('lata') ||
          mat.includes('alumin') ||
          mat.includes('hierr')
        ) {
          metal++;
        } else {
          other++;
        }
      });

      return {
        totalScans,
        points,
        rank,
        progress,
        nextLevelPoints,
        materials: {
          plastic,
          paper,
          glass,
          metal,
          other,
        },
      };
    }),
  );

  // Tips for eco friendly living
  readonly tips = [
    {
      title: 'Lava tus envases',
      description:
        'Asegúrate de enjuagar los envases de plástico, vidrio o metal antes de reciclarlos. La comida sobrante daña el proceso.',
      icon: 'sparkles-outline',
    },
    {
      title: 'Plásticos limpios y secos',
      description:
        'Las botellas PET son 100% reciclables. Retira la etiqueta y la tapa, aplástalas para ahorrar espacio en el contenedor.',
      icon: 'leaf-outline',
    },
    {
      title: 'El cartón siempre doblado',
      description:
        'Desarma y dobla las cajas de cartón. Así evitas que saturen los contenedores municipales y facilitas su transporte.',
      icon: 'earth-outline',
    },
  ];

  constructor() {
    addIcons({
      leafOutline,
      trophyOutline,
      cameraOutline,
      sparklesOutline,
      earthOutline,
      arrowForwardOutline,
    });
  }
}
