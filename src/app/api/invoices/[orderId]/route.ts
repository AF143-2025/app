import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const invoice = await prisma.invoice.findFirst({
      where: {
        OR: [{ orderId: params.orderId }, { invoiceNumber: params.orderId }],
      },
      include: {
        order: {
          include: {
            items: true,
            transactions: true,
          },
        },
      },
    });

    if (!invoice) {
      return NextResponse.json(
        { success: false, error: "Invoice not found for this order" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, invoice });
  } catch (error: any) {
    console.error("GET /api/invoices error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch invoice" },
      { status: 500 }
    );
  }
}
