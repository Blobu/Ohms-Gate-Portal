import { Component, inject } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTableModule } from 'ng-zorro-antd/table';
import { DownloadItemsService } from '../../core/service/download-items.service';
import { DownloadItem } from '../../shared/download-item';

@Component({
  selector: 'app-download-items-table',
  standalone: true,
  imports: [NzTableModule, NzButtonModule, DownloadItem],
  template: `
    <section>
      <h2>Deployment Downloads</h2>

      <nz-table
        #downloadsTable
        [nzData]="downloadItemsService.downloadItems()"
        [nzShowPagination]="false"
      >
        <thead>
          <tr>
            <th>Deployment Name</th>
            <th>Version</th>
            <th>Platform</th>
            <th>Access Type</th>
            <th>Estimated Instances</th>
            <th>Download</th>
          </tr>
        </thead>

        <tbody>
          @for (item of downloadsTable.data; track item.id) {
            <tr>
              <td>{{ item.deploymentName }}</td>
              <td>{{ item.version }}</td>
              <td>{{ item.platform }}</td>
              <td>{{ item.accessType }}</td>
              <td>{{ item.estimatedInstances }}</td>
              <td>
                <app-download-item
                  [id]="item.id"
                  [label]="'Download'"
                  (downloadRequested)="onDownloadRequested($event)"
                />
              </td>
            </tr>
          }
        </tbody>
      </nz-table>
    </section>
  `,
})
export class DownloadItemsTable {
  protected downloadItemsService = inject(DownloadItemsService);

  protected onDownloadRequested(id: number): void {
    const item = this.downloadItemsService
      .downloadItems()
      .find((downloadItem) => downloadItem.id === id);

    if (!item) {
      return;
    }

    window.open(item.downloadUrl, '_blank');
  }
}
