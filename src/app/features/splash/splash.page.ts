import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, IonIcon, IonSpinner } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { leafOutline } from 'ionicons/icons';

@Component({
  selector: 'app-splash-page',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
  imports: [IonContent, IonIcon, IonSpinner],
  standalone: true,
})
export class SplashPage implements OnInit {
  private readonly router = inject(Router);

  constructor() {
    addIcons({ leafOutline });
  }

  ngOnInit(): void {
    setTimeout(() => {
      void this.router.navigateByUrl('/home');
    }, 2000);
  }
}
