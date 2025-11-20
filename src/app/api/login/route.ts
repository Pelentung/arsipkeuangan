// File: src/app/api/login/route.ts

import { handleLogin } from 'next-firebase-auth-edge/lib/next/login';
import { authConfig } from '@/config/auth-config';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  return handleLogin(request, authConfig);
}
