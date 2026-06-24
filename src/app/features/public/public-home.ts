import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DownloadItem } from '../../shared/download-item';
import { DownloadItemModel } from 'app/core/models/download-item.model';

@Component({
  selector: 'app-public-home',
  standalone: true,
  imports: [RouterLink, DownloadItem],
  template: `
    <h1>Ohms Gate Portal</h1>
    <p>Zona publica a aplicatiei.</p>

    <a routerLink="/auth/login">Login</a>
    <a routerLink="/auth/register">Register</a>

    <app-download-item
      [id]="publicBuild.id"
      [label]="'Download standard version'"
      (downloadRequested)="onDownloadRequested($event)"
    />
    
  `,
})
export class PublicHome {

  protected publicBuild: DownloadItemModel = {
    id: 1,
    deploymentName: 'Ohms Gate Standard Build',
    version: '1.0.0',
    platform: 'Windows',
    accessType: 'Student',
    estimatedInstances: 0,
    downloadUrl: '/downloads/ohms-gate-standard-1.0.0.zip',
  };

  onDownloadRequested(id: number): void {
    console.log('Download requested for item:', id);
  }
}