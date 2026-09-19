export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authorizeAdminRequest } from "@/lib/admin-auth";

export async function GET(
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

    const { id } = params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        categoryRel: true,
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
    console.error("GET /api/admin/products/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "فشل جلب المنتج" },
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

    const { id } = params;
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "المنتج غير موجود" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const updateData: any = {};

    if (body.name !== undefined) updateData.name = body.name.trim();
    if (body.description !== undefined) updateData.description = body.description.trim();
    if (body.price !== undefined) updateData.price = parseFloat(body.price);
    if (body.originalPrice !== undefined) {
      updateData.originalPrice = body.originalPrice === null || body.originalPrice === ""
        ? null
        : parseFloat(body.originalPrice);
    }
    if (body.stock !== undefined) updateData.stock = parseInt(body.stock, 10);
    if (body.imageUrl !== undefined) updateData.imageUrl = body.imageUrl.trim();
    if (body.availabilityStatus !== undefined) updateData.availabilityStatus = body.availabilityStatus;
    if (body.specs !== undefined) {
      updateData.specs = typeof body.specs === "object" ? JSON.stringify(body.specs) : body.specs;
    }
    if (body.isActive !== undefined) updateData.isActive = Boolean(body.isActive);
    if (body.order !== undefined) updateData.order = parseInt(body.order, 10);

    // Update category if provided
    if (body.categoryId !== undefined) {
      if (body.categoryId && body.categoryId !== "all") {
        const cat = await prisma.category.findUnique({ where: { id: body.categoryId } });
        if (cat) {
          updateData.categoryId = cat.id;
          updateData.category = cat.id;
        } else {
          updateData.categoryId = null;
        }
      } else {
        updateData.categoryId = null;
      }
    }

    // Auto-calculate isDeal
    const currentPrice = updateData.price !== undefined ? updateData.price : existing.price;
    const currentOrigPrice = updateData.originalPrice !== undefined ? updateData.originalPrice : existing.originalPrice;
    updateData.isDeal = currentOrigPrice !== null && currentOrigPrice > currentPrice;

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        categoryRel: {
          select: { id: true, name: true },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "تم تحديث المنتج بنجاح",
      product,
    });
  } catch (error: any) {
    console.error("PUT /api/admin/products/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "فشل تحديث المنتج" },
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

    const { id } = params;
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "المنتج غير موجود" },
        { status: 404 }
      );
    }

    await prisma.product.delete({ where: { id } });

    return NextResponse.json({
      success: true,
      message: "تم حذف المنتج بنجاح",
    });
  } catch (error: any) {
    console.error("DELETE /api/admin/products/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "فشل حذف المنتج" },
      { status: 500 }
    );
  }
}
