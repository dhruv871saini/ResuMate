// app/api/upload/route.ts
//
// Receives PDF or DOCX from the browser → uploads to Cloudinary → returns URL.
// Frontend then sends that URL to Express backend for AI parsing.
//
// Cloudinary setup:
//   1. dashboard.cloudinary.com → Settings → API Keys
//   2. Create a folder called "resumate/resumes" (optional, auto-created)
//   3. Set resource_type: "raw" for PDF/DOCX (not "image")

import { v2 as cloudinary } from 'cloudinary';
import { NextRequest, NextResponse } from 'next/server';

cloudinary.config({
  cloud_name:  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
  api_key:     process.env.CLOUDINARY_API_KEY!,
  api_secret:  process.env.CLOUDINARY_API_SECRET!,
});

const MAX_SIZE    = 5 * 1024 * 1024; // 5 MB
const ALLOWED     = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

export async function POST(req: NextRequest) {
  try {
    const form   = await req.formData();
    const file   = form.get('file') as File | null;
    const userId = form.get('userId') as string | null;

    if (!file)   return NextResponse.json({ message: 'No file' }, { status: 400 });
    if (!userId) return NextResponse.json({ message: 'userId required' }, { status: 400 });

    if (!ALLOWED.includes(file.type)) {
      return NextResponse.json({ message: 'Only PDF or DOCX allowed' }, { status: 400 });
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ message: 'File too large — max 5 MB' }, { status: 400 });
    }

    // Convert File → base64 data URI (what Cloudinary's Node SDK expects)
    const buffer     = Buffer.from(await file.arrayBuffer());
    const base64     = buffer.toString('base64');
    const ext        = file.type.includes('pdf') ? 'pdf' : 'docx';
    const dataUri    = `data:${file.type};base64,${base64}`;

    // Upload to Cloudinary
    // resource_type "raw" is required for non-image files (PDF, DOCX)
    const result = await cloudinary.uploader.upload(dataUri, {
      resource_type: 'raw',
      folder:        `resumate/resumes/${userId}`,
      public_id:     `resume_${Date.now()}`,
      format:        ext,
      // Keep uploaded files — don't auto-delete
      overwrite:     false,
    });

    return NextResponse.json({
      message:   'Uploaded',
      url:       result.secure_url,   // ← HTTPS URL, send to Express for parsing
      publicId:  result.public_id,
      fileType:  file.type,
      name:      file.name,
    });

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Upload failed';
    console.error('[Cloudinary upload]', msg);
    return NextResponse.json({ message: msg }, { status: 500 });
  }
}
