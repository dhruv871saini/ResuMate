// app/api/pdf/route.ts
// Updated: backend now returns { pdfUrl } (Cloudinary URL) instead of a PDF binary.
// This proxy forwards the request and returns the JSON response.
// Frontend (pdfApi.generate) opens the Cloudinary URL directly.

import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const token = req.headers.get('authorization') || '';

    // Backend mounts at /api/pdf (route/index.js)
    const backendUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/pdf`;

    const res = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    // Return { pdfUrl, template, analysisId } — frontend opens pdfUrl in new tab
    return NextResponse.json(data);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'PDF proxy error';
    return NextResponse.json({ message: msg }, { status: 500 });
  }
}
