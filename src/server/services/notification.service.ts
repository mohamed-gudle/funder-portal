import { emailClient } from '@/lib/email/emailClient';
import TeamMember from '@/server/models/team-member.model';
import { IOpenCall } from '@/server/models/open-call.model';
import { Types } from 'mongoose';

export class NotificationService {
  /**
   * Resolves a list of user identifiers (IDs, emails, or names) to unique email addresses.
   */
  private async resolveEmails(
    identifiers: (string | Types.ObjectId | undefined)[]
  ): Promise<string[]> {
    const validIdentifiers = identifiers
      .filter(Boolean)
      .map((id) => (typeof id === 'string' ? id : id?.toString())) as string[];

    if (validIdentifiers.length === 0) return [];

    const objectIds = validIdentifiers.filter((id) =>
      Types.ObjectId.isValid(id)
    );
    const otherIds = validIdentifiers.filter(
      (id) => !Types.ObjectId.isValid(id)
    );

    const conditions: any[] = [];
    if (objectIds.length) {
      conditions.push({ _id: { $in: objectIds } });
    }
    if (otherIds.length) {
      conditions.push({ email: { $in: otherIds } });
      conditions.push({ name: { $in: otherIds } });
    }

    if (!conditions.length) return [];

    const members = await TeamMember.find({ $or: conditions }).select('email');
    const emails = new Set(members.map((m) => m.email).filter(Boolean));

    return Array.from(emails);
  }

  /**
   * Notify the owners of the NEW stage that the call has moved.
   */
  async notifyStageChange(
    openCall: IOpenCall,
    previousStatus: string,
    newStatus: string
  ): Promise<void> {
    const stagePerm = openCall.stagePermissions?.find(
      (p) => p.stage === newStatus
    );
    const assignees = stagePerm?.assignees || [];

    if (assignees.length === 0) return;

    const emails = await this.resolveEmails(assignees);

    if (emails.length === 0) return;

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const link = `${appUrl}/dashboard/open-calls/${(openCall as any).id || (openCall as any)._id}`;
    const deadlineText = openCall.deadline
      ? new Date(openCall.deadline).toLocaleDateString()
      : 'N/A';

    try {
      await emailClient.send({
        to: emails,
        subject: `[Action Required] Open Call moved to ${newStatus}: ${openCall.title}`,
        html: `
          <div style="font-family: sans-serif; color: #333;">
            <h2>Stage Update</h2>
            <p>The Open Call <strong>${openCall.title}</strong> has been moved from <em>${previousStatus}</em> to <strong>${newStatus}</strong>.</p>
            <p>You are listed as an owner for this stage.</p>
            <p><strong>Deadline:</strong> ${deadlineText}</p>
            <p style="margin-top: 20px;">
              <a href="${link}" style="background-color: #000; color: #fff; padding: 10px 15px; text-decoration: none; border-radius: 5px;">View Open Call</a>
            </p>
          </div>
        `
      });
      console.log(
        `[NotificationService] Stage change email sent to ${emails.join(', ')}`
      );
    } catch (error) {
      console.error(
        '[NotificationService] Failed to send stage change email:',
        error
      );
    }
  }

  /**
   * Notify ALL stage owners and the current internal owner of a new activity.
   */
  async notifyNewActivity(
    activity: any,
    entity: IOpenCall | any, // any to support IBilateralEngagement without strict type issues for now, or import it
    modelType: 'OpenCall' | 'BilateralEngagement'
  ): Promise<void> {
    const identifiers = new Set<string | Types.ObjectId>();

    // 1. Internal Owner
    if (entity.internalOwner) {
      identifiers.add(entity.internalOwner);
    }

    // 2. All Stage Owners
    if (entity.stagePermissions) {
      entity.stagePermissions.forEach((perm: any) => {
        if (perm.assignees) {
          perm.assignees.forEach((assignee: any) => identifiers.add(assignee));
        }
      });
    }

    // Remove the author of the activity from the notification list to avoid self-email
    const authorId = activity.author?.id || activity.author;

    // Resolve emails first to filter
    const recipientEmails = await this.resolveEmails(Array.from(identifiers));

    let authorEmail = '';
    if (authorId) {
      const authorMembers = await this.resolveEmails([authorId]);
      if (authorMembers.length) authorEmail = authorMembers[0];
    }

    const finalEmails = recipientEmails.filter((e) => e !== authorEmail);

    if (finalEmails.length === 0) return;

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    let entityTitle = '';
    let linkPath = '';

    if (modelType === 'OpenCall') {
      entityTitle = (entity as IOpenCall).title;
      linkPath = `dashboard/open-calls/${(entity as any).id || (entity as any)._id}`;
    } else {
      entityTitle = entity.organizationName || 'Bilateral Engagement';
      linkPath = `dashboard/bilateral-engagements/${(entity as any).id || (entity as any)._id}`;
    }

    const link = `${appUrl}/${linkPath}?tab=activities`;

    try {
      await emailClient.send({
        to: finalEmails,
        subject: `New Activity on ${modelType === 'OpenCall' ? 'Open Call' : 'Engagement'}: ${entityTitle}`,
        html: `
          <div style="font-family: sans-serif; color: #333;">
            <h2>New Activity</h2>
            <p>A new <strong>${activity.type}</strong> was posted on <strong>${entityTitle}</strong>.</p>
            <div style="background-color: #f5f5f5; padding: 15px; border-left: 4px solid #ddd; margin: 15px 0;">
              ${activity.content}
            </div>
            <p style="margin-top: 20px;">
              <a href="${link}" style="background-color: #000; color: #fff; padding: 10px 15px; text-decoration: none; border-radius: 5px;">View Activity</a>
            </p>
          </div>
        `
      });
      console.log(
        `[NotificationService] Activity notification sent to ${finalEmails.join(', ')}`
      );
    } catch (error) {
      console.error(
        '[NotificationService] Failed to send activity email:',
        error
      );
    }
  }

  /**
   * Notify assignees when they are specifically assigned to a stage (Assignment diffs)
   */
  async notifyAssignment(
    openCall: IOpenCall,
    stage: string,
    assignees: string[]
  ): Promise<void> {
    const emails = await this.resolveEmails(assignees);
    if (!emails.length) return;

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const link = `${appUrl}/dashboard/open-calls/${(openCall as any).id || (openCall as any)._id}`;

    try {
      await emailClient.send({
        to: emails,
        subject: `You have been assigned to ${stage} for "${openCall.title}"`,
        html: `
         <div style="font-family: sans-serif; color: #333;">
            <h2>Assignment Update</h2>
            <p>You have been assigned to the <strong>${stage}</strong> stage for <strong>${openCall.title}</strong>.</p>
            <p>Current overall status: ${openCall.status}</p>
            <p style="margin-top: 20px;">
              <a href="${link}" style="background-color: #000; color: #fff; padding: 10px 15px; text-decoration: none; border-radius: 5px;">View Details</a>
            </p>
          </div>`
      });
    } catch (error) {
      console.error(
        '[NotificationService] Failed to send assignment notification',
        error
      );
    }
  }
}

export const notificationService = new NotificationService();
