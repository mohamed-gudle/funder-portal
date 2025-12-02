import { NextResponse } from 'next/server';
import { bilateralEngagementService } from '@/server/services/bilateral-engagement.service';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || undefined;
    const stage = searchParams.get('stage') || undefined;
    const sector = searchParams.get('sector') || undefined;

    const engagements = await bilateralEngagementService.findAll({
      search,
      stage,
      sector
    });

    return NextResponse.json(engagements);
  } catch (error) {
    console.error('Error fetching bilateral engagements:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bilateral engagements' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const engagement = await bilateralEngagementService.create(body);
    return NextResponse.json(engagement, { status: 201 });
  } catch (error) {
    console.error('Error creating bilateral engagement:', error);
    return NextResponse.json(
      { error: 'Failed to create bilateral engagement' },
      { status: 500 }
    );
  }
}
