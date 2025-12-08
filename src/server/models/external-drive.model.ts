import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IExternalDrive extends Document {
  provider: 'google-drive';
  displayName: string;
  folderId: string;
  folderName?: string;
  status: 'connected' | 'error';
  lastSyncAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ExternalDriveSchema: Schema = new Schema(
  {
    provider: { type: String, required: true, default: 'google-drive' },
    displayName: { type: String, required: true },
    folderId: { type: String, required: true },
    folderName: { type: String },
    status: { type: String, required: true, default: 'connected' },
    lastSyncAt: { type: Date }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (_doc, ret: any) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      }
    }
  }
);

const ExternalDrive: Model<IExternalDrive> =
  mongoose.models.ExternalDrive ||
  mongoose.model<IExternalDrive>('ExternalDrive', ExternalDriveSchema);

export default ExternalDrive;
