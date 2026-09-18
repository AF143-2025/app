"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import {
  Search,
  Bell,
  Sparkles,
  ShieldCheck,
  X,
  CheckCheck,
  Smartphone,
  Tag,
  ShoppingBag,
  Menu,
} from "lucide-react";
import { useCart } from "./cart-context";

interface NotificationItem {
  id: string;
  title: string;
  desc: string;
  time: string;
  unread: boolean;
  link: string;
  icon: string;
}

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const { totalItems, openCart, toggleMenu } = useCart();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: "1",
      title: "عروض أقساط الهواتف الجديدة 🔥",
      desc: "أقساط هواتف iPhone 16 Pro Max و Samsung S24 Ultra تبدأ من 75,000 د.ع/شهر.",
      time: "منذ 10 دقائق",
      unread: true,
      link: "/installments",
      icon: "📱",
    },
    {
      id: "2",
      title: "ورشة الصيانة المعتمدة 🛠️",
      desc: "فحص مجاني للشاشات والبطاريات في ورشة سما الخضراء مع توفير قطع غيار أصلية.",
      time: "منذ 45 دقيقة",
      unread: true,
      link: "/maintenance",
      icon: "🔧",
    },
    {
      id: "3",
      title: "صرف جميع الرواتب نقداً 💵",
      desc: "يتوفر لدينا صرف جميع رواتب الماستر كارد، الرافدين، الرشيد، والكي كارد فوراً وبأقل عمولة.",
      time: "منذ ساعتين",
      unread: true,
      link: "/salaries",
      icon: "🏛️",
    },
  ]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
    }
  };

  const handleTagClick = (tag: string) => {
    setSearchQuery(tag);
    router.push(`/?search=${encodeURIComponent(tag)}`);
    setIsSearchOpen(false);
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  const popularTags = [
    "آيفون 16",
    "سامسونج S24",
    "تقسيط ميسر",
    "صيانة شاشات",
    "شواحن أنكر",
    "مستعمل مفحوص",
  ];

  return (
    <header
      className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-white/50 shadow-sm text-right pt-[env(safe-area-inset-top,0px)] w-full max-w-full transition-all"
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2 w-full">
          {/* Right: Brand Title & Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group min-w-0 flex-1 max-w-[70%] sm:max-w-none"
          >
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white p-1.5 shadow-sm shrink-0 group-hover:scale-105 transition-transform overflow-hidden flex items-center justify-center">
              <Image
                src="/images/sama-logo-emblem.png"
                alt="شعار سما الخضراء"
                width={44}
                height={44}
                className="w-full h-full object-contain"
                priority
              />
            </div>
            <div className="min-w-0">
              <span className="text-base sm:text-lg font-black text-slate-900 block leading-tight truncate tracking-tight">
                سما الخضراء
              </span>
            </div>
          </Link>

          {/* Left Actions: Guaranteed Visible, Bold, High-Contrast Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* 1. Search Button */}
            <Link
              href="/search"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full transition-all flex items-center justify-center relative active:scale-95 shrink-0 bg-black/5 hover:bg-black/10 text-slate-800"
              title="بحث في الهواتف والمنتجات"
              aria-label="البحث"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
            </Link>

            {/* 2. Notifications Button & Popover */}
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => {
                  setIsNotificationsOpen(!isNotificationsOpen);
                  setIsSearchOpen(false);
                }}
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full transition-all flex items-center justify-center relative active:scale-95 shrink-0 ${
                  isNotificationsOpen
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-black/5 hover:bg-black/10 text-slate-800"
                }`}
                title="الإشعارات والتنبيهات"
                aria-label="الإشعارات"
              >
                <Bell className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] sm:text-[10px] font-black rounded-full min-w-[17px] h-[17px] px-0.5 flex items-center justify-center shadow-xs border-2 border-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Responsive Notification Popover (Never overflows mobile screens) */}
              {isNotificationsOpen && (
                <div className="fixed inset-x-3 top-16 sm:absolute sm:inset-x-auto sm:left-0 sm:top-full sm:mt-2 sm:w-80 md:w-96 bg-white/95 backdrop-blur-3xl rounded-3xl shadow-2xl border border-white/20 py-3 z-50 text-right overflow-hidden max-h-[80vh]">
                  <div className="px-4 py-2 border-b border-slate-100/50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-emerald-600" />
                      <span className="font-bold text-xs text-slate-900">الإشعارات والتنبيهات</span>
                      {unreadCount > 0 && (
                        <span className="text-[10px] bg-red-50 text-red-600 font-bold px-2 py-0.5 rounded-full">
                          {unreadCount} جديد
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition-colors"
                      >
                        <CheckCheck className="w-3 h-3" />
                        تحديد الكل كمقروء
                      </button>
                    )}
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-50/50">
                    {notifications.map((n) => (
                      <Link
                        key={n.id}
                        href={n.link}
                        onClick={() => {
                          markAsRead(n.id);
                          setIsNotificationsOpen(false);
                        }}
                        className={`p-3.5 flex items-start gap-3 hover:bg-black/5 transition-colors block ${
                          n.unread ? "bg-emerald-50/30" : ""
                        }`}
                      >
                        <span className="text-xl shrink-0 p-2 rounded-2xl bg-white shadow-xs border border-slate-100">
                          {n.icon}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <h4 className="font-bold text-xs text-slate-900 leading-snug">{n.title}</h4>
                            {n.unread && (
                              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 shadow-sm" />
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{n.desc}</p>
                          <span className="text-[9px] text-slate-400 mt-1 block font-medium">{n.time}</span>
                        </div>
                      </Link>
                    ))}
                  </div>

                  <div className="p-2 border-t border-slate-100/50 text-center">
                    <span className="text-[10px] text-slate-400 font-medium">
                      مركز إشعارات متجر سما الخضراء
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* 3. Shopping Cart Button (Desktop / Tablet only; mobile has bottom tab bar) */}
            <button
              type="button"
              onClick={openCart}
              className="hidden sm:flex w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-all items-center justify-center relative active:scale-95 shrink-0"
              title="سلة المشتريات"
              aria-label="عرض السلة"
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-[9px] sm:text-[10px] font-black rounded-full min-w-[17px] h-[17px] px-0.5 flex items-center justify-center shadow-xs border-2 border-white">
                  {totalItems}
                </span>
              )}
            </button>

            {/* 4. Menu Toggle Button (Drawer) (Desktop / Tablet only; mobile has bottom tab bar) */}
            <button
              type="button"
              onClick={toggleMenu}
              className="hidden sm:flex w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/5 hover:bg-black/10 text-slate-800 transition-all items-center justify-center relative active:scale-95 shrink-0"
              title="القائمة والأقسام"
              aria-label="القائمة"
            >
              <Menu className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
            </button>
          </div>
        </div>
      </div>

    </header>
  );
}

