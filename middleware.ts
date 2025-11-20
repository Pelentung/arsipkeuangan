import { NextRequest, NextResponse } from 'next/server';
import { authentication } from 'next-firebase-auth-edge/lib/next/middleware';
import { authConfig } from './src/config/auth-config';

const PUBLIC_PATHS = ['/login'];

function isPublic(path: string) {
  return PUBLIC_PATHS.includes(path);
}

export async function middleware(request: NextRequest) {
  return authentication(request, {
    loginPath: '/api/login',
    logoutPath: '/api/logout',
    ...authConfig,
    handleValidToken: async ({ token, decodedToken }) => {
      if (isPublic(request.nextUrl.pathname)) {
        return NextResponse.redirect(new URL('/', request.url));
      }

      return NextResponse.next();
    },
    handleInvalidToken: async () => {
      if (isPublic(request.nextUrl.pathname)) {
        return NextResponse.next();
      }

      return NextResponse.redirect(new URL('/login', request.url));
    },
    handleError: async (error) => {
      console.error('Middleware error:', { error });

      if (isPublic(request.nextUrl.pathname)) {
        return NextResponse.next();
      }

      return NextResponse.redirect(new URL('/login', request.url));
    },
  });
}

export const config = {
  matcher: ['/((?!_next/static|favicon.ico|api/login|api/logout).*)'],
};
