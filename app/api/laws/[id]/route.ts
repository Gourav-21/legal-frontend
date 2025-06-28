import { NextRequest, NextResponse } from 'next/server';
import { proxyToBackend } from '../../utils/proxyToBackend';

// PUT /api/laws/[id] - Update a law by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  return proxyToBackend(request, `/api/laws/${params.id}`, { 
    method: 'PUT', 
    body: body 
  });
}

// DELETE /api/laws/[id] - Delete a law by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return proxyToBackend(request, `/api/laws/${params.id}`, { 
    method: 'DELETE' 
  });
}

// GET /api/laws/[id] - Get a specific law by ID (optional)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return proxyToBackend(request, `/api/laws/${params.id}`, { 
    method: 'GET' 
  });
}
