import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  // Add safety checks for req and nextUrl
  if (!req || !req.nextUrl) {
    console.error('Request or nextUrl is undefined in middleware');
    return NextResponse.next();
  }

  const { nextUrl } = req;
  
  // Add safety check for pathname
  if (!nextUrl.pathname) {
    console.error('Pathname is undefined in middleware');
    return NextResponse.next();
  }

  const isLoggedIn = !!req.auth;
  const pathname = nextUrl.pathname;

  // Debug logging (remove in production)
  console.log('Middleware processing:', {
    pathname,
    isLoggedIn,
    hasAuth: !!req.auth
  });

  // Route checks with safe string methods
  const isApiAuthRoute = pathname.startsWith('/api/auth');
  const isPublicRoute = ['/auth/signin', '/auth/signup'].includes(pathname);
  const isProtectedRoute = ['/weather', '/history'].includes(pathname);

  // Allow API auth routes to pass through
  if (isApiAuthRoute) {
    return NextResponse.next();
  }

  // Redirect to sign-in if accessing protected routes without authentication
  if (isProtectedRoute && !isLoggedIn) {
    const signInUrl = new URL('/auth/signin', nextUrl);
    signInUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Redirect to weather page if accessing public auth routes while logged in
  if (isPublicRoute && isLoggedIn) {
    return NextResponse.redirect(new URL('/weather', nextUrl));
  }

  // Allow request to continue
  return NextResponse.next();
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - Files with extensions (images, etc.)
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};