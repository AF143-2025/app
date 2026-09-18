"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Heart,
  ShoppingBag,
  Check,
  CheckCircle2,
  ArrowRight,
  Clock,
} from "lucide-react";
import { useCart } from "@/components/cart-context";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = (params?.id as string) || "";

  const { addToCart, isInWishlist, toggleWishlist } = useCart();
  const [product, setProduct] = useState<any | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  // 1. Fetch Product and Related Products
  useEffect(() => {
    if (!productId) return;
    let isMounted = true;

    async function loadProductData() {
      try {
        setLoading(true);
        const res = await fetch(`/api/products/${productId}`);
        const data = await res.json();

        if (isMounted && data.success && data.product) {
          setProduct(data.product);

          // Fetch real related products excluding current product
          const targetCat = data.product.categoryId || data.product.category || "all";
          const relRes = await fetch(
            `/api/products?categoryId=${encodeURIComponent(targetCat)}&limit=8`
          );
          const relData = await relRes.json();

          let candidates = (relData.products || []).filter(
            (p: any) => p.id !== data.product.id
          );

          // Fallback to all products if category has few items
          if (candidates.length < 2) {
            const allRes = await fetch("/api/products?limit=8");
            const allData = await allRes.json();
            if (allData.success) {
              candidates = (allData.products || []).filter(
                (p: any) => p.id !== data.product.id
              );
            }
          }

          if (isMounted) {
            setRelatedProducts(candidates.slice(0, 4));
          }
        }
      } catch (err) {
        console.error("Failed to load product:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadProductData();
    return () => {
      isMounted = false;
    };
  }, [productId]);

  // Available Images (with fallback)
  const productImages = useMemo(() => {
    if (!product) return [];
    const list: string[] = [];
    if (product.imageUrl) list.push(product.imageUrl);
    if (Array.isArray(product.images)) {
      product.images.forEach((img: string) => {
        if (img && !list.includes(img)) list.push(img);
      });
    }
    return list.length > 0 ? list : ["/images/placeholder-phone.png"];
  }, [product]);

  // Add to cart handler
  const handleAddToCart = async () => {
    if (!product || product.stock <= 0 || isAdding) return;
    try {
      setIsAdding(true);
      const success = await addToCart(product.id, 1, product);
      if (success) {
        setJustAdded(true);
        setTimeout(() => setJustAdded(false), 2500);
      }
    } catch (err) {
      console.error("Add to cart error:", err);
    } finally {
      setIsAdding(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3" dir="rtl">
        <div className="w-10 h-10 rounded-full border-3 border-emerald-600 border-t-transparent animate-spin" />
        <p className="text-xs font-bold text-slate-500">جاري تحميل المنتج...</p>
      </div>
    );
  }

  // Not found state
  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 text-center space-y-4" dir="rtl">
        <div className="w-16 h-16 rounded-3xl bg-slate-100 flex items-center justify-center text-2xl">
          📱
        </div>
        <h1 className="text-lg font-black text-slate-900">المنتج غير موجود</h1>
        <p className="text-xs text-slate-500 max-w-xs">
          لم نتمكن من العثور على هذا المنتج، قد يكون تم نقله أو حذفه.
        </p>
        <button
          onClick={() => router.push("/")}
          className="px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs"
        >
          العودة للرئيسية
        </button>
      </div>
    );
  }

  const isAvailable = product.stock > 0;
  const descriptionText = product.description || "";
  const isLongDescription = descriptionText.length > 140;

  return (
    <div className="min-h-screen bg-[#f8fafc] py-4 sm:py-6 px-3 sm:px-6 text-right font-sans" dir="rtl">
      {/* Toast Feedback Alert */}
      {justAdded && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-2xl shadow-xl border border-emerald-500/40 flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>تمت إضافة المنتج إلى السلة بنجاح</span>
        </div>
      )}

      <div className="max-w-xl mx-auto space-y-4">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between pb-1">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-emerald-700 bg-white border border-slate-200/80 px-3 py-1.5 rounded-xl shadow-2xs transition-colors"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>رجوع</span>
          </button>

          <Link
            href="/"
            className="text-xs font-bold text-slate-500 hover:text-emerald-700 transition-colors"
          >
            الرئيسية
          </Link>
        </div>

        {/* ========================================================= */}
        {/* 1. صورة المنتج (Product Image Container)                  */}
        {/* ========================================================= */}
        <div className="bg-white rounded-[2rem] border border-transparent shadow-[0_4px_24px_-8px_rgba(0,0,0,0.06)] p-4 sm:p-6 relative overflow-hidden">
          {/* Wishlist Button on Image */}
          <button
            type="button"
            onClick={() => toggleWishlist(product.id)}
            className={`absolute top-4 left-4 z-10 w-10 h-10 rounded-full shadow-sm flex items-center justify-center transition-all ${
              isInWishlist(product.id)
                ? "bg-rose-50 text-rose-600 scale-105"
                : "bg-white/80 backdrop-blur-md text-slate-400 hover:text-rose-500 hover:bg-white hover:shadow-md"
            }`}
            title={isInWishlist(product.id) ? "إزالة من المفضلة" : "إضافة للمفضلة"}
            aria-label="المفضلة"
          >
            <Heart
              className={`w-5 h-5 ${
                isInWishlist(product.id) ? "fill-rose-600 text-rose-600" : ""
              }`}
            />
          </button>

          {/* Main Image View */}
          <div className="aspect-square w-full flex items-center justify-center bg-[#F8FAFC]/50 rounded-3xl p-2 sm:p-4 overflow-hidden">
            <img
              src={productImages[selectedImageIndex] || product.imageUrl}
              alt={product.name}
              className="w-full h-full object-contain drop-shadow-sm transition-transform duration-300"
            />
          </div>

          {/* Dots Navigation (Only if more than 1 image) */}
          {productImages.length > 1 && (
            <div className="flex items-center justify-center gap-1.5 pt-4">
              {productImages.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    selectedImageIndex === idx
                      ? "w-8 bg-emerald-500"
                      : "w-2 bg-slate-200 hover:bg-slate-300"
                  }`}
                  aria-label={`صورة ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* ========================================================= */}
        {/* 2. معلومات المنتج + 3. حالة المنتج + 4. أضف إلى السلة       */}
        {/* ========================================================= */}
        <div className="bg-white rounded-[2rem] border border-transparent shadow-[0_4px_24px_-8px_rgba(0,0,0,0.06)] p-5 sm:p-7 space-y-4">
          {/* اسم المنتج */}
          <h1 className="text-base sm:text-xl font-black text-slate-900 leading-snug">
            {product.name}
          </h1>

          {/* السعر بالدينار العراقي */}
          <div className="flex items-baseline gap-2">
            <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {Number(product.price).toLocaleString()} <span className="text-sm font-bold text-emerald-600">دينار</span>
            </div>

            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-slate-400 line-through">
                {Number(product.originalPrice).toLocaleString()} دينار
              </span>
            )}
          </div>

          {/* الوصف المختصر (مع عرض المزيد إذا كان طويلاً) */}
          {descriptionText && (
            <div className="pt-2 border-t border-slate-100 text-xs sm:text-sm text-slate-600 leading-relaxed">
              <p>
                {showFullDescription || !isLongDescription
                  ? descriptionText
                  : `${descriptionText.slice(0, 140)}...`}
                {isLongDescription && (
                  <button
                    type="button"
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-800 mr-1.5 underline cursor-pointer"
                  >
                    {showFullDescription ? "عرض أقل" : "عرض المزيد"}
                  </button>
                )}
              </p>
            </div>
          )}

          {/* 3. حالة المنتج (متوفر / سيتوفر قريبًا) */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600">حالة المنتج:</span>
            {isAvailable ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-xs font-black">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                <span>متوفر</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200 text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-slate-400" />
                <span>سيتوفر قريبًا</span>
              </span>
            )}
          </div>

          {/* 4. إضافة إلى السلة */}
          <div className="pt-2">
            {isAvailable ? (
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isAdding}
                className={`w-full py-3.5 px-6 rounded-2xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-md ${
                  justAdded
                    ? "bg-emerald-800 text-white shadow-emerald-800/20"
                    : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20"
                } disabled:opacity-60 cursor-pointer`}
              >
                {justAdded ? (
                  <>
                    <Check className="w-4 h-4 stroke-[2.5]" />
                    <span>تمت الإضافة إلى السلة</span>
                  </>
                ) : isAdding ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>جاري الإضافة...</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>أضف إلى السلة</span>
                  </>
                )}
              </button>
            ) : (
              <button
                type="button"
                disabled
                className="w-full py-3.5 px-6 rounded-2xl text-xs sm:text-sm font-bold bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Clock className="w-4 h-4 text-slate-400" />
                <span>سيتوفر قريبًا</span>
              </button>
            )}
          </div>
        </div>

        {/* ========================================================= */}
        {/* 5. قد يعجبك أيضًا (Related Products 2-Column Grid)        */}
        {/* ========================================================= */}
        {relatedProducts.length > 0 && (
          <section className="pt-2 space-y-3">
            <h2 className="text-sm sm:text-base font-black text-slate-900">
              قد يعجبك أيضًا
            </h2>

            <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
              {relatedProducts.map((item) => {
                const itemInStock = item.stock > 0;

                return (
                  <div
                    key={item.id}
                    className="group bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:border-emerald-300 transition-all duration-200 flex flex-col overflow-hidden relative"
                  >
                    {/* Wishlist Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleWishlist(item.id);
                      }}
                      className={`absolute top-2 left-2 z-10 w-7 h-7 rounded-full shadow-xs flex items-center justify-center transition-all ${
                        isInWishlist(item.id)
                          ? "bg-rose-50 text-rose-600 border border-rose-200"
                          : "bg-white/90 text-slate-400 hover:text-rose-500 border border-slate-200/70"
                      }`}
                      title={isInWishlist(item.id) ? "إزالة من المفضلة" : "إضافة للمفضلة"}
                      aria-label="المفضلة"
                    >
                      <Heart
                        className={`w-3.5 h-3.5 ${
                          isInWishlist(item.id) ? "fill-rose-600 text-rose-600" : ""
                        }`}
                      />
                    </button>

                    {/* Product Link */}
                    <Link href={`/product/${item.id}`} className="flex flex-col flex-1">
                      {/* Image */}
                      <div className="aspect-square w-full bg-slate-50 flex items-center justify-center p-3 overflow-hidden">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
                          loading="lazy"
                        />
                      </div>

                      {/* Info */}
                      <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                        <h3 className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-emerald-700 transition-colors min-h-[2rem]">
                          {item.name}
                        </h3>

                        <div className="space-y-1 pt-1.5 border-t border-slate-100">
                          <div className="text-xs sm:text-sm font-black text-slate-950 font-mono">
                            {Number(item.price).toLocaleString()} <span className="text-[10px] text-emerald-700">دينار</span>
                          </div>

                          <div className="text-[10px] font-bold">
                            {itemInStock ? (
                              <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md inline-block">
                                متوفر
                              </span>
                            ) : (
                              <span className="text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md inline-block">
                                سيتوفر قريبًا
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
