import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IThread extends Document {
  thread_id: string; // The UUID
  metadata: Record<string, any>; // Flexible metadata (userId, openCallId, title, etc)
  createdAt: Date;
  updatedAt: Date;
}

const ThreadSchema = new Schema<IThread>(
  {
    thread_id: { type: String, required: true, unique: true, index: true },
    metadata: { type: Schema.Types.Mixed, default: {} }
  },
  { timestamps: true }
);

// Index specific metadata fields we commonly query
ThreadSchema.index({ 'metadata.userId': 1 });
ThreadSchema.index({ 'metadata.openCallId': 1 });

const ThreadModel: Model<IThread> =
  mongoose.models.LangGraphThread ||
  mongoose.model<IThread>('LangGraphThread', ThreadSchema);

export default ThreadModel;
