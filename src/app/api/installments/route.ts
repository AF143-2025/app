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

    const plans = await prisma.installmentPlan.findMany({
      include: {
        product: true,
        payments: {
          orderBy: { installmentNumber: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const activeCount = plans.filter((p) => p.status === "Active").length;
    const totalFinanced = plans.reduce((sum, p) => sum + p.totalPrice, 0);
    const totalDownPayments = plans.reduce((sum, p) => sum + p.downPayment, 0);

    return NextResponse.json({
      success: true,
      plans,
      stats: {
        totalPlans: plans.length,
        activeCount,
        totalFinanced,
        totalDownPayments,
      },
    });
  } catch (error: any) {
    console.error("GET /api/installments error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch installment plans" },
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
      customerName,
      customerPhone,
      nationalId,
      guarantorName,
      guarantorPhone,
      productId,
      totalPrice,
      downPayment = 0,
      monthsCount = 12,
      notes,
    } = body;

    if (!customerName || !customerPhone || !productId || !totalPrice) {
      return NextResponse.json(
        { success: false, error: "بيانات العميل والمنتج والسعر مطلوبة" },
        { status: 400 }
      );
    }

    const numTotalPrice = parseFloat(totalPrice);
    const numDown = parseFloat(downPayment || "0");
    const remaining = numTotalPrice - numDown;
    const months = parseInt(monthsCount, 10);
    const monthlyAmount = Math.round(remaining / months);

    const contractNumber = `INST-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

    // Build installment payments schedule
    const paymentsData = [];
    const now = new Date();
    for (let i = 1; i <= months; i++) {
      const dueDate = new Date(now.getFullYear(), now.getMonth() + i, 1);
      paymentsData.push({
        installmentNumber: i,
        dueDate,
        amount: monthlyAmount,
        status: "Pending",
      });
    }

    const plan = await prisma.installmentPlan.create({
      data: {
        contractNumber,
        customerName,
        customerPhone,
        nationalId: nationalId || "",
        guarantorName: guarantorName || "",
        guarantorPhone: guarantorPhone || "",
        productId,
        totalPrice: numTotalPrice,
        downPayment: numDown,
        remainingAmount: remaining,
        monthsCount: months,
        monthlyInstallment: monthlyAmount,
        status: "Active",
        notes: notes || "",
        payments: {
          create: paymentsData,
        },
      },
      include: {
        payments: true,
        product: true,
      },
    });

    // Decrement product stock
    await prisma.product.update({
      where: { id: productId },
      data: { stock: { decrement: 1 } },
    });

    await logAuditEvent({
      action: "INSTALLMENT_PLAN_CREATED",
      entity: "InstallmentPlan",
      entityId: plan.id,
      details: { contractNumber, customerName, totalPrice: numTotalPrice, months },
    });

    return NextResponse.json({ success: true, plan });
  } catch (error: any) {
    console.error("POST /api/installments error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create installment plan" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const auth = await authorizeAdminRequest(request);
    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, error: auth.error || "غير مصرح" },
        { status: auth.status }
      );
    }

    const body = await request.json();
    const { paymentId, paidAmount } = body;

    if (!paymentId) {
      return NextResponse.json(
        { success: false, error: "Payment ID is required" },
        { status: 400 }
      );
    }

    const receiptNumber = `REC-INST-${Math.floor(10000 + Math.random() * 90000)}`;

    const payment = await prisma.installmentPayment.update({
      where: { id: paymentId },
      data: {
        status: "Paid",
        paidDate: new Date(),
        receiptNumber,
      },
      include: {
        plan: {
          include: { payments: true },
        },
      },
    });

    // Check if all payments in plan are paid
    const allPaid = payment.plan.payments.every((p) => p.status === "Paid");
    if (allPaid) {
      await prisma.installmentPlan.update({
        where: { id: payment.planId },
        data: { status: "Completed" },
      });
    }

    return NextResponse.json({ success: true, payment, receiptNumber });
  } catch (error: any) {
    console.error("PUT /api/installments error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to record payment" },
      { status: 500 }
    );
  }
}
