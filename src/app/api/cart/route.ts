import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || "demo-buyer-id";

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
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    const taxRate = 0.15; // 15% VAT
    const taxAmount = Math.round(subtotal * taxRate * 100) / 100;
    const shippingFee = subtotal > 200 || subtotal === 0 ? 0 : 25;
    const totalAmount = Math.round((subtotal + taxAmount + shippingFee) * 100) / 100;
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    return NextResponse.json({
      success: true,
      items: cartItems,
      summary: {
        totalItems,
        subtotal,
        taxAmount,
        shippingFee,
        totalAmount,
      },
    });
  } catch (error: any) {
    console.error("GET /api/cart error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch cart" },
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

    // Ensure user exists in database
    await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: {
        id: userId,
        email: `${userId}@store.local`,
        name: "عميل المتجر",
        role: "BUYER",
      },
    });

    // Verify product & stock
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product || !product.isActive) {
      return NextResponse.json(
        { success: false, error: "Product is not available" },
        { status: 404 }
      );
    }

    if (product.stock < quantity) {
      return NextResponse.json(
        { success: false, error: `Only ${product.stock} items in stock` },
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
            error: `Cannot add more. Stock limit reached (${product.stock})`,
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

    return NextResponse.json({ success: true, cartItem });
  } catch (error: any) {
    console.error("POST /api/cart error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to add to cart: " + (error.message || "") },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { cartItemId, quantity } = body;

    if (!cartItemId || quantity === undefined) {
      return NextResponse.json(
        { success: false, error: "Missing cartItemId or quantity" },
        { status: 400 }
      );
    }

    if (quantity <= 0) {
      await prisma.cartItem.delete({
        where: { id: cartItemId },
      });
      return NextResponse.json({ success: true, message: "Item removed from cart" });
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

    if (quantity > currentItem.product.stock) {
      return NextResponse.json(
        {
          success: false,
          error: `Max available stock is ${currentItem.product.stock}`,
        },
        { status: 400 }
      );
    }

    const updated = await prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
      include: { product: true },
    });

    return NextResponse.json({ success: true, cartItem: updated });
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
      return NextResponse.json({ success: true, message: "Cart cleared" });
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

    return NextResponse.json({ success: true, message: "Item deleted from cart" });
  } catch (error: any) {
    console.error("DELETE /api/cart error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete cart item" },
      { status: 500 }
    );
  }
}
