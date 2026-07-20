import { inject, Injectable } from '@angular/core';
import { GeminiResponseInterface } from '../interfaces/gemini-response.interface';
import { ClassificationModel } from '../models/classification.model';
import { GEMINI_CONFIG } from '../config/gemini.config';
import { BehaviorSubject, firstValueFrom, take } from 'rxjs';

import { AuthService } from './auth.service';
import { FirestoreService } from './firestore.service';

type GeminiPayload = {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
};

@Injectable({
  providedIn: 'root',
})
export class GeminiService {
  private readonly authService = inject(AuthService);
  private readonly firestoreService = inject(FirestoreService);

  private readonly lastImageSubject = new BehaviorSubject<string | null>(null);
  private readonly lastClassificationSubject =
    new BehaviorSubject<ClassificationModel | null>(null);

  readonly lastImage$ = this.lastImageSubject.asObservable();
  readonly lastClassification$ = this.lastClassificationSubject.asObservable();

  async classifyAndSave(imageBase64: string): Promise<ClassificationModel> {
    const classification = await this.classifyImage(imageBase64);
    let imageUrl = '';
    await this.firestoreService.saveClassification(classification, imageUrl);

    this.lastImageSubject.next(imageBase64);
    this.lastClassificationSubject.next(classification);

    return classification;
  }

  /**
   * Sends the base64 image to Gemini and returns a normalized classification model.
   */
  async classifyImage(imageBase64: string): Promise<ClassificationModel> {
    await this.getCurrentUserId();

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_CONFIG.model}:generateContent?key=${GEMINI_CONFIG.apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.2,
          },
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: this.buildPrompt(),
                },
                {
                  inlineData: {
                    mimeType: 'image/jpeg',
                    data: imageBase64,
                  },
                },
              ],
            },
          ],
        }),
      },
    );

    if (!response.ok) {
      // throw new Error('Gemini request failed');
      const error = await response.json();

      console.error(error);

      throw new Error(JSON.stringify(error, null, 2));
    }

    const payload = (await response.json()) as GeminiPayload;
    const rawText = payload.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      throw new Error('Gemini returned an empty response');
    }

    const cleanedJson = this.cleanJsonText(rawText);
    const parsed = JSON.parse(cleanedJson) as GeminiResponseInterface;

    return this.toClassificationModel(parsed);
  }

  private buildPrompt(): string {
    return [
      'Eres un asistente experto en clasificación de residuos.',
      'Analiza la imagen y responde únicamente en JSON válido con estas claves exactas:',
      '{"material":"","type":"","confidence":0,"container":"","degradationTime":"","recommendations":""}',
      'No incluyas texto adicional, markdown ni explicaciones.',
    ].join(' ');
  }

  private cleanJsonText(text: string): string {
    const trimmed = text.trim();

    if (!trimmed.startsWith('```json')) {
      return trimmed;
    }

    const firstLineBreak = trimmed.indexOf('\n');
    const lastFence = trimmed.lastIndexOf('```');

    if (firstLineBreak === -1 || lastFence <= firstLineBreak) {
      return trimmed;
    }

    return trimmed.slice(firstLineBreak + 1, lastFence).trim();
  }

  private toClassificationModel(
    response: GeminiResponseInterface,
  ): ClassificationModel {
    return {
      material: response.material,
      type: response.type,
      confidence: response.confidence,
      container: response.container,
      degradationTime: response.degradationTime,
      recommendations: this.normalizeRecommendations(response.recommendations),
    };
  }

  private normalizeRecommendations(recommendations: string): string[] {
    return recommendations
      .split('\n')
      .join(',')
      .split(',')
      .map((item: string) => item.trim())
      .filter(Boolean);
  }

  private async getCurrentUserId(): Promise<string> {
    const currentUser = await firstValueFrom(
      this.authService.authState$.pipe(take(1)),
    );

    if (!currentUser) {
      throw new Error('No authenticated user found');
    }

    return currentUser.uid;
  }
}
