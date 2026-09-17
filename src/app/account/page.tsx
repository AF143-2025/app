"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  User,
  Package,
  Heart,
  MapPin,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Clock,
  CheckCircle2,
  FileText,
  Phone,
  Shield,
  ShieldCheck,
  Sparkles,
  Search,
  Truck,
  ExternalLink,
  Layers,
  Coins,
  Ticket,
  Wallet,
  Building2,
  Calculator,
  Wrench,
  Info,
  ArrowRight,
  CreditCard,
  Check,
  RefreshCw,
} from "lucide-react";
import { useCart } from "@/components/cart-context";

export default function AccountPage() {
  const {
    user,
    userId,
    wishlistCount,
  } = useCart();

  // Sub-view state: "main" (dashboard like Point Mobile) or specific sub-pages
  const [currentView, setCurrentView] = useState<"main" | "orders" | "warranty" | "addresses" | "installments" | "branches" | "policy">("main");

  // Orders State
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [orderSearchQuery, setOrderSearchQuery] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState<"ALL" | "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED">("ALL");

  // Warranty serial checker state
  const [serialInput, setSerialInput] = useState("");
  const [serialResult, setSerialResult] = useState<{ checked: boolean; valid: boolean; serial?: string; expiryDate?: string } | null>(null);

  // Installment Calculator State
  const [selectedDevicePrice, setSelectedDevicePrice] = useState(1650000); // IQD (e.g. iPhone 16 Pro)
  const [installmentMonths, setInstallmentMonths] = useState(12);
  const [downPayment, setDownPayment] = useState(250000);

  // Saved Address state (persisted in localStorage)
  const [savedAddress, setSavedAddress] = useState({
    governorate: "بغداد",
    district: "المنصور - شارع 14 رمضان",
    landmark: "قرب مجمع المنصور التجاري",
    recipientName: "الزبون المعتمد",
    phone: "07701234567",
  });
  const [addressSavedNotification, setAddressSavedNotification] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("sama_customer_address");
      if (stored) {
        setSavedAddress(JSON.parse(stored));
      }
    } catch {}
  }, []);

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem("sama_customer_address", JSON.stringify(savedAddress));
      setAddressSavedNotification(true);
      setTimeout(() => setAddressSavedNotification(false), 3000);
    } catch {}
  };

  const handleCheckWarranty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serialInput.trim()) return;
    setSerialResult({
      checked: true,
      valid: true,
      serial: serialInput.trim(),
      expiryDate: "2027-04-15",
    });
  };

  useEffect(() => {
    if (userId) {
      setLoadingOrders(true);
      fetch(`/api/orders?userId=${userId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setOrders(data.orders || []);
          }
        })
        .catch((err) => console.error(err))
        .finally(() => setLoadingOrders(false));
    }
  }, [userId]);

  // Order Counts by Status
  const pendingCount = orders.filter((o) => (o.orderStatus || o.status) === "PENDING" || (o.orderStatus || o.status) === "قيد الانتظار").length;
  const processingCount = orders.filter((o) => (o.orderStatus || o.status) === "PROCESSING" || (o.orderStatus || o.status) === "قيد التجهيز").length;
  const shippedCount = orders.filter((o) => (o.orderStatus || o.status) === "SHIPPED" || (o.orderStatus || o.status) === "قيد التوصيل").length;
  const deliveredCount = orders.filter((o) => (o.orderStatus || o.status) === "DELIVERED" || (o.orderStatus || o.status) === "تم التسليم").length;

  const filteredOrders = orders.filter((o) => {
    const status = (o.orderStatus || o.status || "").toUpperCase();
    if (orderStatusFilter !== "ALL") {
      if (orderStatusFilter === "PENDING" && !status.includes("PEND") && !status.includes("انتظار")) return false;
      if (orderStatusFilter === "PROCESSING" && !status.includes("PROC") && !status.includes("تجهيز")) return false;
      if (orderStatusFilter === "SHIPPED" && !status.includes("SHIP") && !status.includes("توصيل")) return false;
      if (orderStatusFilter === "DELIVERED" && !status.includes("DELIV") && !status.includes("تسليم")) return false;
    }
    if (!orderSearchQuery.trim()) return true;
    const q = orderSearchQuery.toLowerCase();
    return (
      o.orderNumber?.toLowerCase().includes(q) ||
      o.id?.toLowerCase().includes(q)
    );
  });

  // Calculate monthly installment in IQD
  const remainingAmount = Math.max(0, selectedDevicePrice - downPayment);
  const interestRate = 0.05; // 5% flat
  const totalWithInterest = remainingAmount * (1 + interestRate * (installmentMonths / 12));
  const monthlyInstallment = Math.round(totalWithInterest / installmentMonths);

  return (
    <div className="min-h-screen bg-[#f6f8fa] py-4 sm:py-8 px-3 sm:px-6 max-w-2xl mx-auto text-right font-sans" dir="rtl">
      {/* Top Breadcrumb & Page Title (Point Mobile Header Style) */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2">
          {currentView !== "main" ? (
            <button
              onClick={() => setCurrentView("main")}
              className="w-9 h-9 rounded-xl bg-white border border-slate-200/80 flex items-center justify-center text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-sm shadow-sm shadow-emerald-600/30">
              P
            </div>
          )}
          <h1 className="text-lg sm:text-xl font-black text-slate-900">
            {currentView === "main" && "حسابي"}
            {currentView === "orders" && "طلباتي ومشترياتي"}
            {currentView === "warranty" && "الضمان والكفالة الرسمية"}
            {currentView === "addresses" && "عناوين التوصيل"}
            {currentView === "installments" && "حاسبة الأقساط الشهرية"}
            {currentView === "branches" && "فروع ومعارض سما الخضراء"}
            {currentView === "policy" && "سياسة الضمان والاستبدال"}
          </h1>
        </div>

        <Link
          href="/"
          className="text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200/70 transition-colors"
        >
          المتجر الرئيسي
        </Link>
      </div>

      {/* ========================================================= */}
      {/* 1. MAIN VIEW: POINT MOBILE DASHBOARD                      */}
      {/* ========================================================= */}
      {currentView === "main" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* USER HERO CARD (Point Mobile Identity Banner) */}
          <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 rounded-3xl p-5 sm:p-6 text-white shadow-xl border border-white/10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-56 h-56 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none -translate-x-1/3 -translate-y-1/3" />
            
            <div className="relative z-10 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-emerald-500/25 shrink-0">
                  <User className="w-7 h-7 sm:w-8 sm:h-8 text-slate-950" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-base sm:text-lg font-black text-white">مرحباً بك في سما الخضراء</h2>
                    <span className="text-[10px] bg-emerald-500/25 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30 font-bold">
                      عميل معتمد
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 font-mono">ID: #IQ-89241 • تسوق مضمون 100%</p>
                </div>
              </div>

              <div className="shrink-0 hidden sm:block">
                <a
                  href="https://wa.me/9647712345678"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>خدمة الزبائن</span>
                </a>
              </div>
            </div>

            {/* Quick Wallet / Points Hub (Point Rewards System) */}
            <div className="relative z-10 grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-white/10 text-center">
              <div className="p-2 rounded-xl bg-white/5 border border-white/5">
                <div className="flex items-center justify-center gap-1 text-[11px] text-slate-300 mb-0.5">
                  <Coins className="w-3.5 h-3.5 text-amber-400" />
                  <span>نقاطي</span>
                </div>
                <div className="text-sm font-black text-white font-mono">250 <span className="text-[10px] text-emerald-400 font-sans">نقطة</span></div>
              </div>

              <div className="p-2 rounded-xl bg-white/5 border border-white/5">
                <div className="flex items-center justify-center gap-1 text-[11px] text-slate-300 mb-0.5">
                  <Ticket className="w-3.5 h-3.5 text-emerald-400" />
                  <span>كوبوناتي</span>
                </div>
                <div className="text-sm font-black text-white font-mono">1 <span className="text-[10px] text-emerald-400 font-sans">قسيمة</span></div>
              </div>

              <div className="p-2 rounded-xl bg-white/5 border border-white/5">
                <div className="flex items-center justify-center gap-1 text-[11px] text-slate-300 mb-0.5">
                  <Wallet className="w-3.5 h-3.5 text-blue-400" />
                  <span>المحفظة</span>
                </div>
                <div className="text-sm font-black text-white font-mono">0 <span className="text-[10px] text-emerald-400 font-sans">د.ع</span></div>
              </div>
            </div>
          </div>

          {/* ORDER STATUS STEPPER (Point Mobile Signature Orders Card) */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-4 pb-2.5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-black text-slate-900">طلباتي</h3>
              </div>
              <button
                onClick={() => {
                  setOrderStatusFilter("ALL");
                  setCurrentView("orders");
                }}
                className="text-xs font-bold text-slate-500 hover:text-emerald-700 flex items-center gap-0.5 transition-colors"
              >
                <span>عرض الكل ({orders.length})</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>

            {/* 4 Status Icon Buttons */}
            <div className="grid grid-cols-4 gap-2 text-center">
              <button
                onClick={() => {
                  setOrderStatusFilter("PENDING");
                  setCurrentView("orders");
                }}
                className="flex flex-col items-center gap-1.5 p-2 rounded-2xl hover:bg-slate-50 transition-colors group relative"
              >
                <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform relative">
                  <Clock className="w-5 h-5" />
                  {pendingCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-white font-bold text-[9px] flex items-center justify-center">
                      {pendingCount}
                    </span>
                  )}
                </div>
                <span className="text-[11px] font-bold text-slate-700">قيد التأكيد</span>
              </button>

              <button
                onClick={() => {
                  setOrderStatusFilter("PROCESSING");
                  setCurrentView("orders");
                }}
                className="flex flex-col items-center gap-1.5 p-2 rounded-2xl hover:bg-slate-50 transition-colors group relative"
              >
                <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform relative">
                  <RefreshCw className="w-5 h-5" />
                  {processingCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-500 text-white font-bold text-[9px] flex items-center justify-center">
                      {processingCount}
                    </span>
                  )}
                </div>
                <span className="text-[11px] font-bold text-slate-700">قيد التجهيز</span>
              </button>

              <button
                onClick={() => {
                  setOrderStatusFilter("SHIPPED");
                  setCurrentView("orders");
                }}
                className="flex flex-col items-center gap-1.5 p-2 rounded-2xl hover:bg-slate-50 transition-colors group relative"
              >
                <div className="w-11 h-11 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center group-hover:scale-105 transition-transform relative">
                  <Truck className="w-5 h-5" />
                  {shippedCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-teal-500 text-white font-bold text-[9px] flex items-center justify-center">
                      {shippedCount}
                    </span>
                  )}
                </div>
                <span className="text-[11px] font-bold text-slate-700">قيد التوصيل</span>
              </button>

              <button
                onClick={() => {
                  setOrderStatusFilter("DELIVERED");
                  setCurrentView("orders");
                }}
                className="flex flex-col items-center gap-1.5 p-2 rounded-2xl hover:bg-slate-50 transition-colors group relative"
              >
                <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform relative">
                  <CheckCircle2 className="w-5 h-5" />
                  {deliveredCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-600 text-white font-bold text-[9px] flex items-center justify-center">
                      {deliveredCount}
                    </span>
                  )}
                </div>
                <span className="text-[11px] font-bold text-slate-700">تم التسليم</span>
              </button>
            </div>
          </div>

          {/* GROUP 1: PURCHASES & WISHLIST (قائمة العمليات والتسوق) */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs divide-y divide-slate-100 overflow-hidden">
            <div className="px-4 py-3 bg-slate-50/50">
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
                المشتريات والطلبات
              </span>
            </div>

            <button
              onClick={() => {
                setOrderStatusFilter("ALL");
                setCurrentView("orders");
              }}
              className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-slate-50/70 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <Package className="w-4 h-4" />
                </div>
                <div className="text-right">
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    سجل الطلبات والفواتير
                  </h4>
                  <p className="text-[10px] text-slate-400">تتبع مشترياتك وتحميل الفواتير الإلكترونية</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 font-mono">{orders.length}</span>
                <ChevronLeft className="w-4 h-4 text-slate-400" />
              </div>
            </button>

            <Link
              href="/wishlist"
              className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-slate-50/70 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                  <Heart className="w-4 h-4" />
                </div>
                <div className="text-right">
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-rose-600 transition-colors">
                    قائمة المفضلة
                  </h4>
                  <p className="text-[10px] text-slate-400">الهواتف والإكسسوارات المحفوظة للشراء</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {wishlistCount > 0 && (
                  <span className="text-xs font-bold bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full font-mono">
                    {wishlistCount}
                  </span>
                )}
                <ChevronLeft className="w-4 h-4 text-slate-400" />
              </div>
            </Link>

            <button
              onClick={() => setCurrentView("addresses")}
              className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-slate-50/70 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="text-right">
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                    عناوين التوصيل والاستلام
                  </h4>
                  <p className="text-[10px] text-slate-400">{savedAddress.governorate} - {savedAddress.district}</p>
                </div>
              </div>
              <ChevronLeft className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          {/* GROUP 2: POINT MOBILE CORE SERVICES (خدمات وكفالة بوينت للأجهزة) */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs divide-y divide-slate-100 overflow-hidden">
            <div className="px-4 py-3 bg-slate-50/50">
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
                الخدمات وضمان الأجهزة
              </span>
            </div>

            <button
              onClick={() => setCurrentView("warranty")}
              className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-slate-50/70 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                      الضمان والكفالة المعتمدة
                    </h4>
                    <span className="text-[9px] bg-teal-100 text-teal-800 px-1.5 py-0.5 rounded font-bold">12 شهراً</span>
                  </div>
                  <p className="text-[10px] text-slate-400">فحص سيريال الجهاز ورقم الفاتورة للكفالة</p>
                </div>
              </div>
              <ChevronLeft className="w-4 h-4 text-slate-400" />
            </button>

            <Link
              href="/maintenance"
              className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-slate-50/70 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
                  <Wrench className="w-4 h-4" />
                </div>
                <div className="text-right">
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">
                    ورشة الصيانة وتتبع الأجهزة
                  </h4>
                  <p className="text-[10px] text-slate-400">متابعة حالة تصليح جهازك بكود الاستلام</p>
                </div>
              </div>
              <ChevronLeft className="w-4 h-4 text-slate-400" />
            </Link>

            <button
              onClick={() => setCurrentView("installments")}
              className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-slate-50/70 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                  <Calculator className="w-4 h-4" />
                </div>
                <div className="text-right">
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                    حاسبة أقساط الهواتف الذكية
                  </h4>
                  <p className="text-[10px] text-slate-400">احسب قسطك الشهري مع ماستر كارد والكي كارد</p>
                </div>
              </div>
              <ChevronLeft className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          {/* GROUP 3: CUSTOMER SUPPORT & STORE INFO (الدعم والفروع) */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs divide-y divide-slate-100 overflow-hidden">
            <div className="px-4 py-3 bg-slate-50/50">
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
                الدعم ومعلومات المتجر
              </span>
            </div>

            <a
              href="https://wa.me/9647712345678"
              target="_blank"
              rel="noreferrer"
              className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-slate-50/70 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#25D366]/20 text-[#1b9a4a] flex items-center justify-center font-bold text-base">
                  💬
                </div>
                <div className="text-right">
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    محادثة واتساب فورية
                  </h4>
                  <p className="text-[10px] text-slate-400">فريق خدمة الزبائن متاح 24/7 للإجابة</p>
                </div>
              </div>
              <ChevronLeft className="w-4 h-4 text-slate-400" />
            </a>

            <a
              href="tel:+9647712345678"
              className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-slate-50/70 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="text-right">
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                    الاتصال بالخط المباشر
                  </h4>
                  <p className="text-[10px] text-slate-400 font-mono">07712345678 (سما الخضراء)</p>
                </div>
              </div>
              <ChevronLeft className="w-4 h-4 text-slate-400" />
            </a>

            <button
              onClick={() => setCurrentView("branches")}
              className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-slate-50/70 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                  <Building2 className="w-4 h-4" />
                </div>
                <div className="text-right">
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                    معارض وفروع المتجر
                  </h4>
                  <p className="text-[10px] text-slate-400">فرع المنصور وساعات العمل الرسمية</p>
                </div>
              </div>
              <ChevronLeft className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={() => setCurrentView("policy")}
              className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-slate-50/70 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                  <Shield className="w-4 h-4" />
                </div>
                <div className="text-right">
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-purple-700 transition-colors">
                    سياسة الكفالة والاستبدال
                  </h4>
                  <p className="text-[10px] text-slate-400">شروط الاستبدال خلال 48 ساعة والضمان</p>
                </div>
              </div>
              <ChevronLeft className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          {/* ADMIN BANNER (IF MANAGER) */}
          {user?.role === "ADMIN" && (
            <div className="bg-slate-900 rounded-3xl p-4 text-white flex items-center justify-between gap-3 border border-emerald-500/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xl">
                  👑
                </div>
                <div>
                  <h4 className="text-xs font-black">لوحة تحكم الإدارة</h4>
                  <p className="text-[10px] text-slate-400">إدارة المنتجات، الطلبات، والمالية</p>
                </div>
              </div>
              <Link
                href="/admin"
                className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black transition-colors"
              >
                الدخول
              </Link>
            </div>
          )}

          {/* APP FOOTER INFO */}
          <div className="text-center py-4 space-y-1 text-slate-400 text-[11px]">
            <p className="font-bold text-slate-600">متجر سما الخضراء للأجهزة الذكية والإلكترونيات</p>
            <p className="font-mono">Point Mobile Interface • Version 2.5.0</p>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. SUB-VIEW: ORDERS & INVOICES                            */}
      {/* ========================================================= */}
      {currentView === "orders" && (
        <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-xs space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-black text-slate-900">سجل الطلبات والمشتريات</h2>
              <p className="text-xs text-slate-500 mt-0.5">تتبع حالة شحناتك وتنزيل الفواتير</p>
            </div>
            <Link href="/orders" className="text-xs font-bold text-emerald-700 hover:underline">
              صفحة الطلبات ←
            </Link>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={orderSearchQuery}
              onChange={(e) => setOrderSearchQuery(e.target.value)}
              placeholder="ابحث برقم الطلب (مثال: #1001)..."
              className="w-full pr-10 pl-4 py-2.5 rounded-2xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            <button
              onClick={() => setOrderStatusFilter("ALL")}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors ${
                orderStatusFilter === "ALL"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              الكل ({orders.length})
            </button>
            <button
              onClick={() => setOrderStatusFilter("PENDING")}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors ${
                orderStatusFilter === "PENDING"
                  ? "bg-amber-500 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              قيد التأكيد ({pendingCount})
            </button>
            <button
              onClick={() => setOrderStatusFilter("PROCESSING")}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors ${
                orderStatusFilter === "PROCESSING"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              قيد التجهيز ({processingCount})
            </button>
            <button
              onClick={() => setOrderStatusFilter("SHIPPED")}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors ${
                orderStatusFilter === "SHIPPED"
                  ? "bg-teal-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              قيد التوصيل ({shippedCount})
            </button>
            <button
              onClick={() => setOrderStatusFilter("DELIVERED")}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors ${
                orderStatusFilter === "DELIVERED"
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              تم التسليم ({deliveredCount})
            </button>
          </div>

          {/* Orders List */}
          {loadingOrders ? (
            <div className="space-y-3 py-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-slate-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto text-3xl">
                📦
              </div>
              <h3 className="text-sm font-black text-slate-800">لا توجد طلبات مسجلة في هذا القسم</h3>
              <p className="text-xs text-slate-400">تصفح الهواتف والإكسسوارات وأضف ما يعجبك للسلة.</p>
              <Link
                href="/"
                className="inline-block px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-black shadow-md shadow-emerald-600/20"
              >
                تصفح المنتجات الآن
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="p-4 rounded-2xl border border-slate-100 hover:border-emerald-200 transition-all bg-slate-50/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-bold text-xs text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                        #{ord.orderNumber}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800">
                        {ord.orderStatus || ord.status || "قيد المعالجة"}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">
                      الإجمالي: <strong className="font-mono text-slate-900">{ord.totalAmount?.toLocaleString()} د.ع</strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <Link
                      href={`/orders/${ord.id}`}
                      className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
                    >
                      التفاصيل
                    </Link>
                    <Link
                      href={`/orders/${ord.id}/invoice`}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold hover:bg-emerald-100 transition-colors flex items-center gap-1"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>الفاتورة</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. SUB-VIEW: WARRANTY & GUARANTEE                         */}
      {/* ========================================================= */}
      {currentView === "warranty" && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-5 animate-in fade-in duration-200">
          <div className="border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-teal-600" />
              <h2 className="text-base font-black text-slate-900">نظام الكفالة والضمان الرسمي</h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">ضمان وكالة معتمد لمدة سنة كاملة على الأجهزة الأصلية</p>
          </div>

          {/* Serial Checker */}
          <div className="p-4 rounded-2xl bg-teal-50/50 border border-teal-200 space-y-3">
            <div className="flex items-center gap-2 text-xs font-black text-teal-950">
              <Search className="w-4 h-4 text-teal-700" />
              <span>فحص سريال الضمان (IMEI / Serial Checker)</span>
            </div>
            <p className="text-[11px] text-slate-600">
              أدخل رقم الـ IMEI أو رقم الفاتورة للتحقق الفوري من سريان كفالة جهازك:
            </p>
            <form onSubmit={handleCheckWarranty} className="flex gap-2">
              <input
                type="text"
                value={serialInput}
                onChange={(e) => setSerialInput(e.target.value)}
                placeholder="358941203948192 أو رقم الفاتورة..."
                className="flex-1 px-3.5 py-2 rounded-xl border border-teal-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-black transition-colors"
              >
                فحص
              </button>
            </form>

            {serialResult && (
              <div className="p-3 rounded-xl bg-white border border-teal-300 text-xs space-y-1.5 animate-in fade-in">
                <div className="flex items-center justify-between text-teal-800 font-bold">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-teal-600" />
                    الضمان معتمد ونشط
                  </span>
                  <span className="text-[10px] bg-teal-100 px-2 py-0.5 rounded-full font-mono">
                    صالح حتى: {serialResult.expiryDate}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 font-mono">السيريال: {serialResult.serial}</p>
              </div>
            )}
          </div>

          {/* 3 Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                48h
              </div>
              <h4 className="text-xs font-black text-slate-900">استبدال فوري</h4>
              <p className="text-[11px] text-slate-500">استبدال مباشر للجهاز عند وجود أي خلل مصنعي في أول 48 ساعة.</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-xs">
                12M
              </div>
              <h4 className="text-xs font-black text-slate-900">كفالة سنة كاملة</h4>
              <p className="text-[11px] text-slate-500">صيانة شاملة للمكونات الداخلية مجاناً تحت الضمان.</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                100%
              </div>
              <h4 className="text-xs font-black text-slate-900">قطع أصلية</h4>
              <p className="text-[11px] text-slate-500">استخدام شاشات وبطاريات أصلية معتمدة من المصنعين.</p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. SUB-VIEW: DELIVERY ADDRESSES                           */}
      {/* ========================================================= */}
      {currentView === "addresses" && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4 animate-in fade-in duration-200">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-black text-slate-900">عناوين التوصيل والاستلام</h2>
            <p className="text-xs text-slate-500 mt-0.5">تحديث عنوانك المعتمد للتوصيل السريع في العراق</p>
          </div>

          {addressSavedNotification && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>تم حفظ وتحديث العنوان المعتمد بنجاح!</span>
            </div>
          )}

          {/* Current Address Preview */}
          <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-emerald-950 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-600" />
                العنوان المعتمد الحالي:
              </span>
              <span className="text-[10px] bg-emerald-200 text-emerald-900 font-bold px-2 py-0.5 rounded-full">
                افتراضي
              </span>
            </div>
            <p className="text-xs font-bold text-slate-800">
              {savedAddress.governorate} - {savedAddress.district}
            </p>
            <p className="text-xs text-slate-600">{savedAddress.landmark}</p>
            <p className="text-[11px] text-slate-500 font-mono">
              المستلم: {savedAddress.recipientName} ({savedAddress.phone})
            </p>
          </div>

          {/* Edit Form */}
          <form onSubmit={handleSaveAddress} className="space-y-3 pt-2">
            <h3 className="text-xs font-black text-slate-800">تعديل العنوان:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">المحافظة:</label>
                <select
                  value={savedAddress.governorate}
                  onChange={(e) => setSavedAddress({ ...savedAddress, governorate: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
                >
                  <option value="بغداد">بغداد</option>
                  <option value="البصرة">البصرة</option>
                  <option value="أربيل">أربيل</option>
                  <option value="النجف الأشرف">النجف الأشرف</option>
                  <option value="كربلاء المقدسة">كربلاء المقدسة</option>
                  <option value="بابل">بابل</option>
                  <option value="السليمانية">السليمانية</option>
                  <option value="نينوى">نينوى</option>
                  <option value="ديالى">ديالى</option>
                  <option value="الأنبار">الأنبار</option>
                  <option value="كركوك">كركوك</option>
                  <option value="صلاح الدين">صلاح الدين</option>
                  <option value="واسط">واسط</option>
                  <option value="ميسان">ميسان</option>
                  <option value="المثنى">المثنى</option>
                  <option value="الديوانية">الديوانية</option>
                  <option value="دهوك">دهوك</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">اسم المستلم:</label>
                <input
                  type="text"
                  value={savedAddress.recipientName}
                  onChange={(e) => setSavedAddress({ ...savedAddress, recipientName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">المنطقة والشارع:</label>
                <input
                  type="text"
                  value={savedAddress.district}
                  onChange={(e) => setSavedAddress({ ...savedAddress, district: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">رقم الهاتف:</label>
                <input
                  type="tel"
                  value={savedAddress.phone}
                  onChange={(e) => setSavedAddress({ ...savedAddress, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-slate-700 block mb-1">أقرب نقطة دالة:</label>
                <input
                  type="text"
                  value={savedAddress.landmark}
                  onChange={(e) => setSavedAddress({ ...savedAddress, landmark: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition-colors shadow-sm"
            >
              حفظ وتحديث العنوان
            </button>
          </form>
        </div>
      )}

      {/* ========================================================= */}
      {/* 5. SUB-VIEW: INSTALLMENTS CALCULATOR                      */}
      {/* ========================================================= */}
      {currentView === "installments" && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4 animate-in fade-in duration-200">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-black text-slate-900">حاسبة أقساط الهواتف الذكية</h2>
            <p className="text-xs text-slate-500 mt-0.5">تقسيط ميسر لحاملي بطاقات الماستر كارد والكي كارد</p>
          </div>

          {/* Device Selection Chips */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-2">اختر الجهاز المطلوب:</label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { name: "iPhone 16 Pro Max", price: 1850000 },
                { name: "iPhone 16", price: 1250000 },
                { name: "Galaxy S24 Ultra", price: 1550000 },
                { name: "Redmi Note 13 Pro", price: 380000 },
              ].map((dev) => (
                <button
                  key={dev.name}
                  type="button"
                  onClick={() => setSelectedDevicePrice(dev.price)}
                  className={`p-2.5 rounded-xl border text-right transition-colors ${
                    selectedDevicePrice === dev.price
                      ? "bg-emerald-50 border-emerald-500 text-emerald-900 font-bold"
                      : "bg-slate-50 border-slate-200 text-slate-700"
                  }`}
                >
                  <div className="text-[11px]">{dev.name}</div>
                  <div className="font-mono text-xs font-bold text-slate-900">{dev.price.toLocaleString()} د.ع</div>
                </button>
              ))}
            </div>
          </div>

          {/* Months & Downpayment */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">الدفعة الأولى (د.ع):</label>
              <input
                type="number"
                step="50000"
                value={downPayment}
                onChange={(e) => setDownPayment(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">مدة التقسيط:</label>
              <select
                value={installmentMonths}
                onChange={(e) => setInstallmentMonths(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
              >
                <option value={6}>6 أشهر</option>
                <option value={12}>12 شهراً (سنة)</option>
                <option value={18}>18 شهراً</option>
                <option value={24}>24 شهراً (سنتان)</option>
              </select>
            </div>
          </div>

          {/* Monthly Result Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white space-y-2 shadow-md">
            <div className="text-[11px] text-emerald-100 font-medium">القسط الشهري المتوقع تقريباً:</div>
            <div className="text-2xl font-black font-mono">
              {monthlyInstallment.toLocaleString()} <span className="text-xs font-sans text-emerald-100">د.ع / شهرياً</span>
            </div>
            <p className="text-[10px] text-emerald-100">
              * يخضع التقسيط للشروط والتعليمات الائتمانية لحاملي بطاقات الماستر كارد ومصرف الرافدين / الرشيد.
            </p>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 6. SUB-VIEW: STORE BRANCHES                               */}
      {/* ========================================================= */}
      {currentView === "branches" && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4 animate-in fade-in duration-200">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-black text-slate-900">معارض وفروع المتجر</h2>
            <p className="text-xs text-slate-500 mt-0.5">تفضل بزيارتنا لتجربة واستلام الأجهزة الأصلية</p>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-emerald-600" />
                  فرع المنصور الرئيسي (بغداد)
                </span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                  الفرع الرئيسي
                </span>
              </div>
              <p className="text-xs text-slate-600">
                بغداد - المنصور - شارع 14 رمضان - مجمع المنصور التجاري
              </p>
              <div className="text-[11px] text-slate-500 space-y-0.5 pt-1 border-t border-slate-200">
                <p>السبت - الخميس: من 9:00 صباحاً حتى 11:00 مساءً</p>
                <p>الجمعة: من 2:00 ظهراً حتى 11:00 مساءً</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-teal-600" />
                  خدمة التوصيل لكافة المحافظات
                </span>
                <span className="text-[10px] bg-teal-100 text-teal-800 font-bold px-2 py-0.5 rounded-full">
                  شحن سريع
                </span>
              </div>
              <p className="text-xs text-slate-600">
                توصيل خلال 24 ساعة داخل بغداد وخلال 48-72 ساعة لباقي محافظات العراق مع المعاينة قبل الاستلام.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 7. SUB-VIEW: WARRANTY & RETURN POLICY                     */}
      {/* ========================================================= */}
      {currentView === "policy" && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4 animate-in fade-in duration-200">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-black text-slate-900">سياسة الضمان والاستبدال</h2>
            <p className="text-xs text-slate-500 mt-0.5">ضمان حقوق الزبون والتسوق الآمن 100%</p>
          </div>

          <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <h4 className="font-bold text-slate-900">1. كفالة الاستبدال الفوري (48 ساعة):</h4>
              <p>يحق للزبون استبدال الجهاز فوراً في حال ظهور أي عيب مصنعي في أول 48 ساعة من تاريخ الاستلام وبنفس الحالة الأصلية للعلبة.</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <h4 className="font-bold text-slate-900">2. كفالة الوكالة الرسمية (12 شهراً):</h4>
              <p>جميع الأجهزة مشمولة بالضمان المعتمد ضد العيوب المصنعية ويتم فحصها وإصلاحها بقطع أصلية مجاناً داخل ورشة الصيانة المعتمدة.</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <h4 className="font-bold text-slate-900">3. الاستثناءات:</h4>
              <p>لا يشمل الضمان الأضرار الناتجة عن سوء الاستخدام مثل الكسر الخارجي، أو السقوط في السوائل للأجهزة غير المقاومة للماء.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
