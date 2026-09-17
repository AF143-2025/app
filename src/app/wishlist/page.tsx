"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Heart,
  ShoppingBag,
  ArrowRight,
  Trash2,
  Sparkles,
  Smartphone,
  ShieldCheck,
  Layers,
} from "lucide-react";
import { useCart } from "@/components/cart-context";

export default function WishlistPage() {
  const { wishlist, toggleWishlist, addToCart } = useCart();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState<string | null>(null);

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        const res = await fetch("/api/products");
        const data = await res.json();
        if (data.success && Array.isArray(data.products)) {
          setProducts(data.products);
        }
      } catch (err) {
        console.error("Error loading products for wishlist:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  const favoriteProducts = products.filter((p) => wishlist.includes(p.id));

  const handleAddToCart = async (productId: string) => {
    setAddingId(productId);
    await addToCart(productId, 1);
    setAddingId(null);
  };

  return (
    <div className="min-h-[80vh] py-6 sm:py-10 text-right" dir="rtl">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header Breadcrumb & Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Link href="/" className="hover:text-emerald-700 transition-colors flex items-center gap-1">
                <ArrowRight className="w-3.5 h-3.5" />
                الرئيسية
              </Link>
              <span>/</span>
              <span className="text-emerald-700 font-bold">المفضلة</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2.5">
              <Heart className="w-7 h-7 text-red-500 fill-red-500" />
              <span>قائمة المفضلة والمحفوظات</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              الأجهزة والملحقات التي قمت بحفظها في متجر سما الخضراء للرجوع إليها لاحقاً أو شرائها
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-black px-3.5 py-1.5 rounded-full">
              {wishlist.length} منتج محفوظ
            </span>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-slate-500 font-bold">جاري تحميل قائمتك المفضلة...</p>
          </div>
        ) : favoriteProducts.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 sm:p-14 text-center border border-slate-100 shadow-sm max-w-lg mx-auto space-y-5 my-8">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-red-50 border border-red-100 flex items-center justify-center text-red-500 shadow-sm">
              <Heart className="w-10 h-10 stroke-[1.5]" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg sm:text-xl font-black text-slate-900">
                قائمة المفضلة فارغة حالياً
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
                لم تقم بإضافة أي هاتف أو ملحق إلى قائمة رغباتك بعد. اضغط على رمز القلب ❤️ بجانب أي منتج لحفظه هنا.
              </p>
            </div>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-black rounded-2xl shadow-lg shadow-emerald-700/20 transition-all active:scale-95"
            >
              <Smartphone className="w-4 h-4" />
              <span>تصفح أحدث الهواتف والملحقات</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {favoriteProducts.map((product) => {
              const monthlyEst = Math.round(product.price / 12);
              const isAdding = addingId === product.id;

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden group relative tap-bounce"
                >
                  {/* Remove button */}
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className="absolute top-2.5 left-2.5 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs text-rose-500 hover:bg-rose-50 border border-slate-200/60 shadow-xs flex items-center justify-center transition-colors active:scale-90"
                    title="حذف من المفضلة"
                    aria-label="حذف من المفضلة"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  {/* Image */}
                  <div className="relative aspect-square bg-slate-50/90 overflow-hidden flex items-center justify-center p-4">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute bottom-2.5 right-2.5 bg-slate-900/80 backdrop-blur-xs text-white text-[9.5px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      <span>ضمان سما الخضراء</span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md">
                        {product.category === "used" ? "مستعمل مفحوص" : "جهاز أصلي معتمد"}
                      </span>
                      <h3 className="font-bold text-sm text-slate-900 mt-1.5 line-clamp-2 leading-snug">
                        {product.name}
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>
                    </div>

                    <div className="space-y-3 pt-2 border-t border-slate-100">
                      <div className="flex items-baseline justify-between">
                        <div>
                          <div className="text-base font-black text-slate-950">
                            {product.price.toLocaleString("ar-IQ")} <span className="text-xs text-emerald-700">د.ع</span>
                          </div>
                          {product.originalPrice && product.originalPrice > product.price && (
                            <div className="text-[11px] text-slate-400 line-through">
                              {product.originalPrice.toLocaleString("ar-IQ")} د.ع
                            </div>
                          )}
                        </div>

                        <div className="text-left">
                          <span className="text-[10px] text-slate-400 block">قسط شهري يبدأ من:</span>
                          <span className="text-xs font-bold text-slate-800 font-mono">
                            {monthlyEst.toLocaleString("ar-IQ")} د.ع
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          onClick={() => handleAddToCart(product.id)}
                          disabled={isAdding}
                          className="w-full h-9 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-95 disabled:opacity-50"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>{isAdding ? "جاري الإضافة..." : "إضافة للسلة"}</span>
                        </button>

                        <Link
                          href="/checkout"
                          onClick={() => addToCart(product.id, 1)}
                          className="w-full h-9 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95"
                        >
                          <Layers className="w-3.5 h-3.5 text-emerald-400" />
                          <span>شراء / تقسيط</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
