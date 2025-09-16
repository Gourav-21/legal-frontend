import { NextRequest } from 'next/server';
import { proxyToBackend } from '../utils/proxyToBackend';

// GET /api/dynamic-params-flat - Get all parameters as a flat list with section info
export async function GET(request: NextRequest) {
  return proxyToBackend(request, '/api/dynamic-params-flat', { method: 'GET' });
}