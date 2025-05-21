import { NextRequest, NextResponse } from 'next/server';
import { proxyToBackend } from '../utils/proxyToBackend';

export async function GET(request: NextRequest) {
  // Extract query parameters from the incoming request
  const { searchParams } = new URL(request.url);
  const analysis_type = searchParams.get('analysis_type');
  const from_date = searchParams.get('from_date');
  const to_date = searchParams.get('to_date');

  // Construct the backend path with query parameters
  let backendPath = '/api/history';
  const queryParams = new URLSearchParams();

  if (analysis_type) {
    queryParams.append('analysis_type', analysis_type);
  }
  if (from_date) {
    queryParams.append('from_date', from_date);
  }
  if (to_date) {
    queryParams.append('to_date', to_date);
  }

  if (queryParams.toString()) {
    backendPath += `?${queryParams.toString()}`;
  }

  return proxyToBackend(request, backendPath, { method: 'GET' });
}
