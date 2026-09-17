export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME } from "@/lib/admin-auth";

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: "تم تسجيل خروج المدير بنجاح",
  });

  response.cookies.delete(ADMIN_COOKIE_NAME);
  return response;
}
