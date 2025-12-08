import { NextResponse } from 'next/server';
import { driveService } from '@/server/services/drive.service';

export async function GET(request: Request) {
  try {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
      const redirectUrl = new URL('/dashboard/knowledge?drive=error', origin);
      return NextResponse.redirect(redirectUrl);
    }

    if (!code) {
      return NextResponse.json({ error: 'Missing code' }, { status: 400 });
    }

    const tokens = await driveService.exchangeCodeForTokens(code);

    if (!tokens.refresh_token) {
      const redirectUrl = new URL(
        '/dashboard/knowledge?drive=missing-refresh',
        origin
      );
      return NextResponse.redirect(redirectUrl);
    }

    const redirectUrl = new URL('/dashboard/knowledge?drive=connected', origin);
    const response = NextResponse.redirect(redirectUrl);
    response.cookies.set('gdrive_refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30 // 30 days
    });

    return response;
  } catch (err) {
    console.error('Error handling Google Drive callback:', err);
    const { origin } = new URL(request.url);
    const redirectUrl = new URL('/dashboard/knowledge?drive=error', origin);
    return NextResponse.redirect(redirectUrl);
  }
}
