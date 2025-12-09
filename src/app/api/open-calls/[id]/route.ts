import { NextResponse } from 'next/server';
import { openCallService } from '@/server/services/open-call.service';
import { CALL_STAGES } from '@/server/models/open-call.model';
import { emailClient } from '@/lib/email/emailClient';
import TeamMember from '@/server/models/team-member.model';
import { Types } from 'mongoose';
import { auth } from '@/lib/auth';
import Activity from '@/server/models/activity.model';
import connectDB from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const openCall = await openCallService.findById(id);

    if (!openCall) {
      return NextResponse.json(
        { error: 'Open call not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(openCall);
  } catch (error) {
    console.error('Error fetching open call:', error);
    return NextResponse.json(
      { error: 'Failed to fetch open call' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    await connectDB();
    const existing = await openCallService.findById(id);

    if (!existing) {
      return NextResponse.json(
        { error: 'Open call not found' },
        { status: 404 }
      );
    }

    const previousStatus = existing.status;
    const previousPermissions = existing.stagePermissions || [];

    const openCall = await openCallService.update(id, body);

    if (!openCall) {
      return NextResponse.json(
        { error: 'Open call not found' },
        { status: 404 }
      );
    }

    // Notify on stage assignment changes
    const assignmentDiffs = getAssignmentDiff(
      previousPermissions,
      openCall.stagePermissions || []
    );

    if (assignmentDiffs.length > 0) {
      await sendAssignmentNotifications(openCall, assignmentDiffs);
    }

    // Stage change notification + activity (skip backward moves)
    if (
      typeof body.status === 'string' &&
      body.status !== previousStatus &&
      !isMovingBackward(previousStatus, body.status)
    ) {
      await sendStageChangeEmails(openCall, previousStatus, body.status);
      await logStageChangeActivity(
        id,
        previousStatus,
        body.status,
        request.headers
      );
    }

    return NextResponse.json(openCall);
  } catch (error) {
    console.error('Error updating open call:', error);
    return NextResponse.json(
      { error: 'Failed to update open call' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return PUT(request, { params });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const openCall = await openCallService.delete(id);

    if (!openCall) {
      return NextResponse.json(
        { error: 'Open call not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting open call:', error);
    return NextResponse.json(
      { error: 'Failed to delete open call' },
      { status: 500 }
    );
  }
}

function isMovingBackward(previousStatus: string, nextStatus: string) {
  const prevIndex = CALL_STAGES.indexOf(previousStatus as any);
  const nextIndex = CALL_STAGES.indexOf(nextStatus as any);

  if (prevIndex === -1 || nextIndex === -1) return false;
  return nextIndex < prevIndex;
}

function getAssignmentDiff(
  previous: Array<{ stage?: string; assignees?: any[] }>,
  next: Array<{ stage?: string; assignees?: any[] }>
) {
  const diffs: Array<{ stage: string; assignees: string[] }> = [];

  CALL_STAGES.forEach((stage) => {
    const prevStage = previous.find((p) => (p.stage || '') === stage);
    const nextStage = next.find((p) => (p.stage || '') === stage);

    const prevAssignees = new Set(
      (prevStage?.assignees || []).map((id: any) => id?.toString?.() ?? id)
    );

    const added = (nextStage?.assignees || [])
      .map((id: any) => id?.toString?.() ?? id)
      .filter((id: string | undefined) => id && !prevAssignees.has(id));

    if (added.length) {
      diffs.push({ stage, assignees: added as string[] });
    }
  });

  return diffs;
}

async function resolveTeamMemberEmails(
  identifiers: (string | Types.ObjectId)[]
) {
  const normalized = identifiers
    .map((id) => (typeof id === 'string' ? id : id?.toString()))
    .filter(Boolean) as string[];

  if (normalized.length === 0) return [];

  const objectIds = normalized.filter((id) => Types.ObjectId.isValid(id));
  const otherIds = normalized.filter((id) => !Types.ObjectId.isValid(id));

  const orQueries: any[] = [];

  if (objectIds.length) {
    orQueries.push({ _id: { $in: objectIds } });
  }

  if (otherIds.length) {
    orQueries.push({ name: { $in: otherIds } });
    orQueries.push({ email: { $in: otherIds } });
  }

  if (!orQueries.length) return [];

  const teamMembers = await TeamMember.find({ $or: orQueries });
  const uniqueEmails = new Set(
    teamMembers.map((member) => member.email).filter(Boolean)
  );

  return Array.from(uniqueEmails);
}

async function sendAssignmentNotifications(
  openCall: any,
  diffs: Array<{ stage: string; assignees: string[] }>
) {
  for (const diff of diffs) {
    const emails = await resolveTeamMemberEmails(diff.assignees);
    if (!emails.length) continue;

    try {
      await emailClient.send({
        to: emails,
        subject: `Assigned to ${diff.stage} for "${openCall.title}"`,
        html: `<p>You have been assigned to the <strong>${diff.stage}</strong> stage for <strong>${openCall.title}</strong>.</p>
        <p>Current status: ${openCall.status}</p>
        <p><a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/open-calls/${openCall.id || openCall._id}">View call details</a></p>`
      });
    } catch (error) {
      console.error('Failed to send assignment notification', error);
    }
  }
}

async function sendStageChangeEmails(
  openCall: any,
  previousStatus: string,
  newStatus: string
) {
  const stageAssignees =
    openCall.stagePermissions?.find(
      (permission: any) => permission.stage === newStatus
    )?.assignees || [];

  const recipients = new Set<string>();

  const stageEmails = await resolveTeamMemberEmails(stageAssignees);
  stageEmails.forEach((email) => recipients.add(email));

  const ownerEmails = await resolveTeamMemberEmails([
    openCall.internalOwner
  ] as any);
  ownerEmails.forEach((email) => recipients.add(email));

  if (!recipients.size) return;

  const deadline = openCall.deadline ? new Date(openCall.deadline) : null;
  const deadlineText = deadline ? deadline.toLocaleDateString() : 'N/A';

  try {
    await emailClient.send({
      to: Array.from(recipients),
      subject: `Stage changed to ${newStatus}: ${openCall.title}`,
      html: `<p>The open call <strong>${openCall.title}</strong> moved from <strong>${previousStatus}</strong> to <strong>${newStatus}</strong>.</p>
      <p>Deadline: ${deadlineText}</p>
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/open-calls/${openCall.id || openCall._id}">Review the call</a></p>`
    });
  } catch (error) {
    console.error('Failed to send stage change email', error);
  }
}

async function logStageChangeActivity(
  openCallId: string,
  previousStatus: string,
  newStatus: string,
  headers: Headers
) {
  try {
    const session = await auth.api.getSession({
      headers
    });

    if (!session?.user) return;

    await Activity.create({
      author: session.user.id,
      type: 'Status Change',
      content: `Stage changed from ${previousStatus} to ${newStatus}`,
      parent: openCallId,
      parentModel: 'OpenCall'
    });
  } catch (error) {
    console.error('Failed to log status change activity', error);
  }
}
