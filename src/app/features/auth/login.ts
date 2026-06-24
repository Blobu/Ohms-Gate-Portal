import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/service/auth.service';
import { Router } from '@angular/router';

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzCardModule } from 'ng-zorro-antd/card';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, NzFormModule, NzInputModule, NzButtonModule, NzCheckboxModule, NzCardModule],
  styleUrl: './login.scss',
  template: `
    <main class="auth-page">
      <section class="auth-shell">
        <nz-card nzBorderless class="auth-card">
          <div class="auth-card__inner">
            <div class="auth-card__header">
              <p class="auth-kicker">OHM'S GATE PORTAL</p>
              <h1>Welcome back</h1>
              <p class="auth-description">
                Sign in to access protected builds, teacher resources, and deployment tools.
              </p>
            </div>

            <form nz-form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="auth-form">
              <nz-form-item>
                <nz-form-control [nzErrorTip]="emailErrorTpl">
                  <label for="email">Email</label>
                  <input nz-input id="email" type="email" formControlName="email" />
                </nz-form-control>
              </nz-form-item>

              <ng-template #emailErrorTpl>
                @if (loginForm.controls.email.errors?.['required']) {
                  <span>Email is required.</span>
                }
                @if (loginForm.controls.email.errors?.['email']) {
                  <span>Email format is invalid.</span>
                }
              </ng-template>

              <nz-form-item>
                <nz-form-control [nzErrorTip]="passwordErrorTpl">
                  <label for="password">Password</label>
                  <input nz-input id="password" type="password" formControlName="password" />
                </nz-form-control>
              </nz-form-item>

              <ng-template #passwordErrorTpl>
                @if (loginForm.controls.password.errors?.['required']) {
                  <span>Password is required.</span>
                }
              </ng-template>

              <div class="auth-form__meta">
                <label nz-checkbox formControlName="rememberMe">
                  Remember me
                </label>
              </div>

              @if (serverError) {
                <p class="auth-server-error">{{ serverError }}</p>
              }

              <div class="auth-footer">
                <p>
                  Don't have an account?
                  <a class="auth-link" routerLink="/auth/register">Sign up</a>
                </p>

                <button nz-button nzType="primary" class="auth-submit" type="submit">
                  Enter portal
                </button>
              </div>
            </form>
          </div>
        </nz-card>
      </section>
    </main>
  `,
})
export class Login {
  private authService = inject(AuthService);
  private router = inject(Router);
  serverError = '';

  loginForm = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    rememberMe: new FormControl(false, {
      nonNullable: true,
    }),
  });

  onSubmit(): void {
    this.serverError = '';
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, password, rememberMe } = this.loginForm.getRawValue();
    const payload = { email, password };

    this.authService.login(payload).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        this.authService.saveSession(response, rememberMe);
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Login failed:', error);
        this.serverError = error.error?.message ?? 'An error occurred during login. Please try again.';
      }
    });
  }
}
