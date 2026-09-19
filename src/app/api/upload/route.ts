import { NextRequest, NextResponse } from "next/server";
import { writeFile, unlink, mkdir } from "fs/promises";
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
    let buffer = Buffer.from(bytes);
    let ext = ".webp";
    let outputFilename = `img_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.webp`;

    // Try optimizing with sharp if available
    try {
      const sharp = require("sharp");
      buffer = await sharp(buffer)
        .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
        .webp({ quality: 82, effort: 4 })
        .toBuffer();
    } catch (sharpErr) {
      // Fallback to original format
      let origExt = path.extname(file.name).toLowerCase();
      if (!origExt || origExt === ".") {
        if (mimeType.includes("png")) origExt = ".png";
        else if (mimeType.includes("webp")) origExt = ".webp";
        else if (mimeType.includes("gif")) origExt = ".gif";
        else origExt = ".jpg";
      }
      ext = origExt;
      outputFilename = `img_${Date.now()}_${Math.random().toString(36).substring(2, 8)}${ext}`;
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    const filepath = path.join(uploadDir, outputFilename);
    await writeFile(filepath, buffer);

    const fileUrl = `/uploads/${outputFilename}`;

    return NextResponse.json({
      success: true,
      url: fileUrl,
      filename: outputFilename,
      size: buffer.length,
      originalSize: file.size,
      compressed: buffer.length < file.size,
    });
  } catch (error: any) {
    console.error("POST /api/upload error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "فشل رفع الصورة" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const auth = await authorizeAdminRequest(request);
    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, error: auth.error || "غير مصرح" },
        { status: auth.status }
      );
    }

    const { searchParams } = new URL(request.url);
    const fileUrl = searchParams.get("url");

    if (!fileUrl || !fileUrl.startsWith("/uploads/")) {
      return NextResponse.json(
        { success: false, error: "رابط الصورة غير صالح للحذف" },
        { status: 400 }
      );
    }

    const filename = path.basename(fileUrl);
    const filepath = path.join(process.cwd(), "public", "uploads", filename);

    try {
      await unlink(filepath);
    } catch (e) {
      // File might not exist
    }

    return NextResponse.json({
      success: true,
      message: "تم حذف الصورة بنجاح",
    });
  } catch (error: any) {
    console.error("DELETE /api/upload error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "فشل حذف الصورة" },
      { status: 500 }
    );
  }
}
