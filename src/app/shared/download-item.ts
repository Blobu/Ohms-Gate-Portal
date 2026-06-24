import { Component, input, output } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-download-item',
  standalone: true,
  imports: [NzButtonModule],
  template: `
    <button
      nz-button
      nzType="default"
      type="button"
      (click)="downloadRequested.emit(id())"
    >
      {{ label() }}
    </button>
  `,
})
export class DownloadItem {
  id = input.required<number>();
  label = input<string>('Download');

  downloadRequested = output<number>();
}