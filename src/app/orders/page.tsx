"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Package, Clock, CheckCircle2, Truck, AlertCircle, ArrowLeft, ArrowRight, Eye, FileText } from "lucide-react";
import { useCart } from "@/components/cart-context";

export default function OrdersPage() {
  const { userId } = useCart();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/orders?userId=${userId}`);
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [userId]);

  const orderStatusConfig: Record<string, { label: string; color: string; icon: any }> = {
    Pending: { label: "في الانتظار", color: "bg-amber-100 text-amber-800 border-amber-200", icon: Clock },
    Confirmed: { label: "تم التأكيد", color: "bg-blue-100 text-blue-800 border-blue-200", icon: CheckCircle2 },
    Processing: { label: "قيد التجهيز", color: "bg-purple-100 text-purple-800 border-purple-200", icon: Package },
    Shipped: { label: "تم الشحن", color: "bg-indigo-100 text-indigo-800 border-indigo-200", icon: Truck },
    Delivered: { label: "تم التوصيل", color: "bg-emerald-100 text-emerald-800 border-emerald-200", icon: CheckCircle2 },
    Cancelled: { label: "ملغي", color: "bg-red-100 text-red-800 border-red-200", icon: AlertCircle },
  };

  const paymentStatusConfig: Record<string, { label: string; color: string }> = {
    Paid: { label: "مدفوع بنجاح ✓", color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
    Pending: { label: "معلق السداد", color: "text-amber-700 bg-amber-50 border-amber-200" },
    Failed: { label: "فشل الدفع ✕", color: "text-red-700 bg-red-50 border-red-200" },
    Refunded: { label: "مسترجع ↺", color: "text-gray-700 bg-gray-100 border-gray-200" },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <Link href="/" className="hover:text-emerald-700 transition-colors">
          الرئيسية
        </Link>
        <span>/</span>
        <span className="font-bold text-gray-800">قائمة طلباتي</span>
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 flex items-center gap-2.5">
          <Package className="w-7 h-7 text-emerald-600" />
          <span>سجل الطلبات والتتبع المباشر</span>
        </h1>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 animate-pulse h-32" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center text-3xl">
            📦
          </div>
          <h2 className="text-lg font-bold text-gray-900">لا توجد طلبات سابقة</h2>
          <p className="text-xs text-gray-500">
            لم تقم بطلب أي منتجات بعد. ابدأ أول تجربة تسوق معنا الآن.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all"
          >
            <span>استكشف المتجر</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const statusObj = orderStatusConfig[order.orderStatus] || orderStatusConfig.Pending;
            const payObj = paymentStatusConfig[order.paymentStatus] || paymentStatusConfig.Pending;
            const StatusIcon = statusObj.icon;

            return (
              <div
                key={order.id}
                className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-5"
              >
                {/* Order Meta */}
                <div className="space-y-2">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-mono font-black text-gray-900 text-sm sm:text-base">
                      {order.orderNumber}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${statusObj.color}`}
                    >
                      <StatusIcon className="w-3 h-3" />
                      {statusObj.label}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${payObj.color}`}
                    >
                      {payObj.label}
                    </span>
                  </div>

                  <div className="text-xs text-gray-500 flex items-center gap-3">
                    <span>التاريخ: {new Date(order.createdAt).toLocaleDateString("ar-SA")}</span>
                    <span>•</span>
                    <span>العميل: {order.customerName}</span>
                    <span>•</span>
                    <span>المدينة: {order.city}</span>
                  </div>

                  {/* Items snapshot */}
                  <div className="text-xs text-gray-600 flex items-center gap-2 pt-1">
                    <span>المنتجات:</span>
                    <span className="font-semibold text-gray-900">
                      {order.items?.length || 0} عناصر
                    </span>
                    <span className="text-gray-400">
                      ({order.items?.map((i: any) => i.productName).join("، ")})
                    </span>
                  </div>
                </div>

                {/* Total & Action Buttons */}
                <div className="flex sm:items-center justify-between md:flex-col md:items-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-gray-100">
                  <div className="text-right">
                    <div className="text-xs text-gray-400">إجمالي الطلب</div>
                    <div className="text-lg font-black text-emerald-700 font-mono">
                      {order.totalAmount.toLocaleString("ar-SA")} ر.س
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/orders/${order.id}`}
                      className="px-4 py-2 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>تتبع الطلب</span>
                    </Link>

                    {order.paymentStatus === "Paid" && (
                      <Link
                        href={`/orders/${order.id}/invoice`}
                        className="px-3.5 py-2 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-bold flex items-center gap-1 transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5 text-emerald-600" />
                        <span>الفاتورة</span>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
