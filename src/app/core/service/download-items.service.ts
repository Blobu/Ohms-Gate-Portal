import { Injectable, signal } from '@angular/core';
import {
  DownloadItemAccessType,
  DownloadItemModel,
  DownloadItemPlatform,
  DownloadItemVersion,
} from '../models/download-item.model';

@Injectable({
  providedIn: 'root',
})
export class DownloadItemsService {
  private readonly storageKey = 'ohms-gate-download-items';

  private readonly initialItems: DownloadItemModel[] = [
    {
      id: 1,
      deploymentName: 'Teacher Build - Physics Lab',
      version: '1.0.0',
      platform: 'Windows',
      accessType: 'Teacher',
      estimatedInstances: 30,
      downloadUrl: this.generateDownloadUrl('Windows', 'Teacher', '1.0.0'),
    },
    {
      id: 2,
      deploymentName: 'Student Quest Demo',
      version: '1.0.1',
      platform: 'Quest 2/3',
      accessType: 'Student',
      estimatedInstances: 15,
      downloadUrl: this.generateDownloadUrl('Quest 2/3', 'Student', '1.0.1'),
    },
  ];

  readonly downloadItems = signal<DownloadItemModel[]>(this.loadItems());

  addItem(item: Omit<DownloadItemModel, 'id' | 'downloadUrl'>): void {
    const newItem: DownloadItemModel = {
      ...item,
      id: Date.now(),
      downloadUrl: this.generateDownloadUrl(
        item.platform,
        item.accessType,
        item.version
      ),
    };

    this.downloadItems.update((items) => {
      const updatedItems = [...items, newItem];
      this.saveItems(updatedItems);
      return updatedItems;
    });
  }

  updateItem(updatedItem: DownloadItemModel): void {
    const itemWithGeneratedUrl: DownloadItemModel = {
      ...updatedItem,
      downloadUrl: this.generateDownloadUrl(
        updatedItem.platform,
        updatedItem.accessType,
        updatedItem.version
      ),
    };

    this.downloadItems.update((items) => {
      const updatedItems = items.map((item) =>
        item.id === itemWithGeneratedUrl.id ? itemWithGeneratedUrl : item
      );

      this.saveItems(updatedItems);
      return updatedItems;
    });
  }

  deleteItem(id: number): void {
    this.downloadItems.update((items) => {
      const updatedItems = items.filter((item) => item.id !== id);
      this.saveItems(updatedItems);
      return updatedItems;
    });
  }

  private loadItems(): DownloadItemModel[] {
    const savedItems = localStorage.getItem(this.storageKey);

    if (!savedItems) {
      this.saveItems(this.initialItems);
      return this.initialItems;
    }

    try {
      return JSON.parse(savedItems) as DownloadItemModel[];
    } catch {
      this.saveItems(this.initialItems);
      return this.initialItems;
    }
  }

  private saveItems(items: DownloadItemModel[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(items));
  }

  private generateDownloadUrl(
    platform: DownloadItemPlatform,
    accessType: DownloadItemAccessType,
    version: DownloadItemVersion
  ): string {
    const normalizedPlatform = platform
      .toLowerCase()
      .replaceAll(' ', '-')
      .replaceAll('/', '-');

    const normalizedAccessType = accessType.toLowerCase();

    return `/downloads/ohms-gate-${normalizedPlatform}-${normalizedAccessType}-${version}.zip`;
  }
}