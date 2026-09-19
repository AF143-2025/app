export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authorizeAdminRequest } from "@/lib/admin-auth";
import { logAuditEvent } from "@/lib/payment/audit-logger";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const categoryId = searchParams.get("categoryId");
    const search = searchParams.get("search");
    const brand = searchParams.get("brand");
    const sort = searchParams.get("sort");
    const sellerId = searchParams.get("sellerId");
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!, 10) : undefined;
    const all = searchParams.get("all") === "true";

    const where: any = {};
    if (!all) {
      where.isActive = true;
    }

    const targetCategory = categoryId || category;

    if (targetCategory && targetCategory !== "all") {
      if (targetCategory === "used") {
        where.OR = [
          { categoryId: "used" },
          { category: "used" },
          { name: { contains: "مستعمل" } },
        ];
      } else {
        // Check if it matches categoryId or legacy category string
        where.OR = [
          { categoryId: targetCategory },
          { category: targetCategory },
        ];
      }
    }

    if (sellerId) {
      where.sellerId = sellerId;
    }

    if (search) {
      const searchCondition = [
        { name: { contains: search } },
        { description: { contains: search } },
      ];
      if (where.OR) {
        where.AND = [{ OR: where.OR }, { OR: searchCondition }];
        delete where.OR;
      } else {
        where.OR = searchCondition;
      }
    }

    let orderBy: any = { createdAt: "desc" };
    if (sort === "price-asc") orderBy = { price: "asc" };
    else if (sort === "price-desc") orderBy = { price: "desc" };
    else if (sort === "rating") orderBy = { rating: "desc" };
    else if (sort === "popular") orderBy = { reviewsCount: "desc" };

    const products = await prisma.product.findMany({
      where,
      orderBy,
      take: limit,
      include: {
        categoryRel: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        seller: {
          select: {
            id: true,
            storeName: true,
            rating: true,
          },
        },
      },
    });

    return NextResponse.json(
      { success: true, products },
      {
        headers: {
          "Cache-Control": "public, s-maxage=30, stale-while-revalidate=120",
        },
      }
    );
  } catch (error: any) {
    console.error("GET /api/products error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // 1. Strict Backend Authorization Check
    const auth = await authorizeAdminRequest(request);
    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, error: auth.error || "غير مصرح: يتطلب صلاحيات المدير العام" },
        { status: auth.status }
      );
    }

    const body = await request.json();
    const {
      name,
      description,
      price,
      originalPrice,
      stock,
      categoryId,
      category,
      imageUrl,
      sellerId,
    } = body;

    if (!name || price === undefined || (!categoryId && !category)) {
      return NextResponse.json(
        { success: false, error: "يرجى ملء اسم المنتج، السعر، والقسم" },
        { status: 400 }
      );
    }

    // Resolve categoryId and legacy category string
    let resolvedCatId = categoryId || category;
    let resolvedCategory = category || "phones";

    if (resolvedCatId) {
      const cat = await prisma.category.findUnique({
        where: { id: resolvedCatId },
      });
      if (cat) {
        resolvedCategory = cat.id;
      }
    }

    // Find default seller if not provided
    let finalSellerId = sellerId;
    if (!finalSellerId) {
      const defaultSeller = await prisma.sellerProfile.findFirst();
      if (defaultSeller) {
        finalSellerId = defaultSeller.id;
      } else {
        const createdSeller = await prisma.sellerProfile.create({
          data: {
            userId: auth.user.id,
            storeName: "سما الخضراء للهواتف",
            description: "المتجر الرسمي",
          },
        });
        finalSellerId = createdSeller.id;
      }
    }

    const product = await prisma.product.create({
      data: {
        name: name.trim(),
        description: description ? description.trim() : "",
        price: parseFloat(price),
        originalPrice: originalPrice ? parseFloat(originalPrice) : null,
        stock: parseInt(stock || "10", 10),
        categoryId: resolvedCatId,
        category: resolvedCategory,
        imageUrl: imageUrl || "https://images.unsplash.com/photo-1511707171634-5f897ff02560?w=600",
        sellerId: finalSellerId,
      },
      include: {
        categoryRel: true,
      },
    });

    await logAuditEvent({
      userId: auth.user.id,
      userEmail: auth.user.email,
      action: "PRODUCT_CREATED",
      entity: "Product",
      entityId: product.id,
      details: { name: product.name, price: product.price, categoryId: product.categoryId },
    });

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    console.error("POST /api/products error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "فشل إضافة المنتج" },
      { status: 500 }
    );
  }
}
