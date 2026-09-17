export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authorizeAdminRequest } from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const status = searchParams.get("status");

    // If no specific userId is requested, only admin can view all orders
    if (!userId) {
      const auth = await authorizeAdminRequest(request);
      if (!auth.authorized) {
        return NextResponse.json(
          { success: false, error: "معرف المستخدم مطلوب أو يتطلب صلاحيات المدير" },
          { status: 401 }
        );
      }
    }

    const where: any = {};
    if (userId) where.userId = userId;
    if (status && status !== "all") where.orderStatus = status;

    const orders = await prisma.order.findMany({
      where,
      include: {
        items: true,
        transactions: true,
        invoice: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, orders });
  } catch (error: any) {
    console.error("GET /api/orders error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

