import { NextRequest, NextResponse } from 'next/server';
import { proxyToBackend } from '../utils/proxyToBackend';

export async function POST(req: NextRequest) {
  const body = await req.json();
  return proxyToBackend(req, '/api/summarise_analysis', {
    method: 'POST',
    body: body,
    isFormData: false
  });
}
