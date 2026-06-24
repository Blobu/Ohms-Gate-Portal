import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DownloadItem } from '../../shared/download-item';

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
      [title]="'Ohms Gate Standard'"
      [description]="'Public build for general users.'"
      [version]="'1.0.0'"
      [buttonLabel]="'Download now'"
      [restricted]="false"
      (downloadRequested)="onStandardDownload()"
    />
    
  `,
})
export class PublicHome {

  onStandardDownload(): void {
    console.log('Standard download requested');
  }
}