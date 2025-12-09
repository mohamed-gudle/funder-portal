import { NextResponse } from 'next/server';
import { opportunityService } from '@/server/services/opportunity.service';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || undefined;

    const opportunities = await opportunityService.findAll(search);
    return NextResponse.json(opportunities);
  } catch (error) {
    console.error('Error fetching saved opportunities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch saved opportunities' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { opportunities = [], query, maxIterations } = body;

    const result = await opportunityService.saveFinderResults({
      opportunities,
      query,
      maxIterations
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error saving opportunities:', error);
    return NextResponse.json(
      { error: 'Failed to save opportunities' },
      { status: 500 }
    );
  }
}
