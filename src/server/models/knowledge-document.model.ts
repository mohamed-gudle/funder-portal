import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IKnowledgeDocument extends Document {
  title: string;
  docType: string;
  sectors: string[];
  specialties: string[];
  engagementStages: string[];
  applicationTypes: string[];
  organizations: string[];
  region?: string;
  year?: number;
  tags: string[];
  sensitivity?: string;
  sourceUrl?: string;
  s3Key: string;
  s3Url: string;
  mimeType?: string;
  size?: number;
  createdAt: Date;
  updatedAt: Date;
}

const KnowledgeDocumentSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    docType: { type: String, required: true, default: 'general' },
    sectors: [{ type: String }],
    specialties: [{ type: String }],
    engagementStages: [{ type: String }],
    applicationTypes: [{ type: String }],
    organizations: [{ type: String }],
    region: { type: String },
    year: { type: Number },
    tags: [{ type: String }],
    sensitivity: { type: String, default: 'internal' },
    sourceUrl: { type: String },
    s3Key: { type: String, required: true },
    s3Url: { type: String, required: true },
    mimeType: { type: String },
    size: { type: Number }
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

const KnowledgeDocument: Model<IKnowledgeDocument> =
  mongoose.models.KnowledgeDocument ||
  mongoose.model<IKnowledgeDocument>(
    'KnowledgeDocument',
    KnowledgeDocumentSchema
  );

export default KnowledgeDocument;
