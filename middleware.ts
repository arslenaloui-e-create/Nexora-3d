import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.AUTH_SECRET || 'dev-only-change-me');

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  if (!path.startsWith('/dashboard') && !path.startsWith('/admin')) {
    return NextResponse.next();
  }

  const token = req.cookies.get('nexora_session')?.value;
  if (!token) {
    const loginUrl = new URL('/auth/login', req.url);
    loginUrl.searchParams.set('next', path);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const p = await jwtVerify(token, secret);
    const id = String(p.payload.id || '');
    const role = String(p.payload.role || '');

    if (!id || (role !== 'ADMIN' && role !== 'CLIENT')) {
      throw new Error('INVALID_SESSION');
    }

    if (path.startsWith('/admin') && role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
    if (path.startsWith('/dashboard') && role !== 'CLIENT') {
      return NextResponse.redirect(new URL('/admin', req.url));
    }

    const response = NextResponse.next();
    response.headers.set('Cache-Control', 'private, no-store, max-age=0');
    return response;
  } catch {
    const loginUrl = new URL('/auth/login', req.url);
    loginUrl.searchParams.set('next', path);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = { matcher: ['/dashboard/:path*', '/admin/:path*'] };
