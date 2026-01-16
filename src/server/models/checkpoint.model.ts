import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICheckpoint extends Document {
  thread_id: string;
  checkpoint_id: string;
  parent_checkpoint_id?: string;
  checkpoint: any; // Serialized checkpoint object
  metadata: any; // Serialized metadata
  createdAt: Date;
}

const CheckpointSchema = new Schema<ICheckpoint>(
  {
    thread_id: { type: String, required: true, index: true },
    checkpoint_id: { type: String, required: true, index: true },
    parent_checkpoint_id: { type: String, required: false },
    checkpoint: { type: Schema.Types.Mixed, required: true }, // Store as Mixed (JSON)
    metadata: { type: Schema.Types.Mixed, required: true }
  },
  { timestamps: true }
);

// Compound index for efficient retrieval
CheckpointSchema.index({ thread_id: 1, checkpoint_id: 1 }, { unique: true });

const CheckpointModel: Model<ICheckpoint> =
  mongoose.models.LangGraphCheckpoint ||
  mongoose.model<ICheckpoint>('LangGraphCheckpoint', CheckpointSchema);

export default CheckpointModel;
