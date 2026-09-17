import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { authorizeAdminRequest } from "@/lib/admin-auth";

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const auth = await authorizeAdminRequest(request);
    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, error: auth.error || "غير مصرح: رفع الصور متاح للمدير فقط" },
        { status: auth.status }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "لم يتم اختيار أي ملف" },
        { status: 400 }
      );
    }

    // Check file type
    const mimeType = file.type;
    if (!mimeType.startsWith("image/")) {
      return NextResponse.json(
        { success: false, error: "الملف المرفوع يجب أن يكون صورة (PNG, JPG, WebP, GIF)" },
        { status: 400 }
      );
    }

    // Max 10MB
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: "حجم الصورة كبير جداً، الحد الأقصى هو 10 ميجابايت" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Get clean extension
    let ext = path.extname(file.name).toLowerCase();
    if (!ext || ext === ".") {
      if (mimeType.includes("png")) ext = ".png";
      else if (mimeType.includes("webp")) ext = ".webp";
      else if (mimeType.includes("gif")) ext = ".gif";
      else ext = ".jpg";
    }

    const filename = `img_${Date.now()}_${Math.random().toString(36).substring(2, 8)}${ext}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads");

    // Ensure uploads directory exists
    await mkdir(uploadDir, { recursive: true });

    const filepath = path.join(uploadDir, filename);
    await writeFile(filepath, buffer);

    const fileUrl = `/uploads/${filename}`;

    return NextResponse.json({
      success: true,
      url: fileUrl,
      filename,
      size: file.size,
    });
  } catch (error: any) {
    console.error("POST /api/upload error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "فشل رفع الصورة" },
      { status: 500 }
    );
  }
}
