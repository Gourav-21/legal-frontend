import { NextRequest, NextResponse } from 'next/server';
import { proxyToBackend } from '../../utils/proxyToBackend';

export async function GET(request: NextRequest) {
  return proxyToBackend(request, '/auth/me', { method: 'GET' });
}
