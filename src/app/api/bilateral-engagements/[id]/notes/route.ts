import { NextResponse } from 'next/server';
import { bilateralEngagementService } from '@/server/services/bilateral-engagement.service';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const engagement = await bilateralEngagementService.addNote(id, body);

    if (!engagement) {
      return NextResponse.json(
        { error: 'Bilateral engagement not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(engagement);
  } catch (error) {
    console.error('Error adding note:', error);
    return NextResponse.json({ error: 'Failed to add note' }, { status: 500 });
  }
}
