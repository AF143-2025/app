"use client";

import React from "react";
import Link from "next/link";
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  ArrowLeft,
  ShieldCheck,
  CreditCard,
  Layers,
  Sparkles,
  Calendar,
} from "lucide-react";
import { useCart } from "./cart-context";

export function CartDrawer() {
  const {
    items,
    isCartOpen,
    closeCart,
    totalItems,
    subtotal,
    shippingFee,
    totalAmount,
    updateQuantity,
    removeFromCart,
    purchaseType,
    setPurchaseType,
    installmentMonths,
    setInstallmentMonths,
    downPayment,
    setDownPayment,
  } = useCart();

  if (!isCartOpen) return null;

  // Installment calculations in IQD
  const activeDown = Math.min(downPayment, totalAmount);
  const remainingFinanced = Math.max(0, totalAmount - activeDown);
  const monthlyAmount = Math.round(remainingFinanced / (installmentMonths || 12));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden text-right" dir="rtl">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 left-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-left duration-200">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-black text-slate-900 leading-tight">
                  سلة سما الخضراء للهواتف ({totalItems})
                </h2>
                <span className="text-[10px] text-emerald-600 font-bold">
                  شراء هواتف كاش • أقساط ميسرة
                </span>
              </div>
            </div>
            <button
              onClick={closeCart}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
                <div className="w-16 h-16 rounded-3xl bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-slate-800 mb-1">
                  السلة فارغة حالياً
                </h3>
                <p className="text-xs text-slate-500 max-w-xs mb-4">
                  تصفح هواتف وإكسسوارات سما الخضراء واختر نظام الشراء المباشر أو بالأقساط.
                </p>
                <button
                  onClick={closeCart}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-600/20"
                >
                  تصفح المنتجات الآن
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 p-3 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                >
                  {/* Image */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-white flex-shrink-0 relative border border-slate-200 flex items-center justify-center p-1">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="text-xs font-bold text-slate-900 line-clamp-2 leading-relaxed">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-slate-400 hover:text-red-600 transition-colors p-1"
                          title="حذف المنتج"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="text-xs font-black text-emerald-700 mt-1">
                        {item.product.price.toLocaleString("ar-IQ")} د.ع
                      </div>
                    </div>

                    {/* Quantity Selector */}
                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-200/60">
                      <div className="flex items-center border border-slate-200 bg-white rounded-lg shadow-sm">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-r-lg transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-7 text-center text-xs font-bold text-slate-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock}
                          className="w-6 h-6 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-l-lg transition-colors disabled:opacity-40"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-xs font-black text-slate-900">
                        {(item.product.price * item.quantity).toLocaleString("ar-IQ")} د.ع
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Purchase Mode Switcher */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 space-y-3.5 pb-[calc(env(safe-area-inset-bottom,0px)+1.2rem)]">
              {/* Mode Selection: Direct vs Installment */}
              <div>
                <div className="text-[11px] font-bold text-slate-500 mb-1.5 flex items-center justify-between">
                  <span>طريقة الشراء والدفع المطلوبة:</span>
                  <span className="text-emerald-700 font-extrabold text-[10px]">
                    {purchaseType === "DIRECT" ? "دفع فوري نقدي" : "تقسيط مريح وميسر"}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 bg-slate-200/60 p-1 rounded-2xl">
                  <button
                    type="button"
                    onClick={() => setPurchaseType("DIRECT")}
                    className={`py-2 px-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all ${
                      purchaseType === "DIRECT"
                        ? "bg-white text-emerald-800 shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                    <span>بيع مباشر (كاش)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPurchaseType("INSTALLMENT")}
                    className={`py-2 px-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all ${
                      purchaseType === "INSTALLMENT"
                        ? "bg-emerald-700 text-white shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>شراء بالأقساط</span>
                  </button>
                </div>
              </div>

              {/* Installment Options Drawer View */}
              {purchaseType === "INSTALLMENT" ? (
                <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-3 space-y-2.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-950 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-emerald-700" /> مدة التقسيط:
                    </span>
                    <div className="flex gap-1">
                      {[6, 10, 12, 24].map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setInstallmentMonths(m)}
                          className={`px-2 py-1 rounded-lg text-[10px] font-black transition-all ${
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

                  <div className="flex items-center justify-between pt-1 border-t border-emerald-200/60">
                    <span className="text-slate-600 text-[11px]">القسط الشهري المقدر:</span>
                    <span className="font-black text-emerald-800 text-sm">
                      {monthlyAmount.toLocaleString("ar-IQ")} د.ع / شهر
                    </span>
                  </div>
                </div>
              ) : (
                /* Direct Summary */
                <div className="space-y-1 text-xs text-slate-600 bg-white p-3 rounded-2xl border border-slate-100">
                  <div className="flex justify-between">
                    <span>المجموع الإجمالي:</span>
                    <span className="font-extrabold text-slate-900">
                      {totalAmount.toLocaleString("ar-IQ")} د.ع
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>التوصيل:</span>
                    <span className="font-bold text-emerald-600">
                      {shippingFee === 0 ? "مجاني لكافة المحافظات" : `${shippingFee.toLocaleString("ar-IQ")} د.ع`}
                    </span>
                  </div>
                </div>
              )}

              {/* Checkout Link */}
              <Link
                href="/checkout"
                onClick={closeCart}
                className="w-full py-4 px-4 rounded-[1.5rem] bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_8px_24px_-8px_rgba(16,185,129,0.4)] transition-all hover:scale-[1.01]"
              >
                <span>
                  {purchaseType === "INSTALLMENT"
                    ? "متابعة تقديم طلب التقسيط"
                    : "متابعة الشراء المباشر"}
                </span>
                <ArrowLeft className="w-4 h-4" />
              </Link>

              <div className="text-center flex items-center justify-center gap-1.5 text-[10px] text-slate-500 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>سما الخضراء للهواتف • ضمان رسمي وعقود معتمدة</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
