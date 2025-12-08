import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { driveService } from '@/server/services/drive.service';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('gdrive_refresh_token')?.value;

    if (!refreshToken) {
      return NextResponse.json({ error: 'Not connected' }, { status: 401 });
    }

    const files = await driveService.listFiles(refreshToken);
    return NextResponse.json(files);
  } catch (error: any) {
    console.error('Error listing Google Drive files:', error);
    const status = error?.code === 401 || error?.code === 403 ? 401 : 500;
    const message =
      status === 401
        ? `Google Drive connection expired or unauthorized. Please reconnect.${error?.reason ? ` Details: ${error.reason}` : ''}`
        : 'Failed to fetch files';
    return NextResponse.json({ error: message }, { status });
  }
}
