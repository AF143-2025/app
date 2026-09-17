import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authorizeAdminRequest } from "@/lib/admin-auth";
import { logAuditEvent } from "@/lib/payment/audit-logger";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    // If listing all tickets without a specific tracking query, require Admin authentication
    if (!search) {
      const auth = await authorizeAdminRequest(request);
      if (!auth.authorized) {
        return NextResponse.json(
          { success: false, error: auth.error || "غير مصرح: يتطلب صلاحيات المدير العام" },
          { status: auth.status }
        );
      }
    }

    const where: any = {};
    if (status && status !== "all") {
      where.status = status;
    }
    if (search) {
      where.OR = [
        { ticketNumber: { contains: search } },
        { customerName: { contains: search } },
        { customerPhone: { contains: search } },
        { brandModel: { contains: search } },
      ];
    }

    const tickets = await prisma.maintenanceTicket.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    const activeCount = tickets.filter(
      (t) => t.status !== "Delivered" && t.status !== "Cancelled"
    ).length;
    const readyCount = tickets.filter((t) => t.status === "Ready").length;

    return NextResponse.json({
      success: true,
      tickets,
      stats: {
        totalTickets: tickets.length,
        activeCount,
        readyCount,
      },
    });
  } catch (error: any) {
    console.error("GET /api/maintenance error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch maintenance tickets" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      customerName,
      customerPhone,
      customerEmail,
      deviceType = "هاتف ذكي",
      brandModel = "جهاز ذكي",
      issueDescription,
      accessories,
      estimatedCost = 0,
    } = body;

    if (!customerName?.trim() || !customerPhone?.trim() || !issueDescription?.trim()) {
      return NextResponse.json(
        { success: false, error: "يرجى ملء الاسم ورقم الهاتف وتفاصيل المشكلة" },
        { status: 400 }
      );
    }

    const ticketNumber = `MAINT-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

    const ticket = await prisma.maintenanceTicket.create({
      data: {
        ticketNumber,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail ? customerEmail.trim() : null,
        deviceType: deviceType.trim(),
        brandModel: brandModel.trim(),
        issueDescription: issueDescription.trim(),
        accessories: accessories ? accessories.trim() : "الجهاز فقط",
        estimatedCost: parseFloat(estimatedCost || "0"),
        status: "Received",
      },
    });

    await logAuditEvent({
      action: "MAINTENANCE_TICKET_CREATED",
      entity: "MaintenanceTicket",
      entityId: ticket.id,
      details: { ticketNumber, customerName, customerPhone, customerEmail, brandModel },
    });

    return NextResponse.json({
      success: true,
      message: "تم إرسال طلب الصيانة إلى المدير بنجاح",
      ticket,
    });
  } catch (error: any) {
    console.error("POST /api/maintenance error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "فشل إرسال طلب الصيانة" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const auth = await authorizeAdminRequest(request);
    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, error: auth.error || "غير مصرح: يتطلب صلاحيات المدير العام" },
        { status: auth.status }
      );
    }

    const body = await request.json();
    const { id, status, technicianNotes, finalCost, estimatedCost, adminReply } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "معرف تذكرة الصيانة مطلوب" },
        { status: 400 }
      );
    }

    const data: any = {};
    if (status) data.status = status;
    if (technicianNotes !== undefined) data.technicianNotes = technicianNotes;
    if (finalCost !== undefined) data.finalCost = parseFloat(finalCost);
    if (estimatedCost !== undefined) data.estimatedCost = parseFloat(estimatedCost);

    if (adminReply !== undefined) {
      data.adminReply = adminReply.trim();
      data.adminRepliedAt = new Date();
      if (!status || status === "Received") {
        data.status = "Replied";
      }
    }

    const ticket = await prisma.maintenanceTicket.update({
      where: { id },
      data,
    });

    await logAuditEvent({
      action: "MAINTENANCE_TICKET_REPLIED_OR_UPDATED",
      entity: "MaintenanceTicket",
      entityId: id,
      details: { status: data.status, hasReply: !!adminReply },
    });

    return NextResponse.json({
      success: true,
      message: "تم حفظ الرد وتحديث طلب الصيانة بنجاح",
      ticket,
    });
  } catch (error: any) {
    console.error("PUT /api/maintenance error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update maintenance ticket" },
      { status: 500 }
    );
  }
}
