import { NextRequest } from 'next/server';
import { proxyToBackend } from '../utils/proxyToBackend';

// POST /api/test-expression - Test an expression with payslip, attendance, contract, employee data
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { expression, expression_type, payslip, attendance, contract, employee } = body;

  if (!expression || !expression_type) {
    return new Response(JSON.stringify({ detail: 'Expression and expression_type are required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return proxyToBackend(request, '/api/test-expression', {
    method: 'POST',
    body: { expression, expression_type, payslip, attendance, contract, employee }
  });
}