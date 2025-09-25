import { NextRequest } from 'next/server';
import { proxyToBackend } from '../../utils/proxyToBackend';

// GET /api/dynamic-params/{section} - Get parameters for a specific section
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ section: string }> }
) {
  const { section } = await params;

  if (!['payslip', 'attendance', 'contract', 'employee'].includes(section)) {
    return new Response(JSON.stringify({ detail: 'Invalid section. Must be payslip, attendance, contract, or employee' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return proxyToBackend(request, `/api/dynamic-params/${section}`, { method: 'GET' });
}

// POST /api/dynamic-params/{section} - Add a new parameter to a specific section
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ section: string }> }
) {
  const { section } = await params;
  const body = await request.json();
  const { param, label_en, label_he, description, type  } = body;

  if (!param || !label_en || !label_he || !description || !type) {
    return new Response(JSON.stringify({ detail: 'Param, label_en, label_he, type and description are required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  if (!['payslip', 'attendance', 'contract', 'employee'].includes(section)) {
    return new Response(JSON.stringify({ detail: 'Invalid section. Must be payslip, attendance, contract, or employee' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return proxyToBackend(request, `/api/dynamic-params/${section}`, {
    method: 'POST',
    body: { param, label_en, label_he, description, type }
  });
}