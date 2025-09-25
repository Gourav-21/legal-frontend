import { NextRequest, NextResponse } from 'next/server';
import { proxyToBackend } from '../utils/proxyToBackend';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.law_description) {
      return NextResponse.json({ detail: 'law_description is required' }, { status: 400 });
    }

    const proxiedResponse = await proxyToBackend(request, '/api/suggest-params-formulas', {
      method: 'POST',
      body: { law_description: body.law_description },
    });

    if (proxiedResponse.status >= 400) {
      return proxiedResponse;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = await (proxiedResponse as any).json();
    const suggestions = (data && typeof data === 'object' && 'suggestions' in data) ? data.suggestions : data;

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error('Suggest params formulas API error:', error);
    return NextResponse.json({ detail: 'Internal server error' }, { status: 500 });
  }
}