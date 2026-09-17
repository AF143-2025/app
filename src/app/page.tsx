"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Truck,
  ShieldCheck,
  CreditCard,
  Layers,
  Wrench,
  Banknote,
  ArrowLeftRight,
  ArrowRight,
  Heart,
  ChevronLeft,
  ChevronRight,
  Zap,
  Headphones,
  Smartphone,
  Radio,
  Receipt,
  Laptop,
  RefreshCw,
  KeyRound,
  Printer,
  Wallet,
  PhoneCall,
  Info,
  X,
  MessageCircle,
  LayoutGrid,
  MapPin,
  Clock,
  ExternalLink,
  Flame,
  CheckCircle2,
  Star,
} from "lucide-react";
import { STORE_CATEGORIES } from "@/lib/categories";
import { STORE_CONFIG, getWhatsAppUrl, getPhoneCallUrl } from "@/lib/store-config";
import { ProductCard } from "@/components/product-card";

// Pure Billboard Ad Banners (Lightweight optimized images)
const heroBanners = [
  {
    id: 1,
    tag: "عرض الأسبوع",
    title: "iPhone 16 Pro Max",
    offerBadge: "متوفر كاش وبالتقسيط",
    targetHref: "/category/phones",
    gradient: "from-slate-950 via-emerald-950 to-teal-950",
    imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02560?w=450&q=75&auto=format",
  },
  {
    id: 2,
    tag: "صوتيات مميزة",
    title: "AirPods Pro 2 & Buds 3",
    offerBadge: "ضمان معتمد 100%",
    targetHref: "/category/headphones",
    gradient: "from-slate-950 via-slate-900 to-indigo-950",
    imageUrl: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=450&q=75&auto=format",
  },
  {
    id: 3,
    tag: "شحن سريع",
    title: "شواحن وبنوك طاقة Anker الأصلية",
    offerBadge: "كفالة استبدال فوري",
    targetHref: "/category/chargers",
    gradient: "from-emerald-950 via-teal-950 to-slate-950",
    imageUrl: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=450&q=75&auto=format",
  },
  {
    id: 4,
    tag: "ساعات ذكية",
    title: "Apple Watch & Galaxy Watch",
    offerBadge: "أحدث الموديلات الأصلية",
    targetHref: "/category/smartwatches",
    gradient: "from-slate-950 via-blue-950 to-indigo-950",
    imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=450&q=75&auto=format",
  },
];

export default function HomePage() {
  const router = useRouter();
  const [currentBanner, setCurrentBanner] = useState(0);
  const [selectedService, setSelectedService] = useState<any | null>(null);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [dealsProducts, setDealsProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "phones" | "audio" | "chargers">("all");

  const whatsappGeneralUrl = getWhatsAppUrl();
  const phoneCallUrl = getPhoneCallUrl();

  // Fast initial fetch: limit=8
  useEffect(() => {
    let isMounted = true;
    async function loadStoreProducts() {
      try {
        setLoadingProducts(true);
        const res = await fetch("/api/products?all=true&limit=8");
        const data = await res.json();
        if (isMounted && data.success && data.products) {
          const prods = data.products || [];
          setFeaturedProducts(prods.slice(0, 4));
          const deals = prods.filter((p: any) => p.originalPrice && p.originalPrice > p.price);
          setDealsProducts(deals.length > 0 ? deals.slice(0, 4) : prods.slice(4, 8));
        }
      } catch (err) {
        console.error("Failed to load products for homepage:", err);
      } finally {
        if (isMounted) setLoadingProducts(false);
      }
    }
    loadStoreProducts();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filtered Products for Showcase Tabs
  const displayedFeatured = React.useMemo(() => {
    if (activeTab === "all") return featuredProducts;
    if (activeTab === "phones") {
      return featuredProducts.filter(
        (p) =>
          p.category === "phones" ||
          p.categoryId === "phones" ||
          (p.name || "").toLowerCase().includes("iphone") ||
          (p.name || "").toLowerCase().includes("galaxy")
      );
    }
    if (activeTab === "audio") {
      return featuredProducts.filter(
        (p) =>
          p.category === "headphones" ||
          p.categoryId === "headphones" ||
          (p.name || "").toLowerCase().includes("airpods") ||
          (p.name || "").toLowerCase().includes("سماعات")
      );
    }
    if (activeTab === "chargers") {
      return featuredProducts.filter(
        (p) =>
          p.category === "chargers" ||
          p.categoryId === "chargers" ||
          (p.name || "").toLowerCase().includes("شاحن") ||
          (p.name || "").toLowerCase().includes("anker")
      );
    }
    return featuredProducts;
  }, [featuredProducts, activeTab]);

  // 15 Comprehensive Professional Services (سما الخضراء)
  const quickServices = [
    {
      id: "buy-sell",
      label: "بيع وشراء الموبايلات",
      badge: "جديد ومستعمل مفحوص",
      icon: Smartphone,
      href: "/category/phones",
      gradient: "from-blue-600 to-indigo-600",
      shadow: "shadow-blue-500/25",
      description: "بيع وشراء أحدث أجهزة iPhone وسامسونج وشاومي الأصلية مع فحص فوري وضمان معتمد للأجهزة المستعملة والجديدة.",
    },
    {
      id: "maintenance",
      label: "صيانة الموبايلات الفورية",
      badge: "ورشة معتمدة بالفرع",
      icon: Wrench,
      href: "/maintenance",
      gradient: "from-amber-500 to-orange-600",
      shadow: "shadow-amber-500/25",
      description: "ورشة متكاملة لصيانة الشاشات، استبدال البطاريات، الآيسيات، وحل كافة مشاكل السوفتوير والهاردوير بقطع غيار أصلية.",
    },
    {
      id: "installments",
      label: "التقسيط داخل المحل",
      badge: "بدون كفيل لموظفي الدولة",
      icon: Layers,
      href: "/installments",
      gradient: "from-emerald-500 to-teal-600",
      shadow: "shadow-emerald-500/25",
      description: "نوفر خدمة التقسيط داخل المحل وفق الشروط والأحكام المعتمدة لموظفي الدولة والمتقاعدين وحاملي البطاقات المصرفية الذكية.",
    },
    {
      id: "salaries",
      label: "الصيرفة وصرف الرواتب",
      badge: "يتوفر لدينا صرف جميع الرواتب",
      icon: Banknote,
      href: "/salaries",
      gradient: "from-cyan-600 to-blue-700",
      shadow: "shadow-cyan-500/25",
      description: "صرف نقدي فوري لرواتب موظفي الدولة والمتقاعدين والماستر كارد والكي كارد وشبكة الحماية الاجتماعية بأقل عمولة رسمية.",
    },
    {
      id: "wallets",
      label: "المحافظ الإلكترونية",
      badge: "زين كاش وكي كارد",
      icon: Wallet,
      href: "/wallets",
      gradient: "from-purple-600 to-indigo-700",
      shadow: "shadow-purple-500/25",
      description: "خدمات شحن وسحب وإيداع المحافظ الإلكترونية المعتمدة (ZainCash, Qi, FIB, 1Pay) بأعلى درجات الأمان والسرعة.",
    },
    {
      id: "sim-cards",
      label: "الخطوط والشرائح",
      badge: "eSIM & SIM معتمدة",
      icon: Radio,
      gradient: "from-emerald-600 to-teal-700",
      shadow: "shadow-emerald-500/25",
      description: "إصدار وتفعيل شرائح eSIM و SIM العادية لكافة شبكات الاتصال (زين العراق، آسيا سيل، كورك) مع توثيق البصمة الفوري الرسمي.",
    },
    {
      id: "balance-recharge",
      label: "تعبئة الرصيد وكروت الألعاب",
      badge: "شحن فوري رقمي",
      icon: Zap,
      gradient: "from-amber-600 to-yellow-600",
      shadow: "shadow-amber-500/25",
      description: "تعبئة رصيد مباشر وبطاقات شحن لكافة شبكات الاتصال والإنترنت، وبطاقات ألعاب ببجي وبلايستيشن وآيتونز بأفضل الأسعار.",
    },
    {
      id: "software",
      label: "السوفتوير والبرمجة",
      badge: "iCloud & استرجاع بيانات",
      icon: KeyRound,
      gradient: "from-violet-600 to-purple-800",
      shadow: "shadow-violet-500/25",
      description: "نقل البيانات والرسائل ومحادثات الواتساب بالكامل من هاتف لآخر، إنشاء وضبط حسابات Apple ID و Gmail باحترافية وأمان تام.",
    },
    {
      id: "screen-protection",
      label: "حماية الشاشة والكفرات",
      badge: "حماية حرارية نانو 360",
      icon: ShieldCheck,
      href: "/category/cases",
      gradient: "from-rose-600 to-pink-600",
      shadow: "shadow-rose-500/25",
      description: "كفرات أصلية ماج سيف، حماية شاشة نانو ضد الصدمات والبصمات، وحماية عدسات الكاميرا بأحدث أجهزة القص الدقيق.",
    },
    {
      id: "printing",
      label: "الطباعة والنسخ",
      badge: "مستندات ومعاملات",
      icon: Printer,
      gradient: "from-slate-700 to-slate-900",
      shadow: "shadow-slate-600/25",
      description: "طباعة المستندات والوثائق الرسمية، سحب وتصوير ملون وأبيض وأسود عالي الدقة، وتجليد المعاملات بأعلى معايير الجودة.",
    },
  ];

  // Carousel Auto-Play
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % heroBanners.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-8 sm:space-y-12 text-right pb-10 w-full max-w-full overflow-hidden" dir="rtl">
      {/* 1. HERO BANNER CAROUSEL */}
      <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl mx-2.5 sm:mx-4 lg:mx-8 shadow-xl border border-slate-900/10 bg-slate-950">
        <div className="relative h-[165px] sm:h-[220px] md:h-[280px] flex items-center transition-all duration-700 ease-in-out">
          {heroBanners.map((banner, index) => {
            const isActive = index === currentBanner;
            return (
              <Link
                key={banner.id}
                href={banner.targetHref}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out flex flex-row items-center justify-between p-4 sm:p-8 md:p-12 gap-3 bg-gradient-to-r ${banner.gradient} text-white group cursor-pointer ${
                  isActive ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
                }`}
                title={`إعلان: ${banner.title}`}
              >
                <div className="relative z-10 flex-1 min-w-0 space-y-2 sm:space-y-3 text-right">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-[10px] sm:text-xs font-bold text-emerald-300">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{banner.tag}</span>
                  </div>

                  <h1 className="text-base sm:text-2xl md:text-4xl font-black tracking-tight leading-snug line-clamp-1 group-hover:text-emerald-300 transition-colors">
                    {banner.title}
                  </h1>

                  <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 text-[10px] sm:text-xs md:text-sm font-black px-3 py-1.5 rounded-xl border border-emerald-500/30">
                    <span>{banner.offerBadge}</span>
                    <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:-translate-x-1 transition-transform" />
                  </div>
                </div>

                <div className="relative z-10 shrink-0 w-28 h-28 sm:w-40 sm:h-40 md:w-56 md:h-56 flex items-center justify-center">
                  <div className="relative w-full h-full rounded-2xl overflow-hidden border border-white/20 shadow-lg bg-white/5 p-1.5">
                    <img
                      src={banner.imageUrl}
                      alt={banner.title}
                      width={220}
                      height={220}
                      decoding="async"
                      className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Carousel Navigation Arrows */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setCurrentBanner((prev) => (prev === 0 ? heroBanners.length - 1 : prev - 1));
          }}
          className="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-md text-white items-center justify-center transition-all pointer-events-auto shadow-md"
          aria-label="السابق"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setCurrentBanner((prev) => (prev + 1) % heroBanners.length);
          }}
          className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-md text-white items-center justify-center transition-all pointer-events-auto shadow-md"
          aria-label="التالي"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Dots Navigation */}
        <div className="absolute bottom-2.5 inset-x-0 z-20 flex items-center justify-center gap-1.5 pointer-events-auto">
          {heroBanners.map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setCurrentBanner(idx);
              }}
              className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                idx === currentBanner ? "w-7 bg-emerald-400" : "w-2 bg-white/40 hover:bg-white/70"
              }`}
              aria-label={`إعلان ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 space-y-8 sm:space-y-12 w-full">

        {/* 2. CATEGORIES 2-ROW GRID */}
        <section id="categories-section" className="scroll-mt-20 space-y-3 w-full">
          <div className="flex items-center">
            <h2 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
              <span>تسوق حسب الفئات</span>
            </h2>
          </div>

          <div className="grid grid-cols-5 gap-1.5 sm:gap-3 w-full">
            {STORE_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const href = cat.customHref || `/category/${cat.id}`;
              return (
                <Link
                  key={cat.id}
                  href={href}
                  className="group flex flex-col items-center justify-center py-2.5 sm:py-3 px-1 rounded-2xl transition-all duration-200 active:scale-95 border bg-white hover:bg-emerald-50/30 text-slate-700 border-slate-200/80 shadow-xs hover:border-emerald-400 hover:shadow-md select-none"
                  title={cat.label}
                >
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center transition-all duration-200 group-hover:scale-110 mb-1.5 border ${cat.accent} shadow-2xs overflow-hidden`}
                  >
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
                  </div>
                  <span className="text-[10px] sm:text-xs font-bold tracking-tight leading-tight text-center text-slate-800 group-hover:text-emerald-800 truncate block w-full px-0.5">
                    {cat.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* 3. FEATURED PRODUCTS SHOWCASE (أحدث وأهم الأجهزة) */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
            <div>
              <h2 className="text-base sm:text-xl font-black text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-600" />
                <span>أحدث الهواتف والأجهزة الأكثر طلباً</span>
              </h2>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 self-start sm:self-auto">
              {[
                { id: "all", label: "الكل" },
                { id: "phones", label: "هواتف ذكية" },
                { id: "audio", label: "سماعات" },
                { id: "chargers", label: "شواحن" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    activeTab === tab.id
                      ? "bg-slate-900 text-white shadow-sm"
                      : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {loadingProducts ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-64 rounded-3xl bg-slate-200 animate-pulse" />
              ))}
            </div>
          ) : displayedFeatured.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
              {displayedFeatured.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-white rounded-3xl border border-slate-200 space-y-2">
              <p className="text-sm font-bold text-slate-600">لا توجد منتجات في هذا التبويب حالياً.</p>
              <Link href="/category/all" className="text-xs text-emerald-600 font-bold underline">
                تصفح كافة الأقسام
              </Link>
            </div>
          )}

          <div className="text-center pt-2">
            <Link
              href="/category/all"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs sm:text-sm font-black shadow-xs transition-all active:scale-95"
            >
              <span>عرض جميع المنتجات</span>
              <ChevronLeft className="w-4 h-4 text-emerald-600" />
            </Link>
          </div>
        </section>

        {/* 4. SERVICES SHOWCASE */}
        <section className="bg-white p-4 sm:p-7 rounded-3xl border border-slate-200/80 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base sm:text-xl font-black text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-600" />
              <span>خدمات متجر سما الخضراء</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3 text-center">
            {quickServices.map((srv) => {
              const Icon = srv.icon;
              const content = (
                <>
                  <div
                    className={`w-11 h-11 sm:w-13 sm:h-13 rounded-2xl bg-gradient-to-tr ${srv.gradient} text-white flex items-center justify-center shadow-md ${srv.shadow} group-hover:scale-105 transition-all duration-200`}
                  >
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <span className="text-xs font-black text-slate-800 mt-2.5 leading-tight group-hover:text-emerald-700 transition-colors line-clamp-1">
                    {srv.label}
                  </span>
                </>
              );

              if (srv.href) {
                return (
                  <Link
                    key={srv.id}
                    href={srv.href}
                    className="group relative flex flex-col items-center justify-center p-3.5 sm:p-4 rounded-2xl bg-slate-50/80 hover:bg-emerald-50/40 border border-slate-200/80 hover:border-emerald-300 transition-all duration-200 active:scale-95 shadow-2xs hover:shadow-md"
                  >
                    {content}
                  </Link>
                );
              }

              return (
                <button
                  key={srv.id}
                  type="button"
                  onClick={() => setSelectedService(srv)}
                  className="group relative flex flex-col items-center justify-center p-3.5 sm:p-4 rounded-2xl bg-slate-50/80 hover:bg-emerald-50/40 border border-slate-200/80 hover:border-emerald-300 transition-all duration-200 active:scale-95 shadow-2xs hover:shadow-md text-center w-full"
                >
                  {content}
                </button>
              );
            })}
          </div>
        </section>

        {/* 5. VALUE PROPOSITION PILLARS (لماذا سما الخضراء - في نهاية الصفحة) */}
        <section className="space-y-4 pt-2">
          <div className="text-center max-w-xl mx-auto">
            <h2 className="text-base sm:text-xl font-black text-slate-900">
              لماذا يثق زبائننا بمتجر سما الخضراء؟
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 w-full">
            {STORE_CONFIG.guarantees.map((g: any, idx: number) => (
              <div
                key={idx}
                className="bg-white p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-black text-xs">
                    <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                    {g.badge}
                  </span>
                </div>
                <h3 className="text-xs sm:text-sm font-black text-slate-900 leading-tight">
                  {g.title}
                </h3>
                <p className="text-[10px] sm:text-xs text-slate-500 leading-relaxed">
                  {g.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

      </div>

      {/* Service Detail Modal */}
      {selectedService && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedService(null)}
        >
          <div
            className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl border border-slate-100 max-h-[85vh] overflow-y-auto space-y-4 animate-in slide-in-from-bottom duration-200 text-right"
            onClick={(e) => e.stopPropagation()}
            dir="rtl"
          >
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto sm:hidden mb-2" />

            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${selectedService.gradient} text-white flex items-center justify-center shadow-lg ${selectedService.shadow} shrink-0`}
                >
                  {React.createElement(selectedService.icon, {
                    className: "w-7 h-7",
                  })}
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900">
                    {selectedService.label}
                  </h3>
                  <span className="inline-block text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full mt-1">
                    {selectedService.badge}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedService(null)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {selectedService.description}
              </p>
            </div>

            <div className="space-y-2 pt-1">
              <a
                href={getWhatsAppUrl(
                  `مرحباً متجر سما الخضراء، أود الاستفسار والطلب بخصوص خدمة: ${selectedService.label}`
                )}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-black py-3 px-4 rounded-xl shadow-md transition-all text-xs sm:text-sm"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>طلب الخدمة عبر واتساب</span>
              </a>

              <a
                href={phoneCallUrl}
                className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3 px-4 rounded-xl transition-all text-xs sm:text-sm"
              >
                <PhoneCall className="w-4 h-4 text-slate-600" />
                <span>اتصال هاتفي مباشر بالفرع</span>
              </a>

              {selectedService.href && (
                <Link
                  href={selectedService.href}
                  onClick={() => setSelectedService(null)}
                  className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-black text-white font-bold py-3 px-4 rounded-xl transition-all text-xs sm:text-sm"
                >
                  <span>عرض الصفحة الكاملة</span>
                  <ChevronLeft className="w-4 h-4" />
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
