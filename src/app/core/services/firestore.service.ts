import { inject, Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  Firestore,
  orderBy,
  query,
  where,
} from '@angular/fire/firestore';
import { Storage, ref, uploadString, getDownloadURL } from '@angular/fire/storage';
import { firstValueFrom, map, Observable, of, switchMap, take } from 'rxjs';

import { AuthService } from './auth.service';
import { ClassificationModel } from '../models/classification.model';

export interface StoredClassification extends ClassificationModel {
  uid: string;
  id?: string;
}

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  private readonly firestore = inject(Firestore);
  private readonly authService = inject(AuthService);
  private readonly storage = inject(Storage);

  /** Uploads a base64 image to Firebase Storage and returns its download URL. */
  async uploadImage(base64Image: string): Promise<string> {
    const uid = await this.getCurrentUid();
    const filePath = `users/${uid}/classifications/${Date.now()}.jpg`;
    const fileRef = ref(this.storage, filePath);

    const uploadResult = await uploadString(fileRef, base64Image, 'base64', {
      contentType: 'image/jpeg',
    });

    return getDownloadURL(uploadResult.ref);
  }

  /** Saves a classification result for the authenticated user. */
  async saveClassification(
    classification: ClassificationModel,
    imageUrl?: string,
  ): Promise<void> {
    const uid = await this.getCurrentUid();

    await addDoc(collection(this.firestore, 'classifications'), {
      uid,
      material: classification.material,
      type: classification.type,
      confidence: classification.confidence,
      container: classification.container,
      degradationTime: classification.degradationTime,
      recommendations: classification.recommendations,
      imageUrl: imageUrl || classification.imageUrl || '',
      createdAt: new Date().toISOString(),
    });
  }

  /** Streams the authenticated user's classifications ordered by most recent first. */
  watchUserClassifications(): Observable<StoredClassification[]> {
    return this.authService.authState$.pipe(
      switchMap((user) => {
        if (!user) {
          return of([] as StoredClassification[]);
        }

        const classificationsRef = collection(
          this.firestore,
          'classifications',
        );
        const classificationsQuery = query(
          classificationsRef,
          where('uid', '==', user.uid),
          orderBy('createdAt', 'desc'),
        );

        return collectionData(classificationsQuery, {
          idField: 'id',
        }).pipe(map((records) => records as StoredClassification[]));
      }),
    );
  }

  private async getCurrentUid(): Promise<string> {
    const currentUser = await firstValueFrom(
      this.authService.authState$.pipe(take(1)),
    );

    if (!currentUser) {
      throw new Error('No authenticated user found');
    }

    return currentUser.uid;
  }
}
