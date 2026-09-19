export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authorizeAdminRequest } from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
  try {
    const auth = await authorizeAdminRequest(request);
    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, error: auth.error || "غير مصرح" },
        { status: auth.status }
      );
    }

    const banners = await prisma.banner.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });

    return NextResponse.json({ success: true, banners });
  } catch (error: any) {
    console.error("GET /api/admin/banners error:", error);
    return NextResponse.json(
      { success: false, error: "فشل جلب البانرات" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await authorizeAdminRequest(request);
    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, error: auth.error || "غير مصرح" },
        { status: auth.status }
      );
    }

    const body = await request.json();
    const {
      title = "",
      tag = "",
      offerBadge = "",
      imageUrl,
      targetHref = "/category/all",
      order = 0,
      isActive = true,
    } = body;

    if (!imageUrl || !imageUrl.trim()) {
      return NextResponse.json(
        { success: false, error: "صورة البانر مطلوبة" },
        { status: 400 }
      );
    }

    const banner = await prisma.banner.create({
      data: {
        title: title.trim(),
        tag: tag.trim(),
        offerBadge: offerBadge.trim(),
        imageUrl: imageUrl.trim(),
        targetHref: targetHref.trim(),
        order: parseInt(order, 10) || 0,
        isActive: Boolean(isActive),
      },
    });

    return NextResponse.json({
      success: true,
      message: "تمت إضافة البانر بنجاح",
      banner,
    });
  } catch (error: any) {
    console.error("POST /api/admin/banners error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "فشل إضافة البانر" },
      { status: 500 }
    );
  }
}
