import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IContact extends Document {
  engagement: Types.ObjectId;
  name: string;
  role?: string;
  email?: string;
  phone?: string;
  isPrimaryPointOfContact: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ContactSchema = new Schema<IContact>(
  {
    engagement: {
      type: Schema.Types.ObjectId,
      ref: 'BilateralEngagement',
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    role: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      lowercase: true,
      trim: true
    },
    phone: {
      type: String,
      trim: true
    },
    isPrimaryPointOfContact: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

const Contact: Model<IContact> =
  mongoose.models.Contact || mongoose.model<IContact>('Contact', ContactSchema);

export default Contact;
