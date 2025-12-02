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

export interface IOpenCall extends Document {
  title: string;
  funder: string;
  sector: string;
  grantType: string;
  budget: string;
  deadline: Date;
  url?: string;
  description: string;
  priorityProject?: string;
  thematicAlignment?: string;
  internalOwner: string;
  status:
    | 'Intake'
    | 'Reviewing'
    | 'Go/No-Go'
    | 'Application preparation'
    | 'Application submitted'
    | 'Outcome';
  notes: INote[];
  documents: IDocument[];
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

const OpenCallSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    funder: { type: String, required: true },
    sector: { type: String, required: true },
    grantType: { type: String, required: true },
    budget: { type: String, required: true },
    deadline: { type: Date, required: true },
    url: { type: String },
    description: { type: String, required: true },
    priorityProject: { type: String },
    thematicAlignment: { type: String },
    internalOwner: { type: String, required: true },
    status: {
      type: String,
      enum: [
        'Intake',
        'Reviewing',
        'Go/No-Go',
        'Application preparation',
        'Application submitted',
        'Outcome'
      ],
      required: true
    },
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

const OpenCall: Model<IOpenCall> =
  mongoose.models.OpenCall ||
  mongoose.model<IOpenCall>('OpenCall', OpenCallSchema);

export default OpenCall;
