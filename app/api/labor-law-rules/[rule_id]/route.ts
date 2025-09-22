import { NextRequest } from 'next/server';
import { proxyToBackend } from '../../utils/proxyToBackend';

// GET /api/labor-law-rules/[rule_id] - Get a specific rule by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ rule_id: string }> }
) {
  const { rule_id } = await params;
  return proxyToBackend(request, `/api/labor-law-rules/${rule_id}`, {
    method: 'GET'
  });
}

// PUT /api/labor-law-rules/[rule_id] - Update a rule by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ rule_id: string }> }
) {
  const { rule_id } = await params;
  const body = await request.json();
  return proxyToBackend(request, `/api/labor-law-rules/${rule_id}`, {
    method: 'PUT',
    body: body
  });
}

// DELETE /api/labor-law-rules/[rule_id] - Delete a rule by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ rule_id: string }> }
) {
  const { rule_id } = await params;
  return proxyToBackend(request, `/api/labor-law-rules/${rule_id}`, {
    method: 'DELETE'
  });
}