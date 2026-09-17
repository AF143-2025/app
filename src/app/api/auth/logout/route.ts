export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from "next/server";
import { logAuditEvent } from "@/lib/payment/audit-logger";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { userId, userEmail } = body;

    if (userId) {
      await logAuditEvent({
        userId,
        userEmail: userEmail || "unknown",
        action: "USER_LOGOUT",
        entity: "User",
        entityId: userId,
        details: { logoutTime: new Date().toISOString() },
      });
    }

    return NextResponse.json({
      success: true,
      message: "تم تسجيل الخروج بنجاح",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "Failed to logout" },
      { status: 500 }
    );
  }
}
