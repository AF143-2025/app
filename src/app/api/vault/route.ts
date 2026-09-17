import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authorizeAdminRequest } from "@/lib/admin-auth";
import { logAuditEvent } from "@/lib/payment/audit-logger";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const auth = await authorizeAdminRequest(request);
    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, error: auth.error || "غير مصرح" },
        { status: auth.status }
      );
    }

    const transactions = await prisma.vaultTransaction.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    const latest = transactions[0];
    const currentBalanceIQD = latest ? latest.balanceIQD : 25000000;
    const currentBalanceUSD = latest ? latest.balanceUSD : 12500;

    return NextResponse.json({
      success: true,
      transactions,
      currentBalance: {
        iqd: currentBalanceIQD,
        usd: currentBalanceUSD,
      },
    });
  } catch (error: any) {
    console.error("GET /api/vault error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch vault transactions" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await authorizeAdminRequest(request);
    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, error: auth.error || "غير مصرح" },
        { status: auth.status }
      );
    }

    const body = await request.json();
    const {
      type = "INCOME_CASH", // INCOME_CASH, EXPENSE_CASH, EXCHANGE
      currency = "IQD",     // IQD, USD
      amount,
      exchangeRate = 1530,
      description,
    } = body;

    if (!amount) {
      return NextResponse.json(
        { success: false, error: "المبلغ حقل مطلوب" },
        { status: 400 }
      );
    }

    const numAmount = parseFloat(amount);
    const numRate = parseFloat(exchangeRate);

    // Get current balance
    const latest = await prisma.vaultTransaction.findFirst({
      orderBy: { createdAt: "desc" },
    });

    let currentIQD = latest ? latest.balanceIQD : 25000000;
    let currentUSD = latest ? latest.balanceUSD : 12500;
    let resultAmount: number | null = null;

    if (type === "INCOME_CASH") {
      if (currency === "IQD") currentIQD += numAmount;
      else currentUSD += numAmount;
    } else if (type === "EXPENSE_CASH") {
      if (currency === "IQD") currentIQD -= numAmount;
      else currentUSD -= numAmount;
    } else if (type === "EXCHANGE") {
      // Exchange USD to IQD or IQD to USD
      if (currency === "USD") {
        // Customer gives USD, gets IQD
        resultAmount = numAmount * numRate;
        currentUSD += numAmount;
        currentIQD -= resultAmount;
      } else {
        // Customer gives IQD, gets USD
        resultAmount = numAmount / numRate;
        currentIQD += numAmount;
        currentUSD -= resultAmount;
      }
    }

    const tx = await prisma.vaultTransaction.create({
      data: {
        type,
        currency,
        amount: numAmount,
        exchangeRate: type === "EXCHANGE" ? numRate : null,
        resultAmount,
        description: description || "عملية صندوق",
        balanceIQD: currentIQD,
        balanceUSD: currentUSD,
      },
    });

    await logAuditEvent({
      action: "VAULT_TRANSACTION",
      entity: "Vault",
      entityId: tx.id,
      details: {
        type,
        currency,
        amount: numAmount,
        balanceIQD: currentIQD,
        balanceUSD: currentUSD,
      },
    });

    return NextResponse.json({ success: true, transaction: tx });
  } catch (error: any) {
    console.error("POST /api/vault error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process vault transaction" },
      { status: 500 }
    );
  }
}
