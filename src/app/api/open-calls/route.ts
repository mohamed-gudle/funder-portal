import { NextResponse } from 'next/server';
import { openCallService } from '@/server/services/open-call.service';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || undefined;
    const status = searchParams.get('status') || undefined;
    const sector = searchParams.get('sector') || undefined;
    const callStatus = searchParams.get('callStatus') || undefined;
    const priority = searchParams.get('priority') || undefined;
    const fundingType = searchParams.get('fundingType') || undefined;

    const openCalls = await openCallService.findAll({
      search,
      status,
      sector,
      callStatus,
      priority,
      fundingType
    });

    return NextResponse.json(openCalls);
  } catch (error) {
    console.error('Error fetching open calls:', error);
    return NextResponse.json(
      { error: 'Failed to fetch open calls' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const openCall = await openCallService.create(body);
    return NextResponse.json(openCall, { status: 201 });
  } catch (error) {
    console.error('Error creating open call:', error);
    return NextResponse.json(
      { error: 'Failed to create open call' },
      { status: 500 }
    );
  }
}
