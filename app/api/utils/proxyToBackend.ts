import { NextRequest, NextResponse } from 'next/server';

interface ProxyOptions {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: any; // Can be FormData or an object for JSON
  isFormData?: boolean; // Explicitly state if the body is FormData
}

export async function proxyToBackend(
  request: NextRequest,
  backendPath: string,
  options: ProxyOptions
): Promise<NextResponse> {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backendUrl) {
      console.error('Backend URL is not configured for path:', backendPath);
      return NextResponse.json({ detail: 'Backend URL is not configured' }, { status: 500 });
    }

    const requestHeaders = new Headers();
    const clientCookies = request.headers.get('Cookie');
    if (clientCookies) {
      requestHeaders.set('Cookie', clientCookies);
    }

    let bodyToSend = options.body;

    if (options.isFormData) {
      // When body is FormData, Content-Type is set automatically by fetch with the correct boundary
    } else if (options.body !== undefined && (options.method === 'POST' || options.method === 'PUT' || options.method === 'PATCH')) {
      requestHeaders.set('Content-Type', 'application/json');
      bodyToSend = JSON.stringify(options.body);
    }

    const fetchOptions: RequestInit = {
      method: options.method,
      headers: requestHeaders,
    };

    if (bodyToSend !== undefined) {
      fetchOptions.body = bodyToSend;
    }

    const response = await fetch(`${backendUrl}${backendPath}`, fetchOptions);

    const responseHeaders = new Headers();
    response.headers.forEach((value, key) => {
      if (key.toLowerCase() === 'set-cookie') {
        responseHeaders.append('Set-Cookie', value);
      }
      // Optionally, forward other headers from backend to client if needed
      // else if (key.toLowerCase() === 'content-type') { 
      //   responseHeaders.set(key, value);
      // }
    });

    if (response.status === 204) { // No Content
      return new NextResponse(null, { status: 204, headers: responseHeaders });
    }

    const contentType = response.headers.get('content-type');
    let data;

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const textData = await response.text();
      if (textData === '' && response.ok) {
        data = {}; 
      } else {
        try {
          data = JSON.parse(textData);
        } catch (e) {
          data = textData;
        }
      }
    }
    
    // Ensure Content-Type is set for the JSON response to the client
    if (!responseHeaders.has('Content-Type') && contentType && contentType.includes('application/json')){
        responseHeaders.set('Content-Type', 'application/json');
    }

    return NextResponse.json(data, { status: response.status, headers: responseHeaders });

  } catch (error: any) {
    console.error(`[API Proxy Error - ${backendPath}] Path: ${request.nextUrl.pathname}`, error);
    return NextResponse.json({ 
      detail: error.message || 'An unexpected error occurred during proxying',
      path: request.nextUrl.pathname,
      backendPath: backendPath
    }, { status: 500 });
  }
}
