import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { AuthService } from '../../core/service/auth.service';
import { DownloadItemsTable } from './download-items-table';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [DownloadItemsTable, NzButtonModule],
  template: `
    <main class="teacher-portal">
      <header class="portal-header">
        <div class="portal-copy">
          <p class="portal-eyebrow">Ohm's Gate Portal</p>

          <h1>Manage Installations</h1>

          <p class="portal-description">
            Manage restricted builds, classroom deployment packages and protected
            resources for educational users.
          </p>
        </div>

        <div class="portal-actions">
          <button
            nz-button
            nzType="default"
            class="home-button"
            type="button"
            (click)="goHome()"
          >
            Home
          </button>

          <button
            nz-button
            nzType="default"
            class="logout-button"
            type="button"
            (click)="onLogout()"
          >
            Logout
          </button>
        </div>
      </header>

      <app-download-items-table />
    </main>
  `,
  styleUrl: './dashboard-home.scss',
})
export class DashboardHome {
  private authService = inject(AuthService);
  private router = inject(Router);

  goHome(): void {
    this.router.navigate(['/']);
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}