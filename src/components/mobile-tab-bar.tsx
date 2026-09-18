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
    <div className="md:hidden fixed bottom-0 inset-x-0 z-40 px-4 pb-[calc(env(safe-area-inset-bottom,0px)+12px)] pointer-events-none flex justify-center">
      <nav
        className="bg-white/80 backdrop-blur-2xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.12)] rounded-[2rem] px-2 py-1.5 pointer-events-auto select-none touch-manipulation w-full max-w-sm"
        dir="rtl"
      >
        <div className="grid grid-cols-5 gap-1 items-center">
          {tabs.map((tab, idx) => {
            const Icon = tab.icon;
            const content = (
              <>
                <div
                  className={`relative px-4 py-1.5 rounded-[1.25rem] transition-all duration-300 flex items-center justify-center ${
                    tab.isActive
                      ? "bg-emerald-500 text-white scale-105 shadow-md shadow-emerald-500/20"
                      : "text-slate-400 group-hover:text-slate-700"
                  }`}
                >
                  <Icon className={`w-5 h-5 ${tab.isActive ? "stroke-[2.5]" : "stroke-[2.2]"}`} />
                  {tab.badge !== undefined && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-black min-w-[16px] h-4 px-0.5 rounded-full flex items-center justify-center shadow-xs border border-white">
                      {tab.badge}
                    </span>
                  )}
                </div>
                <span
                  className={`text-[9.5px] mt-1 tracking-tight block truncate transition-colors duration-300 ${
                    tab.isActive
                      ? "text-emerald-700 font-black"
                      : "text-slate-400 font-bold"
                  }`}
                >
                  {tab.label}
                </span>
              </>
            );

            const commonClasses =
              "group flex flex-col items-center justify-center w-full h-full py-0.5 tap-bounce active:scale-95";

            if (tab.href) {
              return (
                <Link
                  key={idx}
                  href={tab.href}
                  className={commonClasses}
                  onClick={
                    tab.href === "/account" && !isAuthenticated
                      ? (e) => {
                          e.preventDefault();
                          openAuthModal();
                        }
                      : undefined
                  }
                >
                  {content}
                </Link>
              );
            }

            return (
              <button key={idx} type="button" onClick={tab.action} className={commonClasses}>
                {content}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
