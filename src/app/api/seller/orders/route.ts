export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logAuditEvent } from "@/lib/payment/audit-logger";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sellerId = searchParams.get("sellerId") || "demo-seller-profile-id";

    // Find all order items sold by this seller
    const orderItems = await prisma.orderItem.findMany({
      where: { sellerId },
      include: {
        order: true,
        product: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const totalRevenue = orderItems.reduce(
      (sum, item) => (item.order.paymentStatus === "Paid" ? sum + item.total : sum),
      0
    );
    const totalUnitsSold = orderItems.reduce(
      (sum, item) => (item.order.paymentStatus === "Paid" ? sum + item.quantity : sum),
      0
    );

    return NextResponse.json({
      success: true,
      orderItems,
      stats: {
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        totalUnitsSold,
        totalOrdersCount: new Set(orderItems.map((i) => i.orderId)).size,
      },
    });
  } catch (error: any) {
    console.error("GET /api/seller/orders error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch seller orders" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, orderStatus } = body;

    if (!orderId || !orderStatus) {
      return NextResponse.json(
        { success: false, error: "orderId and orderStatus are required" },
        { status: 400 }
      );
    }

    const updated = await prisma.order.update({
      where: { id: orderId },
      data: { orderStatus },
    });

    await logAuditEvent({
      action: "ORDER_STATUS_UPDATED_BY_SELLER",
      entity: "Order",
      entityId: orderId,
      details: { newStatus: orderStatus },
    });

    return NextResponse.json({ success: true, order: updated });
  } catch (error: any) {
    console.error("PUT /api/seller/orders error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update order status" },
      { status: 500 }
    );
  }
}

