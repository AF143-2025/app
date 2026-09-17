import crypto from "crypto";
import { prisma } from "../prisma";
import { logAuditEvent } from "./audit-logger";
import {
  CreateIntentParams,
  CreateIntentResult,
  PaymentStatus,
  RefundParams,
  RefundResult,
  WebhookEventPayload,
} from "./types";

const WEBHOOK_SECRET =
  process.env.PAYMENT_WEBHOOK_SECRET || "whsec_cool_nobel_super_secure_hmac_secret_2026";

/**
 * Generate HMAC SHA-256 signature for webhook payload
 */
export function signWebhookPayload(payload: object, secret = WEBHOOK_SECRET): string {
  const serialized = JSON.stringify(payload);
  return crypto.createHmac("sha256", secret).update(serialized).digest("hex");
}

/**
 * Verify Webhook Signature securely against timing attacks
 */
export function verifyWebhookSignature(
  rawBody: string,
  providedSignature: string,
  secret = WEBHOOK_SECRET
): boolean {
  if (!providedSignature) return false;
  try {
    const computedSignature = crypto
      .createHmac("sha256", secret)
      .update(rawBody)
      .digest("hex");

    return crypto.timingSafeEqual(
      Buffer.from(computedSignature, "utf-8"),
      Buffer.from(providedSignature, "utf-8")
    );
  } catch (err) {
    return false;
  }
}

/**
 * Create Payment Intent with official gateway simulation
 */
export async function createPaymentIntent(
  params: CreateIntentParams
): Promise<CreateIntentResult> {
  const transactionId = `txn_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;
  const gatewayRef = `GW-${Math.floor(10000000 + Math.random() * 90000000)}`;

  // If COD, initial payment status is Pending until delivery
  const isCOD = params.paymentMethod === "COD";

  // Create or link transaction in DB
  await prisma.paymentTransaction.create({
    data: {
      orderId: params.orderId,
      transactionId,
      provider: isCOD ? "CASH_ON_DELIVERY" : "OFFICIAL_GATEWAY_ADAPTER",
      amount: params.amount,
      currency: params.currency,
      status: "Pending",
      gatewayReference: gatewayRef,
      idempotencyKey: `idemp_${params.orderId}_${transactionId}`,
    },
  });

  await logAuditEvent({
    action: "PAYMENT_INTENT_CREATED",
    entity: "PaymentTransaction",
    entityId: transactionId,
    details: {
      orderId: params.orderId,
      amount: params.amount,
      method: params.paymentMethod,
      gatewayReference: gatewayRef,
    },
  });

  return {
    transactionId,
    clientSecret: `sec_${crypto.randomBytes(16).toString("hex")}`,
    gatewayReference: gatewayRef,
    amount: params.amount,
    currency: params.currency,
    paymentMethod: params.paymentMethod,
  };
}

/**
 * Process verified Webhook Event from Gateway
 * This runs ONLY on the server after HMAC verification
 */
export async function processWebhookEvent(
  payload: WebhookEventPayload
): Promise<{ success: boolean; message: string }> {
  const { transactionId, orderId, status, cardBrand, lastFourDigits, failureReason } = payload;

  const transaction = await prisma.paymentTransaction.findUnique({
    where: { transactionId },
    include: { order: true },
  });

  if (!transaction) {
    throw new Error(`Transaction ${transactionId} not found`);
  }

  // Idempotency check: Don't re-process already finished transactions
  if (transaction.status === "Paid" && status === "Paid") {
    return { success: true, message: "Transaction already processed as Paid" };
  }

  if (status === "Paid") {
    // 1. Update Payment Transaction
    await prisma.paymentTransaction.update({
      where: { transactionId },
      data: {
        status: "Paid",
        cardBrand: cardBrand || "CARD",
        lastFourDigits: lastFourDigits || "4242",
        rawResponse: JSON.stringify(payload),
      },
    });

    // 2. Update Order
    await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: "Paid",
        orderStatus: "Confirmed", // Automatically confirm order on paid
      },
    });

    // 3. Generate Official Invoice
    const invoiceNumber = `INV-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    const qrData = `E-INVOICE:${invoiceNumber}|TOTAL:${transaction.amount}SAR|DATE:${new Date().toISOString()}|ORDER:${transaction.order.orderNumber}`;

    await prisma.invoice.upsert({
      where: { orderId },
      create: {
        invoiceNumber,
        orderId,
        customerName: transaction.order.customerName,
        customerEmail: transaction.order.customerEmail,
        subtotal: transaction.order.subtotal,
        taxAmount: transaction.order.taxAmount,
        shippingFee: transaction.order.shippingFee,
        totalAmount: transaction.order.totalAmount,
        paymentMethod: transaction.order.paymentMethod,
        paymentStatus: "Paid",
        issuedAt: new Date(),
        qrCodeData: qrData,
      },
      update: {
        paymentStatus: "Paid",
      },
    });

    // 4. Audit Log
    await logAuditEvent({
      userId: transaction.order.userId,
      userEmail: transaction.order.customerEmail,
      action: "PAYMENT_SUCCESS_VERIFIED",
      entity: "Order",
      entityId: orderId,
      details: {
        transactionId,
        invoiceNumber,
        amount: transaction.amount,
        cardBrand,
        lastFourDigits,
      },
    });

    return { success: true, message: "Payment verified and order confirmed successfully" };
  } else if (status === "Failed") {
    await prisma.paymentTransaction.update({
      where: { transactionId },
      data: {
        status: "Failed",
        failureReason: failureReason || "Card declined or payment cancelled by user",
        rawResponse: JSON.stringify(payload),
      },
    });

    await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: "Failed",
      },
    });

    await logAuditEvent({
      userId: transaction.order.userId,
      userEmail: transaction.order.customerEmail,
      action: "PAYMENT_FAILED",
      entity: "Order",
      entityId: orderId,
      details: {
        transactionId,
        reason: failureReason,
      },
    });

    return { success: true, message: "Payment recorded as Failed" };
  }

  return { success: false, message: `Unhandled status: ${status}` };
}

/**
 * Process Official Refund
 */
export async function processRefund(params: RefundParams): Promise<RefundResult> {
  const { transactionId, orderId, amount, reason, adminUserId } = params;

  const transaction = await prisma.paymentTransaction.findUnique({
    where: { transactionId },
    include: { order: true },
  });

  if (!transaction) {
    throw new Error("Transaction not found");
  }

  if (transaction.status !== "Paid") {
    throw new Error("Cannot refund an unpaid transaction");
  }

  const refundId = `ref_${Date.now()}_${crypto.randomBytes(3).toString("hex")}`;

  // Update transaction and order
  await prisma.paymentTransaction.update({
    where: { transactionId },
    data: {
      status: "Refunded",
      rawResponse: JSON.stringify({ refundId, amount, reason, refundedAt: new Date() }),
    },
  });

  await prisma.order.update({
    where: { id: orderId },
    data: {
      paymentStatus: "Refunded",
      orderStatus: "Cancelled",
    },
  });

  // Update invoice if exists
  await prisma.invoice.updateMany({
    where: { orderId },
    data: {
      paymentStatus: "Refunded",
    },
  });

  await logAuditEvent({
    userId: adminUserId,
    action: "REFUND_ISSUED",
    entity: "PaymentTransaction",
    entityId: transactionId,
    details: {
      orderId,
      refundId,
      amount,
      reason,
    },
  });

  return {
    success: true,
    refundId,
    status: "Refunded",
    message: "Refund processed successfully and order status updated",
  };
}
