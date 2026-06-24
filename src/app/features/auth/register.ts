import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/service/auth.service';
import { Router } from '@angular/router';

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';


const passwordsMatchValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;

  if (password !== confirmPassword) {
    return { passwordsMismatch: true };
  }

  return null;
};

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, NzFormModule, NzInputModule, NzButtonModule, NzCardModule],
  styleUrl: './register.scss',
  template: `
    <main class="auth-page">
      <section class="auth-shell">
        <nz-card nzBorderless class="auth-card">
          <div class="auth-card__inner">
            <div class="auth-card__header">
              <p class="auth-kicker">OHM'S GATE PORTAL</p>
              <h1>Create your account</h1>
              <p class="auth-description">
                Request access to the protected portal and prepare your teacher deployment workspace.
              </p>
            </div>

            <form nz-form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="auth-form">
              <div class="auth-form__row">
                <nz-form-item>
                  <nz-form-control [nzErrorTip]="firstNameErrorTpl">
                    <label for="firstName">First name</label>
                    <input nz-input id="firstName" type="text" formControlName="firstName" />
                  </nz-form-control>
                </nz-form-item>

                <nz-form-item>
                  <nz-form-control [nzErrorTip]="lastNameErrorTpl">
                    <label for="lastName">Last name</label>
                    <input nz-input id="lastName" type="text" formControlName="lastName" />
                  </nz-form-control>
                </nz-form-item>
              </div>

              <ng-template #firstNameErrorTpl>
                @if (registerForm.controls.firstName.errors?.['required']) {
                  <span>First name is required.</span>
                }
              </ng-template>

              <ng-template #lastNameErrorTpl>
                @if (registerForm.controls.lastName.errors?.['required']) {
                  <span>Last name is required.</span>
                }
              </ng-template>

              <nz-form-item>
                <nz-form-control [nzErrorTip]="emailErrorTpl">
                  <label for="email">Email</label>
                  <input nz-input id="email" type="email" formControlName="email" />
                </nz-form-control>
              </nz-form-item>

              <ng-template #emailErrorTpl>
                @if (registerForm.controls.email.errors?.['required']) {
                  <span>Email is required.</span>
                }
                @if (registerForm.controls.email.errors?.['email']) {
                  <span>Email format is invalid.</span>
                }
              </ng-template>

              <div class="auth-form__row">
                <nz-form-item>
                  <nz-form-control [nzErrorTip]="passwordErrorTpl">
                    <label for="password">Password</label>
                    <input nz-input id="password" type="password" formControlName="password" />
                  </nz-form-control>
                </nz-form-item>

                <nz-form-item>
                  <nz-form-control [nzErrorTip]="confirmPasswordErrorTpl">
                    <label for="confirmPassword">Confirm password</label>
                    <input nz-input id="confirmPassword" type="password" formControlName="confirmPassword" />
                  </nz-form-control>
                </nz-form-item>
              </div>

              <ng-template #passwordErrorTpl>
                @if (registerForm.controls.password.errors?.['required']) {
                  <span>Password is required.</span>
                }
                @if (registerForm.controls.password.errors?.['minlength']) {
                  <span>Password must have at least 6 characters.</span>
                }
              </ng-template>

              <ng-template #confirmPasswordErrorTpl>
                @if (registerForm.controls.confirmPassword.errors?.['required']) {
                  <span>Confirm password is required.</span>
                }
                @if (registerForm.errors?.['passwordsMismatch']) {
                  <span>Passwords do not match.</span>
                }
              </ng-template>

              @if (serverError) {
                <p class="auth-server-error">{{ serverError }}</p>
              }
              <div class="auth-footer">
                <p>
                  Already registered?
                  <a class="auth-link" routerLink="/auth/login">Sign in</a>
                </p>

                <button nz-button nzType="primary" class="auth-submit" type="submit">
                  Create account
                </button>
              </div>
            </form>
          </div>
        </nz-card>
      </section>
    </main>
  `,
})
export class Register {

  private authService = inject(AuthService);
  private router = inject(Router);
  serverError = '';

  registerForm = new FormGroup(
    {
      firstName: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      lastName: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      email: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.email],
      }),
      password: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(6)],
      }),
      confirmPassword: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
    },
    { validators: [passwordsMatchValidator] }
  );

  onSubmit(): void {
    this.serverError = '';
    if (this.registerForm.invalid) {
      console.log('Form is invalid:', this.registerForm.errors);
      this.registerForm.markAllAsTouched();
      return;
    }

    const { firstName, lastName, email, password } = this.registerForm.getRawValue();

    const payload = {
      firstName,
      lastName,
      email,
      password,
    };

    this.authService.register(payload).subscribe({
      next: (response) => {
        this.authService.saveSession(response, false);
        console.log('Registration successful:', response);
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Registration failed:', error);
        this.serverError = error.error?.message ?? 'An error occurred during registration. Please try again.';
      },
    });
  }
}
