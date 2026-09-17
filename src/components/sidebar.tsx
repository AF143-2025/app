"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Store,
  CreditCard,
  Banknote,
  Smartphone,
  Wrench,
  Layers,
  ShoppingBag,
  Package,
  ShieldCheck,
  ChevronLeft,
  X,
  Sparkles,
  ArrowLeftRight,
  Calculator,
  UserCheck,
  User,
  LogIn,
  LogOut,
  Heart,
} from "lucide-react";
import { useCart } from "./cart-context";

export function Sidebar() {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const { totalItems, isMenuOpen, closeMenu, user, isAuthenticated, openAuthModal, logout, wishlistCount } = useCart();

  interface NavItem {
    href: string;
    label: string;
    icon: any;
    badge?: string;
    count?: number;
  }

  interface NavSection {
    title: string;
    items: NavItem[];
  }

  const navigationSections: NavSection[] = [
    {
      title: "التجارة ومبيعات الهواتف",
      items: [
        { href: "/", label: "متجر الهواتف والملحقات", icon: Store },
        { href: "/wishlist", label: "قائمة المفضلة", icon: Heart, count: wishlistCount },
        { href: "/cart", label: "سلة المشتريات", icon: ShoppingBag, count: totalItems },
      ],
    },
    {
      title: "الصيانة وخدمات الهواتف",
      items: [
        { href: "/maintenance", label: "طلب صيانة", icon: Wrench, badge: "رد المدير 💬" },
        { href: "/wallets", label: "وسائل الدفع المتوفرة", icon: CreditCard, badge: "طرق الدفع 💳" },
        { href: "/salaries", label: "الصيرفة وصرف جميع الرواتب", icon: Banknote, badge: "متوفر نقداً 💵" },
      ],
    },
    {
      title: "الطلبات والمتابعة",
      items: [
        { href: "/orders", label: "سجل الطلبات وتتبع الشحنات", icon: Package },
      ],
    },
  ];

  if (!isMenuOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden text-right" dir="rtl">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={closeMenu}
      />

      {/* Drawer Container (Sliding from Right or Left - modern side sheet) */}
      <div className="fixed inset-y-0 right-0 max-w-full flex">
        <aside className="w-80 max-w-[88vw] sm:max-w-full bg-slate-900 text-slate-100 flex flex-col shadow-2xl border-l border-slate-800 animate-in slide-in-from-right duration-250">
          {/* Brand Header */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
            <Link
              href="/"
              onClick={closeMenu}
              className="flex items-center gap-3 group"
            >
              <div className="w-10 h-10 rounded-2xl bg-white p-1 flex items-center justify-center shadow-xs ring-1 ring-emerald-500/30 group-hover:scale-105 transition-transform overflow-hidden shrink-0">
                <Image
                  src="/images/sama-logo-emblem.png"
                  alt="شعار سما الخضراء"
                  width={40}
                  height={40}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="text-lg font-black tracking-tight bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent block leading-tight">
                  سما الخضراء
                </span>
                <span className="text-[10px] font-semibold text-emerald-400">
                  محل الهواتف الذكية والصيانة
                </span>
              </div>
            </Link>

            <button
              onClick={closeMenu}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="إغلاق القائمة"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Profile Mini Bar inside drawer */}
          <div className="p-4 border-b border-slate-800/80 bg-slate-950/30">
            {isAuthenticated && user ? (
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-700/60 border border-emerald-500/30 flex items-center justify-center text-white font-bold text-xs">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">{user.name}</div>
                      <div className="text-[10px] text-emerald-400">
                        {user.role === "ADMIN"
                          ? "👑 المدير العام"
                          : "👤 عميل معتمد"}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
                    title="تسجيل الخروج"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>

                {user.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    onClick={closeMenu}
                    className="mt-2.5 w-full py-2 px-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-amber-500/20"
                  >
                    <ShieldCheck className="w-4 h-4 text-slate-950" />
                    <span>الدخول إلى لوحة تحكم المدير 👑</span>
                  </Link>
                )}
              </div>
            ) : (
              <Link
                href="/account"
                onClick={closeMenu}
                className="w-full py-2.5 px-3 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-300 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all"
              >
                <User className="w-4 h-4" />
                <span>حسابي</span>
              </Link>
            )}
          </div>

          {/* Navigation Sections */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin">
            {navigationSections.map((sec, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider px-3">
                  {sec.title}
                </div>
                <div className="space-y-1">
                  {sec.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={closeMenu}
                        className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                          isActive
                            ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                            : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon
                            className={`w-4 h-4 ${
                              isActive ? "text-white" : "text-emerald-400"
                            }`}
                          />
                          <span>{item.label}</span>
                        </div>

                        {item.badge && (
                          <span
                            className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${
                              isActive
                                ? "bg-white/20 text-white"
                                : "bg-slate-800 text-emerald-400 border border-emerald-500/20"
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}

                        {item.count !== undefined && item.count > 0 && (
                          <span className="bg-emerald-500 text-slate-950 font-black text-[10px] rounded-full w-5 h-5 flex items-center justify-center shadow">
                            {item.count}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Footer info */}
          <div className="p-4 border-t border-slate-800 bg-slate-950/60 text-center pb-[calc(env(safe-area-inset-bottom,0px)+1.2rem)]">
            <div className="text-[11px] font-bold text-emerald-400 flex items-center justify-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>منظومة سما الخضراء للهواتف متصلة</span>
            </div>
            <div className="text-[9px] text-slate-500 mt-1">
              هواتف أصلية • أقساط ميسرة • صيانة فورية • كروت شحن
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
