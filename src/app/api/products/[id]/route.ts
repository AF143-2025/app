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
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: {
        categoryRel: true,
        seller: {
          select: {
            id: true,
            storeName: true,
            rating: true,
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: "المنتج غير موجود" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch product" },
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
    const data: any = {};

    if (body.name !== undefined) data.name = body.name.trim();
    if (body.description !== undefined) data.description = body.description.trim();
    if (body.price !== undefined) data.price = parseFloat(body.price);
    if (body.originalPrice !== undefined) {
      data.originalPrice = body.originalPrice ? parseFloat(body.originalPrice) : null;
    }
    if (body.stock !== undefined) data.stock = parseInt(body.stock, 10);
    if (body.imageUrl !== undefined) data.imageUrl = body.imageUrl;
    if (body.isActive !== undefined) data.isActive = body.isActive;

    if (body.categoryId !== undefined) {
      data.categoryId = body.categoryId;
      data.category = body.categoryId;
    } else if (body.category !== undefined) {
      data.categoryId = body.category;
      data.category = body.category;
    }

    const product = await prisma.product.update({
      where: { id: params.id },
      data,
      include: {
        categoryRel: true,
      },
    });

    await logAuditEvent({
      userId: auth.user.id,
      userEmail: auth.user.email,
      action: "PRODUCT_UPDATED",
      entity: "Product",
      entityId: params.id,
      details: data,
    });

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    console.error("PUT /api/products/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update product" },
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

    await prisma.product.delete({
      where: { id: params.id },
    });

    await logAuditEvent({
      userId: auth.user.id,
      userEmail: auth.user.email,
      action: "PRODUCT_DELETED",
      entity: "Product",
      entityId: params.id,
      details: { productId: params.id },
    });

    return NextResponse.json({ success: true, message: "تم حذف المنتج بنجاح" });
  } catch (error: any) {
    console.error("DELETE /api/products/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete product" },
      { status: 500 }
    );
  }
}
