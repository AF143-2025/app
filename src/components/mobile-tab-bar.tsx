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
      className="md:hidden fixed bottom-0 inset-x-0 z-40 glass-tabbar px-2 pt-2 pb-[calc(env(safe-area-inset-bottom,0px)+0.45rem)] no-print select-none touch-manipulation"
      dir="rtl"
    >
      <div className="grid grid-cols-5 gap-1 items-center max-w-md mx-auto">
        {tabs.map((tab, idx) => {
          const Icon = tab.icon;

          if (tab.action) {
            return (
              <button
                key={idx}
                type="button"
                onClick={tab.action}
                className={`min-h-[46px] flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all active:scale-[0.88] relative ${
                  tab.isActive
                    ? "text-emerald-700 font-black bg-emerald-50/70"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 transition-transform ${tab.isActive ? "scale-110 stroke-[2.5]" : "stroke-[2]"}`} />
                  {tab.badge !== undefined && (
                    <span className="absolute -top-1.5 -right-2.5 bg-emerald-600 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                      {tab.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10.5px] font-bold mt-1 tracking-tight">{tab.label}</span>
              </button>
            );
          }

          return (
            <Link
              key={idx}
              href={tab.href || "/"}
              className={`min-h-[46px] flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all active:scale-[0.88] relative ${
                tab.isActive
                  ? "text-emerald-700 font-black bg-emerald-50/70"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${tab.isActive ? "scale-110 stroke-[2.5]" : "stroke-[2]"}`} />
                {tab.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2.5 bg-emerald-600 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[10.5px] font-bold mt-1 tracking-tight">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
