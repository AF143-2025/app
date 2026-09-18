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
    offerBadge: "أفضل سعر مع ضمان رسمي",
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
    <div className="min-h-screen bg-slate-50 text-right selection:bg-emerald-100 selection:text-emerald-900 w-full max-w-full pb-20 sm:pb-0" dir="rtl">
      
      {/* 1. HERO BANNER - Edge-to-edge on mobile, rounded on desktop */}
      <section className="relative w-full sm:max-w-7xl sm:mx-auto sm:px-6 lg:px-8 sm:pt-4">
        <div className="relative h-[220px] sm:h-[360px] md:h-[460px] w-full sm:rounded-[2rem] overflow-hidden bg-slate-900 group shadow-lg">
          
          <div
            className="absolute inset-0 flex transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
            style={{ transform: `translateX(${currentBanner * 100}%)` }}
          >
            {heroBanners.map((banner) => (
              <div
                key={banner.id}
                className={`w-full h-full flex-shrink-0 relative bg-gradient-to-tr ${banner.gradient}`}
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent pointer-events-none" />
                
                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12 z-10 w-full sm:w-2/3">
                  <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-[10px] sm:text-xs font-black mb-3 border border-white/20 self-start shadow-sm">
                    {banner.tag}
                  </span>
                  
                  <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white leading-tight mb-2 sm:mb-4 drop-shadow-md">
                    {banner.title}
                  </h2>
                  
                  <p className="text-emerald-300 font-bold text-xs sm:text-base drop-shadow-sm flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    {banner.offerBadge}
                  </p>
                  
                  <div className="mt-5 sm:mt-8">
                    <Link
                      href={banner.targetHref}
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:px-8 sm:py-3.5 rounded-full bg-white text-slate-900 font-black text-[11px] sm:text-sm shadow-xl active:scale-95 transition-transform"
                    >
                      <span>تسوق الآن</span>
                      <ChevronLeft className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                {/* Optional Side Image for visual flair (hidden on very small screens) */}
                <div className="absolute left-0 bottom-0 h-full w-1/3 hidden sm:block opacity-70">
                   <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover mix-blend-overlay" />
                </div>
              </div>
            ))}
          </div>

          {/* Dots Indicator */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
            {heroBanners.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`شريحة ${i + 1}`}
                onClick={() => setCurrentBanner(i)}
                className={`transition-all duration-300 rounded-full h-1.5 sm:h-2 ${
                  i === currentBanner ? "bg-white w-6 sm:w-8 shadow-sm" : "bg-white/40 hover:bg-white/70 w-1.5 sm:w-2"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-8 sm:space-y-12 w-full mt-6 sm:mt-10">

        {/* 2. CATEGORIES 2-ROW GRID */}
        <section id="categories-section" className="scroll-mt-20 w-full relative">
          <div className="grid grid-cols-5 gap-1.5 sm:gap-3 w-full">
            {STORE_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const href = cat.customHref || `/category/${cat.id}`;
              return (
                <Link
                  key={cat.id}
                  href={href}
                  className="group flex flex-col items-center justify-start py-3 px-1.5 rounded-[1.5rem] bg-white border border-transparent shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.08)] transition-all duration-300 active:scale-95"
                  title={cat.label}
                >
                  <div
                    className={`w-10 h-10 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 mb-2 bg-[#F8FAFC] text-slate-700`}
                  >
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2]" />
                  </div>
                  <span className="text-[9px] sm:text-[11px] font-black tracking-tight leading-tight text-center text-slate-700 group-hover:text-emerald-600 line-clamp-2 w-full px-0.5">
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
        <section className="bg-white p-4 sm:p-7 rounded-[2rem] border border-transparent shadow-[0_4px_24px_-8px_rgba(0,0,0,0.06)] space-y-5">
          <div className="flex items-center justify-between border-b border-slate-50 pb-3">
            <h2 className="text-base sm:text-xl font-black text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-600" />
              <span>خدمات متجر سما الخضراء</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-4 text-center">
            {quickServices.map((srv) => {
              const Icon = srv.icon;
              const content = (
                <>
                  <div
                    className={`w-11 h-11 sm:w-13 sm:h-13 rounded-3xl bg-gradient-to-tr ${srv.gradient} text-white flex items-center justify-center shadow-md ${srv.shadow} group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 mx-auto`}
                  >
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
                  </div>
                  <span className="text-[11px] sm:text-xs font-black text-slate-800 mt-3 leading-tight group-hover:text-emerald-700 transition-colors line-clamp-1 px-1">
                    {srv.label}
                  </span>
                </>
              );

              if (srv.href) {
                return (
                  <Link
                    key={srv.id}
                    href={srv.href}
                    className="group relative flex flex-col items-center justify-center p-4 rounded-[1.5rem] bg-slate-50/50 hover:bg-white border border-transparent shadow-sm hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.08)] transition-all duration-300 active:scale-95"
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
                  className="group relative flex flex-col items-center justify-center p-4 rounded-[1.5rem] bg-slate-50/50 hover:bg-white border border-transparent shadow-sm hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.08)] transition-all duration-300 active:scale-95 w-full"
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
                className="bg-white p-4 sm:p-5 rounded-[1.5rem] border border-transparent shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.08)] transition-all space-y-2"
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
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedService(null)}
        >
          <div
            className="bg-white w-full sm:max-w-md rounded-t-[2rem] sm:rounded-[2.5rem] p-5 sm:p-6 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.2)] border border-transparent max-h-[85vh] overflow-y-auto space-y-4 animate-in slide-in-from-bottom duration-300 text-right"
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
