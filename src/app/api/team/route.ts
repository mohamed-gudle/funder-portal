import { NextResponse } from 'next/server';
import { teamMemberService } from '@/server/services/team-member.service';
import { auth } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || undefined;

    const teamMembers = await teamMemberService.findAll({ search });

    const genericPhoto = 'https://api.dicebear.com/7.x/avataaars/svg?seed=';

    const enrichedMembers = teamMembers.map((member: any) => ({
      ...JSON.parse(JSON.stringify(member)),
      profilePhoto: `${genericPhoto}${member.email}`
    }));

    return NextResponse.json(enrichedMembers);
  } catch (error) {
    console.error('Error fetching team members:', error);
    return NextResponse.json(
      { error: 'Failed to fetch team members' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers
    });

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Users can only create their own profile, admins can create for others
    if (session.user.role !== 'admin' && body.email !== session.user.email) {
      return NextResponse.json(
        { error: 'You can only create your own profile' },
        { status: 403 }
      );
    }

    const teamMember = await teamMemberService.create(body);
    return NextResponse.json(teamMember, { status: 201 });
  } catch (error) {
    console.error('Error creating team member:', error);
    return NextResponse.json(
      { error: 'Failed to create team member' },
      { status: 500 }
    );
  }
}
