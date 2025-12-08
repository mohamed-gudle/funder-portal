import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export type ActivityType =
  | 'Call Log'
  | 'Email'
  | 'Meeting Note'
  | 'Internal Comment'
  | 'Status Change';

export interface IActivity extends Document {
  author: Types.ObjectId;
  type: ActivityType;
  content: string;
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  parent: Types.ObjectId;
  parentModel: 'OpenCall' | 'CompetitiveCall' | 'BilateralEngagement';
  createdAt: Date;
  updatedAt: Date;
}

const ActivitySchema = new Schema<IActivity>(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    type: {
      type: String,
      enum: [
        'Call Log',
        'Email',
        'Meeting Note',
        'Internal Comment',
        'Status Change'
      ],
      required: true
    },
    content: {
      type: String,
      required: true,
      trim: true
    },
    sentiment: {
      type: String,
      enum: ['Positive', 'Neutral', 'Negative'],
      default: 'Neutral'
    },
    parent: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: 'parentModel'
    },
    parentModel: {
      type: String,
      required: true,
      enum: ['OpenCall', 'CompetitiveCall', 'BilateralEngagement']
    }
  },
  { timestamps: true }
);

ActivitySchema.index({ parent: 1, createdAt: -1 });

const Activity: Model<IActivity> =
  mongoose.models.Activity ||
  mongoose.model<IActivity>('Activity', ActivitySchema);

export default Activity;
