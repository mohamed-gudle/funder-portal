import mongoose, { Schema, Document, Model, Types } from 'mongoose';

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

export const ENGAGEMENT_STAGES = [
  'Cold Email',
  'First Engagement',
  'Proposal Stage',
  'Contracting',
  'Partner',
  'Funder',
  'No Relationship'
] as const;

export type EngagementStage = (typeof ENGAGEMENT_STAGES)[number];

export interface IStagePermission {
  stage: EngagementStage;
  assignees: Types.ObjectId[];
}

export interface IBilateralEngagement extends Document {
  organizationName: string;
  contactPerson?: string;
  contactRole?: string;
  email?: string;
  internalOwner: string;
  status: EngagementStage;
  likelihoodToFund: number;
  estimatedValue: number;
  currency: 'USD' | 'KES' | 'EUR' | 'GBP';
  tags?: string[];
  stagePermissions: IStagePermission[];
  notes: INote[];
  documents: IDocument[];
  createdAt: Date;
  updatedAt: Date;
  temperatureLabel?: 'Hot' | 'Warm' | 'Cold';
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

const StagePermissionSchema = new Schema<IStagePermission>(
  {
    stage: { type: String, required: true, enum: ENGAGEMENT_STAGES },
    assignees: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    ]
  },
  { _id: false }
);

const BilateralEngagementSchema: Schema = new Schema(
  {
    organizationName: { type: String, required: true, trim: true, index: true },
    contactPerson: { type: String, trim: true },
    contactRole: { type: String, trim: true },
    email: { type: String, lowercase: true, trim: true },
    internalOwner: { type: String, required: true },
    status: {
      type: String,
      enum: ENGAGEMENT_STAGES,
      default: 'Cold Email'
    },
    likelihoodToFund: { type: Number, min: 0, max: 100, default: 10 },
    estimatedValue: { type: Number, default: 0 },
    currency: {
      type: String,
      enum: ['USD', 'KES', 'EUR', 'GBP'],
      default: 'USD'
    },
    tags: { type: [String], default: [] },
    stagePermissions: { type: [StagePermissionSchema], default: [] },
    notes: { type: [NoteSchema], default: [] },
    documents: { type: [DocumentSchema], default: [] }
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
    },
    toObject: { virtuals: true }
  }
);

BilateralEngagementSchema.virtual('temperatureLabel').get(function (
  this: IBilateralEngagement
) {
  if (this.likelihoodToFund >= 70) return 'Hot';
  if (this.likelihoodToFund >= 30) return 'Warm';
  return 'Cold';
});

const BilateralEngagement: Model<IBilateralEngagement> =
  mongoose.models.BilateralEngagement ||
  mongoose.model<IBilateralEngagement>(
    'BilateralEngagement',
    BilateralEngagementSchema
  );

export default BilateralEngagement;
