import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITeamMember extends Document {
  name: string;
  email: string;
  phoneNumber: string;
  speciality: string;
  position: string;
  invitationToken?: string;
  invitationSentAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const TeamMemberSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    speciality: { type: String, required: true },
    position: { type: String, required: true },
    invitationToken: { type: String },
    invitationSentAt: { type: Date }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret: any) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      }
    }
  }
);

const TeamMember: Model<ITeamMember> =
  mongoose.models.TeamMember ||
  mongoose.model<ITeamMember>('TeamMember', TeamMemberSchema);

export default TeamMember;
