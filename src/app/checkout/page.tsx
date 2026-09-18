"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  CreditCard,
  Smartphone,
  Building,
  Banknote,
  ShieldCheck,
  Lock,
  ArrowRight,
  ArrowLeft,
  Truck,
  CheckCircle2,
  Layers,
  Calendar,
  UserCheck,
  Sparkles,
} from "lucide-react";
import { useCart } from "@/components/cart-context";
import { PaymentModal } from "@/components/payment-modal";

export default function CheckoutPage() {
  const router = useRouter();
  const {
    items,
    totalItems,
    subtotal,
    shippingFee,
    totalAmount,
    userId,
    user,
    refreshCart,
    clearCart,
  } = useCart();

  // Form Fields
  const [customerName, setCustomerName] = useState(user?.name || "");
  const [customerEmail, setCustomerEmail] = useState(user?.email || "");
  const [customerPhone, setCustomerPhone] = useState(user?.phone || "");
  const [city, setCity] = useState("بغداد");
  const [shippingAddress, setShippingAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");

  // Payment Method selection
  const [paymentMethod, setPaymentMethod] = useState<
    "ZAIN_CASH" | "QI_CARD" | "FIB" | "CARD" | "COD"
  >("ZAIN_CASH");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync with logged in user if available
  useEffect(() => {
    if (user) {
      if (user.name) setCustomerName(user.name);
      if (user.email) setCustomerEmail(user.email);
      if (user.phone) setCustomerPhone(user.phone);
    }
  }, [user]);

  // Payment Modal Trigger State (for direct card/gateway)
  const [paymentModalData, setPaymentModalData] = useState<{
    orderId: string;
    orderNumber: string;
    totalAmount: number;
    paymentIntent: any;
  } | null>(null);

  const handleSubmitCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          customerName,
          customerEmail,
          customerPhone,
          shippingAddress,
          city,
          postalCode,
          paymentMethod,
          items,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setErrorMessage(data.error || "تعذر إتمام الطلب");
        setIsSubmitting(false);
        return;
      }

      await clearCart();

      // If COD, navigate straight to order page
      if (data.isCOD) {
        router.push(`/orders/${data.orderId}`);
      } else {
        // Direct electronic payment simulation modal
        setPaymentModalData({
          orderId: data.orderId,
          orderNumber: data.orderNumber,
          totalAmount: data.totalAmount,
          paymentIntent: data.paymentIntent,
        });
      }
    } catch (err: any) {
      setErrorMessage(err.message || "حدث خطأ غير متوقع أثناء معالجة الطلب");
    } finally {
      setIsSubmitting(false);
    }
  };

  const directMethods = [
    {
      id: "ZAIN_CASH",
      name: "زين كاش (ZainCash)",
      desc: "خصم فوري من المحفظة أو مسح رمز QR",
      icon: Smartphone,
      color: "border-pink-500 bg-pink-50/40 text-pink-700",
      badge: "دفع سريع",
    },
    {
      id: "QI_CARD",
      name: "كي كارد (Qi Card)",
      desc: "بطاقة الرواتب والماستر كارد الرافدين والرشيد",
      icon: CreditCard,
      color: "border-amber-500 bg-amber-50/40 text-amber-800",
      badge: "شائع جداً",
    },
    {
      id: "FIB",
      name: "مصرف العراق الأول (FIB)",
      desc: "دفع فوري عبر تطبيق FIB المصرفي المعتمد",
      icon: Building,
      color: "border-blue-500 bg-blue-50/40 text-blue-700",
      badge: "تحويل مباشر",
    },
    {
      id: "CARD",
      name: "فيزا / ماستر كارد دولية",
      desc: "بطاقات الدفع الائتمانية والمدينة العالمية",
      icon: CreditCard,
      color: "border-emerald-500 bg-emerald-50/40 text-emerald-800",
      badge: "أمان 3DS",
    },
    {
      id: "COD",
      name: "الدفع نقداً عند الاستلام",
      desc: "ادفع كاش لمندوب التوصيل عند استلام الطلب وفحصه",
      icon: Banknote,
      color: "border-slate-500 bg-slate-50/40 text-slate-800",
      badge: "كاش",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-right" dir="rtl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/" className="hover:text-emerald-700 transition-colors">
          سما الخضراء للهواتف
        </Link>
        <span>/</span>
        <Link href="/cart" className="hover:text-emerald-700 transition-colors">
          السلة
        </Link>
        <span>/</span>
        <span className="font-bold text-slate-800">إتمام الطلب والدفع</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <h1 className="text-xl sm:text-3xl font-black text-slate-900 flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20 shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <span>إتمام الطلب والدفع الآمن</span>
        </h1>
        <span className="text-[11px] sm:text-xs font-bold text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-full self-start sm:self-auto">
          سما الخضراء • بغداد وكافة المحافظات
        </span>
      </div>

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl text-xs font-bold">
          ⚠️ {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmitCheckout} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Columns: Information and Payment Specifics */}
        <div className="lg:col-span-2 space-y-6">
          {/* 1. Customer & Shipping Details */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-base font-bold text-slate-900">
              <Truck className="w-5 h-5 text-emerald-600" />
              <span>1. بيانات العميل وعنوان التوصيل</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  الاسم الكامل للعميل *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  placeholder="علي محمد الكرخي"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  البريد الإلكتروني (اختياري / للإشعارات)
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none text-left"
                  dir="ltr"
                  placeholder="buyer@sama-alkhadraa.iq"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  رقم هاتف العميل للتواصل *
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none text-left"
                  dir="ltr"
                  placeholder="0770 123 4567"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  المحافظة / المدينة *
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  placeholder="بغداد / البصرة / أربيل / النجف"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  العنوان بالتفصيل (المنطقة، أقرب نقطة دالة) *
                </label>
                <input
                  type="text"
                  required
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  placeholder="الكرادة، شارع المسبح، مجاور مصرف الرافدين"
                />
              </div>
            </div>
          </div>

          {/* 2. اختر طريقة الدفع */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-base font-bold text-slate-900">
              <CreditCard className="w-5 h-5 text-emerald-600" />
              <span>2. اختر طريقة الدفع</span>
            </div>

            <div className="space-y-3">
              {directMethods.map((method) => {
                const Icon = method.icon;
                const isSelected = paymentMethod === method.id;

                return (
                  <label
                    key={method.id}
                    className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      isSelected
                        ? "border-emerald-600 bg-emerald-50/50 shadow-sm"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.id}
                        checked={isSelected}
                        onChange={() => setPaymentMethod(method.id as any)}
                        className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                      />
                      <div className={`p-2.5 rounded-xl border ${method.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-black text-slate-900 text-xs sm:text-sm">
                          {method.name}
                        </div>
                        <div className="text-[11px] text-slate-500">{method.desc}</div>
                      </div>
                    </div>

                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {method.badge}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Action */}
        <div className="space-y-4 sticky top-24">
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xl space-y-5">
            <h2 className="text-base font-black text-slate-900 pb-3 border-b border-slate-100">
              ملخص الطلب ({totalItems} قطع)
            </h2>

            {/* Items mini list */}
            <div className="max-h-48 overflow-y-auto space-y-2.5 pr-1 scrollbar-thin">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-8 h-8 rounded-lg object-cover border border-slate-200"
                    />
                    <div>
                      <span className="font-bold text-slate-800 line-clamp-1 max-w-[140px]">
                        {item.product.name}
                      </span>
                      <span className="text-slate-400 text-[10px]">الكمية: {item.quantity}</span>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-slate-900">
                    {(item.product.price * item.quantity).toLocaleString("en-US")} دينار
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-2 text-xs text-slate-600 pt-3 border-t border-slate-100">
              <div className="flex justify-between">
                <span>المجموع الفرعي:</span>
                <span className="font-bold text-slate-900 font-mono">
                  {subtotal.toLocaleString("en-US")} دينار
                </span>
              </div>
              <div className="flex justify-between">
                <span>أجور التوصيل:</span>
                <span className="font-bold text-emerald-600">
                  {shippingFee === 0 ? "مجاني" : `${shippingFee.toLocaleString("en-US")} دينار`}
                </span>
              </div>

              <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200">
                <span>الإجمالي الكلي:</span>
                <span className="text-emerald-700 font-mono">
                  {totalAmount.toLocaleString("en-US")} دينار
                </span>
              </div>

            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || items.length === 0}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 text-white font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-600/25 transition-all hover:scale-[1.01]"
            >
              {isSubmitting ? (
                <span>جاري معالجة الطلب...</span>
              ) : (
                <>
                  <span>إتمام وتأكيد الطلب الآن</span>
                  <ArrowLeft className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="text-center flex items-center justify-center gap-1.5 text-[10px] text-slate-500 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>نظام دفع وتشغيل عراقي معتمد 100% • سما الخضراء للهواتف</span>
            </div>
          </div>
        </div>
      </form>

      {/* Payment Gateway Modal (for direct online payment simulation) */}
      {paymentModalData && (
        <PaymentModal
          orderId={paymentModalData.orderId}
          orderNumber={paymentModalData.orderNumber}
          totalAmount={paymentModalData.totalAmount}
          paymentIntent={paymentModalData.paymentIntent}
          onSuccess={() => {
            router.push(`/orders/${paymentModalData.orderId}`);
          }}
          onClose={() => setPaymentModalData(null)}
        />
      )}
    </div>
  );
}
