"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Package,
  CheckCircle2,
  Clock,
  Truck,
  FileText,
  CreditCard,
  MapPin,
  ShieldCheck,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  Lock,
  Layers,
} from "lucide-react";
import { PaymentModal } from "@/components/payment-modal";

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [order, setOrder] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/orders/${id}`);
      const data = await res.json();
      if (data.success) {
        setOrder(data.order);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-12 h-12 rounded-full border-4 border-emerald-600 border-t-transparent animate-spin mx-auto mb-4" />
        <p className="text-xs text-gray-500">جاري تحميل تفاصيل الطلب والتتبع المباشر...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-md mx-auto my-16 bg-white p-8 rounded-3xl text-center border border-gray-100 shadow-sm space-y-4">
        <div className="text-4xl">❌</div>
        <h2 className="text-lg font-bold text-gray-900">الطلب غير موجود</h2>
        <p className="text-xs text-gray-500">تأكد من صحة الرابط أو تفقد قائمة طلباتك.</p>
        <Link
          href="/orders"
          className="inline-block px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold"
        >
          العودة للطلبات
        </Link>
      </div>
    );
  }

  // Timeline Steps Definition
  const timelineSteps = [
    { key: "Pending", label: "تم استلام الطلب", desc: "بانتظار التحقق والسداد" },
    { key: "Confirmed", label: "تم تأكيد الدفع", desc: "تم اعتماد العملية رسمياً" },
    { key: "Processing", label: "قيد التجهيز", desc: "يجري فحص وتجهيز الشحنة" },
    { key: "Shipped", label: "تم الشحن", desc: "الشحنة في طريقها مع المندوب" },
    { key: "Delivered", label: "تم التوصيل", desc: "تم استلام الطلب بنجاح" },
  ];

  const statusOrder = ["Pending", "Confirmed", "Processing", "Shipped", "Delivered"];
  const currentStepIndex = statusOrder.indexOf(order.orderStatus);

  const isCancelled = order.orderStatus === "Cancelled";

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <Link href="/" className="hover:text-emerald-700 transition-colors">
          الرئيسية
        </Link>
        <span>/</span>
        <Link href="/orders" className="hover:text-emerald-700 transition-colors">
          طلباتي
        </Link>
        <span>/</span>
        <span className="font-bold text-gray-800 font-mono">{order.orderNumber}</span>
      </div>

      {/* Header Info */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 flex-wrap mb-2">
            <h1 className="text-2xl font-black text-gray-900 font-mono">
              {order.orderNumber}
            </h1>
            <span
              className={`text-xs font-black px-3 py-1 rounded-full border ${
                order.paymentStatus === "Paid"
                  ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                  : order.paymentStatus === "Refunded"
                  ? "bg-gray-100 text-gray-800 border-gray-300"
                  : "bg-amber-100 text-amber-800 border-amber-200"
              }`}
            >
              الدفع: {order.paymentStatus === "Paid" ? "مسدد بالكامل ✓" : order.paymentStatus}
            </span>
          </div>

          <div className="text-xs text-gray-500 space-y-1">
            <div>تاريخ إنشاء الطلب: {new Date(order.createdAt).toLocaleString("ar-SA")}</div>
            <div>
              العميل: <span className="font-bold text-gray-800">{order.customerName}</span> (
              {order.customerEmail})
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {order.paymentStatus === "Paid" && (
            <Link
              href={`/orders/${order.id}/invoice`}
              className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.02]"
            >
              <FileText className="w-4 h-4" />
              <span>عرض وتحميل الفاتورة 🧾</span>
            </Link>
          )}

          {order.paymentStatus !== "Paid" && !isCancelled && (
            <button
              onClick={() => setShowPaymentModal(true)}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.02]"
            >
              <CreditCard className="w-4 h-4" />
              <span>سداد الطلب الآن عبر البوابة</span>
            </button>
          )}

          <button
            onClick={fetchOrder}
            className="p-3 rounded-2xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-bold flex items-center gap-1.5 transition-colors"
            title="تحديث الحالة"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Live Tracking Progress Timeline */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
        <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
          <Truck className="w-5 h-5 text-emerald-600" />
          <span>تتبع حالة الطلب المباشرة</span>
        </h2>

        {isCancelled ? (
          <div className="bg-red-50 border border-red-200 p-4 rounded-2xl text-xs text-red-800 flex items-center gap-3 font-bold">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <span>تم إلغاء هذا الطلب واسترجاع المبلغ إن وُجد.</span>
          </div>
        ) : (
          <div className="relative">
            {/* Steps line */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 relative">
              {timelineSteps.map((step, idx) => {
                const isPassed = currentStepIndex >= idx;
                const isCurrent = currentStepIndex === idx;

                return (
                  <div key={step.key} className="flex flex-col items-center text-center space-y-2">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all z-10 ${
                        isCurrent
                          ? "bg-emerald-600 text-white ring-4 ring-emerald-100 shadow-lg scale-110"
                          : isPassed
                          ? "bg-emerald-600 text-white"
                          : "bg-gray-100 text-gray-400 border border-gray-200"
                      }`}
                    >
                      {isPassed ? "✓" : idx + 1}
                    </div>

                    <div>
                      <div
                        className={`text-xs font-bold ${
                          isPassed ? "text-gray-900" : "text-gray-400"
                        }`}
                      >
                        {step.label}
                      </div>
                      <div className="text-[10px] text-gray-500 mt-0.5 max-w-[120px]">
                        {step.desc}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Items Table */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-gray-900 pb-3 border-b border-gray-100 flex items-center gap-2">
            <Package className="w-5 h-5 text-emerald-600" />
            <span>المنتجات المطلوبة ({order.items?.length || 0})</span>
          </h3>

          <div className="divide-y divide-gray-100">
            {order.items?.map((item: any) => (
              <div key={item.id} className="py-4 flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
                  <img
                    src={item.productImage}
                    alt={item.productName}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 text-xs sm:text-sm">
                    {item.productName}
                  </h4>
                  <div className="text-xs text-gray-500 mt-1">
                    الكمية: <span className="font-bold text-gray-800">{item.quantity}</span> ×{" "}
                    {item.unitPrice.toLocaleString("ar-SA")} ر.س
                  </div>
                </div>

                <div className="text-sm font-black text-gray-900 font-mono">
                  {item.total.toLocaleString("ar-SA")} ر.س
                </div>
              </div>
            ))}
          </div>

          {/* If Installment Plan exists for this order, show contract & schedule */}
          {order.installmentPlan && (
            <div className="mt-6 pt-6 border-t border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900">
                      عقد التقسيط المعتمد (#{order.installmentPlan.contractNumber})
                    </h4>
                    <span className="text-[11px] text-emerald-600 font-bold">
                      تمويل سما الخضراء الميسر للهواتف
                    </span>
                  </div>
                </div>
                <span className="text-xs font-black px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
                  {order.installmentPlan.status === "Active" ? "عقد ساري" : order.installmentPlan.status}
                </span>
              </div>

              {/* Installment Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center text-xs">
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <span className="text-slate-400 block text-[10px]">إجمالي التمويل</span>
                  <span className="font-black text-slate-900 font-mono mt-0.5 block">
                    {order.installmentPlan.totalPrice?.toLocaleString("en-US")} دينار
                  </span>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <span className="text-slate-400 block text-[10px]">الدفعة الأولى</span>
                  <span className="font-black text-emerald-700 font-mono mt-0.5 block">
                    {order.installmentPlan.downPayment?.toLocaleString("en-US")} دينار
                  </span>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <span className="text-slate-400 block text-[10px]">المبلغ المتبقي</span>
                  <span className="font-black text-slate-900 font-mono mt-0.5 block">
                    {order.installmentPlan.remainingAmount?.toLocaleString("en-US")} دينار
                  </span>
                </div>
                <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-200">
                  <span className="text-emerald-800 block text-[10px] font-bold">القسط الشهري ({order.installmentPlan.monthsCount} شهر)</span>
                  <span className="font-black text-emerald-900 font-mono mt-0.5 block text-sm">
                    {order.installmentPlan.monthlyInstallment?.toLocaleString("en-US")} دينار
                  </span>
                </div>
              </div>

              {/* Installment Payments Schedule */}
              {order.installmentPlan.payments && order.installmentPlan.payments.length > 0 && (
                <div className="space-y-2 pt-2">
                  <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-emerald-600" />
                    <span>جدول الأقساط الشهرية وتواريخ الاستحقاق:</span>
                  </div>
                  <div className="max-h-56 overflow-y-auto divide-y divide-slate-100 rounded-2xl border border-slate-100 bg-slate-50/50">
                    {order.installmentPlan.payments.map((p: any) => (
                      <div key={p.id} className="p-3 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2.5">
                          <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[10px] font-bold">
                            {p.installmentNumber}
                          </span>
                          <div>
                            <div className="font-bold text-slate-800">
                              القسط #{p.installmentNumber}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              الاستحقاق: {new Date(p.dueDate).toLocaleDateString("ar-IQ")}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="font-black font-mono text-slate-900">
                            {p.amount.toLocaleString("en-US")} دينار
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            p.status === "Paid" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                          }`}>
                            {p.status === "Paid" ? "مسدد ✓" : "قيد الاستحقاق"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Shipping & Payment Meta */}
        <div className="space-y-6">
          {/* Shipping Card */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>عنوان التوصيل</span>
            </h3>
            <div className="text-xs font-bold text-gray-900">{order.shippingAddress}</div>
            <div className="text-xs text-gray-600">المدينة: {order.city}</div>
            {order.postalCode && (
              <div className="text-xs text-gray-600">الرمز البريدي: {order.postalCode}</div>
            )}
            <div className="text-xs text-gray-600 font-mono">الهاتف: {order.customerPhone}</div>
          </div>

          {/* Payment & Financial Breakdown */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-emerald-600" />
              <span>بيانات الدفع والملخص</span>
            </h3>

            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>طريقة الدفع:</span>
                <span className="font-bold text-gray-900">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span>حالة السداد:</span>
                <span className="font-bold text-emerald-700">{order.paymentStatus}</span>
              </div>
              <div className="flex justify-between">
                <span>المجموع الفرعي:</span>
                <span className="font-mono">{order.subtotal?.toLocaleString("en-US")} دينار</span>
              </div>
              <div className="flex justify-between">
                <span>ضريبة القيمة المضافة:</span>
                <span className="font-mono">{order.taxAmount?.toLocaleString("en-US")} دينار</span>
              </div>
              <div className="flex justify-between">
                <span>الشحن:</span>
                <span>{order.shippingFee === 0 ? "مجاني" : `${order.shippingFee.toLocaleString("en-US")} دينار`}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-gray-900 pt-3 border-t border-gray-100">
                <span>الإجمالي:</span>
                <span className="text-emerald-700 font-mono">
                  {order.totalAmount?.toLocaleString("en-US")} دينار
                </span>
              </div>
            </div>

            {/* Transaction security proof */}
            {order.transactions && order.transactions.length > 0 && (
              <div className="mt-4 pt-3 border-t border-gray-100 text-[11px] text-gray-500 space-y-1">
                <div className="font-bold text-gray-700 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>التحقق البنكي المعتمد:</span>
                </div>
                <div className="font-mono text-[10px] text-gray-600">
                  ID: {order.transactions[0].transactionId}
                </div>
                <div className="font-mono text-[10px] text-gray-600">
                  المرجع: {order.transactions[0].gatewayReference || "GW-VERIFIED"}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Payment Gateway Modal (if re-paying) */}
      {showPaymentModal && (
        <PaymentModal
          orderId={order.id}
          orderNumber={order.orderNumber}
          totalAmount={order.totalAmount}
          paymentIntent={{
            transactionId: order.transactions?.[0]?.transactionId || `txn_${Date.now()}`,
            clientSecret: "sec_temp_client",
            gatewayReference: order.transactions?.[0]?.gatewayReference || "GW-DIRECT",
            amount: order.totalAmount,
            currency: "SAR",
            paymentMethod: order.paymentMethod,
          }}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={() => {
            setShowPaymentModal(false);
            fetchOrder();
          }}
        />
      )}
    </div>
  );
}
