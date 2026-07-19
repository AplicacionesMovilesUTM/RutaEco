import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonContent,
  IonIcon,
  IonInput,
  IonText,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  leafOutline,
  lockClosedOutline,
  mailOutline,
  personOutline,
} from 'ionicons/icons';

import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-registro-page',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonContent,
    IonInput,
    IonButton,
    IonText,
    IonIcon,
    IonCard,
    IonCardContent,
    RouterLink,
  ],
  standalone: true,
})
export class RegistroPage {
  constructor() {
    addIcons({ leafOutline, mailOutline, lockClosedOutline, personOutline });
  }
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  errorMessage = '';
  isLoading = false;

  readonly form = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    try {
      const { name, email, password } = this.form.getRawValue();
      await this.authService.register(name, email, password);
      await this.router.navigateByUrl('/home');
    } catch {
      this.errorMessage = 'No fue posible crear la cuenta. Intenta nuevamente.';
    } finally {
      this.isLoading = false;
    }
  }
}
