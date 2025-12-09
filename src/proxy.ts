import { NextRequest, NextResponse } from 'next/server';

// Simple passthrough middleware that skips health checks
// Clerk middleware will be added when proper keys are configured
export default async function middleware(req: NextRequest) {
  // Always skip health check endpoint
  if (req.nextUrl.pathname === '/api/health') {
    return NextResponse.next();
  }

  // For now, just pass through all requests
  // TODO: Add Clerk middleware when keys are properly configured
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)'
  ]
};
