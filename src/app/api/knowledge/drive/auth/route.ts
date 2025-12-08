import { NextResponse } from 'next/server';
import { driveService } from '@/server/services/drive.service';

export async function GET() {
  try {
    const url = driveService.getAuthUrl();
    return NextResponse.json({ url });
  } catch (error) {
    console.error('Error generating Google Drive auth URL:', error);
    return NextResponse.json(
      { error: 'Failed to start Google Drive auth' },
      { status: 500 }
    );
  }
}
