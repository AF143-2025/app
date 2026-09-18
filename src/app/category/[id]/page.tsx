"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import {
  ChevronRight,
  ArrowRight,
  Search,
  Sparkles,
  ArrowUpDown,
  Filter,
  Layers,
  Heart,
  ShoppingCart,
  LayoutGrid,
  ShieldCheck,
  Check,
} from "lucide-react";
import { getCategoryById, STORE_CATEGORIES } from "@/lib/categories";
import { ProductCard } from "@/components/product-card";
import { ProductDetailModal } from "@/components/product-detail-modal";
import { useCart } from "@/components/cart-context";
import { parseProductAttributes } from "@/lib/product-helper";

export default function CategoryPage() {
  const router = useRouter();
  const params = useParams();
  const categoryId = (params?.id as string) || "";

  const [dbCategory, setDbCategory] = useState<any | null>(null);

  useEffect(() => {
    if (!categoryId || categoryId === "all") return;
    fetch(`/api/categories/${encodeURIComponent(categoryId)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.category) {
          setDbCategory(data.category);
        }
      })
      .catch((err) => console.error("Failed to fetch db category:", err));
  }, [categoryId]);

  const category = useMemo(() => {
    if (categoryId === "all") {
      return {
        id: "all",
        label: "جميع المنتجات والأجهزة",
        icon: LayoutGrid,
        accent: "text-emerald-700 bg-emerald-50 border-emerald-200",
        bgGradient: "from-emerald-700 to-teal-800",
        description: "تصفح جميع الهواتف الذكية والأجهزة والإكسسوارات الأصلية المتاحة في المتجر",
        subcategories: ["الكل", "هواتف ذكية", "شواحن", "كوابل", "سماعات", "ساعات", "باوربانك"],
      };
    }
    const staticCat = getCategoryById(categoryId);
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
      id: categoryId,
      label: "قسم المنتجات",
      icon: LayoutGrid,
      accent: "text-emerald-700 bg-emerald-50 border-emerald-200",
      bgGradient: "from-emerald-700 to-teal-800",
      description: "تصفح جميع المنتجات الأصلية المتاحة في هذا القسم",
      subcategories: ["الكل"],
    };
  }, [categoryId, dbCategory]);

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("الكل");
  const [selectedBrand, setSelectedBrand] = useState<string>("all");
  const [selectedCondition, setSelectedCondition] = useState<string>("all");
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>("all");
  const [sortOption, setSortOption] = useState("popular");
  const [activeModalProduct, setActiveModalProduct] = useState<any | null>(null);

  // Fetch products
  useEffect(() => {
    if (!categoryId) return;

    let isMounted = true;
    const fetchCategoryProducts = async () => {
      try {
        setLoading(true);
        let url =
          categoryId === "all"
            ? `/api/products?all=true&limit=200`
            : `/api/products?categoryId=${encodeURIComponent(categoryId)}&limit=200`;
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
  }, [categoryId, sortOption]);

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

  const Icon = category?.icon || LayoutGrid;

  if (!category && !loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 text-center space-y-4" dir="rtl">
        <div className="w-16 h-16 rounded-3xl bg-red-50 text-red-500 flex items-center justify-center text-3xl">
          ⚠️
        </div>
        <h1 className="text-xl font-black text-slate-800">القسم غير موجود</h1>
        <p className="text-xs text-slate-500 max-w-sm">
          لم نتمكن من العثور على القسم المطلوب. يمكنك العودة إلى الواجهة الرئيسية وتصفح جميع الأقسام.
        </p>
        <button
          onClick={() => router.push("/")}
          className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95"
        >
          العودة للرئيسية
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-16 space-y-4 sm:space-y-6 text-right w-full max-w-full overflow-hidden" dir="rtl">
      {/* 1. TOP HEADER */}
      <div className="relative bg-white border-b border-slate-200/80 shadow-2xs w-full">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-2.5">
            {/* Right Side: Back Button + Title */}
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <Link
                href="/#categories-section"
                className="p-2 sm:p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition-all active:scale-90 border border-slate-200/60 shadow-2xs flex items-center justify-center shrink-0"
                aria-label="كل الأقسام"
                title="كل الأقسام"
              >
                <ChevronRight className="w-5 h-5 stroke-[2.5]" />
              </Link>

              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-2xs border ${
                    category?.accent || "text-emerald-700 bg-emerald-50 border-emerald-200"
                  }`}
                >
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] sm:text-xs font-bold text-slate-400">قسم</span>
                    <span className="text-[10px] sm:text-xs font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/50">
                      {filteredProducts.length} جهاز متوفر
                    </span>
                  </div>
                  <h1 className="text-base sm:text-xl font-black text-slate-900 truncate leading-tight">
                    {category?.label}
                  </h1>
                </div>
              </div>
            </div>

            {/* Left Side: Sort Dropdown */}
            <div className="flex items-center gap-1 shrink-0">
              <div className="relative">
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="pr-2.5 pl-6 py-2 rounded-xl text-[11px] sm:text-xs font-black border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none cursor-pointer"
                >
                  <option value="popular">الأكثر طلباً</option>
                  <option value="newest">الأحدث وصولاً</option>
                  <option value="price-asc">السعر: من الأقل</option>
                  <option value="price-desc">السعر: من الأعلى</option>
                  <option value="rating">التقييم الأعلى</option>
                </select>
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* 2. SEARCH BAR */}
          <div className="mt-3 relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`ابحث في ${category?.label || "المنتجات"}...`}
              className="w-full pr-9 pl-8 py-2.5 text-xs sm:text-sm rounded-xl sm:rounded-2xl border border-slate-200 bg-slate-50/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all placeholder:text-slate-400"
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 bg-slate-200 rounded-full w-5 h-5 flex items-center justify-center transition-colors"
                aria-label="مسح البحث"
              >
                ✕
              </button>
            )}
          </div>



        </div>
      </div>

      {/* 4. PRODUCTS DISPLAY: 2-COLUMN GRID (Mobile-First) */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-4 w-full">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 w-full">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl sm:rounded-3xl p-3 border border-slate-100 shadow-sm animate-pulse space-y-3"
              >
                <div className="aspect-square bg-slate-200 rounded-2xl" />
                <div className="h-3 bg-slate-200 rounded w-3/4" />
                <div className="h-3 bg-slate-200 rounded w-1/2" />
                <div className="h-7 bg-slate-200 rounded-xl" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 sm:p-14 text-center border border-slate-200 max-w-md mx-auto space-y-4 shadow-sm w-full mt-6">
            <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-3xl mx-auto">
              🔍
            </div>
            <div className="space-y-1">
              <h3 className="text-sm sm:text-base font-black text-slate-800">لا توجد منتجات مطابقة للبحث والفلاتر</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                جرّب مسح كلمات البحث أو تغيير فلاتر السعر والحالة.
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
              }}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold active:scale-95 transition-all shadow-sm"
            >
              إعادة ضبط الفلاتر وعرض الكل
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

      {/* Quick Modal fallback if needed */}
      {activeModalProduct && (
        <ProductDetailModal
          product={activeModalProduct}
          onClose={() => setActiveModalProduct(null)}
        />
      )}
    </div>
  );
}
