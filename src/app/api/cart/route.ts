import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

async function getCartResponse(userId: string) {
  const cartItems = await prisma.cartItem.findMany({
    where: { userId },
    include: {
      product: {
        include: {
          seller: {
            select: {
              storeName: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity,
    0
  );
  const taxAmount = 0;
  const shippingFee = 0; // Free delivery across all governorates
  const totalAmount = subtotal;
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return {
    items: cartItems,
    summary: {
      totalItems,
      subtotal,
      taxAmount,
      shippingFee,
      totalAmount,
    },
  };
}

async function ensureUserExists(userId: string) {
  try {
    const existing = await prisma.user.findUnique({ where: { id: userId } });
    if (!existing) {
      const email = `${userId.replace(/[^a-zA-Z0-9_-]/g, "")}_${Date.now()}@store.local`;
      await prisma.user.create({
        data: {
          id: userId,
          email,
          name: "عميل المتجر",
          role: "BUYER",
        },
      });
    }
  } catch (err) {
    console.warn("[Cart API] ensureUserExists notice:", err);
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || "demo-buyer-id";

    const cartData = await getCartResponse(userId);

    return NextResponse.json({
      success: true,
      ...cartData,
    });
  } catch (error: any) {
    console.error("GET /api/cart error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch cart", items: [], summary: { totalItems: 0, subtotal: 0, taxAmount: 0, shippingFee: 0, totalAmount: 0 } },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId = "demo-buyer-id", productId, quantity = 1 } = body;

    if (!productId) {
      return NextResponse.json(
        { success: false, error: "Product ID is required" },
        { status: 400 }
      );
    }

    // Ensure user exists in database safely
    await ensureUserExists(userId);

    // Verify product & stock
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product || !product.isActive) {
      return NextResponse.json(
        { success: false, error: "المنتج غير متوفر حالياً" },
        { status: 404 }
      );
    }

    if (product.stock < quantity) {
      return NextResponse.json(
        { success: false, error: `الكمية المتاحة في المخزون: ${product.stock} فقط` },
        { status: 400 }
      );
    }

    // Check if item already in cart
    const existingCartItem = await prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    let cartItem;
    if (existingCartItem) {
      const newQuantity = existingCartItem.quantity + quantity;
      if (newQuantity > product.stock) {
        return NextResponse.json(
          {
            success: false,
            error: `الحد الأقصى للطلب هو الكمية المتوفرة بالمخزون (${product.stock})`,
          },
          { status: 400 }
        );
      }

      cartItem = await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: newQuantity },
        include: { product: true },
      });
    } else {
      cartItem = await prisma.cartItem.create({
        data: {
          userId,
          productId,
          quantity,
        },
        include: { product: true },
      });
    }

    const cartData = await getCartResponse(userId);

    return NextResponse.json({
      success: true,
      cartItem,
      ...cartData,
    });
  } catch (error: any) {
    console.error("POST /api/cart error:", error);
    return NextResponse.json(
      { success: false, error: "تعذر إضافة المنتج للسلة: " + (error.message || "") },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { cartItemId, quantity, userId } = body;

    if (!cartItemId || quantity === undefined) {
      return NextResponse.json(
        { success: false, error: "Missing cartItemId or quantity" },
        { status: 400 }
      );
    }

    const currentItem = await prisma.cartItem.findUnique({
      where: { id: cartItemId },
      include: { product: true },
    });

    if (!currentItem) {
      return NextResponse.json(
        { success: false, error: "Cart item not found" },
        { status: 404 }
      );
    }

    const targetUserId = userId || currentItem.userId;

    if (quantity <= 0) {
      await prisma.cartItem.delete({
        where: { id: cartItemId },
      });
      const cartData = await getCartResponse(targetUserId);
      return NextResponse.json({ success: true, message: "Item removed from cart", ...cartData });
    }

    if (quantity > currentItem.product.stock) {
      return NextResponse.json(
        {
          success: false,
          error: `الكمية المتوفرة بالمخزون: ${currentItem.product.stock}`,
        },
        { status: 400 }
      );
    }

    const updated = await prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
      include: { product: true },
    });

    const cartData = await getCartResponse(targetUserId);

    return NextResponse.json({ success: true, cartItem: updated, ...cartData });
  } catch (error: any) {
    console.error("PUT /api/cart error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update cart item" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const cartItemId = searchParams.get("cartItemId");
    const userId = searchParams.get("userId") || "demo-buyer-id";
    const clearAll = searchParams.get("clearAll");

    if (clearAll === "true") {
      await prisma.cartItem.deleteMany({
        where: { userId },
      });
      const cartData = await getCartResponse(userId);
      return NextResponse.json({ success: true, message: "Cart cleared", ...cartData });
    }

    if (!cartItemId) {
      return NextResponse.json(
        { success: false, error: "cartItemId is required" },
        { status: 400 }
      );
    }

    await prisma.cartItem.delete({
      where: { id: cartItemId },
    });

    const cartData = await getCartResponse(userId);

    return NextResponse.json({ success: true, message: "Item deleted from cart", ...cartData });
  } catch (error: any) {
    console.error("DELETE /api/cart error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete cart item" },
      { status: 500 }
    );
  }
}
