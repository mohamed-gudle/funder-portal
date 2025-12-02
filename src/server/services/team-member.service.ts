import connectDB from '@/lib/db';
import TeamMember, { ITeamMember } from '../models/team-member.model';
import { clerkClient } from '@clerk/nextjs/server';
import { emailClient } from '@/lib/email/emailClient';
import * as teamInvitationEmail from '@/lib/email/templates/teamInvitationEmail';

export class TeamMemberService {
  async create(data: Partial<ITeamMember>) {
    await connectDB();

    // 1. Create in MongoDB
    const teamMember = await TeamMember.create(data);

    // 2. Invite via Clerk (if email is present)
    if (data.email) {
      try {
        const client = await clerkClient();
        const invitation = await client.invitations.createInvitation({
          emailAddress: data.email,
          publicMetadata: {
            teamMemberId: teamMember._id.toString(),
            role: data.position
          }
        });

        // 3. Send custom email notification
        try {
          const invitationUrl =
            invitation.url || `${process.env.NEXT_PUBLIC_APP_URL}/sign-up`;

          await emailClient.send({
            to: data.email,
            subject: teamInvitationEmail.subject({
              name: data.name || '',
              position: data.position || '',
              invitationLink: invitationUrl,
              organizationName: process.env.NEXT_PUBLIC_ORG_NAME
            }),
            html: teamInvitationEmail.html({
              name: data.name || '',
              position: data.position || '',
              invitationLink: invitationUrl,
              organizationName: process.env.NEXT_PUBLIC_ORG_NAME
            })
          });
        } catch (emailError) {
          console.error('Failed to send email notification:', emailError);
          // Don't fail the whole operation if email fails
        }
      } catch (error) {
        console.error('Failed to send Clerk invitation:', error);
        // We don't rollback the DB creation, just log the error.
        // In a production app, we might want to handle this more gracefully.
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
    return TeamMember.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string) {
    await connectDB();
    return TeamMember.findByIdAndDelete(id);
  }
}

export const teamMemberService = new TeamMemberService();
