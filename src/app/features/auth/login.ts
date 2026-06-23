import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/service/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <h1>Login</h1>

    <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
      <div>
        <label for="email">Email</label>
        <input id="email" type="email" formControlName="email" />

        @if (loginForm.controls.email.touched && loginForm.controls.email.invalid) {
          <div>
            @if (loginForm.controls.email.errors?.['required']) {
              <small>Email is required.</small>
            }
            @if (loginForm.controls.email.errors?.['email']) {
              <small>Email format is invalid.</small>
            }
          </div>
        }
      </div>

      <div>
        <label for="password">Password</label>
        <input id="password" type="password" formControlName="password" />

        @if (loginForm.controls.password.touched && loginForm.controls.password.invalid) {
          <div>
            @if (loginForm.controls.password.errors?.['required']) {
              <small>Password is required.</small>
            }
          </div>
        }
      </div>

      <div>
        <label>
          <input type="checkbox" formControlName="rememberMe" />
          Remember me
        </label>
      </div>

      <button type="submit">Login</button>
    </form>
  `,
})
export class Login {
  private authService = inject(AuthService);

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
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const {email, password, rememberMe} = this.loginForm.value as { email: string; password: string; rememberMe: boolean };
    const payload = { email, password } as { email: string; password: string };

    this.authService.login(payload).subscribe({ // fara subscribe nu se face loginul si nu se trimite raspuns
      next: (response) => {
        console.log('Login successful:', response);
        this.authService.saveSession(response, rememberMe);
      },
      error: (error) => {
        console.error('Login failed:', error);
      }
    });
  }
}