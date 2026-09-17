"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ChevronRight,
  ShieldCheck,
  Truck,
  Heart,
  ShoppingBag,
  Check,
  MessageCircle,
  PhoneCall,
  Share2,
  Sparkles,
  Layers,
  Info,
  Clock,
  MapPin,
  CheckCircle2,
  ArrowRight,
  Eye,
  Star,
} from "lucide-react";
import { useCart } from "@/components/cart-context";
import { parseProductAttributes } from "@/lib/product-helper";
import { STORE_CONFIG, getProductWhatsAppUrl, getPhoneCallUrl } from "@/lib/store-config";
import { ProductCard } from "@/components/product-card";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = (params?.id as string) || "";

  const { addToCart, isInWishlist, toggleWishlist } = useCart();
  const [product, setProduct] = useState<any | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedStorage, setSelectedStorage] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (!productId) return;
    let isMounted = true;

    async function loadProduct() {
      try {
        setLoading(true);
        const res = await fetch(`/api/products/${productId}`);
        const data = await res.json();
        if (isMounted && data.success && data.product) {
          setProduct(data.product);

          // Fetch related products from same category
          const catRes = await fetch(
            `/api/products?categoryId=${encodeURIComponent(
              data.product.categoryId || data.product.category || "phones"
            )}&limit=6`
          );
          const catData = await catRes.json();
          if (isMounted && catData.success) {
            setRelatedProducts(
              (catData.products || []).filter((p: any) => p.id !== data.product.id).slice(0, 4)
            );
          }
        }
      } catch (err) {
        console.error("Failed to load product details:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadProduct();
    return () => {
      isMounted = false;
    };
  }, [productId]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4" dir="rtl">
        <div className="w-12 h-12 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
        <p className="text-xs sm:text-sm font-bold text-slate-500">جاري تحميل تفاصيل الجهاز والمواصفات...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 text-center space-y-4" dir="rtl">
        <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-500 flex items-center justify-center text-3xl">
          📱
        </div>
        <h1 className="text-xl font-black text-slate-900">المنتج غير موجود</h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-sm">
          لم نتمكن من العثور على هذا المنتج، قد يكون تم حذفه أو تم تغيير الرابط.
        </p>
        <button
          onClick={() => router.push("/")}
          className="px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md active:scale-95"
        >
          العودة للمتجر الرئيسي
        </button>
      </div>
    );
  }

  const parsed = parseProductAttributes(product);
  const isOutOfStock = product.stock === 0;
  const whatsappUrl = getProductWhatsAppUrl(product);
  const phoneCallUrl = getPhoneCallUrl();

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  const handleAddToCart = async () => {
    if (isOutOfStock || isAdding) return;
    setIsAdding(true);
    const success = await addToCart(product.id, 1);
    setIsAdding(false);
    if (success) {
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2500);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `شاهد هاتف ${product.name} في متجر سما الخضراء للهواتف: `,
          url: window.location.href,
        });
      } catch (e) {
        // User cancelled share
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div className="min-h-screen pb-16 space-y-6 sm:space-y-8 text-right w-full max-w-full overflow-hidden" dir="rtl">
      {/* 1. Breadcrumbs Bar */}
      <div className="bg-white border-b border-slate-200/80 shadow-2xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 truncate">
            <Link href="/" className="hover:text-emerald-600 transition-colors font-bold">
              الرئيسية
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0 rotate-180" />
            <Link
              href={`/category/${product.categoryId || product.category || "all"}`}
              className="hover:text-emerald-600 transition-colors font-bold truncate max-w-[100px] sm:max-w-none"
            >
              {parsed.brand || "الأجهزة"}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0 rotate-180" />
            <span className="text-slate-800 font-bold truncate max-w-[140px] sm:max-w-none">
              {product.name}
            </span>
          </div>

          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-emerald-600 transition-colors shrink-0 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>رجوع</span>
          </button>
        </div>
      </div>

      {/* 2. Main Product Content Showcase */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
          
          {/* Left Column: Image Gallery & Previews (5 Cols) */}
          <div className="lg:col-span-5 space-y-3">
            {/* Primary Main Image Frame */}
            <div className="relative aspect-square w-full rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden flex items-center justify-center p-6 group">
              {/* Badges */}
              <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5 pointer-events-none">
                {discountPercent && (
                  <span className="bg-red-500 text-white text-xs font-black px-2.5 py-1 rounded-xl shadow-xs self-start">
                    خصم {discountPercent}%
                  </span>
                )}
                <span className={`text-xs font-black px-2.5 py-1 rounded-xl border shadow-xs self-start ${parsed.conditionBadge}`}>
                  {parsed.condition}
                </span>
              </div>

              {/* Wishlist & Share buttons */}
              <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => toggleWishlist(product.id)}
                  className={`w-9 h-9 rounded-full shadow-sm flex items-center justify-center transition-all backdrop-blur-md ${
                    isInWishlist(product.id)
                      ? "bg-red-50 text-red-600 border border-red-200 scale-105"
                      : "bg-white/95 text-slate-400 hover:text-red-500 border border-slate-200"
                  }`}
                  title={isInWishlist(product.id) ? "إزالة من المفضلة" : "إضافة للمفضلة"}
                  aria-label="المفضلة"
                >
                  <Heart
                    className={`w-4 h-4 ${isInWishlist(product.id) ? "fill-red-600 text-red-600" : ""}`}
                  />
                </button>

                <button
                  type="button"
                  onClick={handleShare}
                  className="w-9 h-9 rounded-full bg-white/95 hover:bg-slate-100 text-slate-600 border border-slate-200 shadow-sm flex items-center justify-center transition-all"
                  title="مشاركة رابط المنتج"
                  aria-label="مشاركة"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>

              {/* Displayed Image */}
              <img
                src={
                  (parsed.galleryImages[selectedImageIndex] || product.imageUrl)?.includes("unsplash.com")
                    ? (parsed.galleryImages[selectedImageIndex] || product.imageUrl).split("?")[0] + "?w=600&q=80&auto=format"
                    : (parsed.galleryImages[selectedImageIndex] || product.imageUrl)
                }
                alt={product.name}
                width={480}
                height={480}
                decoding="async"
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
              />

              {isOutOfStock && (
                <div className="absolute inset-0 bg-slate-900/70 flex items-center justify-center">
                  <span className="bg-white text-slate-900 text-sm font-black px-4 py-2 rounded-2xl shadow-xl">
                    غير متوفر حالياً في الفرع
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnails Row */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {parsed.galleryImages.map((img: string, idx: number) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white border p-1.5 transition-all shrink-0 overflow-hidden flex items-center justify-center ${
                    selectedImageIndex === idx
                      ? "border-emerald-500 ring-2 ring-emerald-500/20 shadow-md"
                      : "border-slate-200 hover:border-slate-300 opacity-70 hover:opacity-100"
                  }`}
                >
                  <img
                    src={img.includes("unsplash.com") ? img.split("?")[0] + "?w=120&q=70&auto=format" : img}
                    alt={`صورة ${idx + 1}`}
                    width={80}
                    height={80}
                    decoding="async"
                    loading="lazy"
                    className="w-full h-full object-contain"
                  />
                </button>
              ))}
            </div>

            {copiedLink && (
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold text-center animate-in fade-in">
                ✓ تم نسخ رابط المنتج إلى الحافظة بنجاح!
              </div>
            )}
          </div>

          {/* Right Column: Details, Specifications, CTAs (7 Cols) */}
          <div className="lg:col-span-7 space-y-5">
            
            {/* Brand, Title, Rating */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl">
                  {parsed.brand}
                </span>
                <span className="text-xs font-bold text-slate-500">
                  كود الجهاز: {product.id.slice(0, 8)}
                </span>
                <div className="mr-auto flex items-center gap-1 text-amber-500 text-xs font-black bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-xl">
                  <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                  <span>{product.rating?.toFixed(1) || "4.9"}</span>
                  <span className="text-slate-400 font-medium">({product.reviewsCount || 42} تقييم)</span>
                </div>
              </div>

              <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 leading-snug">
                {product.name}
              </h1>

              {/* Status and Warranty Summary Pills */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                <span className="inline-flex items-center gap-1 font-bold text-teal-800 bg-teal-50 border border-teal-200 px-2.5 py-1 rounded-xl">
                  <ShieldCheck className="w-4 h-4 text-teal-600" />
                  <span>{parsed.warranty}</span>
                </span>

                <span className="inline-flex items-center gap-1 font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-xl">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{parsed.availabilityStatus}</span>
                </span>
              </div>
            </div>

            {/* Price Box */}
            <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-slate-900 to-slate-950 text-white shadow-lg space-y-2">
              <div className="flex items-baseline justify-between gap-3">
                <div>
                  <span className="text-xs text-slate-400 block font-bold">السعر النقدي (كاش):</span>
                  <div className="text-2xl sm:text-3xl font-black text-white leading-tight">
                    {product.price.toLocaleString("ar-IQ")}
                    <span className="text-xs sm:text-sm font-bold text-emerald-400 mr-1.5">دينار عراقي</span>
                  </div>
                </div>

                {product.originalPrice && product.originalPrice > product.price && (
                  <div className="text-left">
                    <span className="text-xs text-slate-400 block line-through">
                      {product.originalPrice.toLocaleString("ar-IQ")} د.ع
                    </span>
                    <span className="text-xs font-black text-emerald-400">
                      توفير {(product.originalPrice - product.price).toLocaleString("ar-IQ")} د.ع
                    </span>
                  </div>
                )}
              </div>

              {/* In-Store Installment Notice */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-300">
                <span className="flex items-center gap-1.5 font-bold">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  <span>متوفر بالتقسيط داخل المحل</span>
                </span>
                <Link
                  href="/installments"
                  className="text-emerald-400 hover:text-emerald-300 font-bold underline underline-offset-4"
                >
                  شروط وأحكام التقسيط ←
                </Link>
              </div>
            </div>

            {/* Storage & Color Selectors */}
            <div className="space-y-3.5 bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-2xs">
              {/* Storage */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-800">السعة التخزينية المتوفرة:</label>
                <div className="flex flex-wrap gap-2">
                  {["128GB", "256GB", "512GB", "1TB"].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setSelectedStorage(st)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                        (selectedStorage || parsed.storage) === st
                          ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Colors */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-800">الألوان المتوفرة:</label>
                <div className="flex flex-wrap gap-2">
                  {parsed.availableColors.map((col: { name: string; hex: string }) => (
                    <button
                      key={col.name}
                      type="button"
                      onClick={() => setSelectedColor(col.name)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                        (selectedColor || parsed.availableColors[0]?.name) === col.name
                          ? "bg-emerald-50 border-emerald-500 text-emerald-950 ring-1 ring-emerald-500"
                          : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-black/20 shrink-0"
                        style={{ backgroundColor: col.hex }}
                      />
                      <span>{col.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Direct Conversion Action CTAs (WhatsApp, Direct Call, Add to Cart) */}
            <div className="space-y-2.5 pt-1">
              {/* Primary 1: WhatsApp Instant Contact CTA */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full h-12 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#25D366]/25 transition-all active:scale-98 cursor-pointer"
              >
                <MessageCircle className="w-5 h-5 fill-white" />
                <span>تواصل عبر واتساب فوراً بخصوص هذا الجهاز</span>
              </a>

              {/* Primary 2: Direct Call & Add to Cart */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <a
                  href={phoneCallUrl}
                  className="h-11 rounded-2xl bg-slate-900 hover:bg-black text-white font-black text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-98"
                >
                  <PhoneCall className="w-4 h-4 text-emerald-400" />
                  <span>اتصال مباشر بالمحل ({STORE_CONFIG.contact.primaryPhone})</span>
                </a>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={isOutOfStock || isAdding}
                  className={`h-11 rounded-2xl font-black text-xs flex items-center justify-center gap-2 transition-all active:scale-98 shadow-md ${
                    justAdded
                      ? "bg-emerald-800 text-white"
                      : isOutOfStock
                      ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                      : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20"
                  }`}
                >
                  {justAdded ? (
                    <>
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>تمت الإضافة للسلة</span>
                    </>
                  ) : isOutOfStock ? (
                    <span>غير متوفر</span>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>إضافة إلى سلة الشراء</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Description Paragraph */}
            {product.description && (
              <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-1.5">
                <h3 className="text-xs font-black text-slate-900">وصف ومميزات الجهاز:</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Comprehensive Technical Specifications Table */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
              <div className="p-4 bg-slate-50 border-b border-slate-200">
                <h3 className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>المواصفات الفنية المعتمدة</span>
                </h3>
              </div>
              <div className="divide-y divide-slate-100">
                {parsed.specs.map((item: { label: string; value: string }, idx: number) => (
                  <div key={idx} className="p-3 sm:p-3.5 flex items-center justify-between text-xs gap-3">
                    <span className="font-bold text-slate-500 w-1/3 shrink-0">{item.label}</span>
                    <span className="font-black text-slate-800 text-left flex-1">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Important Pre-Purchase Advice Box */}
            <div className="p-4 sm:p-5 rounded-3xl bg-amber-50/70 border border-amber-200/80 space-y-2 text-amber-950">
              <h4 className="text-xs sm:text-sm font-black flex items-center gap-2 text-amber-900">
                <Info className="w-4 h-4 text-amber-600 shrink-0" />
                <span>معلومات وضمانات مهمة قبل الشراء:</span>
              </h4>
              <ul className="text-[11px] sm:text-xs space-y-1.5 text-amber-900/90 list-disc list-inside">
                <li>جميع الأجهزة مكفولة ومفحوصة أصلي 100%، ويحق لك المعاينة والفحص الكامل قبل الدفع.</li>
                <li>إمكانية الاستلام الفوري من فرعنا في بغداد - الكرادة أو التوصيل السريع إلى باب منزلك.</li>
                <li>خدمة نقل البيانات، محادثات الواتساب، وضبط الحسابات مجانية عند شراء أي جهاز من الفرع.</li>
              </ul>
            </div>

          </div>
        </div>

        {/* 3. Related Products Section */}
        {relatedProducts.length > 0 && (
          <section className="pt-10 sm:pt-14 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base sm:text-lg font-black text-slate-900">
                  أجهزة أخرى قد تهمك
                </h2>
                <p className="text-xs text-slate-500">من نفس الفئة والماركة بضمان معتمد</p>
              </div>
              <Link
                href="/category/all"
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 underline underline-offset-4"
              >
                تصفح كافة الأجهزة ←
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
