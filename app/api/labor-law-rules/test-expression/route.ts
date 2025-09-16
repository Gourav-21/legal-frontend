import { NextRequest, NextResponse } from 'next/server';
import { proxyToBackend } from '../../utils/proxyToBackend';

// POST /api/labor-law-rules/test-expression - Test an expression
export async function POST(request: NextRequest) {
  const body = await request.json();
  return proxyToBackend(request, '/api/labor-law-rules/test-expression', {
    method: 'POST',
    body: body
  });
}
