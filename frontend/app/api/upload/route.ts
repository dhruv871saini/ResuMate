import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

const MAX_SIZE = 5 * 1024 * 1024;

const ALLOWED = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;
    const userId = form.get("userId") as string | null;

    if (!file) return NextResponse.json({ message: "No file" }, { status: 400 });
    if (!userId) return NextResponse.json({ message: "userId required" }, { status: 400 });

    if (!ALLOWED.includes(file.type)) {
      return NextResponse.json(
        { message: "Only PDF or DOCX allowed" },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { message: "File too large (max 5MB)" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = buffer.toString("base64");
    const dataUri = `data:${file.type};base64,${base64}`;

    const result = await cloudinary.uploader.upload(dataUri, {
      resource_type: "raw",

      // clean folder structure (IMPORTANT FIX)
      folder: `resumate/resumes/user_${userId}`,

      public_id: `resume_${Date.now()}`,

      overwrite: false,
    });

    return NextResponse.json({
      message: "Uploaded successfully",
      url: result.secure_url,
      publicId: result.public_id,
      fileType: file.type,
      originalName: file.name,
    });

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Upload failed";
    console.error("[Cloudinary upload]", msg);

    return NextResponse.json({ message: msg }, { status: 500 });
  }
}