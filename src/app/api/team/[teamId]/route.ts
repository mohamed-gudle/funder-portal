import { NextResponse } from 'next/server';
import { teamMemberService } from '@/server/services/team-member.service';
import { auth } from '@/lib/auth';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ teamId: string }> }
) {
  try {
    const { teamId } = await params;
    const teamMember = await teamMemberService.findById(teamId);
    if (!teamMember) {
      return NextResponse.json(
        { error: 'Team member not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(teamMember);
  } catch (error) {
    console.error('Error fetching team member:', error);
    return NextResponse.json(
      { error: 'Failed to fetch team member' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ teamId: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers
    });

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { teamId } = await params;
    const body = await request.json();

    // Check if user can update this team member
    if (session.user.role !== 'admin') {
      const teamMember = await teamMemberService.findById(teamId);
      if (!teamMember) {
        return NextResponse.json(
          { error: 'Team member not found' },
          { status: 404 }
        );
      }

      if (teamMember.email !== session.user.email) {
        return NextResponse.json(
          { error: 'You can only update your own profile' },
          { status: 403 }
        );
      }
    }

    const teamMember = await teamMemberService.update(teamId, body);
    if (!teamMember) {
      return NextResponse.json(
        { error: 'Team member not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(teamMember);
  } catch (error) {
    console.error('Error updating team member:', error);
    return NextResponse.json(
      { error: 'Failed to update team member' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ teamId: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers
    });

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { teamId } = await params;

    // Check if user can delete this team member
    if (session.user.role !== 'admin') {
      const teamMember = await teamMemberService.findById(teamId);
      if (!teamMember) {
        return NextResponse.json(
          { error: 'Team member not found' },
          { status: 404 }
        );
      }

      if (teamMember.email !== session.user.email) {
        return NextResponse.json(
          { error: 'You can only delete your own profile' },
          { status: 403 }
        );
      }
    }

    const teamMember = await teamMemberService.delete(teamId);
    if (!teamMember) {
      return NextResponse.json(
        { error: 'Team member not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({ message: 'Team member deleted successfully' });
  } catch (error) {
    console.error('Error deleting team member:', error);
    return NextResponse.json(
      { error: 'Failed to delete team member' },
      { status: 500 }
    );
  }
}
