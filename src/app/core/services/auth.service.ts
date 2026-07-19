import { inject, Injectable } from '@angular/core';
import { AuthResponseInterface } from '../interfaces/auth-response.interface';
import { UserModel } from '../models/user.model';
import {
  Auth,
  authState,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { map, Observable } from 'rxjs';
import { updateProfile, User as FirebaseUser } from 'firebase/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly auth = inject(Auth);
  private readonly firestore = inject(Firestore);

  /** Emits the Firebase auth state and keeps the session synchronized. */
  readonly authState$: Observable<FirebaseUser | null> = authState(this.auth);

  /** Indicates whether a Firebase session is currently active. */
  readonly isAuthenticated$ = this.authState$.pipe(map((user) => !!user));

  /** Signs in an existing user with email and password. */
  async login(email: string, password: string): Promise<AuthResponseInterface> {
    const credential = await signInWithEmailAndPassword(
      this.auth,
      email.trim(),
      password,
    );

    return this.buildAuthResponse(credential.user);
  }

  /** Creates a Firebase Authentication account and stores the user profile in Firestore. */
  async register(
    name: string,
    email: string,
    password: string,
  ): Promise<AuthResponseInterface> {
    const cleanName = name.trim();
    const cleanEmail = email.trim();

    const credential = await createUserWithEmailAndPassword(
      this.auth,
      cleanEmail,
      password,
    );

    await updateProfile(credential.user, {
      displayName: cleanName,
      photoURL: '',
    });

    const profile = this.buildUserModel(credential.user, cleanName);
    await setDoc(doc(this.firestore, 'users', credential.user.uid), profile);

    return this.buildAuthResponse(credential.user, profile);
  }

  /** Ends the active Firebase session. */
  async logout(): Promise<void> {
    await signOut(this.auth);
  }

  private async buildAuthResponse(
    user: FirebaseUser,
    profile?: UserModel,
  ): Promise<AuthResponseInterface> {
    const token = await user.getIdToken();
    const tokenResult = await user.getIdTokenResult();

    return {
      user: profile ?? this.buildUserModel(user),
      token,
      expiresIn: tokenResult.expirationTime
        ? new Date(tokenResult.expirationTime).getTime() - Date.now()
        : undefined,
    };
  }

  private buildUserModel(user: FirebaseUser, name?: string): UserModel {
    const now = new Date().toISOString();

    return {
      uid: user.uid,
      name: name ?? user.displayName ?? user.email?.split('@')[0] ?? '',
      email: user.email ?? '',
      avatarUrl: user.photoURL ?? '',
      points: 0,
      totalScans: 0,
      createdAt: now,
      updatedAt: now,
    };
  }
}
