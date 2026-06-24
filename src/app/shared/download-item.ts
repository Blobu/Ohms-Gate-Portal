import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-download-item',
  standalone: true,
  template: `
    <button type="button" (click)="onDownload()">
      {{ label() }}
    </button>
  `,
})
export class DownloadItem {
  id = input.required<number>();
  label = input<string>('Download');

  downloadRequested = output<number>();

  onDownload(): void {
    this.downloadRequested.emit(this.id());
  }
}