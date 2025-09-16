import { NextRequest, NextResponse } from 'next/server';
import { proxyToBackend } from '../utils/proxyToBackend';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Basic validation - rule_description required
    if (!body.rule_description) {
      return NextResponse.json({ detail: 'rule_description is required' }, { status: 400 });
    }

    // Proxy to backend AI generation endpoint. Backend should implement `/api/generate-rule`
    return await proxyToBackend(request, '/api/generate-rule', {
      method: 'POST',
      body: body,
    });
  } catch (error) {
    console.error('Generate rule API error:', error);
    return NextResponse.json({ detail: 'Internal server error' }, { status: 500 });
  }
}