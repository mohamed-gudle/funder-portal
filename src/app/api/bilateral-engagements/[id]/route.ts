import { NextResponse } from 'next/server';
import { bilateralEngagementService } from '@/server/services/bilateral-engagement.service';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const engagement = await bilateralEngagementService.findById(id);

    if (!engagement) {
      return NextResponse.json(
        { error: 'Bilateral engagement not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(engagement);
  } catch (error) {
    console.error('Error fetching bilateral engagement:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bilateral engagement' },
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
    const engagement = await bilateralEngagementService.update(id, body);

    if (!engagement) {
      return NextResponse.json(
        { error: 'Bilateral engagement not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(engagement);
  } catch (error) {
    console.error('Error updating bilateral engagement:', error);
    return NextResponse.json(
      { error: 'Failed to update bilateral engagement' },
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
    const engagement = await bilateralEngagementService.delete(id);

    if (!engagement) {
      return NextResponse.json(
        { error: 'Bilateral engagement not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting bilateral engagement:', error);
    return NextResponse.json(
      { error: 'Failed to delete bilateral engagement' },
      { status: 500 }
    );
  }
}
