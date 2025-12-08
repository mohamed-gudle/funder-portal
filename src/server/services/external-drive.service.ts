import connectDB from '@/lib/db';
import ExternalDrive, { IExternalDrive } from '../models/external-drive.model';

export interface ExternalDrivePayload {
  provider: 'google-drive';
  displayName: string;
  folderId: string;
  folderName?: string;
}

class ExternalDriveService {
  async create(payload: ExternalDrivePayload) {
    await connectDB();
    return ExternalDrive.create({
      ...payload,
      status: 'connected'
    });
  }

  async findAll() {
    await connectDB();
    return ExternalDrive.find().sort({ createdAt: -1 });
  }
}

export const externalDriveService = new ExternalDriveService();
