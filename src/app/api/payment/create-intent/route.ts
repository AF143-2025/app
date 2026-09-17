import { NextRequest, NextResponse } from "next/server";
import { createPaymentIntent } from "@/lib/payment/gateway-adapter";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, paymentMethod = "CARD" } = body;

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: "Order ID is required" },
        { status: 400 }
      );
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    const intent = await createPaymentIntent({
      orderId: order.id,
      orderNumber: order.orderNumber,
      amount: order.totalAmount,
      currency: "SAR",
      customerEmail: order.customerEmail,
      customerName: order.customerName,
      paymentMethod,
    });

    return NextResponse.json({ success: true, intent });
  } catch (error: any) {
    console.error("POST /api/payment/create-intent error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create payment intent" },
      { status: 500 }
    );
  }
}
