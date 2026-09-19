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

    const [
      totalProducts,
      totalCategories,
      products,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.category.count(),
      prisma.product.findMany({
        select: {
          id: true,
          name: true,
          price: true,
          originalPrice: true,
          stock: true,
          availabilityStatus: true,
          isActive: true,
          categoryRel: {
            select: { name: true },
          },
        },
      }),
    ]);

    let availableCount = 0;
    let outOfStockCount = 0;
    let limitedStockCount = 0;
    let discountedCount = 0;
    const lowStockItems: any[] = [];

    for (const p of products) {
      const isOut = p.stock <= 0 || p.availabilityStatus === "OUT_OF_STOCK";
      const isLimited = (p.stock > 0 && p.stock <= 5) || p.availabilityStatus === "LIMITED";
      const isAvailable = p.stock > 0 && p.availabilityStatus !== "OUT_OF_STOCK" && p.availabilityStatus !== "COMING_SOON";
      const isDiscounted = p.originalPrice !== null && p.originalPrice > p.price;

      if (isOut) outOfStockCount++;
      if (isLimited) {
        limitedStockCount++;
        lowStockItems.push({
          id: p.id,
          name: p.name,
          stock: p.stock,
          price: p.price,
          categoryName: p.categoryRel?.name || "بدون قسم",
          status: "LIMITED",
        });
      }
      if (isAvailable) availableCount++;
      if (isDiscounted) discountedCount++;

      if (isOut && lowStockItems.length < 15) {
        lowStockItems.push({
          id: p.id,
          name: p.name,
          stock: p.stock,
          price: p.price,
          categoryName: p.categoryRel?.name || "بدون قسم",
          status: "OUT_OF_STOCK",
        });
      }
    }

    return NextResponse.json({
      success: true,
      stats: {
        totalProducts,
        totalCategories,
        availableProducts: availableCount,
        outOfStockProducts: outOfStockCount,
        limitedStockProducts: limitedStockCount,
        discountedProducts: discountedCount,
      },
      lowStockItems: lowStockItems.slice(0, 10),
    });
  } catch (error: any) {
    console.error("GET /api/admin/stats error:", error);
    return NextResponse.json(
      { success: false, error: "فشل جلب الإحصائيات" },
      { status: 500 }
    );
  }
}
