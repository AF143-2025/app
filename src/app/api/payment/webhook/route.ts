import { NextRequest, NextResponse } from "next/server";
import {
  processWebhookEvent,
  verifyWebhookSignature,
} from "@/lib/payment/gateway-adapter";
import { WebhookEventPayload } from "@/lib/payment/types";
import { logAuditEvent } from "@/lib/payment/audit-logger";

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature =
      request.headers.get("x-webhook-signature") ||
      request.headers.get("signature") ||
      "";

    // 1. Strict Cryptographic HMAC SHA-256 Verification
    const isValid = verifyWebhookSignature(rawBody, signature);

    if (!isValid) {
      await logAuditEvent({
        action: "SECURITY_WEBHOOK_INVALID_SIGNATURE",
        entity: "Security",
        entityId: "webhook_tamper_attempt",
        details: { signatureProvided: signature ? "yes" : "none" },
        ipAddress: request.headers.get("x-forwarded-for") || "unknown",
      });

      return NextResponse.json(
        { success: false, error: "Invalid cryptographic signature" },
        { status: 401 }
      );
    }

    // 2. Parse payload safely
    const payload: WebhookEventPayload = JSON.parse(rawBody);

    // 3. Process event on server
    const result = await processWebhookEvent(payload);

    return NextResponse.json({
      received: true,
      success: result.success,
      message: result.message,
    });
  } catch (error: any) {
    console.error("POST /api/payment/webhook error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Webhook processing failed" },
      { status: 500 }
    );
  }
}
