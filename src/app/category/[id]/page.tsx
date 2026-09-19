"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import {
  ChevronRight,
  Search,
  ArrowUpDown,
  LayoutGrid,
} from "lucide-react";
import { getCategoryById, STORE_CATEGORIES } from "@/lib/categories";
import { ProductCard } from "@/components/product-card";
import { ProductDetailModal } from "@/components/product-detail-modal";
import { parseProductAttributes } from "@/lib/product-helper";

export default function CategoryPage() {
  const router = useRouter();
  const params = useParams();
  const routeCategoryId = (params?.id as string) || "all";

  // Active category state for fast, smooth client-side switching
  const [activeCategoryId, setActiveCategoryId] = useState<string>(routeCategoryId);
  const [dbCategory, setDbCategory] = useState<any | null>(null);

  // Synchronize with URL params if changed externally
  useEffect(() => {
    if (routeCategoryId) {
      setActiveCategoryId(routeCategoryId);
    }
  }, [routeCategoryId]);

  // Fetch DB category info if applicable
  useEffect(() => {
    if (!activeCategoryId || activeCategoryId === "all") return;
    fetch(`/api/categories/${encodeURIComponent(activeCategoryId)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.category) {
          setDbCategory(data.category);
        }
      })
      .catch((err) => console.error("Failed to fetch db category:", err));
  }, [activeCategoryId]);

  const currentCategory = useMemo(() => {
    if (activeCategoryId === "all") {
      return {
        id: "all",
        label: "جميع المنتجات",
        icon: LayoutGrid,
        accent: "text-emerald-700 bg-emerald-50 border-emerald-200",
        bgGradient: "from-emerald-700 to-teal-800",
        description: "تصفح جميع الهواتف الذكية والأجهزة والإكسسوارات الأصلية المتاحة في المتجر",
        subcategories: ["الكل", "هواتف ذكية", "شواحن", "كوابل", "سماعات", "ساعات", "باوربانك"],
      };
    }
    const staticCat = getCategoryById(activeCategoryId);
    if (staticCat) return staticCat;
    if (dbCategory) {
      return {
        id: dbCategory.id,
        label: dbCategory.name,
        icon: LayoutGrid,
        accent: "text-emerald-700 bg-emerald-50 border-emerald-200",
        bgGradient: "from-emerald-700 to-teal-800",
        description: `تصفح أحدث منتجات قسم ${dbCategory.name} الأصلية المعتمدة`,
        subcategories: ["الكل"],
      };
    }
    return {
      id: activeCategoryId,
      label: "قسم المنتجات",
      icon: LayoutGrid,
      accent: "text-emerald-700 bg-emerald-50 border-emerald-200",
      bgGradient: "from-emerald-700 to-teal-800",
      description: "تصفح جميع المنتجات الأصلية المتاحة في هذا القسم",
      subcategories: ["الكل"],
    };
  }, [activeCategoryId, dbCategory]);

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("الكل");
  const [selectedBrand, setSelectedBrand] = useState<string>("all");
  const [selectedCondition, setSelectedCondition] = useState<string>("all");
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>("all");
  const [sortOption, setSortOption] = useState("popular");
  const [activeModalProduct, setActiveModalProduct] = useState<any | null>(null);

  const categoriesBarRef = useRef<HTMLDivElement>(null);

  // Auto scroll active category into view in the horizontal bar
  useEffect(() => {
    if (categoriesBarRef.current && activeCategoryId) {
      const activeEl = categoriesBarRef.current.querySelector(
        `[data-cat-id="${activeCategoryId}"]`
      ) as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  }, [activeCategoryId]);

  // Fetch products whenever active category or sort changes
  useEffect(() => {
    if (!activeCategoryId) return;

    let isMounted = true;
    const fetchCategoryProducts = async () => {
      try {
        setLoading(true);
        let url =
          activeCategoryId === "all"
            ? `/api/products?all=true&limit=200`
            : `/api/products?categoryId=${encodeURIComponent(activeCategoryId)}&limit=200`;
        if (sortOption === "price-asc") url += `&sort=price-asc`;
        else if (sortOption === "price-desc") url += `&sort=price-desc`;
        else if (sortOption === "rating") url += `&sort=rating`;
        else if (sortOption === "popular") url += `&sort=popular`;

        const res = await fetch(url);
        const data = await res.json();
        if (isMounted && data.success) {
          setProducts(data.products || []);
        }
      } catch (err) {
        console.error("Failed to fetch category products:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCategoryProducts();
    return () => {
      isMounted = false;
    };
  }, [activeCategoryId, sortOption]);

  // Category switch handler without full page reload
  const handleCategorySelect = (id: string) => {
    setActiveCategoryId(id);
    setSelectedSubcategory("الكل");
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", `/category/${id}`);
    }
  };

  // Client-side filtering
  const filteredProducts = useMemo(() => {
    let list = products;

    // 1. Filter by Subcategory
    if (selectedSubcategory && selectedSubcategory !== "الكل") {
      const cleanSub = selectedSubcategory
        .replace(/ال/g, "")
        .trim()
        .toLowerCase();
      const keywords = selectedSubcategory
        .toLowerCase()
        .split(" ")
        .filter((w) => w.length > 2);

      list = list.filter((p) => {
        const title = (p.name || "").toLowerCase();
        const desc = (p.description || "").toLowerCase();
        return (
          title.includes(selectedSubcategory.toLowerCase()) ||
          desc.includes(selectedSubcategory.toLowerCase()) ||
          title.includes(cleanSub) ||
          keywords.some((k) => title.includes(k) || desc.includes(k))
        );
      });
    }

    // 2. Filter by Brand
    if (selectedBrand !== "all") {
      list = list.filter((p) => {
        const parsed = parseProductAttributes(p);
        return parsed.brand.toLowerCase() === selectedBrand.toLowerCase();
      });
    }

    // 3. Filter by Condition (جديد / مستعمل)
    if (selectedCondition !== "all") {
      list = list.filter((p) => {
        const parsed = parseProductAttributes(p);
        if (selectedCondition === "new") return parsed.condition === "جديد كارتونة";
        if (selectedCondition === "used") return parsed.condition === "مستعمل مفحوص A+";
        return true;
      });
    }

    // 4. Filter by Price Range
    if (selectedPriceRange !== "all") {
      if (selectedPriceRange === "under200") {
        list = list.filter((p) => p.price < 200000);
      } else if (selectedPriceRange === "200to600") {
        list = list.filter((p) => p.price >= 200000 && p.price <= 600000);
      } else if (selectedPriceRange === "above600") {
        list = list.filter((p) => p.price > 600000);
      }
    }

    // 5. Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter((p) => {
        const title = (p.name || "").toLowerCase();
        const desc = (p.description || "").toLowerCase();
        return title.includes(q) || desc.includes(q);
      });
    }

    return list;
  }, [products, selectedSubcategory, selectedBrand, selectedCondition, selectedPriceRange, searchQuery]);

  return (
    <div className="min-h-screen pb-20 sm:pb-12 space-y-4 text-right w-full max-w-full overflow-hidden bg-slate-50/50" dir="rtl">
      {/* 1. TOP STICKY BAR: Search on top, followed immediately by horizontal scrollable categories bar */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs w-full">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3 space-y-2.5">
          
          {/* Row 1: Search Bar (في أعلى صفحة المنتجات ضع شريط البحث) + Back + Sort */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Back Button to Home */}
            <Link
              href="/"
              className="p-2 sm:p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all active:scale-90 shrink-0 border border-slate-200/60 shadow-2xs flex items-center justify-center"
              title="العودة للرئيسية"
              aria-label="العودة للرئيسية"
            >
              <ChevronRight className="w-5 h-5 stroke-[2.5]" />
            </Link>

            {/* Search Input */}
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث في المنتجات والأجهزة..."
                className="w-full pr-10 pl-8 py-2.5 text-xs sm:text-sm rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all placeholder:text-slate-400 font-medium"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[11px] text-slate-400 hover:text-slate-600 bg-slate-200 hover:bg-slate-300 rounded-full w-5 h-5 flex items-center justify-center transition-colors"
                  aria-label="مسح البحث"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Sort Selector */}
            <div className="relative shrink-0">
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="pr-2 pl-6 py-2.5 rounded-2xl text-[11px] sm:text-xs font-black border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none cursor-pointer"
                aria-label="ترتيب المنتجات"
              >
                <option value="popular">الأكثر طلباً</option>
                <option value="newest">الأحدث وصولاً</option>
                <option value="price-asc">الأقل سعراً</option>
                <option value="price-desc">الأعلى سعراً</option>
                <option value="rating">التقييم الأعلى</option>
              </select>
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Row 2: Horizontal Scrollable Categories Bar (أسفل البحث مباشرة ضع شريط أفقي قابل للسحب يحتوي جميع أقسام المتجر) */}
          <div className="relative w-full">
            <div
              ref={categoriesBarRef}
              className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none touch-pan-x -mx-3 px-3 sm:mx-0 sm:px-0"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {STORE_CATEGORIES.map((cat) => {
                const CatIcon = cat.icon;
                const isActive = activeCategoryId === cat.id;

                return (
                  <button
                    key={cat.id}
                    type="button"
                    data-cat-id={cat.id}
                    onClick={() => handleCategorySelect(cat.id)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs whitespace-nowrap transition-all duration-200 shrink-0 select-none active:scale-95 ${
                      isActive
                        ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/25 font-black scale-[1.02] border border-emerald-600"
                        : "bg-white text-slate-700 border border-slate-200/90 hover:bg-slate-50 hover:border-slate-300 font-bold"
                    }`}
                  >
                    <CatIcon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-slate-500"}`} />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </header>

      {/* 2. CATEGORY STATUS & INFO STRIP */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-2 py-1 text-xs">
          <div className="flex items-center gap-2">
            <h1 className="text-sm sm:text-base font-black text-slate-900">
              {currentCategory.label}
            </h1>
            <span className="text-[10px] sm:text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
              {filteredProducts.length} منتج
            </span>
          </div>

          {searchQuery && (
            <span className="text-[11px] text-slate-500 font-medium">
              نتائج البحث عن: <strong className="text-slate-800 font-black">"{searchQuery}"</strong>
            </span>
          )}
        </div>
      </div>

      {/* 3. PRODUCTS DISPLAY: Exactly 2 cards per row on mobile (اعرض المنتجات ببطاقتين في كل صف على الموبايل) */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-4 w-full">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 w-full">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-3xl p-3 border border-slate-100 shadow-sm animate-pulse space-y-3"
              >
                <div className="aspect-square bg-slate-200 rounded-2xl" />
                <div className="h-3 bg-slate-200 rounded w-3/4" />
                <div className="h-3 bg-slate-200 rounded w-1/2" />
                <div className="h-8 bg-slate-200 rounded-xl" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 sm:p-14 text-center border border-slate-200 max-w-md mx-auto space-y-4 shadow-sm w-full mt-6">
            <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-3xl mx-auto">
              🔍
            </div>
            <div className="space-y-1">
              <h3 className="text-sm sm:text-base font-black text-slate-800">
                لا توجد منتجات مطابقة في هذا القسم
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                جرّب البحث باسم آخر أو اختيار قسم آخر من شريط الأقسام أعلاه.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedBrand("all");
                setSelectedCondition("all");
                setSelectedPriceRange("all");
                setSelectedSubcategory("الكل");
                handleCategorySelect("all");
              }}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold active:scale-95 transition-all shadow-sm"
            >
              عرض جميع المنتجات
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 items-stretch w-full">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={(p) => setActiveModalProduct(p)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Quick Modal fallback if quick view is triggered */}
      {activeModalProduct && (
        <ProductDetailModal
          product={activeModalProduct}
          onClose={() => setActiveModalProduct(null)}
        />
      )}
    </div>
  );
}
