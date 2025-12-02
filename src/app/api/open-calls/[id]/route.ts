import { NextResponse } from 'next/server';
import { openCallService } from '@/server/services/open-call.service';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const openCall = await openCallService.findById(id);

    if (!openCall) {
      return NextResponse.json(
        { error: 'Open call not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(openCall);
  } catch (error) {
    console.error('Error fetching open call:', error);
    return NextResponse.json(
      { error: 'Failed to fetch open call' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const openCall = await openCallService.update(id, body);

    if (!openCall) {
      return NextResponse.json(
        { error: 'Open call not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(openCall);
  } catch (error) {
    console.error('Error updating open call:', error);
    return NextResponse.json(
      { error: 'Failed to update open call' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const openCall = await openCallService.delete(id);

    if (!openCall) {
      return NextResponse.json(
        { error: 'Open call not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting open call:', error);
    return NextResponse.json(
      { error: 'Failed to delete open call' },
      { status: 500 }
    );
  }
}
