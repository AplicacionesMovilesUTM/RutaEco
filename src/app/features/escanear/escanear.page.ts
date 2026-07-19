import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonIcon,
  IonImg,
  IonSpinner,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { cameraOutline, imageOutline, sparklesOutline } from 'ionicons/icons';

import { CameraService } from '../../core/services/camera.service';
import { GeminiService } from '../../core/services/gemini.service';

@Component({
  selector: 'app-escanear-page',
  templateUrl: './escanear.page.html',
  styleUrls: ['./escanear.page.scss'],
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonImg,
    IonText,
    IonIcon,
    IonCard,
    IonCardContent,
    IonSpinner,
  ],
  standalone: true,
})
export class EscanearPage {
  constructor() {
    addIcons({ cameraOutline, imageOutline, sparklesOutline });
    console.log('EscanearPage cargado');
  }
  private readonly cameraService = inject(CameraService);
  private readonly geminiService = inject(GeminiService);
  private readonly router = inject(Router);

  previewImage: string | null = null;
  errorMessage: string | null = null;
  isProcessing = false;

  prueba() {
    alert('CLICK FUNCIONA');
    console.log('CLICK FUNCIONA');
  }

  async takePhoto(): Promise<void> {
    console.log('Botón tomar foto presionado');
    await this.handleImageCapture(() => this.cameraService.takePhoto());
  }

  async pickFromGallery(): Promise<void> {
    console.log('Botón galería presionado');
    await this.handleImageCapture(() => this.cameraService.pickFromGallery());
  }

  private async handleImageCapture(
    capture: () => Promise<string | null>,
  ): Promise<void> {
    this.errorMessage = null;
    this.isProcessing = true;

    try {
      const imageBase64 = await capture();
      if (!imageBase64) {
        return;
      }

      this.previewImage = `data:image/jpeg;base64,${imageBase64}`;

      await this.geminiService.classifyAndSave(imageBase64);
      await this.router.navigateByUrl('/resultado');
    } catch {
      this.errorMessage = 'No fue posible obtener la imagen.';
    } finally {
      this.isProcessing = false;
    }
  }
}
