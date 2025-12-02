import { NextResponse } from 'next/server';
import { openCallService } from '@/server/services/open-call.service';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const openCall = await openCallService.addDocument(id, body);

    if (!openCall) {
      return NextResponse.json(
        { error: 'Open call not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(openCall);
  } catch (error) {
    console.error('Error adding document:', error);
    return NextResponse.json(
      { error: 'Failed to add document' },
      { status: 500 }
    );
  }
}
