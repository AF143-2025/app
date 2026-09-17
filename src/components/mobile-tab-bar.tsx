"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  LayoutGrid,
  Heart,
  ShoppingBag,
  User,
} from "lucide-react";
import { useCart } from "./cart-context";

export function MobileTabBar() {
  const pathname = usePathname();

  // Hide mobile navigation bar on admin routes
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const {
    totalItems,
    openCart,
    isCartOpen,
    toggleMenu,
    isMenuOpen,
    isAuthenticated,
    openAuthModal,
    wishlistCount,
  } = useCart();

  const tabs = [
    {
      href: "/",
      label: "الرئيسية",
      icon: Home,
      isActive: pathname === "/",
    },
    {
      action: toggleMenu,
      label: "الأقسام",
      icon: LayoutGrid,
      isActive: isMenuOpen,
    },
    {
      href: "/wishlist",
      label: "المفضلة",
      icon: Heart,
      badge: wishlistCount > 0 ? wishlistCount : undefined,
      isActive: pathname === "/wishlist",
    },
    {
      action: openCart,
      label: "السلة",
      icon: ShoppingBag,
      badge: totalItems > 0 ? totalItems : undefined,
      isActive: pathname === "/cart" || isCartOpen,
    },
    {
      href: "/account",
      label: "حسابي",
      icon: User,
      isActive: pathname === "/account" || pathname === "/orders",
    },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200/90 shadow-[0_-4px_24px_rgba(0,0,0,0.06)] px-2 pt-1 pb-[max(env(safe-area-inset-bottom,0px),8px)] no-print select-none touch-manipulation"
      dir="rtl"
    >
      <div className="grid grid-cols-5 gap-1 items-center max-w-md mx-auto">
        {tabs.map((tab, idx) => {
          const Icon = tab.icon;
          const content = (
            <>
              <div
                className={`relative px-3 py-0.5 rounded-full transition-all duration-200 flex items-center justify-center ${
                  tab.isActive
                    ? "bg-emerald-100/80 text-emerald-800 scale-105"
                    : "text-slate-500 group-hover:text-slate-800"
                }`}
              >
                <Icon className="w-5 h-5 stroke-[2.2]" />
                {tab.badge !== undefined && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[9px] font-black min-w-[16px] h-4 px-0.5 rounded-full flex items-center justify-center shadow-xs border-2 border-white animate-pulse">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[10.5px] mt-0.5 tracking-tight block truncate ${
                  tab.isActive
                    ? "text-emerald-800 font-black"
                    : "text-slate-500 font-semibold"
                }`}
              >
                {tab.label}
              </span>
            </>
          );

          if (tab.action) {
            return (
              <button
                key={idx}
                type="button"
                onClick={tab.action}
                className="min-h-[48px] flex flex-col items-center justify-center py-1 px-1 rounded-2xl transition-all active:scale-95 relative group"
              >
                {content}
              </button>
            );
          }

          return (
            <Link
              key={idx}
              href={tab.href || "/"}
              className="min-h-[48px] flex flex-col items-center justify-center py-1 px-1 rounded-2xl transition-all active:scale-95 relative group"
            >
              {content}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
