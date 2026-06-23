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
import { AuthService } from 'app/core/service/auth.service';

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
  imports: [ReactiveFormsModule],
  template: `
    <h1>Register</h1>

    <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
      <div>
        <label for="firstName">First name</label>
        <input id="firstName" type="text" formControlName="firstName" />

        @if (registerForm.controls.firstName.touched && registerForm.controls.firstName.invalid) {
          <small>First name is required.</small>
        }
      </div>

      <div>
        <label for="lastName">Last name</label>
        <input id="lastName" type="text" formControlName="lastName" />

        @if (registerForm.controls.lastName.touched && registerForm.controls.lastName.invalid) {
          <small>Last name is required.</small>
        }
      </div>

      <div>
        <label for="email">Email</label>
        <input id="email" type="email" formControlName="email" />

        @if (registerForm.controls.email.touched && registerForm.controls.email.invalid) {
          <div>
            @if (registerForm.controls.email.errors?.['required']) {
              <small>Email is required.</small>
            }
            @if (registerForm.controls.email.errors?.['email']) {
              <small>Email format is invalid.</small>
            }
          </div>
        }
      </div>

      <div>
        <label for="password">Password</label>
        <input id="password" type="password" formControlName="password" />

        @if (registerForm.controls.password.touched && registerForm.controls.password.invalid) {
          <div>
            @if (registerForm.controls.password.errors?.['required']) {
              <small>Password is required.</small>
            }
            @if (registerForm.controls.password.errors?.['minlength']) {
              <small>Password must have at least 6 characters.</small>
            }
          </div>
        }
      </div>

      <div>
        <label for="confirmPassword">Confirm password</label>
        <input id="confirmPassword" type="password" formControlName="confirmPassword" />

        @if (registerForm.controls.confirmPassword.touched && registerForm.controls.confirmPassword.invalid) {
          @if (registerForm.controls.confirmPassword.errors?.['required']) {
            <small>Confirm password is required.</small>
          }
        }

        @if (
          registerForm.touched &&
          registerForm.errors?.['passwordsMismatch']
        ) {
          <small>Passwords do not match.</small>
        }
      </div>

      <button type="submit">Register</button>
    </form>
  `,
})
export class Register {

  private authService = inject(AuthService);

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
    if (this.registerForm.invalid) {
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
      },
      error: (error) => {
        console.error('Registration failed:', error);
      },
    });
  }
}