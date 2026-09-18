"use client";

import React from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  ArrowLeft,
  ShieldCheck,
  Truck,
  CreditCard,
  Layers,
  Calendar,
  Sparkles,
  ChevronLeft,
} from "lucide-react";
import { useCart } from "@/components/cart-context";

export default function CartPage() {
  const {
    items,
    totalItems,
    subtotal,
    shippingFee,
    totalAmount,
    updateQuantity,
    removeFromCart,
    clearCart,
    purchaseType,
    setPurchaseType,
    installmentMonths,
    setInstallmentMonths,
    downPayment,
    setDownPayment,
  } = useCart();

  const activeDown = Math.min(downPayment, totalAmount);
  const remainingFinanced = Math.max(0, totalAmount - activeDown);
  const monthlyAmount = Math.round(remainingFinanced / (installmentMonths || 12));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-right" dir="rtl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/" className="hover:text-emerald-700 transition-colors">
          سما الخضراء للهواتف
        </Link>
        <span>/</span>
        <span className="font-bold text-slate-800">سلة المشتريات</span>
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <span>سلة المشتريات</span>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
            {totalItems} أجهزة
          </span>
        </h1>

        {items.length > 0 && (
          <button
            onClick={clearCart}
            className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>تفريغ السلة</span>
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm space-y-4 max-w-md mx-auto">
          <div className="w-20 h-20 rounded-3xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center text-3xl">
            🛍️
          </div>
          <h2 className="text-xl font-bold text-slate-900">سلة التسوق فارغة</h2>
          <p className="text-xs text-slate-500">
            لم تقم بإضافة أي منتجات للسلة بعد.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-2xl transition-all shadow-xs active:scale-95"
          >
            <span>تصفح المنتجات</span>
            <ChevronLeft className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Items List */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs hover:border-emerald-300 transition-all flex flex-col sm:flex-row items-center gap-4"
              >
                {/* Image */}
                <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-50 flex-shrink-0 border border-slate-200/80 flex items-center justify-center p-2">
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 text-center sm:text-right space-y-1">
                  <div className="text-[11px] font-bold text-emerald-600">
                    {item.product.category}
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug">
                    {item.product.name}
                  </h3>
                  <div className="text-xs font-black text-emerald-700 font-mono">
                    {item.product.price.toLocaleString("en-US")} دينار للقطعة
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center justify-between w-full sm:w-auto gap-3">
                  <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-200 rounded-r-xl transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-9 text-center text-xs font-bold text-slate-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.product.stock}
                      className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-200 rounded-l-xl transition-colors disabled:opacity-30"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-sm font-black text-slate-900 sm:w-28 text-left font-mono">
                    {(item.product.price * item.quantity).toLocaleString("en-US")} دينار
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                    title="حذف"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary & Installment Choice Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xl space-y-5 sticky top-24">
            <h2 className="text-lg font-black text-slate-900 pb-3 border-b border-slate-100 flex items-center justify-between">
              <span>خيارات الشراء والدفع</span>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                سما الخضراء للهواتف
              </span>
            </h2>

            {/* Direct vs Installment Choice Tabs */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-600">
                حدد نظام الشراء المفضل:
              </label>
              <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setPurchaseType("DIRECT")}
                  className={`py-2.5 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all ${
                    purchaseType === "DIRECT"
                      ? "bg-white text-emerald-800 shadow-md"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                  <span>شراء كاش مباشر</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPurchaseType("INSTALLMENT")}
                  className={`py-2.5 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all ${
                    purchaseType === "INSTALLMENT"
                      ? "bg-emerald-700 text-white shadow-md"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  <span>شراء بالأقساط</span>
                </button>
              </div>
            </div>

            {/* If Installment Selected: Duration and Preview */}
            {purchaseType === "INSTALLMENT" ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-emerald-700" /> مدة التقسيط المتاحة:
                  </span>
                  <div className="flex gap-1">
                    {[3, 6, 10, 12, 24].map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setInstallmentMonths(m)}
                        className={`px-2.5 py-1 rounded-xl text-xs font-black transition-all ${
                          installmentMonths === m
                            ? "bg-emerald-700 text-white shadow-sm"
                            : "bg-white text-emerald-900 border border-emerald-200"
                        }`}
                      >
                        {m} شهر
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-emerald-200/70 text-xs">
                  <div className="flex justify-between text-slate-700">
                    <span>إجمالي المبلغ الممول:</span>
                    <span className="font-bold font-mono">{totalAmount.toLocaleString("en-US")} دينار</span>
                  </div>
                  <div className="flex justify-between text-slate-700">
                    <span>الدفعة الأولى (اختيارية):</span>
                    <span className="font-bold font-mono">{downPayment.toLocaleString("en-US")} دينار</span>
                  </div>
                  <div className="flex justify-between items-center text-emerald-950 font-black text-sm pt-2 border-t border-emerald-200">
                    <span>القسط الشهري التقريبي:</span>
                    <span className="text-base text-emerald-800 font-mono">
                      {monthlyAmount.toLocaleString("en-US")} دينار / شهر
                    </span>
                  </div>
                </div>

                <div className="text-[11px] text-emerald-800 bg-white/70 p-2.5 rounded-xl border border-emerald-200/50">
                  تقسيط ميسر بالبطاقة الوطنية وبطاقة الدفع أو كفيل.
                </div>
              </div>
            ) : (
              /* Direct Order Summary */
              <div className="space-y-2.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>المجموع الفرعي:</span>
                  <span className="font-bold text-slate-900 font-mono">
                    {subtotal.toLocaleString("en-US")} دينار
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>تكلفة الشحن والتوصيل:</span>
                  <span className="font-bold text-emerald-600">
                    {shippingFee === 0 ? "مجاني لكافة المحافظات" : `${shippingFee.toLocaleString("en-US")} دينار`}
                  </span>
                </div>
                <div className="flex justify-between text-base font-black text-slate-900 pt-3 border-t border-slate-200">
                  <span>الإجمالي الكلي:</span>
                  <span className="text-emerald-700 font-mono">
                    {totalAmount.toLocaleString("en-US")} دينار
                  </span>
                </div>
              </div>
            )}

            {/* Checkout CTA */}
            <Link
              href="/checkout"
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-600/20 transition-all hover:scale-[1.01]"
            >
              <span>
                {purchaseType === "INSTALLMENT"
                  ? "متابعة طلب التقسيط"
                  : "متابعة إتمام الطلب"}
              </span>
              <ArrowLeft className="w-4 h-4" />
            </Link>

            <div className="text-center flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>دفع آمن ومعتمد 100%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
