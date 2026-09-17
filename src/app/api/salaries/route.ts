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

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");

    const where: any = {};
    if (search) {
      where.OR = [
        { recipientName: { contains: search } },
        { employeeNumber: { contains: search } },
        { civilId: { contains: search } },
        { department: { contains: search } },
      ];
    }

    const disbursements = await prisma.salaryDisbursement.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    const totalAmount = disbursements.reduce((sum, d) => sum + d.amount, 0);
    const totalFees = disbursements.reduce((sum, d) => sum + d.fee, 0);

    return NextResponse.json({
      success: true,
      disbursements,
      stats: {
        count: disbursements.length,
        totalAmount,
        totalFees,
      },
    });
  } catch (error: any) {
    console.error("GET /api/salaries error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch salaries" },
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
      recipientName,
      civilId,
      employeeNumber,
      department,
      cardType = "ماستر كارد الرافدين",
      lastFourDigits = "1234",
      amount,
      fee = 2000,
      notes,
    } = body;

    if (!recipientName || !amount || !employeeNumber) {
      return NextResponse.json(
        { success: false, error: "الاسم والمبلغ والرقم الوظيفي حقول مطلوبة" },
        { status: 400 }
      );
    }

    const numAmount = parseFloat(amount);
    const numFee = parseFloat(fee);
    const totalDisbursed = numAmount - numFee;

    const referenceNumber = `SAL-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const record = await prisma.salaryDisbursement.create({
      data: {
        referenceNumber,
        recipientName,
        civilId: civilId || "",
        employeeNumber,
        department: department || "عام",
        cardType,
        lastFourDigits,
        amount: numAmount,
        fee: numFee,
        totalDisbursed,
        status: "Disbursed",
        notes: notes || "",
      },
    });

    // Record in Audit Log
    await logAuditEvent({
      action: "SALARY_DISBURSED",
      entity: "SalaryDisbursement",
      entityId: record.id,
      details: {
        referenceNumber,
        recipientName,
        amount: numAmount,
        fee: numFee,
        department,
      },
    });

    return NextResponse.json({ success: true, disbursement: record });
  } catch (error: any) {
    console.error("POST /api/salaries error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to disburse salary" },
      { status: 500 }
    );
  }
}
