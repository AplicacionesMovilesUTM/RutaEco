import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import {
  Camera,
  CameraSource,
  CameraResultType,
  type CameraPermissionState,
} from '@capacitor/camera';

@Injectable({
  providedIn: 'root',
})
export class CameraService {
  /**
   * Captures a photo from the device camera and returns it as Base64.
   */
  async takePhoto(): Promise<string | null> {
    if (!Capacitor.isNativePlatform()) {
      return this.pickImageWeb();
    }
    return this.captureFromSource(CameraSource.Camera);
  }

  /**
   * Opens the gallery picker and returns the selected image as Base64.
   */
  async pickFromGallery(): Promise<string | null> {
    if (!Capacitor.isNativePlatform()) {
      return this.pickImageWeb();
    }
    return this.captureFromSource(CameraSource.Photos);
  }

  /**
   * Safe web fallback to pick files as Base64 in browsers.
   */
  private pickImageWeb(): Promise<string | null> {
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';

      input.onchange = (event: any) => {
        const file = event.target.files?.[0];
        if (!file) {
          resolve(null);
          return;
        }

        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          const base64 = result.split(',')[1] || null;
          resolve(base64);
        };
        reader.onerror = () => {
          resolve(null);
        };
        reader.readAsDataURL(file);
      };

      input.oncancel = () => {
        resolve(null);
      };

      input.click();
    });
  }

  private async captureFromSource(
    source: CameraSource,
  ): Promise<string | null> {
    try {
      await this.ensurePermissions(source);

      // Using Camera.getPhoto is standard and returns Base64 directly
      const photoResult = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: source,
      });

      return photoResult.base64String || null;
    } catch (error) {
      if (this.isCancellation(error)) {
        return null;
      }
      console.error('Error al capturar la imagen:', error);
      throw error;
    }
  }

  private async ensurePermissions(source: CameraSource): Promise<void> {
    if (!Capacitor.isNativePlatform()) {
      return;
    }

    const permissions = await Camera.checkPermissions();

    if (source === CameraSource.Camera) {
      if (!this.hasPermission(permissions.camera)) {
        const requested = await Camera.requestPermissions({
          permissions: ['camera'],
        });
        if (!this.hasPermission(requested.camera)) {
          throw new Error('Permiso de cámara denegado');
        }
      }
      return;
    }

    // Check photos / gallery permission
    if (!this.hasPermission(permissions.photos)) {
      const requested = await Camera.requestPermissions({
        permissions: ['photos'],
      });
      if (!this.hasPermission(requested.photos)) {
        throw new Error('Permiso de galería denegado');
      }
    }
  }

  private hasPermission(state: CameraPermissionState): boolean {
    return state === 'granted' || state === 'limited';
  }

  private isCancellation(error: unknown): boolean {
    if (typeof error !== 'object' || error === null) {
      return false;
    }

    const message =
      'message' in error
        ? String((error as { message?: unknown }).message ?? '')
        : '';
    const code =
      'code' in error ? String((error as { code?: unknown }).code ?? '') : '';

    return /cancel/i.test(message) || /cancel/i.test(code);
  }
}
