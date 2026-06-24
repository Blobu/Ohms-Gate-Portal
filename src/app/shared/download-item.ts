import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-download-item',
  standalone: true,
  template: `
    <article>
      <h2>{{ title() }}</h2>
      <p>{{ description() }}</p>
      <p>Version: {{ version() }}</p>

      @if (restricted()) {
        <p>Restricted access</p>
      }

      <button type="button" (click)="onDownload()">
        {{ buttonLabel() }}
      </button>
    </article>
  `,
})
export class DownloadItem {
  title = input.required<string>();
  description = input.required<string>();
  version = input<string>('1.0.0');
  buttonLabel = input<string>('Download');
  restricted = input<boolean>(false);

  downloadRequested = output<void>();

  onDownload(): void {
    this.downloadRequested.emit();
  }
}