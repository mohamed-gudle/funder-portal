import { NextResponse } from 'next/server';

// Health check endpoint - should work even if other services fail
// Export route config to bypass middleware if needed
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  // Simple health check that doesn't depend on external services
  // This should always return 200 if the server is running
  return NextResponse.json(
    {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'funders-portal',
      uptime: process.uptime()
    },
    {
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    }
  );
}
