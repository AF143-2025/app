import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createPaymentIntent } from "@/lib/payment/gateway-adapter";
import { logAuditEvent } from "@/lib/payment/audit-logger";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId = "demo-buyer-id",
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      city,
      postalCode,
      paymentMethod = "CARD",
      installmentMonths = 12,
      downPayment = 0,
      nationalId,
      guarantorName,
      guarantorPhone,
    } = body;

    if (!customerName || !shippingAddress || !city) {
      return NextResponse.json(
        { success: false, error: "Please fill in all required shipping details" },
        { status: 400 }
      );
    }

    // 1. Fetch current cart items
    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: { product: true },
    });

    if (cartItems.length === 0) {
      return NextResponse.json(
        { success: false, error: "Shopping cart is empty" },
        { status: 400 }
      );
    }

    // 2. Validate stock for each item
    for (const item of cartItems) {
      if (item.product.stock < item.quantity) {
        return NextResponse.json(
          {
            success: false,
            error: `Insufficient stock for ${item.product.name}. Available: ${item.product.stock}`,
          },
          { status: 400 }
        );
      }
    }

    // 3. Compute accurate totals on server
    const subtotal = cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    const taxRate = 0.15;
    const taxAmount = Math.round(subtotal * taxRate * 100) / 100;
    const shippingFee = subtotal > 200 ? 0 : 25;
    const totalAmount = Math.round((subtotal + taxAmount + shippingFee) * 100) / 100;

    const orderNumber = `ORD-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

    const isCOD = paymentMethod === "COD";
    const isInstallment = paymentMethod === "INSTALLMENT";

    const numDown = isInstallment ? Math.min(parseFloat(String(downPayment || "0")), totalAmount) : 0;
    const months = isInstallment ? parseInt(String(installmentMonths || "12"), 10) : 12;
    const remainingAmount = totalAmount - numDown;
    const monthlyInstallment = isInstallment ? Math.round(remainingAmount / months) : 0;

    // 4. Create Order & Items in database transaction
    const { order: result, installmentPlan } = await prisma.$transaction(async (tx) => {
      // Create Order
      const order = await tx.order.create({
        data: {
          orderNumber,
          userId,
          customerName,
          customerEmail: customerEmail || `${customerPhone || "guest"}@sama-alkhadraa.iq`,
          customerPhone: customerPhone || "",
          shippingAddress,
          city,
          postalCode: postalCode || "",
          subtotal,
          taxAmount,
          shippingFee,
          totalAmount,
          paymentMethod,
          paymentStatus: isInstallment ? (numDown > 0 ? "Down_Payment_Recorded" : "Installment_Active") : (isCOD ? "Pending" : "Pending"),
          orderStatus: isCOD || isInstallment ? "Confirmed" : "Pending",
        },
      });

      // Create Order Items and decrease stock
      for (const item of cartItems) {
        await tx.orderItem.create({
          data: {
            orderId: order.id,
            productId: item.productId,
            sellerId: item.product.sellerId,
            productName: item.product.name,
            productImage: item.product.imageUrl,
            unitPrice: item.product.price,
            quantity: item.quantity,
            total: item.product.price * item.quantity,
          },
        });

        // Decrement stock
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: { decrement: item.quantity },
          },
        });
      }

      // If Installment, create InstallmentPlan with scheduled payments
      let planRecord: any = null;
      if (isInstallment) {
        const contractNumber = `INST-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
        const paymentsData = [];
        const now = new Date();
        for (let i = 1; i <= months; i++) {
          const dueDate = new Date(now.getFullYear(), now.getMonth() + i, 1);
          paymentsData.push({
            installmentNumber: i,
            dueDate,
            amount: monthlyInstallment,
            status: "Pending",
          });
        }

        planRecord = await tx.installmentPlan.create({
          data: {
            contractNumber,
            customerName,
            customerPhone: customerPhone || "",
            nationalId: nationalId || "تم التقديم إلكترونياً",
            guarantorName: guarantorName || "كفيل موثق",
            guarantorPhone: guarantorPhone || "",
            productId: cartItems[0]?.productId,
            userId,
            orderId: order.id,
            totalPrice: totalAmount,
            downPayment: numDown,
            remainingAmount,
            monthsCount: months,
            monthlyInstallment,
            status: "Active",
            notes: `عقد تقسيط لسلة مشتريات رقم ${orderNumber}`,
            payments: {
              create: paymentsData,
            },
          },
        });
      }

      // Clear user cart
      await tx.cartItem.deleteMany({
        where: { userId },
      });

      return { order, installmentPlan: planRecord };
    });

    // 5. Generate Payment Intent if electronic direct payment
    let paymentIntent = null;
    if (!isCOD && !isInstallment) {
      paymentIntent = await createPaymentIntent({
        orderId: result.id,
        orderNumber: result.orderNumber,
        amount: totalAmount,
        currency: "IQD",
        customerEmail: result.customerEmail,
        customerName,
        paymentMethod,
      });
    }

    // If COD or INSTALLMENT, generate official invoice right away
    if (isCOD || isInstallment) {
      const invoiceNumber = `INV-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
      await prisma.invoice.create({
        data: {
          invoiceNumber,
          orderId: result.id,
          customerName,
          customerEmail: result.customerEmail,
          subtotal,
          taxAmount,
          shippingFee,
          totalAmount,
          paymentMethod: isInstallment ? "INSTALLMENT" : "COD",
          paymentStatus: isInstallment ? "Active_Installment" : "Pending",
          qrCodeData: `SAMA-ALKHADRAA:${invoiceNumber}|TOTAL:${totalAmount}IQD|TYPE:${paymentMethod}|DATE:${new Date().toISOString()}`,
        },
      });

      await logAuditEvent({
        userId,
        userEmail: result.customerEmail,
        action: isInstallment ? "ORDER_CREATED_INSTALLMENT" : "ORDER_CREATED_COD",
        entity: "Order",
        entityId: result.id,
        details: {
          orderNumber,
          totalAmount,
          paymentMethod,
          isInstallment,
          contractNumber: installmentPlan?.contractNumber,
        },
      });
    }

    return NextResponse.json({
      success: true,
      orderId: result.id,
      orderNumber: result.orderNumber,
      totalAmount,
      paymentMethod,
      paymentIntent,
      isCOD,
      isInstallment,
      installmentPlan,
    });
  } catch (error: any) {
    console.error("POST /api/checkout error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process checkout" },
      { status: 500 }
    );
  }
}
