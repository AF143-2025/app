export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logAuditEvent } from "@/lib/payment/audit-logger";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, phone, role = "BUYER" } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: "الرجاء إدخال الاسم، البريد الإلكتروني، وكلمة المرور" },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: "البريد الإلكتروني مسجل مسبقاً، يرجى تسجيل الدخول" },
        { status: 400 }
      );
    }

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: cleanEmail,
        password: password,
        phone: phone ? phone.trim() : null,
        role: "BUYER",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        createdAt: true,
      },
    });

    await logAuditEvent({
      userId: user.id,
      userEmail: user.email,
      action: "USER_REGISTERED",
      entity: "User",
      entityId: user.id,
      details: { role: user.role, name: user.name },
    });

    return NextResponse.json({
      success: true,
      message: "تم إنشاء الحساب بنجاح في متجر سما الخضراء للهواتف",
      user,
    });
  } catch (error: any) {
    console.error("POST /api/auth/register error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "فشل إنشاء الحساب" },
      { status: 500 }
    );
  }
}
