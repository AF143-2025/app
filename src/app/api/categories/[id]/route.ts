export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authorizeAdminRequest } from "@/lib/admin-auth";
import { logAuditEvent } from "@/lib/payment/audit-logger";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const category = await prisma.category.findUnique({
      where: { id: params.id },
      include: {
        products: {
          where: { isActive: true },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!category) {
      return NextResponse.json(
        { success: false, error: "القسم غير موجود" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      category,
    });
  } catch (error: any) {
    console.error("GET /api/categories/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch category" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await authorizeAdminRequest(request);
    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, error: auth.error || "غير مصرح" },
        { status: auth.status }
      );
    }

    const body = await request.json();
    const { name, image } = body;

    const data: any = {};
    if (name && name.trim()) data.name = name.trim();
    if (image !== undefined) data.image = image;

    const updated = await prisma.category.update({
      where: { id: params.id },
      data,
    });

    await logAuditEvent({
      userId: auth.user.id,
      userEmail: auth.user.email,
      action: "CATEGORY_UPDATED",
      entity: "Category",
      entityId: params.id,
      details: data,
    });

    return NextResponse.json({
      success: true,
      message: "تم تعديل القسم بنجاح",
      category: updated,
    });
  } catch (error: any) {
    console.error("PUT /api/categories/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "فشل تعديل القسم" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await authorizeAdminRequest(request);
    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, error: auth.error || "غير مصرح" },
        { status: auth.status }
      );
    }

    // Unlink products assigned to this category
    await prisma.product.updateMany({
      where: { categoryId: params.id },
      data: { categoryId: null },
    });

    // Delete the category
    await prisma.category.delete({
      where: { id: params.id },
    });

    await logAuditEvent({
      userId: auth.user.id,
      userEmail: auth.user.email,
      action: "CATEGORY_DELETED",
      entity: "Category",
      entityId: params.id,
      details: { categoryId: params.id },
    });

    return NextResponse.json({
      success: true,
      message: "تم حذف القسم بنجاح",
    });
  } catch (error: any) {
    console.error("DELETE /api/categories/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "فشل حذف القسم" },
      { status: 500 }
    );
  }
}
