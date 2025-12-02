import mongoose, { Schema, Document, Model } from 'mongoose';

export interface INote {
  id: string;
  content: string;
  author: string;
  createdAt: Date;
}

export interface IDocument {
  id: string;
  name: string;
  url: string;
  uploadedAt: Date;
}

export interface IBilateralEngagement extends Document {
  funder: string;
  sector: string;
  engagementType: string;
  priorityProject?: string;
  internalOwner: string;
  stage:
    | 'Identification'
    | 'Engagement ongoing'
    | 'Proposal under development'
    | 'Decision pending'
    | 'Paused'
    | 'Closed';
  notes: INote[];
  documents: IDocument[];
  latestEmail?: string;
  nextFollowUpDate?: Date;
  confidenceLevel?: 'Low' | 'Medium' | 'High';
  importanceScore?: number;
  createdAt: Date;
  updatedAt: Date;
}

const NoteSchema = new Schema({
  id: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const DocumentSchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  url: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now }
});

const BilateralEngagementSchema: Schema = new Schema(
  {
    funder: { type: String, required: true },
    sector: { type: String, required: true },
    engagementType: { type: String, required: true },
    priorityProject: { type: String },
    internalOwner: { type: String, required: true },
    stage: {
      type: String,
      enum: [
        'Identification',
        'Engagement ongoing',
        'Proposal under development',
        'Decision pending',
        'Paused',
        'Closed'
      ],
      required: true
    },
    notes: { type: [NoteSchema], default: [] },
    documents: { type: [DocumentSchema], default: [] },
    latestEmail: { type: String },
    nextFollowUpDate: { type: Date },
    confidenceLevel: {
      type: String,
      enum: ['Low', 'Medium', 'High']
    },
    importanceScore: {
      type: Number,
      min: 1,
      max: 10
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret: any) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
      }
    }
  }
);

const BilateralEngagement: Model<IBilateralEngagement> =
  mongoose.models.BilateralEngagement ||
  mongoose.model<IBilateralEngagement>(
    'BilateralEngagement',
    BilateralEngagementSchema
  );

export default BilateralEngagement;
