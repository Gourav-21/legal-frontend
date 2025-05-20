import { NextRequest, NextResponse } from 'next/server';
import { proxyToBackend } from '../utils/proxyToBackend';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  return proxyToBackend(request, '/api/process', { 
    method: 'POST', 
    body: formData, 
    isFormData: true 
  });
}
