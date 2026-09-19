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

    const deals = await prisma.product.findMany({
      where: {
        OR: [
          { isDeal: true },
          { originalPrice: { not: null } },
        ],
      },
      include: {
        categoryRel: {
          select: { id: true, name: true },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    const formatted = deals.map((p) => {
      const orig = p.originalPrice || p.price;
      const discountAmount = orig > p.price ? orig - p.price : 0;
      const discountPercent = orig > 0 ? Math.round((discountAmount / orig) * 100) : 0;

      return {
        id: p.id,
        name: p.name,
        price: p.price,
        originalPrice: p.originalPrice,
        discountAmount,
        discountPercent,
        stock: p.stock,
        imageUrl: p.imageUrl,
        categoryName: p.categoryRel?.name || "بدون قسم",
        isActive: p.isActive,
        isDeal: p.isDeal,
      };
    });

    return NextResponse.json({ success: true, deals: formatted });
  } catch (error: any) {
    console.error("GET /api/admin/deals error:", error);
    return NextResponse.json(
      { success: false, error: "فشل جلب العروض" },
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
    const { productId, newPrice, originalPrice } = body;

    if (!productId || newPrice === undefined || originalPrice === undefined) {
      return NextResponse.json(
        { success: false, error: "معرف المنتج، السعر الجديد، والسعر السابق مطلوبة" },
        { status: 400 }
      );
    }

    const numNewPrice = parseFloat(newPrice);
    const numOrigPrice = parseFloat(originalPrice);

    if (numOrigPrice <= numNewPrice) {
      return NextResponse.json(
        { success: false, error: "يجب أن يكون السعر السابق أعلى من سعر العرض المخفض" },
        { status: 400 }
      );
    }

    const updated = await prisma.product.update({
      where: { id: productId },
      data: {
        price: numNewPrice,
        originalPrice: numOrigPrice,
        isDeal: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "تم تفعيل العرض على المنتج بنجاح",
      product: updated,
    });
  } catch (error: any) {
    console.error("POST /api/admin/deals error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "فشل تفعيل العرض" },
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
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json(
        { success: false, error: "معرف المنتج مطلوب" },
        { status: 400 }
      );
    }

    const updated = await prisma.product.update({
      where: { id: productId },
      data: {
        originalPrice: null,
        isDeal: false,
      },
    });

    return NextResponse.json({
      success: true,
      message: "تم إلغاء العرض وإعادة السعر السابق",
      product: updated,
    });
  } catch (error: any) {
    console.error("DELETE /api/admin/deals error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "فشل إلغاء العرض" },
      { status: 500 }
    );
  }
}
