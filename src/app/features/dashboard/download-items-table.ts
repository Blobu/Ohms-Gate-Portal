import { Component, computed, inject, signal } from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule } from 'ng-zorro-antd/table';
import {
  DownloadItemAccessType,
  DownloadItemModel,
  DownloadItemPlatform,
  DownloadItemVersion,
} from '../../core/models/download-item.model';
import { DownloadItemsService } from '../../core/service/download-items.service';
import { DownloadItem } from '../../shared/download-item';

@Component({
  selector: 'app-download-items-table',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NzTableModule,
    NzInputModule,
    NzInputNumberModule,
    NzButtonModule,
    NzPopconfirmModule,
    NzModalModule,
    NzFormModule,
    NzSelectModule,
    DownloadItem,
  ],
  template: `
    <section>
      <h2>Deployment Downloads</h2>

      <div class="table-toolbar">
        <button nz-button nzType="primary" (click)="openAddModal()">
          Add Deployment
        </button>

        <input
          nz-input
          type="text"
          placeholder="Search deployments..."
          [value]="searchTerm()"
          (input)="onSearchChange($event)"
          class="search-input"
        />
      </div>

      <nz-table
        #downloadsTable
        [nzData]="filteredDownloadItems()"
        [nzShowPagination]="false"
        [nzNoResult]="'No deployments found'"
      >
        <thead>
          <tr>
            <th [nzSortFn]="sortByDeploymentName">Deployment Name</th>
            <th [nzSortFn]="sortByVersion">Version</th>
            <th [nzSortFn]="sortByPlatform">Platform</th>
            <th [nzSortFn]="sortByAccessType">Access Type</th>
            <th [nzSortFn]="sortByEstimatedInstances">Estimated Instances</th>
            <th [nzSortFn]="sortByDownloadUrl">Download</th>
            <th>Actions</th>
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
              <td>
                <button
                  nz-button
                  nzDanger
                  nz-popconfirm
                  nzPopconfirmTitle="Are you sure you want to delete this deployment?"
                  nzOkText="Yes"
                  nzCancelText="No"
                  (nzOnConfirm)="onDeleteItem(item.id)"
                >
                  Delete
                </button>
              </td>
            </tr>
          }
        </tbody>
      </nz-table>

      <nz-modal
        [nzVisible]="isAddModalVisible()"
        nzTitle="Add Deployment"
        nzOkText="Save"
        nzCancelText="Cancel"
        [nzWidth]="560"
        [nzCentered]="true"
        (nzVisibleChange)="isAddModalVisible.set($event)"
        (nzOnCancel)="closeAddModal()"
        (nzOnOk)="onSubmitAdd()"
      >
        <ng-container *nzModalContent>
          <form nz-form nzLayout="vertical" [formGroup]="addForm">
            <nz-form-item>
              <nz-form-label nzRequired>Deployment Name</nz-form-label>
              <nz-form-control nzErrorTip="Deployment name is required.">
                <input
                  nz-input
                  formControlName="deploymentName"
                  placeholder="Example: Teacher Build - Physics Lab"
                />
              </nz-form-control>
            </nz-form-item>

            <nz-form-item>
              <nz-form-label nzRequired>Version</nz-form-label>
              <nz-form-control nzErrorTip="Version is required.">
                <nz-select
                  formControlName="version"
                  nzPlaceHolder="Select version"
                >
                  @for (version of versions; track version) {
                    <nz-option
                      [nzValue]="version"
                      [nzLabel]="version"
                    ></nz-option>
                  }
                </nz-select>
              </nz-form-control>
            </nz-form-item>

            <nz-form-item>
              <nz-form-label nzRequired>Platform</nz-form-label>
              <nz-form-control nzErrorTip="Platform is required.">
                <nz-select
                  formControlName="platform"
                  nzPlaceHolder="Select platform"
                >
                  @for (platform of platforms; track platform) {
                    <nz-option
                      [nzValue]="platform"
                      [nzLabel]="platform"
                    ></nz-option>
                  }
                </nz-select>
              </nz-form-control>
            </nz-form-item>

            <nz-form-item>
              <nz-form-label nzRequired>Access Type</nz-form-label>
              <nz-form-control nzErrorTip="Access type is required.">
                <nz-select
                  formControlName="accessType"
                  nzPlaceHolder="Select access type"
                >
                  @for (accessType of accessTypes; track accessType) {
                    <nz-option
                      [nzValue]="accessType"
                      [nzLabel]="accessType"
                    ></nz-option>
                  }
                </nz-select>
              </nz-form-control>
            </nz-form-item>

            <nz-form-item>
              <nz-form-label nzRequired>Estimated Instances</nz-form-label>
              <nz-form-control
                nzErrorTip="Estimated instances must be at least 1."
              >
                <nz-input-number
                  formControlName="estimatedInstances"
                  [nzMin]="1"
                  [nzStep]="1"
                  class="full-width"
                ></nz-input-number>
              </nz-form-control>
            </nz-form-item>
          </form>
        </ng-container>
      </nz-modal>
    </section>
  `,
  styles: [
    `
      .table-toolbar {
        display: flex;
        gap: 12px;
        align-items: center;
        margin-bottom: 16px;
      }

      .search-input {
        max-width: 320px;
      }

      .full-width {
        width: 100%;
      }
    `,
  ],
})
export class DownloadItemsTable {
  protected downloadItemsService = inject(DownloadItemsService);
  private fb = inject(NonNullableFormBuilder);

  protected searchTerm = signal('');
  protected isAddModalVisible = signal(false);

  protected versions: DownloadItemVersion[] = ['1.0.0', '1.0.1', '1.1.0'];

  protected platforms: DownloadItemPlatform[] = [
    'Windows',
    'Quest 2/3',
    'PS VR',
    'Vive Pro2',
  ];

  protected accessTypes: DownloadItemAccessType[] = ['Student', 'Teacher'];

  protected addForm = this.fb.group({
    deploymentName: ['', [Validators.required]],
    version: ['1.0.0' as DownloadItemVersion, [Validators.required]],
    platform: ['Windows' as DownloadItemPlatform, [Validators.required]],
    accessType: ['Student' as DownloadItemAccessType, [Validators.required]],
    estimatedInstances: [1, [Validators.required, Validators.min(1)]],
  });

  protected filteredDownloadItems = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();

    if (!term) {
      return this.downloadItemsService.downloadItems();
    }

    return this.downloadItemsService.downloadItems().filter((item) => {
      return (
        item.deploymentName.toLowerCase().includes(term) ||
        item.version.toLowerCase().includes(term) ||
        item.platform.toLowerCase().includes(term) ||
        item.accessType.toLowerCase().includes(term) ||
        item.estimatedInstances.toString().includes(term) ||
        item.downloadUrl.toLowerCase().includes(term)
      );
    });
  });

  protected sortByDeploymentName = (
    a: DownloadItemModel,
    b: DownloadItemModel
  ): number => a.deploymentName.localeCompare(b.deploymentName);

  protected sortByVersion = (
    a: DownloadItemModel,
    b: DownloadItemModel
  ): number => a.version.localeCompare(b.version);

  protected sortByPlatform = (
    a: DownloadItemModel,
    b: DownloadItemModel
  ): number => a.platform.localeCompare(b.platform);

  protected sortByAccessType = (
    a: DownloadItemModel,
    b: DownloadItemModel
  ): number => a.accessType.localeCompare(b.accessType);

  protected sortByEstimatedInstances = (
    a: DownloadItemModel,
    b: DownloadItemModel
  ): number => a.estimatedInstances - b.estimatedInstances;

  protected sortByDownloadUrl = (
    a: DownloadItemModel,
    b: DownloadItemModel
  ): number => a.downloadUrl.localeCompare(b.downloadUrl);

  protected onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
  }

  protected openAddModal(): void {
    this.addForm.reset({
      deploymentName: '',
      version: '1.0.0',
      platform: 'Windows',
      accessType: 'Student',
      estimatedInstances: 1,
    });

    this.isAddModalVisible.set(true);
  }

  protected closeAddModal(): void {
    this.isAddModalVisible.set(false);
  }

  protected onSubmitAdd(): void {
    if (this.addForm.invalid) {
      this.markAddFormAsDirty();
      return;
    }

    const formValue = this.addForm.getRawValue();

    this.downloadItemsService.addItem({
      deploymentName: formValue.deploymentName,
      version: formValue.version,
      platform: formValue.platform,
      accessType: formValue.accessType,
      estimatedInstances: formValue.estimatedInstances,
    });

    this.closeAddModal();
  }

  protected onDownloadRequested(id: number): void {
    const item = this.downloadItemsService
      .downloadItems()
      .find((downloadItem) => downloadItem.id === id);

    if (!item) {
      return;
    }

    window.open(item.downloadUrl, '_blank');
  }

  protected onDeleteItem(id: number): void {
    this.downloadItemsService.deleteItem(id);
  }

  private markAddFormAsDirty(): void {
    Object.values(this.addForm.controls).forEach((control) => {
      control.markAsDirty();
      control.updateValueAndValidity();
    });
  }
}