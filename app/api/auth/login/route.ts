import { NextRequest } from 'next/server';
import { proxyToBackend } from '../../utils/proxyToBackend';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  return proxyToBackend(request, '/auth/login', { 
    method: 'POST', 
    body: formData, 
    isFormData: true 
  });
}
