import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import {
  Camera,
  CameraSource,
  MediaTypeSelection,
  type CameraPermissionState,
  type MediaResult,
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
   * Safe web fallback to pick files as Base64 in browsers without requiring native plugins or PWA elements.
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
          // Extract base64 part from data URL
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

      const mediaResult =
        source === CameraSource.Camera
          ? await Camera.takePhoto({
              quality: 90,
              correctOrientation: true,
              saveToGallery: false,
              includeMetadata: false,
            })
          : await this.pickImageFromGallery();

      return this.extractBase64(mediaResult);
    } catch (error) {
      if (this.isCancellation(error)) {
        return null;
      }

      throw error;
    }
  }

  private async pickImageFromGallery(): Promise<MediaResult> {
    const results = await Camera.chooseFromGallery({
      mediaType: MediaTypeSelection.Photo,
      allowMultipleSelection: false,
      includeMetadata: false,
      quality: 90,
      editable: 'no',
    });

    const [mediaResult] = results.results;
    if (!mediaResult) {
      throw new Error('No se seleccionó ninguna imagen');
    }

    return mediaResult;
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

  private extractBase64(mediaResult: MediaResult): string | null {
    return mediaResult.thumbnail ?? null;
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
