export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authorizeAdminRequest } from "@/lib/admin-auth";
import { logAuditEvent } from "@/lib/payment/audit-logger";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { createdAt: "asc" },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    return NextResponse.json({
      success: true,
      categories: categories.map((c) => ({
        id: c.id,
        name: c.name,
        image: c.image,
        productCount: c._count.products,
        createdAt: c.createdAt,
      })),
    });
  } catch (error: any) {
    console.error("GET /api/categories error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // 1. Backend Authorization Check
    const auth = await authorizeAdminRequest(request);
    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, error: auth.error || "غير مصرح للمستخدمين العاديين" },
        { status: auth.status }
      );
    }

    const body = await request.json();
    const { name, image, id } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { success: false, error: "اسم القسم مطلوب" },
        { status: 400 }
      );
    }

    const cleanName = name.trim();

    // Check if category name exists
    const existing = await prisma.category.findFirst({
      where: { name: cleanName },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: "يوجد قسم بنفس هذا الاسم بالفعل" },
        { status: 400 }
      );
    }

    // Auto-generate a clean ID if not supplied
    const catId =
      id && id.trim()
        ? id.trim().toLowerCase().replace(/\s+/g, "-")
        : `cat-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

    const category = await prisma.category.create({
      data: {
        id: catId,
        name: cleanName,
        image: image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600",
      },
    });

    await logAuditEvent({
      userId: auth.user.id,
      userEmail: auth.user.email,
      action: "CATEGORY_CREATED",
      entity: "Category",
      entityId: category.id,
      details: { name: category.name },
    });

    return NextResponse.json({
      success: true,
      message: "تم إنشاء القسم بنجاح",
      category,
    });
  } catch (error: any) {
    console.error("POST /api/categories error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "فشل إنشاء القسم" },
      { status: 500 }
    );
  }
}
