import { NextRequest, NextResponse } from 'next/server';
import { proxyToBackend } from '../../utils/proxyToBackend';

// POST /api/labor-law-rules/test - Test a rule
export async function POST(request: NextRequest) {
  const body = await request.json();
  return proxyToBackend(request, '/api/labor-law-rules/test', {
    method: 'POST',
    body: body
  });
}
