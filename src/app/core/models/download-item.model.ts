export type DownloadItemVersion = '1.0.0' | '1.0.1' | '1.1.0';

export type DownloadItemPlatform =
  | 'Windows'
  | 'Quest 2/3'
  | 'PS VR'
  | 'Vive Pro2';

export type DownloadItemAccessType = 'Student' | 'Teacher';

export interface DownloadItemModel {
  id: number;
  deploymentName: string;
  version: DownloadItemVersion;
  platform: DownloadItemPlatform;
  accessType: DownloadItemAccessType;
  estimatedInstances: number;
  downloadUrl: string;
}