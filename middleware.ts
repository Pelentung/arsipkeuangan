// File: middleware.ts

import { NextRequest, NextResponse } from 'next/server';
import { authConfigServer } from './firebase/server-init';
import { authMiddleware } from 'next-firebase-auth-edge';

const PUBLIC_PATHS = ['/login'];

export async function middleware(request: NextRequest) {
  return authMiddleware(request, {
    // The login path is the path to the login page.
    loginPath: '/api/login',
    // The logout path is the path to the logout page.
    logoutPath: '/api/logout',
    // The Firebase secret keys are used to sign and verify the session cookie.
    ...authConfigServer,
    // The public paths are the paths that are accessible without authentication.
    // It is recommended to configure this to your needs.
    publicPaths: PUBLIC_PATHS,
    // Set this to true if you want to use the Firebase Admin SDK.
    // It is recommended to set this to true to reduce the number of reads to the database.
    // You will have to configure the service account in the `authConfig` object.
    checkRevoked: true,
    // Specify the refresh time for the session cookie.
    // This will allow the session to be refreshed periodically.
    refreshTime: 10 * 60, // 10 minutes
    // The paths that should be ignored by the middleware.
    // You can use this to ignore API routes or other paths.
    ignoredPaths: ['/api/login', '/api/logout'],
  });
}

// The matcher is used to match the paths that the middleware should run on.
// You can use this to only run the middleware on specific paths.
export const config = {
  matcher: ['/((?!_next/static|favicon.ico).*)'],
};
