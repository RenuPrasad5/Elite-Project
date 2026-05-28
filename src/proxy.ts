import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function isTokenValid(token: string | undefined): boolean {
  if (!token) return false;
  
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const payload = JSON.parse(jsonPayload);
    
    // JWT exp is in seconds, Date.now() in ms
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      return false;
    }
    
    return true;
  } catch (e) {
    return false;
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('sb-access-token')?.value;
  const hasValidToken = isTokenValid(token);

  const isProtectedRoute = pathname.startsWith('/dashboard');
  const isAuthRoute = pathname === '/login' || pathname === '/signup';

  if (isProtectedRoute && !hasValidToken) {
    // Redirect to login page if trying to access dashboard while logged out
    const redirectUrl = new URL('/login', request.url);
    // Remember original URL to redirect back after login if desired
    redirectUrl.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (isAuthRoute && hasValidToken) {
    // Redirect to dashboard if trying to access login/signup while already logged in
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images, icons, etc.
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg|.*\\.png|.*\\.jpg).*)',
  ],
};
