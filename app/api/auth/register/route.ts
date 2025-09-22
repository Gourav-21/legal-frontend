import { NextRequest } from 'next/server';
import { proxyToBackend } from '../../utils/proxyToBackend';

export async function POST(request: NextRequest) {
  const body = await request.json(); // Assuming register expects JSON
  return proxyToBackend(request, '/auth/register', { 
    method: 'POST', 
    body: body 
  });
}
