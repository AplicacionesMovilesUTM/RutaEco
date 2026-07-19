// import { CommonModule } from '@angular/common';
// import { Component, inject } from '@angular/core';
// import {
//   IonCard,
//   IonCardContent,
//   IonCardHeader,
//   IonCardSubtitle,
//   IonCardTitle,
//   IonContent,
//   IonHeader,
//   IonImg,
//   IonTitle,
//   IonToolbar,
// } from '@ionic/angular/standalone';

// import { GeminiService } from '../../core/services/gemini.service';

// @Component({
//   selector: 'app-resultado-page',
//   templateUrl: './resultado.page.html',
//   styleUrls: ['./resultado.page.scss'],
//   imports: [
//     CommonModule,
//     IonHeader,
//     IonToolbar,
//     IonTitle,
//     IonContent,
//     IonCard,
//     IonCardHeader,
//     IonCardTitle,
//     IonCardSubtitle,
//     IonCardContent,
//     IonImg,
//   ],
//   standalone: true,
// })
// export class ResultadoPage {
//   readonly lastImage$ = inject(GeminiService).lastImage$;
//   readonly lastClassification$ = inject(GeminiService).lastClassification$;
// }

import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  IonBadge,
  IonButton,
  IonCard,
  IonCardContent,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonHeader,
  IonIcon,
  IonImg,
  IonProgressBar,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline,
  checkmarkCircleOutline,
  leafOutline,
  mapOutline,
  sparklesOutline,
  timeOutline,
  trashBinOutline,
} from 'ionicons/icons';
import { RouterLink } from '@angular/router';

import { GeminiService } from '../../core/services/gemini.service';

@Component({
  selector: 'app-resultado-page',
  templateUrl: './resultado.page.html',
  styleUrls: ['./resultado.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardContent,
    IonImg,
    IonIcon,
    IonBadge,
    IonButton,
    IonProgressBar,
    IonGrid,
    IonRow,
    IonCol,
    RouterLink,
  ],
})
export class ResultadoPage {
  private readonly geminiService = inject(GeminiService);

  readonly lastImage$ = this.geminiService.lastImage$;
  readonly lastClassification$ = this.geminiService.lastClassification$;

  constructor() {
    addIcons({
      checkmarkCircleOutline,
      timeOutline,
      trashBinOutline,
      sparklesOutline,
      arrowBackOutline,
      mapOutline,
      leafOutline,
    });
  }

  getContainerColor(container: string): string {
    const name = (container || '').toLowerCase();
    if (name.includes('azul')) {
      return 'primary';
    }
    if (name.includes('verde')) {
      return 'success';
    }
    if (name.includes('amarillo')) {
      return 'warning';
    }
    if (name.includes('gris')) {
      return 'medium';
    }
    if (
      name.includes('marrón') ||
      name.includes('cafe') ||
      name.includes('café')
    ) {
      return 'secondary';
    }
    return 'success';
  }
}
