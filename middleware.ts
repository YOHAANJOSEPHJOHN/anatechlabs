
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

export async function middleware(request: NextRequest) {
  const session = await getSession();
  const { pathname } = request.nextUrl;

  // If trying to access a protected admin route and there is no session, redirect to login
  if (pathname.startsWith('/admin') && !session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If on login page and already authenticated, redirect to admin dashboard
  if (pathname === '/login' && session) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Protect all routes under /admin
  // Also check /login to handle the redirect case for already authenticated users
  matcher: ['/admin/:path*', '/login'],
};
