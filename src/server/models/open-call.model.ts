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

export const CALL_STAGES = [
  'In Review',
  'Go/No-Go',
  'Proposal Writing',
  'Internal Review',
  'Submission Stage',
  'Submitted',
  'Accepted',
  'Rejected'
] as const;

export type CallStage = (typeof CALL_STAGES)[number];
export type CallLifecycle = 'Open' | 'Closed';
export type CallPriority = 'High' | 'Medium' | 'Low';
export type FundingType = 'Core Funding' | 'Programmatic Funding';

export interface IStagePermission {
  stage: CallStage;
  assignees: Array<Types.ObjectId | string>;
}

export interface IOpenCall extends Document {
  title: string;
  funder?: string;
  sector: string[];
  grantType?: string;
  budget?: string;
  deadline: Date;
  url?: string;
  description: string;
  priorityProject?: string;
  thematicAlignment?: string;
  internalOwner: string;
  callStatus: CallLifecycle;
  priority: CallPriority;
  fundingType: FundingType;
  relatedProgram?: Types.ObjectId;
  stagePermissions: IStagePermission[];
  status: CallStage;
  notes: INote[];
  documents: IDocument[];
  createdAt: Date;
  updatedAt: Date;
  canUserEdit?: (userId: Types.ObjectId, currentStage: CallStage) => boolean;
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
    stage: {
      type: String,
      required: true,
      enum: CALL_STAGES
    },
    assignees: [
      {
        type: Schema.Types.Mixed,
        ref: 'User'
      }
    ]
  },
  { _id: false }
);

const OpenCallSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    funder: { type: String },
    sector: {
      type: [String],
      default: [],
      set: (value: unknown) => {
        if (Array.isArray(value)) {
          return value.filter(Boolean);
        }
        return value ? [value as string] : [];
      }
    },
    grantType: { type: String },
    budget: { type: String },
    deadline: { type: Date, required: true },
    url: { type: String },
    description: { type: String, required: true },
    priorityProject: { type: String },
    thematicAlignment: { type: String },
    internalOwner: { type: String, required: true },
    callStatus: {
      type: String,
      enum: ['Open', 'Closed'],
      default: 'Open'
    },
    priority: {
      type: String,
      enum: ['High', 'Medium', 'Low'],
      default: 'Medium'
    },
    fundingType: {
      type: String,
      enum: ['Core Funding', 'Programmatic Funding'],
      required: true
    },
    relatedProgram: {
      type: Schema.Types.ObjectId,
      ref: 'Program',
      required: function () {
        return (this as any).fundingType === 'Programmatic Funding';
      }
    },
    status: {
      type: String,
      enum: CALL_STAGES,
      default: 'In Review'
    },
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
    }
  }
);

OpenCallSchema.methods.canUserEdit = function (
  this: IOpenCall,
  userId: Types.ObjectId,
  currentStage: CallStage
) {
  const permission = this.stagePermissions?.find(
    (p) => p.stage === currentStage
  );

  if (!permission || permission.assignees.length === 0) {
    return true;
  }

  return permission.assignees.some((id) => {
    if (typeof id === 'string') {
      return id === userId.toString();
    }
    return id.equals(userId);
  });
};

const OpenCall: Model<IOpenCall> =
  mongoose.models.OpenCall ||
  mongoose.model<IOpenCall>('OpenCall', OpenCallSchema);

export default OpenCall;
