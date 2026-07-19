import { Component, EnvironmentInjector, inject } from '@angular/core';
import {
  IonIcon,
  IonLabel,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  cameraOutline,
  homeOutline,
  listOutline,
  mapOutline,
  personOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  imports: [
    IonTabs,
    IonTabBar,
    IonTabButton,
    IonIcon,
    IonLabel,
  ],
  standalone: true,
})
export class DashboardPage {
  public environmentInjector = inject(EnvironmentInjector);

  constructor() {
    addIcons({
      homeOutline,
      cameraOutline,
      mapOutline,
      listOutline,
      personOutline,
    });
  }
}
