import { NextRequest, NextResponse } from "next/server";
import { processRefund } from "@/lib/payment/gateway-adapter";
import { authorizeAdminRequest } from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  try {
    const auth = await authorizeAdminRequest(request);
    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, error: auth.error || "غير مصرح: استرجاع الأموال يتطلب صلاحيات المدير العام" },
        { status: auth.status }
      );
    }

    const body = await request.json();
    const { transactionId, orderId, amount, reason } = body;

    if (!transactionId || !orderId) {
      return NextResponse.json(
        { success: false, error: "transactionId and orderId are required" },
        { status: 400 }
      );
    }

    const result = await processRefund({
      transactionId,
      orderId,
      amount: parseFloat(amount || "0"),
      reason: reason || "Customer requested refund",
      adminUserId: auth.user.id,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("POST /api/payment/refund error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Refund failed" },
      { status: 500 }
    );
  }
}
