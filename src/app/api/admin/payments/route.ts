export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authorizeAdminRequest } from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
  try {
    const auth = await authorizeAdminRequest(request);
    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, error: auth.error || "غير مصرح" },
        { status: auth.status }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const where: any = {};
    if (status && status !== "all") {
      where.status = status;
    }

    const [
      transactions,
      totalVolumeAgg,
      paidCount,
      failedCount,
      refundedCount,
      pendingCount,
      totalCount,
    ] = await Promise.all([
      prisma.paymentTransaction.findMany({
        where,
        include: {
          order: {
            select: {
              orderNumber: true,
              customerName: true,
              customerEmail: true,
              paymentMethod: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.paymentTransaction.aggregate({
        _sum: { amount: true },
        where: { status: "Paid" },
      }),
      prisma.paymentTransaction.count({ where: { status: "Paid" } }),
      prisma.paymentTransaction.count({ where: { status: "Failed" } }),
      prisma.paymentTransaction.count({ where: { status: "Refunded" } }),
      prisma.paymentTransaction.count({ where: { status: "Pending" } }),
      prisma.paymentTransaction.count(),
    ]);

    const totalVolume = totalVolumeAgg._sum.amount || 0;
    const successRate =
      totalCount > 0 ? Math.round((paidCount / totalCount) * 100) : 100;

    return NextResponse.json({
      success: true,
      transactions,
      stats: {
        totalVolume: Math.round(totalVolume * 100) / 100,
        paidCount,
        failedCount,
        refundedCount,
        pendingCount,
        totalCount,
        successRate,
      },
    });
  } catch (error: any) {
    console.error("GET /api/admin/payments error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch payment transactions" },
      { status: 500 }
    );
  }
}

