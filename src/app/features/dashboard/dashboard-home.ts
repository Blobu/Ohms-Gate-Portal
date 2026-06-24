import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/service/auth.service';
import { DownloadItem } from '../../shared/download-item';
import { DownloadItemModel } from '../../core/models/download-item.model';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [DownloadItem],
  template: `
    <h1>Dashboard</h1>
    <p>Zona protejata a aplicatiei.</p>

    @if (authService.currentUser(); as user) {
      <p>Bine ai venit, {{ user.firstName }} {{ user.lastName }}</p>
      <p>Email: {{ user.email }}</p>
      <p>Rol: {{ user.role }}</p>
    }

    <app-download-item
      [id]="teacherBuild.id"
      [label]="'Download teacher build'"
      (downloadRequested)="onDownloadRequested($event)"
    />

    <button type="button" (click)="onLogout()">Logout</button>
  `,
})
export class DashboardHome {
  protected authService = inject(AuthService);
  private router = inject(Router);

  protected teacherBuild: DownloadItemModel = {
    id: 2,
    deploymentName: 'Teacher Build - Physics Lab',
    version: '1.0.0',
    platform: 'Windows',
    accessType: 'Teacher',
    estimatedInstances: 30,
    downloadUrl: '/downloads/ohms-gate-windows-teacher-1.0.0.zip',
  };

  onDownloadRequested(id: number): void {
    console.log('Download requested for id:', id);
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}