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
                  تصفح هواتف وإكسسوارات متجر سما الخضراء وأضف ما يعجبك إلى السلة.
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
                        {item.product.price.toLocaleString("en-US")} دينار
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
                        {(item.product.price * item.quantity).toLocaleString("en-US")} دينار
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
              {/* Summary */}
              <div className="space-y-2 text-xs text-slate-600 bg-white p-3.5 rounded-2xl border border-slate-100 shadow-2xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-700">المجموع الإجمالي:</span>
                  <span className="text-base font-black text-slate-950 font-mono">
                    {totalAmount.toLocaleString("en-US")} <span className="text-xs text-emerald-700 font-bold">دينار</span>
                  </span>
                </div>
                <div className="flex justify-between items-center text-[11px] text-slate-500 pt-1.5 border-t border-slate-100">
                  <span>التوصيل:</span>
                  <span className="font-bold text-emerald-600">
                    {shippingFee === 0 ? "مجاني لكافة المحافظات" : `${shippingFee.toLocaleString("en-US")} دينار`}
                  </span>
                </div>
              </div>

              {/* Checkout Link */}
              <Link
                href="/checkout"
                onClick={closeCart}
                className="w-full py-4 px-4 rounded-[1.5rem] bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_8px_24px_-8px_rgba(16,185,129,0.4)] transition-all hover:scale-[1.01]"
              >
                <span>متابعة إتمام الطلب</span>
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
