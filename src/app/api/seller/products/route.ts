export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sellerId = searchParams.get("sellerId") || "demo-seller-profile-id";

    const products = await prisma.product.findMany({
      where: { sellerId },
      orderBy: { createdAt: "desc" },
    });

    const totalProducts = products.length;
    const totalStock = products.reduce((sum, p) => sum + p.stock, 0);

    return NextResponse.json({
      success: true,
      products,
      stats: {
        totalProducts,
        totalStock,
      },
    });
  } catch (error: any) {
    console.error("GET /api/seller/products error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch seller products" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      description,
      price,
      originalPrice,
      stock,
      category,
      imageUrl,
      sellerId = "demo-seller-profile-id",
    } = body;

    if (!name || !price || !category) {
      return NextResponse.json(
        { success: false, error: "Name, price, and category are required" },
        { status: 400 }
      );
    }

    let finalSellerId = sellerId;
    const existingSeller = await prisma.sellerProfile.findUnique({
      where: { id: finalSellerId },
    });
    if (!existingSeller) {
      const defaultSeller = await prisma.sellerProfile.findFirst();
      if (defaultSeller) {
        finalSellerId = defaultSeller.id;
      } else {
        return NextResponse.json(
          { success: false, error: "No seller profile found" },
          { status: 400 }
        );
      }
    }

    const product = await prisma.product.create({
      data: {
        name,
        description: description || "",
        price: parseFloat(price),
        originalPrice: originalPrice ? parseFloat(originalPrice) : null,
        stock: parseInt(stock || "10", 10),
        category,
        imageUrl:
          imageUrl ||
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600",
        sellerId: finalSellerId,
      },
    });

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    console.error("POST /api/seller/products error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create product" },
      { status: 500 }
    );
  }
}

