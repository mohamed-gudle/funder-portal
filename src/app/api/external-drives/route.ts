import { NextResponse } from 'next/server';
import { externalDriveService } from '@/server/services/external-drive.service';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const drives = await externalDriveService.findAll();
    return NextResponse.json(drives);
  } catch (error) {
    console.error('Error fetching external drives:', error);
    return NextResponse.json(
      { error: 'Failed to fetch external drives' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { displayName, folderId, folderName } = body;

    if (!displayName || !folderId) {
      return NextResponse.json(
        { error: 'displayName and folderId are required' },
        { status: 400 }
      );
    }

    const drive = await externalDriveService.create({
      provider: 'google-drive',
      displayName,
      folderId,
      folderName
    });

    return NextResponse.json(drive, { status: 201 });
  } catch (error) {
    console.error('Error creating external drive:', error);
    return NextResponse.json(
      { error: 'Failed to create external drive' },
      { status: 500 }
    );
  }
}
