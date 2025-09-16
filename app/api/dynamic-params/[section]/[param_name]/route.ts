import { NextRequest } from 'next/server';
import { proxyToBackend } from '../../../utils/proxyToBackend';

// PUT /api/dynamic-params/{section}/{param_name} - Update an existing parameter
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ section: string; param_name: string }> }
) {
  const { section, param_name } = await params;
  const body = await request.json();
  const { label_en, label_he, description } = body;

  if (!label_en || !label_he || !description) {
    return new Response(JSON.stringify({ detail: 'label_en, label_he, and description are required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  if (!['payslip', 'attendance', 'contract'].includes(section)) {
    return new Response(JSON.stringify({ detail: 'Invalid section. Must be payslip, attendance, or contract' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return proxyToBackend(request, `/api/dynamic-params/${section}/${param_name}`, {
    method: 'PUT',
    body: { label_en, label_he, description }
  });
}

// DELETE /api/dynamic-params/{section}/{param_name} - Remove a parameter from a section
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ section: string; param_name: string }> }
) {
  const { section, param_name } = await params;

  if (!['payslip', 'attendance', 'contract'].includes(section)) {
    return new Response(JSON.stringify({ detail: 'Invalid section. Must be payslip, attendance, or contract' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Don't allow removal of core parameters
  const coreParams = ['employee_id', 'month'];
  if (coreParams.includes(param_name)) {
    return new Response(JSON.stringify({ detail: `Cannot remove core parameter '${param_name}'` }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return proxyToBackend(request, `/api/dynamic-params/${section}/${param_name}`, {
    method: 'DELETE'
  });
}