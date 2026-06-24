import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/service/auth.service';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  template: `
    <h1>Dashboard</h1>
    <p>Zona protejata a aplicatiei.</p>

    <button type="button" (click)="onLogout()">Logout</button>
  `,
})
export class DashboardHome {
  protected authService = inject(AuthService);
  private router = inject(Router);

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}