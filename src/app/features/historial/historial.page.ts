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
//   IonTitle,
//   IonToolbar,
// } from '@ionic/angular/standalone';

// import { FirestoreService } from '../../core/services/firestore.service';

// @Component({
//   selector: 'app-historial-page',
//   templateUrl: './historial.page.html',
//   styleUrls: ['./historial.page.scss'],
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
//   ],
//   standalone: true,
// })
// export class HistorialPage {
//   readonly classifications$ =
//     inject(FirestoreService).watchUserClassifications();
// }

import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';

import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonImg,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';

import { FirestoreService } from '../../core/services/firestore.service';

@Component({
  selector: 'app-historial-page',
  templateUrl: './historial.page.html',
  styleUrls: ['./historial.page.scss'],
  standalone: true,

  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonImg,
  ],
})
export class HistorialPage {
  private readonly firestoreService = inject(FirestoreService);

  readonly classifications$ = this.firestoreService.watchUserClassifications();
}
