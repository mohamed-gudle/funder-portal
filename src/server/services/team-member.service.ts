import connectDB from '@/lib/db';
import mongoose from 'mongoose';
import TeamMember, { ITeamMember } from '../models/team-member.model';
import { emailClient } from '@/lib/email/emailClient';
import * as teamInvitationEmail from '@/lib/email/templates/teamInvitationEmail';
import { randomUUID } from 'crypto';

export class TeamMemberService {
  async create(data: Partial<ITeamMember>) {
    await connectDB();

    // 1. Create in MongoDB
    const inviteToken = data.email ? randomUUID() : undefined;
    const teamMember = await TeamMember.create({
      ...data,
      invitationToken: inviteToken,
      invitationSentAt: inviteToken ? new Date() : undefined
    });

    // 2. Send invitation email that points to our Better Auth sign-up flow
    if (data.email) {
      try {
        const baseUrl =
          process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const invitationUrl = new URL('/auth/sign-up', baseUrl);

        invitationUrl.searchParams.set('email', data.email);
        invitationUrl.searchParams.set(
          'teamMemberId',
          teamMember._id.toString()
        );

        if (inviteToken) {
          invitationUrl.searchParams.set('invite', inviteToken);
        }

        await emailClient.send({
          to: data.email,
          subject: teamInvitationEmail.subject({
            name: data.name || '',
            position: data.position || '',
            invitationLink: invitationUrl.toString(),
            organizationName: process.env.NEXT_PUBLIC_ORG_NAME
          }),
          html: teamInvitationEmail.html({
            name: data.name || '',
            position: data.position || '',
            invitationLink: invitationUrl.toString(),
            organizationName: process.env.NEXT_PUBLIC_ORG_NAME
          })
        });
      } catch (error) {
        console.error('Failed to send Better Auth invitation:', error);
        // We don't rollback the DB creation, just log the error.
      }
    }

    return teamMember;
  }

  async findAll(filter: any = {}) {
    await connectDB();
    const query: any = {};

    if (filter.search) {
      query.$or = [
        { name: { $regex: filter.search, $options: 'i' } },
        { email: { $regex: filter.search, $options: 'i' } },
        { position: { $regex: filter.search, $options: 'i' } },
        { speciality: { $regex: filter.search, $options: 'i' } }
      ];
    }

    return TeamMember.find(query).sort({ createdAt: -1 });
  }

  async findById(id: string) {
    await connectDB();
    return TeamMember.findById(id);
  }

  async findByEmail(email: string) {
    await connectDB();
    return TeamMember.findOne({ email });
  }

  async update(id: string, data: Partial<ITeamMember>) {
    await connectDB();
    const updatedMember = await TeamMember.findByIdAndUpdate(id, data, {
      new: true
    });

    // If role is updated, sync to User collection
    if (data.role && updatedMember) {
      const db = mongoose.connection.db;
      if (db) {
        await db
          .collection('user')
          .updateOne(
            { email: updatedMember.email },
            { $set: { role: data.role } }
          );
      }
    }

    return updatedMember;
  }

  async delete(id: string) {
    await connectDB();
    return TeamMember.findByIdAndDelete(id);
  }
}

export const teamMemberService = new TeamMemberService();
