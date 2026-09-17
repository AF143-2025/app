export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from "next/server";
import { authorizeAdminRequest } from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
  const auth = await authorizeAdminRequest(request);

  if (!auth.authorized) {
    return NextResponse.json(
      { success: false, error: auth.error || "غير مصرح" },
      { status: auth.status }
    );
  }

  return NextResponse.json({
    success: true,
    user: auth.user,
  });
}
