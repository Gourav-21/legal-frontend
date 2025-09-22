import { NextRequest } from 'next/server';
import { proxyToBackend } from '../utils/proxyToBackend';

// GET /api/laws - Fetch all laws
export async function GET(request: NextRequest) {
  return proxyToBackend(request, '/api/laws', { 
    method: 'GET' 
  });
}

// POST /api/laws - Add a new law
export async function POST(request: NextRequest) {
  const body = await request.json();
  return proxyToBackend(request, '/api/laws', { 
    method: 'POST', 
    body: body 
  });
}
