import { NextRequest } from 'next/server';
import { proxyToBackend } from '../utils/proxyToBackend';

// GET /api/dynamic-params - Retrieve all dynamic parameters organized by sections
export async function GET(request: NextRequest) {
  return proxyToBackend(request, '/api/dynamic-params', { method: 'GET' });
}

// POST /api/dynamic-params/{section} - Add a new parameter to a specific section
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { param, label_en, label_he, description, type } = body;

  if (!param || !label_en || !label_he || !description || !type) {
    return new Response(JSON.stringify({ detail: 'Param, label_en, label_he, type and description are required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return proxyToBackend(request, `/api/dynamic-params/${body.section || 'payslip'}`, {
    method: 'POST',
    body: { param, label_en, label_he, description, type }
  });
}