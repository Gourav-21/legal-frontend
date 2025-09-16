import { NextRequest, NextResponse } from 'next/server';
import { proxyToBackend } from '../../utils/proxyToBackend';

// GET /api/labor-law-rules/dynamic-params - Retrieve all dynamic parameters organized by sections
export async function GET(request: NextRequest) {
  return proxyToBackend(request, '/api/dynamic-params', { method: 'GET' });
}

// POST /api/labor-law-rules/dynamic-params - Add a new parameter to a specific section
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { section, param, label } = body;

  if (!section || !param || !label) {
    return NextResponse.json(
      { detail: 'Section, param, and label are required' },
      { status: 400 }
    );
  }

  return proxyToBackend(request, `/api/dynamic-params/${section}`, {
    method: 'POST',
    body: { param, label }
  });
}

// DELETE /api/labor-law-rules/dynamic-params - Remove a parameter from a section
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const section = searchParams.get('section');
  const param = searchParams.get('param');

  if (!section || !param) {
    return NextResponse.json(
      { detail: 'Section and param are required' },
      { status: 400 }
    );
  }

  return proxyToBackend(request, `/api/dynamic-params/${section}/${param}`, {
    method: 'DELETE'
  });
}
