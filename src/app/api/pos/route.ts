import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authorizeAdminRequest } from "@/lib/admin-auth";
import { logAuditEvent } from "@/lib/payment/audit-logger";

export const dynamic = 'force-dynamic';

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
      items, // array of { productId, quantity }
      paymentMethod = "CASH_IQD",
      customerName = "زبون مباشر",
      customerPhone = "",
      discount = 0,
    } = body;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { success: false, error: "يجب اختيار منتج واحد على الأقل" },
        { status: 400 }
      );
    }

    // Fetch products
    const productIds = items.map((i: any) => i.productId);
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    let subtotal = 0;
    const orderItemsData: any[] = [];

    for (const item of items) {
      const prod = dbProducts.find((p) => p.id === item.productId);
      if (!prod) {
        return NextResponse.json(
          { success: false, error: `المنتج غير موجود: ${item.productId}` },
          { status: 404 }
        );
      }
      if (prod.stock < item.quantity) {
        return NextResponse.json(
          {
            success: false,
            error: `الكمية غير كافية للمنتج: ${prod.name} (المتوفر: ${prod.stock})`,
          },
          { status: 400 }
        );
      }

      const lineTotal = prod.price * item.quantity;
      subtotal += lineTotal;
      orderItemsData.push({
        productId: prod.id,
        sellerId: prod.sellerId,
        productName: prod.name,
        productImage: prod.imageUrl,
        unitPrice: prod.price,
        quantity: item.quantity,
        total: lineTotal,
      });
    }

    const totalAmount = Math.max(0, subtotal - parseFloat(discount || "0"));
    const orderNumber = `POS-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

    const result = await prisma.$transaction(async (tx) => {
      // Create Order
      const order = await tx.order.create({
        data: {
          orderNumber,
          userId: "demo-buyer-id",
          customerName,
          customerEmail: "pos@sama-alkhadraa.local",
          customerPhone: customerPhone || "07700000000",
          shippingAddress: "استلام مباشر من الفرع",
          city: "بغداد",
          subtotal,
          taxAmount: 0,
          shippingFee: 0,
          totalAmount,
          paymentMethod,
          paymentStatus: "Paid",
          orderStatus: "Delivered",
          items: {
            create: orderItemsData,
          },
          transactions: {
            create: [
              {
                transactionId: `pos_txn_${Date.now()}`,
                provider: paymentMethod,
                amount: totalAmount,
                currency: paymentMethod.includes("USD") ? "USD" : "IQD",
                status: "Paid",
                gatewayReference: "POS-DIRECT",
              },
            ],
          },
        },
        include: {
          items: true,
          transactions: true,
        },
      });

      // Decrement stock
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      // Create Invoice
      const invoiceNumber = `INV-${orderNumber}`;
      await tx.invoice.create({
        data: {
          invoiceNumber,
          orderId: order.id,
          customerName,
          customerEmail: "pos@sama-alkhadraa.local",
          subtotal,
          taxAmount: 0,
          shippingFee: 0,
          totalAmount,
          paymentMethod,
          paymentStatus: "Paid",
          qrCodeData: `SAMA-ALKHADRAA|POS:${orderNumber}|TOTAL:${totalAmount}|STATUS:PAID`,
        },
      });

      return order;
    });

    await logAuditEvent({
      action: "POS_DIRECT_SALE",
      entity: "Order",
      entityId: result.id,
      details: { orderNumber, totalAmount, paymentMethod },
    });

    return NextResponse.json({ success: true, order: result });
  } catch (error: any) {
    console.error("POST /api/pos error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process POS sale" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const auth = await authorizeAdminRequest(request);
    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, error: auth.error || "غير مصرح" },
        { status: auth.status }
      );
    }

    const orders = await prisma.order.findMany({
      where: {
        paymentMethod: {
          in: ["CASH_IQD", "CASH_USD", "ZAIN_CASH_POS", "QI_CARD_POS", "FIB_POS"],
        },
      },
      include: {
        items: true,
        invoice: true,
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    const totalSales = orders.reduce((sum, o) => sum + o.totalAmount, 0);

    return NextResponse.json({
      success: true,
      orders,
      stats: {
        todaySalesCount: orders.length,
        totalSales,
      },
    });
  } catch (error: any) {
    console.error("GET /api/pos error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch POS orders" },
      { status: 500 }
    );
  }
}
