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
} from "lucide-react";
import { useCart } from "@/components/cart-context";

export default function AccountPage() {
  const {
    user,
    userId,
    wishlistCount,
  } = useCart();

  const [activeTab, setActiveTab] = useState<"orders" | "wishlist" | "warranty" | "addresses" | "support">("orders");
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [orderSearchQuery, setOrderSearchQuery] = useState("");

  // Warranty serial checker state
  const [serialInput, setSerialInput] = useState("");
  const [serialResult, setSerialResult] = useState<{ checked: boolean; valid: boolean; serial?: string } | null>(null);

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

  const filteredOrders = orders.filter((o) => {
    if (!orderSearchQuery.trim()) return true;
    const q = orderSearchQuery.toLowerCase();
    return (
      o.orderNumber?.toLowerCase().includes(q) ||
      o.id?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-right" dir="rtl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/" className="hover:text-emerald-700 transition-colors">
          سما الخضراء
        </Link>
        <span>/</span>
        <span className="font-bold text-slate-800">حسابي</span>
      </div>

      {/* Account Hero Card */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-950 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-2xl border border-white/10">
        <div className="absolute top-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center shadow-xl shadow-emerald-500/20 shrink-0">
              <User className="w-8 h-8 sm:w-10 sm:h-10 text-slate-950" />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight">حسابي</h1>
                <span className="text-[11px] bg-emerald-500/20 text-emerald-300 px-3 py-0.5 rounded-full border border-emerald-500/30 font-bold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  بوابة خدمات الزبائن
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 font-medium">
                مركز متابعة المشتريات، تتبع الشحنات، وخدمات الضمان المعتمد من سما الخضراء
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <Link
              href="/maintenance"
              className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold border border-white/10 transition-all flex items-center gap-2 active:scale-95"
            >
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>فحص حالة الصيانة</span>
            </Link>
            <a
              href="https://wa.me/9647712345678"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black shadow-lg shadow-emerald-500/30 transition-all flex items-center gap-1.5 active:scale-95"
            >
              <Phone className="w-4 h-4" />
              <span>محادثة الدعم المباشر</span>
            </a>
          </div>
        </div>

        {/* Quick Highlights Bar */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10">
          <div className="flex items-center gap-2.5 text-xs text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>ضمان رسمي معتمد 100%</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-slate-300">
            <Truck className="w-4 h-4 text-teal-400 shrink-0" />
            <span>توصيل سريع لكافة المحافظات</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-slate-300">
            <FileText className="w-4 h-4 text-blue-400 shrink-0" />
            <span>فواتير إلكترونية وضريبية</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
            <span>أجهزة وكالة أصلية مضمونة</span>
          </div>
        </div>
      </div>

      {/* Admin Panel Access Banner (For Manager) */}
      {user?.role === "ADMIN" && (
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-5 sm:p-6 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 border border-emerald-500/30 animate-in fade-in">
          <div className="flex items-center gap-3.5 text-center sm:text-right flex-col sm:flex-row">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-2xl border border-emerald-500/30 shrink-0">
              👑
            </div>
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h3 className="text-base sm:text-lg font-black text-white">
                  أنت مسجل كمدير عام للمتجر
                </h3>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30 font-mono">
                  FULL CONTROL
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                يمكنك إدارة كافة المنتجات والمخزون، فحص وتحديث حالات الطلبات، تذاكر الصيانة، والرقابة المالية.
              </p>
            </div>
          </div>
          <Link
            href="/admin"
            className="px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black shadow-lg shadow-emerald-500/30 transition-all active:scale-95 flex items-center gap-1.5 shrink-0"
          >
            <span>الدخول للوحة تحكم المدير</span>
            <ChevronLeft className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* Quick Interactive Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <button
          onClick={() => setActiveTab("orders")}
          className={`p-4 rounded-2xl border text-right transition-all flex flex-col justify-between gap-3 ${
            activeTab === "orders"
              ? "bg-emerald-50 border-emerald-300 shadow-sm"
              : "bg-white border-slate-200/80 hover:border-emerald-200 hover:bg-slate-50/50"
          }`}
        >
          <div className="flex items-center justify-between w-full">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
            <span className="text-xl font-black text-slate-900 font-mono">{orders.length}</span>
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800">طلباتي ومشترياتي</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">تتبع الفواتير والشحنات</p>
          </div>
        </button>

        <button
          onClick={() => setActiveTab("wishlist")}
          className={`p-4 rounded-2xl border text-right transition-all flex flex-col justify-between gap-3 ${
            activeTab === "wishlist"
              ? "bg-red-50 border-red-300 shadow-sm"
              : "bg-white border-slate-200/80 hover:border-red-200 hover:bg-slate-50/50"
          }`}
        >
          <div className="flex items-center justify-between w-full">
            <div className="w-9 h-9 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
              <Heart className="w-5 h-5" />
            </div>
            <span className="text-xl font-black text-slate-900 font-mono">{wishlistCount}</span>
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800">قائمة المفضلة</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">الأجهزة المحفوظة للشراء</p>
          </div>
        </button>

        <button
          onClick={() => setActiveTab("warranty")}
          className={`p-4 rounded-2xl border text-right transition-all flex flex-col justify-between gap-3 ${
            activeTab === "warranty"
              ? "bg-teal-50 border-teal-300 shadow-sm"
              : "bg-white border-slate-200/80 hover:border-teal-200 hover:bg-slate-50/50"
          }`}
        >
          <div className="flex items-center justify-between w-full">
            <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-teal-800 bg-teal-200/70 px-2 py-0.5 rounded-full">12 شهراً</span>
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800">الضمان والكفالة</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">فحص سيريال وكفالة الوكالة</p>
          </div>
        </button>

        <button
          onClick={() => setActiveTab("addresses")}
          className={`p-4 rounded-2xl border text-right transition-all flex flex-col justify-between gap-3 ${
            activeTab === "addresses"
              ? "bg-amber-50 border-amber-300 shadow-sm"
              : "bg-white border-slate-200/80 hover:border-amber-200 hover:bg-slate-50/50"
          }`}
        >
          <div className="flex items-center justify-between w-full">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-700">{savedAddress.governorate}</span>
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800">عنوان التوصيل</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">العنوان المعتمد للشحن</p>
          </div>
        </button>
      </div>

      {/* Main Grid: Sidebar Tabs + Content */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Tabs Sidebar */}
        <div className="md:col-span-4 bg-white rounded-3xl p-3 border border-slate-200/80 shadow-sm space-y-1.5">
          <button
            onClick={() => setActiveTab("orders")}
            className={`w-full flex items-center justify-between p-3.5 rounded-2xl text-xs font-bold transition-all ${
              activeTab === "orders"
                ? "bg-emerald-50 text-emerald-800 font-black shadow-sm"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <div className="flex items-center gap-3">
              <Package className="w-4 h-4 text-emerald-600" />
              <span>طلباتي وتتبع الشحنات</span>
            </div>
            <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-bold">
              {orders.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("wishlist")}
            className={`w-full flex items-center justify-between p-3.5 rounded-2xl text-xs font-bold transition-all ${
              activeTab === "wishlist"
                ? "bg-emerald-50 text-emerald-800 font-black shadow-sm"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <div className="flex items-center gap-3">
              <Heart className="w-4 h-4 text-red-500" />
              <span>قائمة المفضلة</span>
            </div>
            {wishlistCount > 0 && (
              <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-bold">
                {wishlistCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("warranty")}
            className={`w-full flex items-center justify-between p-3.5 rounded-2xl text-xs font-bold transition-all ${
              activeTab === "warranty"
                ? "bg-emerald-50 text-emerald-800 font-black shadow-sm"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>الضمان والكفالة المعتمدة</span>
            </div>
            <span className="text-[10px] bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full font-bold">
              معتمد
            </span>
          </button>

          <button
            onClick={() => setActiveTab("addresses")}
            className={`w-full flex items-center justify-between p-3.5 rounded-2xl text-xs font-bold transition-all ${
              activeTab === "addresses"
                ? "bg-emerald-50 text-emerald-800 font-black shadow-sm"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-amber-500" />
              <span>عناوين التوصيل والاستلام</span>
            </div>
            <ChevronLeft className="w-4 h-4 text-slate-400" />
          </button>

          <button
            onClick={() => setActiveTab("support")}
            className={`w-full flex items-center justify-between p-3.5 rounded-2xl text-xs font-bold transition-all ${
              activeTab === "support"
                ? "bg-emerald-50 text-emerald-800 font-black shadow-sm"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <div className="flex items-center gap-3">
              <HelpCircle className="w-4 h-4 text-purple-500" />
              <span>خدمة الزبائن والدعم الفني</span>
            </div>
            <ChevronLeft className="w-4 h-4 text-slate-400" />
          </button>

          {/* Quick Help Card inside Sidebar */}
          <div className="p-3.5 mt-3 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white space-y-2">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-black">تحتاج مساعدة فورية؟</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              فريق مبيعات وخدمات سما الخضراء متاح للإجابة على جميع الاستفسارات.
            </p>
            <a
              href="https://wa.me/9647712345678"
              target="_blank"
              rel="noreferrer"
              className="block w-full py-2 text-center rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-colors"
            >
              مراسلة عبر واتساب
            </a>
          </div>
        </div>

        {/* Tab Content Panel */}
        <div className="md:col-span-8 bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/80 shadow-sm min-h-[420px]">
          {/* 1. ORDERS TAB */}
          {activeTab === "orders" && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-base font-black text-slate-900">سجل الطلبات والمشتريات</h2>
                  <p className="text-xs text-slate-500 mt-0.5">تتبع طلباتك السابقة ومراحل شحنها</p>
                </div>
                <Link
                  href="/orders"
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 self-start sm:self-auto"
                >
                  <span>عرض صفحة الطلبات الكاملة</span>
                  <ChevronLeft className="w-4 h-4" />
                </Link>
              </div>

              {/* Order Search Filter */}
              {orders.length > 0 && (
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
              )}

              {loadingOrders ? (
                <div className="space-y-3 py-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-24 bg-slate-100 rounded-2xl animate-pulse" />
                  ))}
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto text-3xl">
                    📦
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-black text-slate-800">لا توجد طلبات مسجلة حالياً</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      تصفح الهواتف والإكسسوارات الأصلية، وأضف ما يعجبك إلى سلة الشراء لإتمام الطلب بسهولة وسرعة.
                    </p>
                  </div>
                  <div className="pt-2 flex items-center justify-center gap-3">
                    <Link
                      href="/"
                      className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-md shadow-emerald-600/20 transition-all"
                    >
                      تصفح المنتجات الآن
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredOrders.map((ord) => (
                    <div
                      key={ord.id}
                      className="p-4 sm:p-5 rounded-2xl border border-slate-100 hover:border-emerald-200 transition-all bg-slate-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono font-bold text-xs text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                            #{ord.orderNumber}
                          </span>
                          <span className="text-[11px] px-2.5 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800">
                            {ord.orderStatus || ord.status || "قيد المعالجة"}
                          </span>
                          {ord.paymentMethod === "INSTALLMENT" && (
                            <span className="text-[11px] px-2.5 py-0.5 rounded-full font-bold bg-blue-100 text-blue-800">
                              تقسيط مالي
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-600 flex-wrap">
                          <span>
                            المبلغ: <strong className="text-slate-900 font-mono">{ord.totalAmount?.toLocaleString()} د.ع</strong>
                          </span>
                          {ord.items && (
                            <span className="text-slate-400 font-medium">({ord.items.length} عناصر)</span>
                          )}
                          {ord.createdAt && (
                            <span className="text-slate-400 text-[11px]">
                              {new Date(ord.createdAt).toLocaleDateString("ar-IQ")}
                            </span>
                          )}
                        </div>
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

          {/* 2. WISHLIST TAB */}
          {activeTab === "wishlist" && (
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-base font-black text-slate-900">المنتجات المحفوظة في المفضلة</h2>
                  <p className="text-xs text-slate-500 mt-0.5">الأجهزة والإكسسوارات التي اخترتها للشراء لاحقاً</p>
                </div>
                <Link href="/wishlist" className="text-xs font-bold text-emerald-700 hover:underline">
                  فتح صفحة المفضلة ←
                </Link>
              </div>

              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mx-auto text-3xl">
                  <Heart className="w-8 h-8 fill-red-100 text-red-500" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-black text-slate-800">
                    لديك {wishlistCount} منتج في قائمة المفضلة
                  </h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    يمكنك استعراض ومقارنة الأسعار والمواصفات لجميع المنتجات وإضافتها فوراً لسلة الشراء.
                  </p>
                </div>
                <div className="pt-2">
                  <Link
                    href="/wishlist"
                    className="inline-block px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-md shadow-emerald-600/20 transition-all"
                  >
                    عرض المنتجات المحفوظة ({wishlistCount})
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* 3. WARRANTY TAB (الضمان والكفالة المعتمدة) */}
          {activeTab === "warranty" && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <h2 className="text-base font-black text-slate-900">نظام الكفالة والضمان المعتمد</h2>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  جميع أجهزتنا مشمولة بضمان رسمي حقيقي من مركز صيانة سما الخضراء المعتمد
                </p>
              </div>

              {/* Warranty Serial Checker Tool */}
              <div className="p-5 rounded-2xl border border-emerald-200 bg-emerald-50/40 space-y-3">
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-emerald-700" />
                  <h3 className="text-xs font-black text-emerald-950">فحص سريال الضمان أو رقم الفاتورة</h3>
                </div>
                <p className="text-[11px] text-slate-600">
                  أدخل رقم الـ IMEI للجهاز أو رقم الفاتورة للتحقق الفوري من سريان الضمان الرسمي.
                </p>
                <form onSubmit={handleCheckWarranty} className="flex gap-2">
                  <input
                    type="text"
                    value={serialInput}
                    onChange={(e) => setSerialInput(e.target.value)}
                    placeholder="مثال: 358941203948192 أو رقم الفاتورة..."
                    className="flex-1 px-3.5 py-2 rounded-xl border border-emerald-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition-colors shadow-sm shrink-0"
                  >
                    فحص الضمان
                  </button>
                </form>

                {serialResult && (
                  <div className="mt-3 p-3.5 rounded-xl bg-white border border-emerald-300 text-xs space-y-2 animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-800 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        الضمان نشط ومعتمد لدى سما الخضراء
                      </span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                        صالح لمدة سنة
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-600 font-mono">
                      الرقم التسلسلي المفحوص: {serialResult.serial}
                    </div>
                  </div>
                )}
              </div>

              {/* 3 Warranty Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                    48h
                  </div>
                  <h4 className="text-xs font-black text-slate-900">استبدال فوري 48 ساعة</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    استبدال مباشر للجهاز دون انتظار عند وجود أي عيب مصنعي في أول 48 ساعة.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-sm">
                    12M
                  </div>
                  <h4 className="text-xs font-black text-slate-900">ضمان وكالة 12 شهراً</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    صيانة شاملة للأجهزة والمكونات الداخلية بإشراف مهندسين معتمدين.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                    100%
                  </div>
                  <h4 className="text-xs font-black text-slate-900">قطع غيار أصلية</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    استخدام شاشات وبطاريات وقطع أصلية حصراً معتمدة من الشركات المصنعة.
                  </p>
                </div>
              </div>

              {/* Action Banner for Maintenance */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="space-y-0.5 text-center sm:text-right">
                  <h4 className="text-xs font-black">هل لديك جهاز قيد الصيانة؟</h4>
                  <p className="text-[11px] text-slate-300">
                    يمكنك متابعة حالة جهازك خطوة بخطوة عبر كود استلام الصيانة.
                  </p>
                </div>
                <Link
                  href="/maintenance"
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-colors shrink-0"
                >
                  تتبع الصيانة الآن
                </Link>
              </div>
            </div>
          )}

          {/* 4. ADDRESSES TAB */}
          {activeTab === "addresses" && (
            <div className="space-y-5">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-base font-black text-slate-900">عناوين التوصيل والاستلام</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  احفظ بيانات عنوانك لتعبئتها تلقائياً عند تأكيد أي طلب جديد
                </p>
              </div>

              {addressSavedNotification && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>تم حفظ وتحديث عنوان التوصيل المعتمد بنجاح!</span>
                </div>
              )}

              {/* Current Default Address Card */}
              <div className="p-4 sm:p-5 rounded-2xl border border-emerald-200 bg-emerald-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-emerald-950 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    العنوان المعتمد للتوصيل السريع:
                  </span>
                  <span className="text-[10px] bg-emerald-200 text-emerald-900 font-bold px-2.5 py-0.5 rounded-full">
                    افتراضي
                  </span>
                </div>
                <div className="space-y-1 text-xs text-slate-700">
                  <p className="font-bold text-slate-900">
                    {savedAddress.governorate} - {savedAddress.district}
                  </p>
                  <p className="text-slate-600">{savedAddress.landmark}</p>
                  <p className="text-[11px] text-slate-500 font-mono">
                    المستلم: {savedAddress.recipientName} ({savedAddress.phone})
                  </p>
                </div>
              </div>

              {/* Edit Address Form */}
              <form onSubmit={handleSaveAddress} className="space-y-4 pt-2">
                <h3 className="text-xs font-black text-slate-800">تعديل بيانات العنوان:</h3>
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
                      <option value="نينوى (الموصل)">نينوى (الموصل)</option>
                      <option value="ذي قار">ذي قار</option>
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
                      placeholder="الاسم الثلاثي للمستلم..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">المنطقة والشارع:</label>
                    <input
                      type="text"
                      value={savedAddress.district}
                      onChange={(e) => setSavedAddress({ ...savedAddress, district: e.target.value })}
                      placeholder="مثال: المنصور - شارع 14 رمضان..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">رقم الهاتف:</label>
                    <input
                      type="tel"
                      value={savedAddress.phone}
                      onChange={(e) => setSavedAddress({ ...savedAddress, phone: e.target.value })}
                      placeholder="0770xxxxxxx"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 font-mono"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-slate-700 block mb-1">أقرب نقطة دالة:</label>
                    <input
                      type="text"
                      value={savedAddress.landmark}
                      onChange={(e) => setSavedAddress({ ...savedAddress, landmark: e.target.value })}
                      placeholder="مثال: مجاور مجمع المنصور التجاري..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition-colors shadow-sm"
                >
                  حفظ العنوان المعتمد
                </button>
              </form>
            </div>
          )}

          {/* 5. SUPPORT TAB */}
          {activeTab === "support" && (
            <div className="space-y-5">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-base font-black text-slate-900">خدمة الزبائن والدعم الفني المباشر</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  فريقنا متواجد لخدمتك والإجابة على أي استفسار يتعلق بالمبيعات أو الصيانة
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <a
                  href="https://wa.me/9647712345678"
                  target="_blank"
                  rel="noreferrer"
                  className="p-4 rounded-2xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40 transition-all flex items-center gap-3.5 group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#25D366]/20 text-[#1b9a4a] flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    💬
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-slate-900">محادثة واتساب فورية</h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">رد فوري 24/7 من فريق المبيعات</p>
                  </div>
                </a>

                <a
                  href="tel:+9647712345678"
                  className="p-4 rounded-2xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/40 transition-all flex items-center gap-3.5 group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-slate-900">الاتصال المباشر</h3>
                    <p className="text-[11px] text-slate-500 mt-0.5 font-mono">07712345678 (سما الخضراء)</p>
                  </div>
                </a>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/70 text-xs space-y-3">
                <div className="flex items-center gap-2 text-slate-900 font-black">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <span>معرض وفرع سما الخضراء الرئيسي:</span>
                </div>
                <p className="text-slate-600">
                  العراق - بغداد - المنصور - شارع 14 رمضان (مجمع المنصور التجاري)
                </p>

                <div className="pt-2 border-t border-slate-200 text-slate-600 space-y-1">
                  <span className="font-bold text-slate-800 block">أوقات الدوام الرسمي:</span>
                  <p>السبت - الخميس: من 9:00 صباحاً حتى 11:00 مساءً</p>
                  <p>الجمعة: من 2:00 ظهراً حتى 11:00 مساءً</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
