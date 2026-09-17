import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logAuditEvent } from "@/lib/payment/audit-logger";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const walletType = searchParams.get("walletType");

    const where: any = {};
    if (walletType && walletType !== "all") {
      where.walletType = walletType;
    }

    const records = await prisma.walletTopup.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    const totalVolume = records.reduce((sum, r) => sum + r.amount, 0);
    const totalFees = records.reduce((sum, r) => sum + r.fee, 0);

    return NextResponse.json({
      success: true,
      records,
      stats: {
        count: records.length,
        totalVolume,
        totalFees,
      },
    });
  } catch (error: any) {
    console.error("GET /api/wallets error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch wallet records" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      walletType = "ZAIN_CASH",
      serviceType = "DEPOSIT",
      customerPhone,
      customerCard,
      amount,
      fee = 1000,
      operatorNotes,
    } = body;

    if (!amount) {
      return NextResponse.json(
        { success: false, error: "المبلغ حقل مطلوب" },
        { status: 400 }
      );
    }

    const numAmount = parseFloat(amount);
    const numFee = parseFloat(fee || "0");
    const totalCharge = numAmount + numFee;

    const prefix = walletType.replace("_", "").slice(0, 4);
    const referenceNumber = `WAL-${prefix}-${Math.floor(10000 + Math.random() * 90000)}`;

    const record = await prisma.walletTopup.create({
      data: {
        referenceNumber,
        walletType,
        serviceType,
        customerPhone: customerPhone || "",
        customerCard: customerCard || "",
        amount: numAmount,
        fee: numFee,
        totalCharge,
        status: "Success",
        operatorNotes: operatorNotes || "",
      },
    });

    await logAuditEvent({
      action: "WALLET_TRANSACTION_COMPLETED",
      entity: "WalletTopup",
      entityId: record.id,
      details: {
        referenceNumber,
        walletType,
        serviceType,
        amount: numAmount,
        customerPhone,
      },
    });

    return NextResponse.json({ success: true, record });
  } catch (error: any) {
    console.error("POST /api/wallets error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process wallet transaction" },
      { status: 500 }
    );
  }
}
