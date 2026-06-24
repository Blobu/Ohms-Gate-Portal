import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/service/auth.service';
import { DownloadItemsTable } from './download-items-table';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [DownloadItemsTable],
  template: `
    <h1>Dashboard</h1>
    <p>Zona protejata a aplicatiei.</p>

    @if (authService.currentUser(); as user) {
      <p>Bine ai venit, {{ user.firstName }} {{ user.lastName }}</p>
      <p>Email: {{ user.email }}</p>
      <p>Rol: {{ user.role }}</p>
    }

    <app-download-items-table />

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