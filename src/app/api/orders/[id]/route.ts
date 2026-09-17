import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                imageUrl: true,
                category: true,
              },
            },
          },
        },
        transactions: {
          orderBy: { createdAt: "desc" },
        },
        invoice: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    const installmentPlan = await prisma.installmentPlan.findFirst({
      where: { orderId: params.id },
      include: {
        payments: {
          orderBy: { installmentNumber: "asc" },
        },
      },
    });

    return NextResponse.json({
      success: true,
      order: {
        ...order,
        installmentPlan,
      },
    });
  } catch (error: any) {
    console.error("GET /api/orders/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch order details" },
      { status: 500 }
    );
  }
}
