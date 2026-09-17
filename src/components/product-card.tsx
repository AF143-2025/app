"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Star,
  ShoppingBag,
  Eye,
  Check,
  Heart,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { useCart } from "./cart-context";
import { parseProductAttributes } from "@/lib/product-helper";
import { getProductWhatsAppUrl } from "@/lib/store-config";

export interface ProductCardProps {
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    originalPrice?: number | null;
    imageUrl: string;
    stock: number;
    category: string;
    rating: number;
    reviewsCount: number;
    seller?: {
      storeName: string;
      rating?: number;
    };
  };
  onQuickView?: (product: any) => void;
}

export function ProductCard({ product, onQuickView }: ProductCardProps) {
  const router = useRouter();
  const { addToCart, isInWishlist, toggleWishlist } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  const handleAdd = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (product.stock === 0 || isAdding) return;
    setIsAdding(true);
    const success = await addToCart(product.id, 1);
    setIsAdding(false);
    if (success) {
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2000);
    }
  };

  const parsed = parseProductAttributes(product);
  const isOutOfStock = product.stock === 0;
  const whatsappUrl = getProductWhatsAppUrl(product);

  const handleCardClick = () => {
    router.push(`/product/${product.id}`);
  };

  const optimizedImageUrl = React.useMemo(() => {
    if (!product.imageUrl) return "/images/placeholder-phone.png";
    if (product.imageUrl.includes("unsplash.com")) {
      const base = product.imageUrl.split("?")[0];
      return `${base}?w=350&q=75&auto=format`;
    }
    return product.imageUrl;
  }, [product.imageUrl]);

  return (
    <article
      onClick={handleCardClick}
      className="group bg-white rounded-2xl sm:rounded-3xl border border-slate-100 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all duration-200 flex flex-col overflow-hidden cursor-pointer relative select-none w-full"
    >
      {/* Badges Container */}
      <div className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 z-10 flex flex-col gap-1 pointer-events-none">
        {/* Discount Badge */}
        {discountPercent && (
          <span className="bg-red-500 text-white text-[9.5px] sm:text-[11px] font-black px-2 py-0.5 rounded-lg sm:rounded-xl shadow-xs self-start">
            -{discountPercent}%
          </span>
        )}

        {/* Condition Badge (جديد / مستعمل) */}
        <span
          className={`text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-lg sm:rounded-xl border shadow-2xs self-start ${parsed.conditionBadge}`}
        >
          {parsed.condition}
        </span>
      </div>

      {/* Wishlist Heart Button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          toggleWishlist(product.id);
        }}
        className={`absolute top-2 left-2 sm:top-2.5 sm:left-2.5 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full shadow-xs transition-all flex items-center justify-center ${
          isInWishlist(product.id)
            ? "bg-red-50 text-red-600 border border-red-200 scale-105"
            : "bg-white/95 text-slate-400 hover:text-red-500 hover:bg-white border border-slate-100"
        }`}
        title={isInWishlist(product.id) ? "إزالة من المفضلة" : "إضافة للمفضلة"}
        aria-label="المفضلة"
      >
        <Heart
          className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
            isInWishlist(product.id) ? "fill-red-600 text-red-600" : ""
          }`}
        />
      </button>

      {/* Image Container */}
      <div className="relative aspect-square w-full overflow-hidden bg-slate-50 flex items-center justify-center p-3">
        <img
          src={optimizedImageUrl}
          alt={product.name}
          width={280}
          height={280}
          decoding="async"
          loading="lazy"
          className="w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-300"
        />
        {isOutOfStock && (
          <div className="absolute inset-0 bg-slate-900/70 flex items-center justify-center">
            <span className="bg-white text-slate-900 text-[10px] sm:text-xs font-black px-2.5 py-1 rounded-xl shadow-md">
              غير متوفر حالياً
            </span>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-2.5 sm:p-3.5 flex-1 flex flex-col justify-between space-y-2">
        <div className="space-y-1.5">
          {/* Brand & Storage Specs Header */}
          <div className="flex items-center justify-between text-[10px] text-slate-500 gap-1">
            <span className="font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-100 truncate">
              {parsed.brand}
            </span>
            <div className="flex items-center gap-1 text-[9.5px] font-semibold text-slate-500 truncate">
              <span>{parsed.storage}</span>
              {parsed.ram && <span>• {parsed.ram}</span>}
            </div>
          </div>

          {/* Product Title (2-line consistent clamp) */}
          <h3 className="font-black text-slate-900 text-xs sm:text-sm line-clamp-2 leading-tight group-hover:text-emerald-700 transition-colors min-h-[2.1rem] sm:min-h-[2.5rem]">
            {product.name}
          </h3>

          {/* Warranty & Availability Snippet */}
          <div className="flex items-center justify-between text-[9px] sm:text-[10px] pt-0.5">
            <span className="text-slate-500 flex items-center gap-1 truncate max-w-[65%]">
              <ShieldCheck className="w-3 h-3 text-teal-600 shrink-0" />
              <span className="truncate">{parsed.warranty}</span>
            </span>

            {product.stock > 0 ? (
              <span className="font-bold text-emerald-700 shrink-0">
                متوفر بالفرع
              </span>
            ) : (
              <span className="font-bold text-slate-400 shrink-0">
                نافد
              </span>
            )}
          </div>
        </div>

        {/* Pricing Section */}
        <div className="pt-2 border-t border-slate-100 space-y-2 mt-auto">
          <div className="flex items-baseline justify-between gap-1">
            <div className="text-sm sm:text-base font-black text-slate-900 leading-none">
              {product.price.toLocaleString("ar-IQ")}
              <span className="text-[10px] sm:text-xs font-bold text-emerald-700 mr-1">د.ع</span>
            </div>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-[10px] sm:text-xs text-slate-400 line-through">
                {product.originalPrice.toLocaleString("ar-IQ")} د.ع
              </span>
            )}
          </div>

          {/* Dual Action Buttons: "عرض التفاصيل" + "واتساب فوري" */}
          <div className="grid grid-cols-2 gap-1.5 pt-0.5">
            {/* 1. View Details Button */}
            <Link
              href={`/product/${product.id}`}
              onClick={(e) => e.stopPropagation()}
              className="h-8 sm:h-8.5 rounded-xl text-[10px] sm:text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-all flex items-center justify-center gap-1 active:scale-95 border border-slate-200"
            >
              <Eye className="w-3.5 h-3.5 text-slate-600" />
              <span>التفاصيل</span>
            </Link>

            {/* 2. Direct WhatsApp Inquiry CTA */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="h-8 sm:h-8.5 rounded-xl text-[10px] sm:text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-all flex items-center justify-center gap-1 shadow-sm shadow-emerald-600/20 active:scale-95"
              title="تواصل مباشر عبر واتساب"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-white" />
              <span>واتساب</span>
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
