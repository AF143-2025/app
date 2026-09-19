"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  X,
  Star,
  ShoppingBag,
  ShieldCheck,
  Truck,
  RefreshCw,
  Plus,
  Minus,
  Check,
  Heart,
  MessageCircle,
  Layers,
  Sparkles,
} from "lucide-react";
import { useCart } from "./cart-context";

interface ProductDetailModalProps {
  product: any | null;
  onClose: () => void;
}

export function ProductDetailModal({ product, onClose }: ProductDetailModalProps) {
  const router = useRouter();
  const { items, addToCart, isInWishlist, toggleWishlist } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const isInCart = items.some(
    (item) => item.productId === product?.id || item.product?.id === product?.id
  );
  const [selectedStorage, setSelectedStorage] = useState("256GB");
  const [selectedColor, setSelectedColor] = useState("تيتانيوم طبيعي");

  if (!product) return null;

  const handleAdd = async () => {
    if (product.stock === 0 || isAdding) return;
    setIsAdding(true);
    const success = await addToCart(product.id, quantity, product);
    setIsAdding(false);
    if (success) {
      setJustAdded(true);
      setTimeout(() => {
        setJustAdded(false);
        onClose();
      }, 1200);
    }
  };

  const isOutOfStock = product.stock === 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" dir="rtl">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      <div className="min-h-full flex items-center justify-center p-2 sm:p-4">
        <div className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-100 max-h-[92vh] flex flex-col overflow-y-auto touch-scroll text-right">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 left-4 z-20 p-2.5 rounded-full bg-white/90 backdrop-blur-md text-slate-500 hover:text-slate-800 hover:bg-white shadow-md transition-colors"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Image */}
            <div className="relative aspect-square md:aspect-auto bg-slate-50 overflow-hidden flex items-center justify-center">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md text-slate-800 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                ⭐ {product.rating.toFixed(1)} تقييم المتسوقين
              </div>
            </div>

            {/* Content */}
            <div className="p-5 sm:p-6 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-xs font-bold text-emerald-700">
                    {product.seller?.storeName || "سما الخضراء المعتمد"}
                  </span>
                  {product.stock > 5 ? (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      ● متوفر بالمخزون
                    </span>
                  ) : product.stock > 0 ? (
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                      ⚠️ متبقي {product.stock} قطع
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                      ✕ غير متوفر
                    </span>
                  )}
                </div>

                <h2 className="text-base sm:text-xl font-black text-slate-900 leading-snug mb-2">
                  {product.name}
                </h2>

                {/* Price */}
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-2xl font-black text-emerald-800">
                    {product.price.toLocaleString("en-US")} دينار
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-sm text-slate-400 line-through">
                      {product.originalPrice.toLocaleString("en-US")} دينار
                    </span>
                  )}
                </div>

                {/* Storage Variants (for phones/electronics) */}
                {(product.category === "phones" || product.category === "electronics") && (
                  <div className="space-y-1.5 mb-3">
                    <span className="text-[11px] font-bold text-slate-700 block">سعة الذاكرة:</span>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {["128GB", "256GB", "512GB", "1TB"].map((cap) => (
                        <button
                          key={cap}
                          type="button"
                          onClick={() => setSelectedStorage(cap)}
                          className={`px-3 py-1 rounded-xl text-[11px] font-bold border transition-all active:scale-95 ${
                            selectedStorage === cap
                              ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                              : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                          }`}
                        >
                          {cap}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Color Variants */}
                <div className="space-y-1.5 mb-3">
                  <span className="text-[11px] font-bold text-slate-700 block">اللون المختار:</span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {["تيتانيوم صحراوي", "تيتانيوم طبيعي", "أسود فلكي", "أبيض ناصع"].map((clr) => (
                      <button
                        key={clr}
                        type="button"
                        onClick={() => setSelectedColor(clr)}
                        className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border transition-all active:scale-95 ${
                          selectedColor === clr
                            ? "bg-emerald-50 text-emerald-800 border-emerald-400 font-black shadow-sm"
                            : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {clr}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  {product.description}
                </p>

                {/* Value Propositions */}
                <div className="grid grid-cols-3 gap-2 py-2.5 border-y border-slate-100 text-center text-[10px] text-slate-600 mb-3">
                  <div className="flex flex-col items-center gap-1">
                    <Truck className="w-4 h-4 text-emerald-600" />
                    <span>توصيل المحافظات</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>ضمان رسمي معتمد</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <RefreshCw className="w-4 h-4 text-emerald-600" />
                    <span>فحص وصيانة فورية</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons Section */}
              <div className="space-y-2.5 pt-1">
                {/* Quantity selector */}
                <div className="flex items-center justify-between bg-slate-50 p-2 rounded-2xl border border-slate-100">
                  <span className="text-xs font-bold text-slate-700">الكمية المطلوبة:</span>
                  <div className="flex items-center border border-slate-200 rounded-xl bg-white">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded-r-xl transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-9 text-center text-xs font-black text-slate-900">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      disabled={quantity >= product.stock}
                      className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded-l-xl transition-colors disabled:opacity-30"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Primary Add to Cart + Wishlist row */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleAdd}
                    disabled={isAdding || isOutOfStock}
                    className={`flex-1 py-3 px-4 rounded-2xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 shadow-lg transition-all min-h-[44px] ${
                      justAdded || isInCart
                        ? "bg-emerald-700 text-white shadow-emerald-700/25"
                        : isOutOfStock
                        ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                        : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20 active:scale-[0.98]"
                    }`}
                  >
                    {justAdded || isInCart ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>موجود في السلة</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>أضف إلى السلة 🛒</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleWishlist(product.id)}
                    className={`p-3 rounded-2xl border transition-all flex items-center justify-center min-w-[44px] min-h-[44px] ${
                      isInWishlist(product.id)
                        ? "bg-red-50 border-red-200 text-red-600 shadow-sm"
                        : "bg-slate-50 border-slate-200 text-slate-500 hover:text-red-500 hover:bg-white"
                    }`}
                    title={isInWishlist(product.id) ? "إزالة من المفضلة" : "إضافة للمفضلة"}
                    aria-label="المفضلة"
                  >
                    <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? "fill-red-600 text-red-600" : ""}`} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
