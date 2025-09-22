import { NextRequest } from 'next/server';
import { proxyToBackend } from '../utils/proxyToBackend';

export async function POST(request: NextRequest) {
  const body = await request.json();
  return proxyToBackend(request, '/api/fix_ocr', { 
    method: 'POST', 
    body: body 
  });
}