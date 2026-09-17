"use client";

import React from "react";
import { Printer, Download, CheckCircle2, ShieldCheck, ArrowRight, Clock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface InvoiceViewProps {
  invoice: {
    invoiceNumber: string;
    issuedAt: string | Date;
    customerName: string;
    customerEmail: string;
    subtotal: number;
    taxAmount: number;
    shippingFee: number;
    totalAmount: number;
    paymentMethod: string;
    paymentStatus: string;
    qrCodeData?: string;
    order: {
      id: string;
      orderNumber: string;
      customerPhone?: string;
      shippingAddress: string;
      city: string;
      orderStatus: string;
      items: {
        id: string;
        productName: string;
        unitPrice: number;
        quantity: number;
        total: number;
      }[];
      transactions?: {
        transactionId: string;
        provider: string;
        cardBrand?: string;
        lastFourDigits?: string;
        gatewayReference?: string;
      }[];
    };
  };
}

export function InvoiceView({ invoice }: InvoiceViewProps) {
  const handlePrint = () => {
    window.print();
  };

  const paymentMethodLabels: Record<string, string> = {
    CARD: "بطاقة مصرفية (Visa / Mada)",
    WALLET: "محفظة رقمية (Apple Pay / STC Pay)",
    LOCAL_GATEWAY: "بوابة دفع محلية (سداد / كي نت)",
    COD: "الدفع عند الاستلام (Cash on Delivery)",
  };

  const isPaid = invoice.paymentStatus === "Paid";

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden print:border-none print:shadow-none print:m-0">
      {/* Action Bar (Not visible in print) */}
      <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between no-print">
        <Link
          href={`/orders/${invoice.order.id}`}
          className="text-xs font-bold text-gray-600 hover:text-gray-900 flex items-center gap-1.5 transition-colors"
        >
          <ArrowRight className="w-3.5 h-3.5" />
          <span>العودة لتفاصيل الطلب</span>
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>طباعة الفاتورة / حفظ كـ PDF</span>
          </button>
        </div>
      </div>

      <div className="p-6 sm:p-10">
        {/* Invoice Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-8 border-b-2 border-gray-100 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1.5">
              <div className="w-10 h-10 rounded-xl bg-slate-900 p-1 flex items-center justify-center border border-emerald-500/30 shrink-0">
                <Image
                  src="/images/sama-logo-emblem.png"
                  alt="سما الخضراء"
                  width={36}
                  height={36}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-2xl font-black text-gray-900 leading-tight">سما الخضراء</h1>
                <span className="text-[10px] font-bold text-emerald-700">للهواتف الذكية والأقساط والصيانة</span>
              </div>
            </div>
            <p className="text-xs text-gray-500">فاتورة إلكترونية معتمدة • ضمان رسمي للأجهزة والقطع</p>
            <p className="text-[11px] text-gray-400 mt-0.5">الرقم الضريبي: 300000000000003</p>
          </div>

          <div className="text-right sm:text-left space-y-1">
            <div className="inline-block px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800">
              {isPaid ? "فاتورة مسددة بالكامل ✓" : "في انتظار السداد"}
            </div>
            <div className="text-xs font-bold text-gray-800">
              رقم الفاتورة: <span className="font-mono text-emerald-700">{invoice.invoiceNumber}</span>
            </div>
            <div className="text-xs text-gray-500">
              رقم الطلب: <span className="font-mono text-gray-800">{invoice.order.orderNumber}</span>
            </div>
            <div className="text-xs text-gray-500">
              تاريخ الإصدار: {new Date(invoice.issuedAt).toLocaleDateString("ar-SA")}
            </div>
          </div>
        </div>

        {/* Customer & Shipping Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-6 border-b border-gray-100 text-xs">
          <div>
            <span className="font-bold text-gray-400 block mb-1">بيانات العميل:</span>
            <div className="font-bold text-gray-900 text-sm">{invoice.customerName}</div>
            <div className="text-gray-600 mt-0.5">{invoice.customerEmail}</div>
            {invoice.order.customerPhone && (
              <div className="text-gray-600 dir-ltr text-right">{invoice.order.customerPhone}</div>
            )}
          </div>
          <div>
            <span className="font-bold text-gray-400 block mb-1">عنوان التوصيل:</span>
            <div className="text-gray-900 font-medium">{invoice.order.shippingAddress}</div>
            <div className="text-gray-600 mt-0.5">المدينة: {invoice.order.city}</div>
            <div className="text-gray-600 mt-0.5">
              طريقة الدفع: {paymentMethodLabels[invoice.paymentMethod] || invoice.paymentMethod}
            </div>
          </div>
        </div>

        {/* Itemized Products Table */}
        <div className="py-6">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b border-gray-200 text-gray-400 font-bold">
                <th className="pb-3 text-right">المنتج والوصف</th>
                <th className="pb-3 text-center">الكمية</th>
                <th className="pb-3 text-left">سعر الوحدة</th>
                <th className="pb-3 text-left">المجموع</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {invoice.order.items.map((item) => (
                <tr key={item.id} className="text-gray-700">
                  <td className="py-3 font-semibold text-gray-900 max-w-[280px]">
                    {item.productName}
                  </td>
                  <td className="py-3 text-center font-bold text-gray-800">
                    {item.quantity}
                  </td>
                  <td className="py-3 text-left font-mono">
                    {item.unitPrice.toLocaleString("ar-SA")} ر.س
                  </td>
                  <td className="py-3 text-left font-bold font-mono text-gray-900">
                    {item.total.toLocaleString("ar-SA")} ر.س
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Calculation Breakdown & QR Stamp */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t-2 border-gray-100">
          {/* QR Code Simulation & Legal Stamp */}
          <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
            {/* Visual QR Code Representation */}
            <div className="w-20 h-20 bg-white border border-gray-300 p-1.5 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
              <div className="w-full h-full bg-gray-900 grid grid-cols-4 gap-0.5 p-1 rounded">
                <div className="bg-white col-span-2 row-span-2 rounded-sm" />
                <div className="bg-emerald-500" />
                <div className="bg-white" />
                <div className="bg-white" />
                <div className="bg-emerald-400 col-span-2 row-span-2 rounded-sm" />
                <div className="bg-white" />
                <div className="bg-white" />
              </div>
            </div>

            <div className="text-[11px] text-gray-500 space-y-1">
              <div className="font-bold text-emerald-800 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>فاتورة إلكترونية معتمدة</span>
              </div>
              <div>رمز التوثيق: ZATCA-E-INV-OK</div>
              <div>ختم التحقق الرقمي عبر Webhook الرسمي</div>
            </div>
          </div>

          {/* Totals */}
          <div className="space-y-2 text-xs text-gray-600">
            <div className="flex justify-between">
              <span>المجموع الفرعي:</span>
              <span className="font-bold text-gray-900 font-mono">
                {invoice.subtotal.toLocaleString("ar-SA")} ر.س
              </span>
            </div>
            <div className="flex justify-between">
              <span>ضريبة القيمة المضافة (15%):</span>
              <span className="font-bold text-gray-900 font-mono">
                {invoice.taxAmount.toLocaleString("ar-SA")} ر.س
              </span>
            </div>
            <div className="flex justify-between">
              <span>رسوم التوصيل:</span>
              <span className="font-bold text-gray-900">
                {invoice.shippingFee === 0 ? "مجاني" : `${invoice.shippingFee.toLocaleString("ar-SA")} ر.س`}
              </span>
            </div>
            <div className="flex justify-between text-base font-black text-gray-900 pt-3 border-t border-gray-200">
              <span>الإجمالي الكلي:</span>
              <span className="text-emerald-700 font-mono">
                {invoice.totalAmount.toLocaleString("ar-SA")} ر.س
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-10 pt-6 border-t border-gray-100 text-center text-xs text-gray-400">
          شكراً لتسوقك معنا في نوبل ستور! للاستفسارات والدعم تواصل معنا عبر support@store.com
        </div>
      </div>
    </div>
  );
}
