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
    <section class="downloads-section">
      <div class="downloads-header">
        <div>
          <p class="eyebrow">Teacher resources</p>
          <h2>Deployment Downloads</h2>
        </div>

        <button nz-button nzType="primary" (click)="openAddModal()">
          Add Deployment
        </button>
      </div>

      <div class="table-toolbar">
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
                <div class="actions-cell">
                  <button nz-button nzType="default" (click)="openEditModal(item)">
                    Edit
                  </button>

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
                </div>
              </td>
            </tr>
          }
        </tbody>
      </nz-table>

      <nz-modal
        [nzVisible]="isModalVisible()"
        [nzTitle]="modalTitle()"
        [nzOkText]="modalOkText()"
        nzCancelText="Cancel"
        nzClassName="soft-brutal-modal"
        [nzWidth]="560"
        [nzCentered]="true"
        (nzVisibleChange)="isModalVisible.set($event)"
        (nzOnCancel)="closeModal()"
        (nzOnOk)="onSubmitForm()"
      >
        <ng-container *nzModalContent>
          <form nz-form nzLayout="vertical" [formGroup]="deploymentForm">
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
  styleUrl: './download-items-table.scss',
})
export class DownloadItemsTable {
  protected downloadItemsService = inject(DownloadItemsService);
  private fb = inject(NonNullableFormBuilder);

  protected searchTerm = signal('');
  protected isModalVisible = signal(false);
  protected editingItemId = signal<number | null>(null);

  protected versions: DownloadItemVersion[] = ['1.0.0', '1.0.1', '1.1.0'];

  protected platforms: DownloadItemPlatform[] = [
    'Windows',
    'Quest 2/3',
    'PS VR',
    'Vive Pro2',
  ];

  protected accessTypes: DownloadItemAccessType[] = ['Student', 'Teacher'];

  protected deploymentForm = this.fb.group({
    deploymentName: ['', [Validators.required]],
    version: ['1.0.0' as DownloadItemVersion, [Validators.required]],
    platform: ['Windows' as DownloadItemPlatform, [Validators.required]],
    accessType: ['Student' as DownloadItemAccessType, [Validators.required]],
    estimatedInstances: [1, [Validators.required, Validators.min(1)]],
  });

  protected modalTitle = computed(() =>
    this.editingItemId() === null ? 'Add Deployment' : 'Edit Deployment'
  );

  protected modalOkText = computed(() =>
    this.editingItemId() === null ? 'Add' : 'Save Changes'
  );

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
    this.editingItemId.set(null);

    this.deploymentForm.reset({
      deploymentName: '',
      version: '1.0.0',
      platform: 'Windows',
      accessType: 'Student',
      estimatedInstances: 1,
    });

    this.isModalVisible.set(true);
  }

  protected openEditModal(item: DownloadItemModel): void {
    this.editingItemId.set(item.id);

    this.deploymentForm.reset({
      deploymentName: item.deploymentName,
      version: item.version,
      platform: item.platform,
      accessType: item.accessType,
      estimatedInstances: item.estimatedInstances,
    });

    this.isModalVisible.set(true);
  }

  protected closeModal(): void {
    this.isModalVisible.set(false);
    this.editingItemId.set(null);
  }

  protected onSubmitForm(): void {
    if (this.deploymentForm.invalid) {
      this.markFormAsDirty();
      return;
    }

    const formValue = this.deploymentForm.getRawValue();
    const editingId = this.editingItemId();

    if (editingId === null) {
      this.downloadItemsService.addItem({
        deploymentName: formValue.deploymentName,
        version: formValue.version,
        platform: formValue.platform,
        accessType: formValue.accessType,
        estimatedInstances: formValue.estimatedInstances,
      });
    } else {
      const existingItem = this.downloadItemsService
        .downloadItems()
        .find((item) => item.id === editingId);

      if (!existingItem) {
        this.closeModal();
        return;
      }

      this.downloadItemsService.updateItem({
        ...existingItem,
        deploymentName: formValue.deploymentName,
        version: formValue.version,
        platform: formValue.platform,
        accessType: formValue.accessType,
        estimatedInstances: formValue.estimatedInstances,
      });
    }

    this.closeModal();
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

  private markFormAsDirty(): void {
    Object.values(this.deploymentForm.controls).forEach((control) => {
      control.markAsDirty();
      control.updateValueAndValidity();
    });
  }
}