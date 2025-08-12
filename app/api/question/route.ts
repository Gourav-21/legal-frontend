import { NextRequest, NextResponse } from 'next/server';
import { proxyToBackend } from '../utils/proxyToBackend';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.question || !body.report) {
      console.log(body.report)
      console.log(body.question)
      return NextResponse.json(
        { detail: 'Question and report are required' },
        { status: 400 }
      );
    }

    // Format the request body to match the backend QnA API structure
    const qnaRequestBody = {
      report: body.report,
      questions: [body.question]
    };

    // Proxy the request to the backend QnA endpoint
    return await proxyToBackend(request, '/api/qna', {
      method: 'POST',
      body: JSON.stringify(qnaRequestBody),
    });
  } catch (error) {
    console.error('Question API error:', error);
    return NextResponse.json(
      { detail: 'Internal server error' },
      { status: 500 }
    );
  }
}