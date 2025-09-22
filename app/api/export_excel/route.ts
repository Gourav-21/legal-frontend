import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backendUrl) {
      console.error('Backend URL is not configured for Excel export');
      return NextResponse.json({ detail: 'Backend URL is not configured' }, { status: 500 });
    }

    const body = await request.json();
    
    const requestHeaders = new Headers();
    const clientCookies = request.headers.get('Cookie');
    if (clientCookies) {
      requestHeaders.set('Cookie', clientCookies);
    }
    requestHeaders.set('Content-Type', 'application/json');

    const response = await fetch(`${backendUrl}/api/export_excel`, {
      method: 'POST',
      headers: requestHeaders,
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(errorData, { status: response.status });
    }

    // Handle binary Excel file response
    const excelBuffer = await response.arrayBuffer();
    
    // Create response with proper headers for Excel file download
    const responseHeaders = new Headers();
    responseHeaders.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    responseHeaders.set('Content-Disposition', 'attachment; filename=employee_data.xlsx');
    
    // Forward any cookies from backend
    response.headers.forEach((value, key) => {
      if (key.toLowerCase() === 'set-cookie') {
        responseHeaders.append('Set-Cookie', value);
      }
    });

    return new NextResponse(excelBuffer, {
      status: 200,
      headers: responseHeaders
    });

  } catch (error) {
    console.error('[Excel Export Error]', error);
    return NextResponse.json({
      detail: error instanceof Error ? error.message : 'An unexpected error occurred during Excel export'
    }, { status: 500 });
  }
}