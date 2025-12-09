import mongoose, { Model, Schema, Document } from 'mongoose';

export interface IOpportunityResult extends Document {
  title: string;
  organization: string;
  description?: string;
  amount?: string;
  deadline?: string;
  url: string;
  energy_sector?: string;
  eligibility?: string;
  relevance_score?: number;
  query?: string;
  maxIterations?: number;
  createdAt: Date;
  updatedAt: Date;
}

const OpportunityResultSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    organization: { type: String, default: '' },
    description: { type: String },
    amount: { type: String },
    deadline: { type: String },
    url: { type: String, required: true, unique: true, index: true },
    energy_sector: { type: String },
    eligibility: { type: String },
    relevance_score: { type: Number, default: 0 },
    query: { type: String },
    maxIterations: { type: Number }
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

const OpportunityResult: Model<IOpportunityResult> =
  mongoose.models.OpportunityResult ||
  mongoose.model<IOpportunityResult>(
    'OpportunityResult',
    OpportunityResultSchema
  );

export default OpportunityResult;
