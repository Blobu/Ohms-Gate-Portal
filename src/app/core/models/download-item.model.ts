export interface DownloadItemModel {
  id: number;
  deploymentName: string;
  version: string;
  platform: string;
  accessType: string;
  estimatedInstances: number;
  downloadUrl: string;
}