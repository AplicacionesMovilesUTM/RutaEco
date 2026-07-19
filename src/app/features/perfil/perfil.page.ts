import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { doc, docData, Firestore } from '@angular/fire/firestore';
import {
  IonAvatar,
  IonBadge,
  IonButton,
  IonCard,
  IonCardContent,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonRow,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  calendarOutline,
  checkmarkCircle,
  logOutOutline,
  mailOutline,
  personOutline,
  trophyOutline,
} from 'ionicons/icons';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { AuthService } from '../../core/services/auth.service';
import { FirestoreService } from '../../core/services/firestore.service';
import { UserModel } from '../../core/models/user.model';

interface Achievement {
  id: string;
  name: string;
  description: string;
  reqCount: number;
  emoji: string;
  unlocked: boolean;
}

@Component({
  selector: 'app-perfil-page',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonIcon,
    IonAvatar,
    IonList,
    IonItem,
    IonLabel,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardContent,
    IonBadge,
  ],
})
export class PerfilPage {
  private readonly authService = inject(AuthService);
  private readonly firestoreService = inject(FirestoreService);
  private readonly firestore = inject(Firestore);
  private readonly router = inject(Router);

  // Stream current user auth state and pull corresponding Firestore doc
  readonly user$: Observable<UserModel | null> =
    this.authService.authState$.pipe(
      switchMap((firebaseUser) => {
        if (!firebaseUser) {
          return of(null);
        }
        const userDocRef = doc(this.firestore, 'users', firebaseUser.uid);
        return docData(userDocRef).pipe(
          map((data) => (data ? (data as UserModel) : null)),
        );
      }),
    );

  // List of classifications for achievements calculation
  readonly classifications$ = this.firestoreService.watchUserClassifications();

  // Dynamically compute user achievements based on total classification count
  readonly achievements$: Observable<Achievement[]> =
    this.classifications$.pipe(
      map((list) => {
        const count = list.length;
        const baseAchievements = [
          {
            id: 'first',
            name: 'Primer Paso',
            description: 'Clasifica tu primer residuo con inteligencia artificial.',
            reqCount: 1,
            emoji: '🎫',
          },
          {
            id: 'five',
            name: 'Eco-Héroe Bronce',
            description: 'Realiza 5 escaneos y ayuda al planeta.',
            reqCount: 5,
            emoji: '🥉',
          },
          {
            id: 'fifteen',
            name: 'Eco-Héroe Plata',
            description: 'Completa 15 clasificaciones de residuos.',
            reqCount: 15,
            emoji: '🥈',
          },
          {
            id: 'thirty',
            name: 'Eco-Héroe Oro',
            description: 'Alcanza los 30 escaneos registrados.',
            reqCount: 30,
            emoji: '🥇',
          },
          {
            id: 'elite',
            name: 'Reciclador de Élite',
            description: 'Gran protector ecológico con 50+ escaneos.',
            reqCount: 50,
            emoji: '💎',
          },
        ];

        return baseAchievements.map((ach) => ({
          ...ach,
          unlocked: count >= ach.reqCount,
        }));
      }),
    );

  // Derived user statistics (total scans, points, level name)
  readonly stats$ = this.classifications$.pipe(
    map((list) => {
      const scans = list.length;
      const points = scans * 15;
      let level = 'Eco-Semilla';

      if (points >= 300) {
        level = 'Eco-Guardián';
      } else if (points >= 150) {
        level = 'Héroe Verde';
      } else if (points >= 50) {
        level = 'Reciclador Activo';
      }

      return { scans, points, level };
    }),
  );

  constructor() {
    addIcons({
      logOutOutline,
      trophyOutline,
      mailOutline,
      calendarOutline,
      personOutline,
      checkmarkCircle,
    });
  }

  async logout(): Promise<void> {
    await this.authService.logout();
    await this.router.navigateByUrl('/login');
  }
}
