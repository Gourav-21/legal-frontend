import { NextRequest } from 'next/server';
import { proxyToBackend } from '../utils/proxyToBackend';

// GET /api/labor-law-rules - Fetch all rules
export async function GET(request: NextRequest) {
  return proxyToBackend(request, '/api/labor-law-rules', { 
    method: 'GET' 
  });
}

// POST /api/labor-law-rules - Add a new rule
export async function POST(request: NextRequest) {
  const body = await request.json();
  return proxyToBackend(request, '/api/labor-law-rules', { 
    method: 'POST', 
    body: body 
  });
}