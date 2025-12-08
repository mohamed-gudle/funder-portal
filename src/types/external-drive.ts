export interface ExternalDrive {
  id: string;
  provider: 'google-drive';
  displayName: string;
  folderId: string;
  folderName?: string;
  status: 'connected' | 'error';
  lastSyncAt?: string;
  createdAt: string;
  updatedAt: string;
}
