// File: src/app/api/logout/route.ts

import { handleLogout } from 'next-firebase-auth-edge/lib/next/logout';
import { authConfig } from '@/config/auth-config';
import { NextRequest } from 'next/server';

export function POST(request: NextRequest) {
  return handleLogout(request, authConfig);
}
