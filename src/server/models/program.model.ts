import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProgram extends Document {
  name: string;
  description?: string;
  sectors: string[];
  budget?: number;
  startDate?: Date;
  endDate?: Date;
  status: 'Active' | 'Completed' | 'Planned';
  createdAt: Date;
  updatedAt: Date;
}

const ProgramSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    sectors: { type: [String], default: [] },
    budget: { type: Number },
    startDate: { type: Date },
    endDate: { type: Date },
    status: {
      type: String,
      enum: ['Active', 'Completed', 'Planned'],
      default: 'Active'
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

const Program: Model<IProgram> =
  mongoose.models.Program || mongoose.model<IProgram>('Program', ProgramSchema);

export default Program;
