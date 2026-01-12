import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { teamMemberService } from '@/server/services/team-member.service';

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const email = session.user.email;
    if (!email) {
      return NextResponse.json({ error: 'No email found' }, { status: 400 });
    }

    const teamMember = await teamMemberService.findByEmail(email);
    const teamMemberJson = teamMember ? teamMember.toJSON() : null;

    return NextResponse.json({
      id: session.user.id,
      email: session.user.email,
      name: teamMemberJson?.name || session.user.name || '',
      phoneNumber: teamMemberJson?.phoneNumber || '',
      speciality: teamMemberJson?.speciality || '',
      position: teamMemberJson?.position || '',
      profilePhoto: session.user.image || '',
      teamMemberId: teamMember?._id?.toString() || null
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}
