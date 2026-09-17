import { NextRequest, NextResponse } from "next/server";
import { signWebhookPayload } from "@/lib/payment/gateway-adapter";
import { prisma } from "@/lib/prisma";
import { authorizeAdminRequest } from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  try {
    // In production, require admin authorization to simulate payments
    if (process.env.NODE_ENV === "production") {
      const auth = await authorizeAdminRequest(request);
      if (!auth.authorized) {
        return NextResponse.json(
          { success: false, error: "محظور في بيئة الإنتاج إلا للمدير العام" },
          { status: 403 }
        );
      }
    }

    const body = await request.json();
    const {
      transactionId,
      orderId,
      status = "Paid", // or "Failed"
      cardBrand = "Visa",
      lastFourDigits = "4242",
      failureReason,
    } = body;

    const transaction = await prisma.paymentTransaction.findUnique({
      where: { transactionId },
      include: { order: true },
    });

    if (!transaction) {
      return NextResponse.json(
        { success: false, error: "Transaction not found" },
        { status: 404 }
      );
    }

    // Prepare Webhook Event Payload as the official Payment Gateway would emit
    const payload = {
      event: status === "Paid" ? "payment.succeeded" : "payment.failed",
      transactionId: transaction.transactionId,
      orderId: transaction.orderId,
      orderNumber: transaction.order.orderNumber,
      amount: transaction.amount,
      currency: transaction.currency,
      status: status,
      gatewayReference: transaction.gatewayReference || "GW-SIMULATED",
      cardBrand,
      lastFourDigits,
      failureReason: status === "Failed" ? (failureReason || "Declined by bank") : undefined,
      timestamp: Date.now(),
    };

    // Sign payload with HMAC SHA-256 using the gateway secret
    const signature = signWebhookPayload(payload);

    // Call our server webhook endpoint securely
    const host = request.headers.get("host") || "localhost:3000";
    const protocol = request.headers.get("x-forwarded-proto") || "http";
    const webhookUrl = `${protocol}://${host}/api/payment/webhook`;

    const webhookResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-webhook-signature": signature,
      },
      body: JSON.stringify(payload),
    });

    const webhookResult = await webhookResponse.json();

    return NextResponse.json({
      success: true,
      simulatedGatewayResponse: {
        payload,
        signature,
        webhookResult,
      },
    });
  } catch (error: any) {
    console.error("Simulation error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Simulation failed" },
      { status: 500 }
    );
  }
}
