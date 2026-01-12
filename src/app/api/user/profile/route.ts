import { NextResponse } from 'next/server';
import { teamMemberService } from '@/server/services/team-member.service';
import { auth } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers
    });

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Try to find team member data
    const teamMember = await teamMemberService.findByEmail(session.user.email);
    const teamMemberJson = teamMember ? teamMember.toJSON() : null;

    // Return combined user and team member data
    const profileData = {
      // Basic user data from session
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      image: session.user.image,
      role: session.user.role,

      // Team member data (if exists)
      phoneNumber: teamMemberJson?.phoneNumber || '',
      speciality: teamMemberJson?.speciality || '',
      position: teamMemberJson?.position || '',
      teamMemberId: teamMember?._id?.toString() || null
    };

    return NextResponse.json(profileData);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user profile' },
      { status: 500 }
    );
  }
}
