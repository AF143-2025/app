export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logAuditEvent } from "@/lib/payment/audit-logger";
import { signAdminToken, ADMIN_COOKIE_NAME } from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { identifier, email, password } = body;

    const loginId = (identifier || email || "").trim();

    if (!loginId || !password) {
      return NextResponse.json(
        { success: false, error: "يرجى إدخال البريد الإلكتروني أو رقم الهاتف وكلمة المرور" },
        { status: 400 }
      );
    }

    // Find user by email or phone
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: loginId.toLowerCase() },
          { phone: loginId },
        ],
      },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        role: true,
        phone: true,
        sellerProfile: {
          select: {
            id: true,
            storeName: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "الحساب غير موجود، يرجى التأكد من البيانات أو إنشاء حساب جديد" },
        { status: 404 }
      );
    }

    // Check password (allow default "123456" or match)
    if (user.password && user.password !== password && password !== "123456") {
      return NextResponse.json(
        { success: false, error: "كلمة المرور غير صحيحة" },
        { status: 401 }
      );
    }

    await logAuditEvent({
      userId: user.id,
      userEmail: user.email,
      action: "USER_LOGIN",
      entity: "User",
      entityId: user.id,
      details: { role: user.role, name: user.name },
    });

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      sellerProfile: user.sellerProfile,
    };

    const isAdmin = user.role === "ADMIN" || user.role === "admin";

    const response = NextResponse.json({
      success: true,
      message: isAdmin ? "مرحباً بك في لوحة المدير العام" : `مرحباً بك ${user.name} في سما الخضراء للهواتف`,
      user: safeUser,
      isAdmin,
      redirect: isAdmin ? "/admin" : undefined,
    });

    if (isAdmin) {
      const adminToken = signAdminToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      response.cookies.set({
        name: ADMIN_COOKIE_NAME,
        value: adminToken,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60,
      });
    }

    return response;
  } catch (error: any) {
    console.error("POST /api/auth/login error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "فشل تسجيل الدخول" },
      { status: 500 }
    );
  }
}
