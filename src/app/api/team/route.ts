import { NextResponse } from 'next/server';
import { teamMemberService } from '@/server/services/team-member.service';
import { clerkClient } from '@clerk/nextjs/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || undefined;

    const teamMembers = await teamMemberService.findAll({ search });

    // Fetch Clerk users to get profile photos
    const client = await clerkClient();
    const enrichedMembers = await Promise.all(
      teamMembers.map(async (member: any) => {
        try {
          // Try to find Clerk user by email
          const clerkUsers = await client.users.getUserList({
            emailAddress: [member.email]
          });

          const clerkUser = clerkUsers.data[0];

          return {
            ...JSON.parse(JSON.stringify(member)),
            profilePhoto: clerkUser?.imageUrl || member.profilePhoto || ''
          };
        } catch (error) {
          // If Clerk lookup fails, use existing photo
          return JSON.parse(JSON.stringify(member));
        }
      })
    );

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
    const body = await request.json();
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
