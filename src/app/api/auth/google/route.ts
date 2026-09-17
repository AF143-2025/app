export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logAuditEvent } from "@/lib/payment/audit-logger";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, avatar, googleId } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, error: "البريد الإلكتروني لحساب Google مطلوب" },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const displayName = name && name.trim() ? name.trim() : cleanEmail.split("@")[0];

    // Find user or create if new
    let user = await prisma.user.findUnique({
      where: { email: cleanEmail },
      select: {
        id: true,
        name: true,
        email: true,
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

    let isNewUser = false;

    if (!user) {
      // Auto-assign ADMIN role strictly if email exactly matches ADMIN_MASTER_EMAIL, otherwise BUYER
      const masterAdminEmail = (process.env.ADMIN_MASTER_EMAIL || "admin@store.com").toLowerCase();
      const role = cleanEmail === masterAdminEmail ? "ADMIN" : "BUYER";

      const created = await prisma.user.create({
        data: {
          email: cleanEmail,
          name: displayName,
          password: "google_oauth_auth_token",
          role,
        },
        select: {
          id: true,
          name: true,
          email: true,
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

      user = created;
      isNewUser = true;
    }

    await logAuditEvent({
      userId: user.id,
      userEmail: user.email,
      action: isNewUser ? "GOOGLE_REGISTER" : "GOOGLE_LOGIN",
      entity: "User",
      entityId: user.id,
      details: {
        method: "google_oauth",
        displayName,
        googleId: googleId || "google_account",
      },
    });

    return NextResponse.json({
      success: true,
      message: isNewUser
        ? `أهلاً بك ${user.name}، تم إنشاء حسابك الجديد عبر Google بنجاح`
        : `مرحباً بك مجدداً ${user.name}، تم تسجيل دخولك عبر Google بنجاح`,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        sellerProfile: user.sellerProfile,
      },
    });
  } catch (error: any) {
    console.error("POST /api/auth/google error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "فشل تسجيل الدخول عبر Google" },
      { status: 500 }
    );
  }
}
