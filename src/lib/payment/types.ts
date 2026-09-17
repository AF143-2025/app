export type PaymentMethod = "CARD" | "WALLET" | "LOCAL_GATEWAY" | "COD";

export type PaymentStatus = "Pending" | "Paid" | "Failed" | "Refunded";

export type OrderStatus =
  | "Pending"
  | "Confirmed"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Cancelled";

export interface CreateIntentParams {
  orderId: string;
  orderNumber: string;
  amount: number;
  currency: string;
  customerEmail: string;
  customerName: string;
  paymentMethod: PaymentMethod;
  metadata?: Record<string, string>;
}

export interface CreateIntentResult {
  transactionId: string;
  clientSecret: string;
  gatewayUrl?: string;
  gatewayReference: string;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod;
}

export interface WebhookEventPayload {
  event: "payment.succeeded" | "payment.failed" | "payment.refunded";
  transactionId: string;
  orderId: string;
  orderNumber: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  gatewayReference: string;
  cardBrand?: string; // Visa, Mada, MasterCard, Meeza, STCPay
  lastFourDigits?: string; // Never full PAN or CVV
  failureReason?: string;
  timestamp: number;
  signature?: string;
}

export interface VerifyWebhookResult {
  isValid: boolean;
  eventPayload?: WebhookEventPayload;
  error?: string;
}

export interface RefundParams {
  transactionId: string;
  orderId: string;
  amount: number;
  reason: string;
  adminUserId?: string;
}

export interface RefundResult {
  success: boolean;
  refundId: string;
  status: PaymentStatus;
  message: string;
}
