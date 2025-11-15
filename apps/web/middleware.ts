import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware to handle URL redirects and eliminate duplicate routes
 * CRITICAL: Redirects /dashboard to / (eliminating duplicate home pages)
 */
export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Redirect /dashboard to / (CRITICAL FIX for duplicate home pages)
  if (pathname === '/dashboard') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Allow all other requests to proceed
  return NextResponse.next();
}

// Configure which routes this middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};