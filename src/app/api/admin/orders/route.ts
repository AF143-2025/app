export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authorizeAdminRequest } from "@/lib/admin-auth";
import { logAuditEvent } from "@/lib/payment/audit-logger";

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
    const status = searchParams.get("status");

    const where: any = {};
    if (status && status !== "all") {
      where.orderStatus = status;
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        items: true,
        transactions: true,
        invoice: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, orders });
  } catch (error: any) {
    console.error("GET /api/admin/orders error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const auth = await authorizeAdminRequest(request);
    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, error: auth.error || "غير مصرح" },
        { status: auth.status }
      );
    }

    const body = await request.json();
    const { orderId, orderStatus, paymentStatus } = body;

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: "orderId is required" },
        { status: 400 }
      );
    }

    const data: any = {};
    if (orderStatus) data.orderStatus = orderStatus;
    if (paymentStatus) data.paymentStatus = paymentStatus;

    const updated = await prisma.order.update({
      where: { id: orderId },
      data,
    });

    await logAuditEvent({
      userId: auth.user.id,
      userEmail: auth.user.email,
      action: "ADMIN_ORDER_STATUS_UPDATE",
      entity: "Order",
      entityId: orderId,
      details: data,
    });

    return NextResponse.json({ success: true, order: updated });
  } catch (error: any) {
    console.error("PUT /api/admin/orders error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update order" },
      { status: 500 }
    );
  }
}

