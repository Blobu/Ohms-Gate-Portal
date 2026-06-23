import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { inject } from '@angular/core';
import {
  AuthResponse,
  AuthenticatedUser,
  LoginRequest,
  RegisterRequest,
} from '../models/auth.models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);

  currentUser = signal<AuthenticatedUser | null>(null);

  login(payload: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>('http://localhost:3000/auth/login', payload);
  }

  register(payload: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>('http://localhost:3000/auth/register', payload);
  }

  setCurrentUser(user: AuthenticatedUser | null): void {
    this.currentUser.set(user);
  }

  saveSession(response: AuthResponse, rememberMe: boolean): void {
    const storage = rememberMe ? localStorage : sessionStorage;

    localStorage.removeItem('accessToken');
    localStorage.removeItem('currentUser');
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('currentUser');

    storage.setItem('accessToken', response.accessToken);
    storage.setItem('currentUser', JSON.stringify(response.user));

    this.currentUser.set(response.user);
  }

  restoreSession(): void {
    const storedUser =
      localStorage.getItem('currentUser') ?? sessionStorage.getItem('currentUser');

    if (!storedUser) {
      this.currentUser.set(null);
      return;
    }

    this.currentUser.set(JSON.parse(storedUser) as AuthenticatedUser);
  }

  getAccessToken(): string | null {
    return (
      localStorage.getItem('accessToken') ??
      sessionStorage.getItem('accessToken')
    );
  }

  logout(): void {
    this.currentUser.set(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('currentUser');
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('currentUser');
  }

  isAuthenticated(): boolean {
    return this.currentUser() !== null;
  }
}