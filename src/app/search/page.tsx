"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, ChevronRight, X, Tag, Smartphone } from "lucide-react";
import { ProductCard } from "@/components/product-card";

export default function SearchPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center">جاري التحميل...</div>}>
      <SearchContent />
    </React.Suspense>
  );
}

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams?.get("search") || "";
  
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const popularTags = [
    "آيفون 16",
    "سامسونج S24",
    "تقسيط ميسر",
    "صيانة شاشات",
    "شواحن أنكر",
    "مستعمل مفحوص",
  ];

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
    if (initialQuery) {
      handleSearch(initialQuery);
    }
  }, [initialQuery]);

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(`/api/products?search=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      if (data.success) {
        setResults(data.products || []);
      }
    } catch (err) {
      console.error("Search failed", err);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.replace(`/search?search=${encodeURIComponent(query.trim())}`);
      handleSearch(query);
    }
  };

  const onTagClick = (tag: string) => {
    setQuery(tag);
    router.replace(`/search?search=${encodeURIComponent(tag)}`);
    handleSearch(tag);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-right pb-20" dir="rtl">
      {/* Top Search Header */}
      <header className="sticky top-0 z-40 bg-white shadow-sm border-b border-slate-200 px-3 py-3 w-full max-w-full">
        <div className="flex items-center gap-2 max-w-7xl mx-auto">
          <button
            onClick={() => router.back()}
            className="p-2 sm:p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition-all active:scale-90 border border-slate-200/60 shadow-sm shrink-0"
            aria-label="الرجوع"
          >
            <ChevronRight className="w-5 h-5 stroke-[2.5]" />
          </button>

          <form onSubmit={onSubmit} className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ابحث عن هاتف، آيفون، صيانة..."
              className="w-full pr-10 pl-10 py-2.5 sm:py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setResults([]);
                  inputRef.current?.focus();
                }}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 rounded-full bg-slate-100 hover:bg-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Popular Tags */}
        {!query && results.length === 0 && (
          <div className="space-y-4">
            <h3 className="text-sm font-black text-slate-800 flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-emerald-600" />
              عمليات البحث الشائعة
            </h3>
            <div className="flex flex-wrap gap-2">
              {popularTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => onTagClick(tag)}
                  className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 text-xs font-bold shadow-sm active:scale-95 transition-all hover:border-emerald-300 hover:text-emerald-700"
                >
                  {tag}
                </button>
              ))}
            </div>
            
            <div className="pt-10 flex flex-col items-center justify-center text-slate-400 opacity-60 space-y-3">
               <Smartphone className="w-16 h-16" />
               <p className="text-sm font-bold">ابحث في متجر سما الخضراء</p>
            </div>
          </div>
        )}

        {/* Results */}
        {query && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
               <h3 className="text-sm font-black text-slate-800">
                 نتائج البحث عن: <span className="text-emerald-600">"{query}"</span>
               </h3>
               {results.length > 0 && !isLoading && (
                 <span className="text-xs font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md">{results.length} نتائج</span>
               )}
            </div>

            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-64 rounded-3xl bg-slate-200 animate-pulse" />
                ))}
              </div>
            ) : results.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
                {results.map((prod) => (
                  <ProductCard key={prod.id} product={prod} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 space-y-3">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                  <Search className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-black text-slate-800">لم يتم العثور على نتائج</h4>
                <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
                  جرب البحث باستخدام كلمات مختلفة أو تفقد الأقسام المتوفرة لدينا.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}