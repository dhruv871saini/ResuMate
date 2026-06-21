// app/api/pdf/route.ts
//
// Proxies PDF download request from browser → Express backend.
// Express runs Puppeteer, returns a PDF buffer, we stream it back.
// This proxy exists so we can attach the auth token server-side.

import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Forward auth token from browser request headers
    const authHeader = req.headers.get('authorization') || '';

    const backendUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/pdf`;

    const res = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader ? { Authorization: authHeader } : {}),
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.json();
      return NextResponse.json({ message: err.message || 'PDF failed' }, { status: res.status });
    }

    // Stream the PDF buffer directly back to the browser
    const pdfBuffer = await res.arrayBuffer();
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type':        'application/pdf',
        'Content-Disposition': `attachment; filename="resume.pdf"`,
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'PDF proxy failed';
    return NextResponse.json({ message: msg }, { status: 500 });
  }
}
