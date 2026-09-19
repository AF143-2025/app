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

    const categories = await prisma.category.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    const formatted = categories.map((c) => ({
      id: c.id,
      name: c.name,
      image: c.image,
      icon: c.icon,
      order: c.order,
      isActive: c.isActive,
      productsCount: c._count.products,
      createdAt: c.createdAt,
    }));

    return NextResponse.json({ success: true, categories: formatted });
  } catch (error: any) {
    console.error("GET /api/admin/categories error:", error);
    return NextResponse.json(
      { success: false, error: "فشل جلب الأقسام" },
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
    const { name, image, icon, order = 0, isActive = true } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { success: false, error: "اسم القسم مطلوب" },
        { status: 400 }
      );
    }

    const cleanName = name.trim();

    // Check if category name exists
    const existing = await prisma.category.findUnique({
      where: { name: cleanName },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: "يوجد قسم بنفس هذا الاسم بالفعل" },
        { status: 400 }
      );
    }

    // Generate a clean ID slug
    const idSlug = `cat-${Date.now()}`;

    const category = await prisma.category.create({
      data: {
        id: idSlug,
        name: cleanName,
        image: image || "https://images.unsplash.com/photo-1511707171634-5f897ff02560?w=600",
        icon: icon || null,
        order: parseInt(order, 10) || 0,
        isActive: Boolean(isActive),
      },
    });

    return NextResponse.json({
      success: true,
      message: "تم إنشاء القسم بنجاح",
      category,
    });
  } catch (error: any) {
    console.error("POST /api/admin/categories error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "فشل إنشاء القسم" },
      { status: 500 }
    );
  }
}
