"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { InvoiceView } from "@/components/invoice-view";
import { ArrowRight, AlertCircle } from "lucide-react";

export default function OrderInvoicePage() {
  const params = useParams();
  const id = params.id as string;
  const [invoice, setInvoice] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadInvoice() {
      try {
        setLoading(true);
        const res = await fetch(`/api/invoices/${id}`);
        const data = await res.json();
        if (data.success) {
          setInvoice(data.invoice);
        } else {
          setError(data.error || "تعذر العثور على الفاتورة");
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    if (id) loadInvoice();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-20 text-center">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs text-gray-500 font-medium">جاري إعداد وتحميل الفاتورة الضريبية...</p>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="max-w-md mx-auto my-16 bg-white p-8 rounded-3xl text-center border border-gray-100 shadow-sm space-y-4">
        <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 mx-auto flex items-center justify-center">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-gray-900">الفاتورة غير جاهزة بعد</h2>
        <p className="text-xs text-gray-500 leading-relaxed">
          {error || "يتم إنشاء الفاتورة الرسمية تلقائياً بمجرد إتمام عملية السداد وتأكيد الدفع عبر بوابة الدفع الإلكتروني."}
        </p>
        <Link
          href={`/orders/${id}`}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold"
        >
          <ArrowRight className="w-4 h-4" />
          <span>العودة لصفحة تفاصيل الطلب</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <InvoiceView invoice={invoice} />
    </div>
  );
}
