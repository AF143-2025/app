import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

const ADMIN_SECRET = process.env.ADMIN_JWT_SECRET || process.env.PAYMENT_WEBHOOK_SECRET || "sama_alkhadraa_admin_super_secret_key_2026";
export const ADMIN_COOKIE_NAME = "admin_session_token";

export interface AdminSessionPayload {
  userId: string;
  email: string;
  role: string;
  exp: number;
}

/**
 * Sign an admin session token using HMAC-SHA256
 */
export function signAdminToken(payload: Omit<AdminSessionPayload, "exp">, expiresInDays = 7): string {
  const exp = Math.floor(Date.now() / 1000) + expiresInDays * 24 * 60 * 60;
  const fullPayload: AdminSessionPayload = { ...payload, exp };
  const encodedPayload = Buffer.from(JSON.stringify(fullPayload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", ADMIN_SECRET)
    .update(encodedPayload)
    .digest("base64url");
  return `${encodedPayload}.${signature}`;
}

/**
 * Verify and decode an admin session token
 */
export function verifyAdminToken(token: string): AdminSessionPayload | null {
  try {
    if (!token || !token.includes(".")) return null;
    const [encodedPayload, signature] = token.split(".");
    if (!encodedPayload || !signature) return null;

    const expectedSig = crypto
      .createHmac("sha256", ADMIN_SECRET)
      .update(encodedPayload)
      .digest("base64url");

    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))) {
      return null;
    }

    const payload: AdminSessionPayload = JSON.parse(
      Buffer.from(encodedPayload, "base64url").toString("utf8")
    );

    // Check expiration
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    // Role must be admin or ADMIN
    if (payload.role !== "ADMIN" && payload.role !== "admin") {
      return null;
    }

    return payload;
  } catch (err) {
    return null;
  }
}

/**
 * Backend authorization check for Admin API routes
 */
export async function authorizeAdminRequest(request: NextRequest): Promise<{
  authorized: boolean;
  user?: any;
  error?: string;
  status: number;
}> {
  try {
    // 1. Check admin cookie first
    let token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;

    // 2. If not in cookie, check Authorization: Bearer <token>
    if (!token) {
      const authHeader = request.headers.get("authorization");
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7);
      }
    }

    // 3. Check custom header x-admin-token
    if (!token) {
      token = request.headers.get("x-admin-token") || undefined;
    }

    if (!token) {
      return {
        authorized: false,
        error: "غير مصرح: يرجى تسجيل دخول المدير أولاً",
        status: 401,
      };
    }

    const payload = verifyAdminToken(token);
    if (!payload || !payload.userId) {
      return {
        authorized: false,
        error: "جلسة المدير غير صالحة أو منتهية الصلاحية",
        status: 401,
      };
    }

    // Verify directly against the database to prevent stale / revoked access
    const dbUser = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    if (!dbUser || (dbUser.role !== "ADMIN" && dbUser.role !== "admin")) {
      return {
        authorized: false,
        error: "وصول محظور: هذا الحساب ليس لديه صلاحيات المدير العام",
        status: 403,
      };
    }

    return {
      authorized: true,
      user: dbUser,
      status: 200,
    };
  } catch (error: any) {
    console.error("authorizeAdminRequest error:", error);
    return {
      authorized: false,
      error: "فشل التحقق من صلاحيات المدير",
      status: 500,
    };
  }
}
