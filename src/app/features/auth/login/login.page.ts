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
import { leafOutline, lockClosedOutline, mailOutline } from 'ionicons/icons';

import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
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
export class LoginPage {
  constructor() {
    addIcons({ leafOutline, mailOutline, lockClosedOutline });
  }
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  errorMessage = '';
  isLoading = false;

  readonly form = this.formBuilder.nonNullable.group({
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
      const { email, password } = this.form.getRawValue();
      await this.authService.login(email, password);
      await this.router.navigateByUrl('/home');
    } catch {
      this.errorMessage = 'No fue posible iniciar sesión. Verifica tus datos.';
    } finally {
      this.isLoading = false;
    }
  }
}
