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

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const categoryId = searchParams.get("categoryId");
    const status = searchParams.get("status");
    const isActive = searchParams.get("isActive");
    const sort = searchParams.get("sort") || "newest";

    const where: any = {};

    if (categoryId && categoryId !== "all") {
      where.OR = [
        { categoryId: categoryId },
        { category: categoryId },
      ];
    }

    if (status && status !== "all") {
      where.availabilityStatus = status;
    }

    if (isActive !== null && isActive !== undefined && isActive !== "all") {
      where.isActive = isActive === "true";
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
    if (sort === "oldest") orderBy = { createdAt: "asc" };
    else if (sort === "price-asc") orderBy = { price: "asc" };
    else if (sort === "price-desc") orderBy = { price: "desc" };
    else if (sort === "stock-asc") orderBy = { stock: "asc" };
    else if (sort === "stock-desc") orderBy = { stock: "desc" };

    const products = await prisma.product.findMany({
      where,
      orderBy,
      include: {
        categoryRel: {
          select: { id: true, name: true, image: true },
        },
      },
    });

    return NextResponse.json({ success: true, products });
  } catch (error: any) {
    console.error("GET /api/admin/products error:", error);
    return NextResponse.json(
      { success: false, error: "فشل جلب المنتجات" },
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
      name,
      description = "",
      price,
      originalPrice,
      stock = 10,
      categoryId,
      imageUrl = "https://images.unsplash.com/photo-1511707171634-5f897ff02560?w=600",
      availabilityStatus = "AVAILABLE",
      specs,
      isActive = true,
    } = body;

    if (!name || price === undefined || price === null) {
      return NextResponse.json(
        { success: false, error: "اسم المنتج والسعر مطلوبان" },
        { status: 400 }
      );
    }

    // Find default or first seller profile
    let seller = await prisma.sellerProfile.findFirst();
    if (!seller) {
      let defaultUser = await prisma.user.findFirst({ where: { role: "ADMIN" } });
      if (!defaultUser) {
        defaultUser = await prisma.user.create({
          data: {
            email: "admin@store.com",
            name: "المدير العام",
            role: "ADMIN",
          },
        });
      }
      seller = await prisma.sellerProfile.create({
        data: {
          userId: defaultUser.id,
          storeName: "سما الخضراء للهواتف",
        },
      });
    }

    // Verify category exists if provided
    let validCatId = categoryId;
    let catSlug = categoryId || "phones";
    if (categoryId && categoryId !== "all") {
      const cat = await prisma.category.findUnique({ where: { id: categoryId } });
      if (cat) {
        validCatId = cat.id;
        catSlug = cat.id;
      } else {
        validCatId = null;
      }
    } else {
      validCatId = null;
    }

    const numPrice = parseFloat(price);
    const numOriginalPrice = originalPrice ? parseFloat(originalPrice) : null;
    const numStock = parseInt(stock, 10) || 0;
    const isDeal = numOriginalPrice !== null && numOriginalPrice > numPrice;

    const product = await prisma.product.create({
      data: {
        name: name.trim(),
        description: description.trim(),
        price: numPrice,
        originalPrice: numOriginalPrice,
        stock: numStock,
        category: catSlug,
        categoryId: validCatId,
        imageUrl: imageUrl.trim(),
        availabilityStatus: availabilityStatus,
        specs: typeof specs === "object" ? JSON.stringify(specs) : specs,
        isDeal: isDeal,
        isActive: isActive,
        sellerId: seller.id,
      },
      include: {
        categoryRel: {
          select: { id: true, name: true },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "تمت إضافة المنتج بنجاح",
      product,
    });
  } catch (error: any) {
    console.error("POST /api/admin/products error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "فشل إضافة المنتج" },
      { status: 500 }
    );
  }
}
