import { NextRequest } from 'next/server';
import { proxyToBackend } from '../../utils/proxyToBackend';

export async function POST(request: NextRequest) {
  return proxyToBackend(request, '/auth/logout', { method: 'POST' });
}
