"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  User,
  Package,
  Heart,
  MapPin,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ShoppingBag,
  Clock,
  CheckCircle2,
  FileText,
  Phone,
  Mail,
  Shield,
  Sparkles,
  Layers,
} from "lucide-react";
import { useCart } from "@/components/cart-context";

export default function AccountPage() {
  const {
    user,
    isAuthenticated,
    logout,
    userId,
    wishlistCount,
  } = useCart();

  const [activeTab, setActiveTab] = useState<"orders" | "wishlist" | "profile" | "addresses" | "support">("orders");
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

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
      <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-emerald-950 rounded-3xl p-5 sm:p-6 text-white shadow-xl flex items-center gap-4 border border-white/10">
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-500/30 shrink-0">
          <User className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-xl sm:text-2xl font-black">الملف الشخصي</h1>
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

      {/* Main Grid: Sidebar Tabs + Content */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Tabs Sidebar */}
        <div className="md:col-span-4 bg-white rounded-3xl p-3 border border-slate-200/80 shadow-sm space-y-1">
          <button
            onClick={() => setActiveTab("orders")}
            className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition-all ${
              activeTab === "orders"
                ? "bg-emerald-50 text-emerald-800 font-black shadow-sm"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Package className="w-4 h-4 text-emerald-600" />
              <span>طلباتي السابقة</span>
            </div>
            <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold">
              {orders.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("wishlist")}
            className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition-all ${
              activeTab === "wishlist"
                ? "bg-emerald-50 text-emerald-800 font-black shadow-sm"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <div className="flex items-center gap-2.5">
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
            onClick={() => setActiveTab("profile")}
            className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition-all ${
              activeTab === "profile"
                ? "bg-emerald-50 text-emerald-800 font-black shadow-sm"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <User className="w-4 h-4 text-blue-500" />
              <span>بيانات الملف الشخصي</span>
            </div>
            <ChevronLeft className="w-4 h-4 text-slate-400" />
          </button>

          <button
            onClick={() => setActiveTab("addresses")}
            className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition-all ${
              activeTab === "addresses"
                ? "bg-emerald-50 text-emerald-800 font-black shadow-sm"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-amber-500" />
              <span>عناوين التوصيل</span>
            </div>
            <ChevronLeft className="w-4 h-4 text-slate-400" />
          </button>

          <button
            onClick={() => setActiveTab("support")}
            className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition-all ${
              activeTab === "support"
                ? "bg-emerald-50 text-emerald-800 font-black shadow-sm"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <HelpCircle className="w-4 h-4 text-purple-500" />
              <span>الدعم الفني والشكاوى</span>
            </div>
            <ChevronLeft className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {/* Tab Content Panel */}
        <div className="md:col-span-8 bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/80 shadow-sm min-h-[360px]">
          {/* ORDERS TAB */}
          {activeTab === "orders" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h2 className="text-base font-black text-slate-900">سجل الطلبات والمشتريات</h2>
                <Link href="/orders" className="text-xs font-bold text-emerald-700 hover:underline">
                  عرض الصفحة التفصيلية ←
                </Link>
              </div>

              {loadingOrders ? (
                <div className="space-y-3 py-6">
                  {[1, 2].map((i) => (
                    <div key={i} className="h-20 bg-slate-100 rounded-2xl animate-pulse" />
                  ))}
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto text-2xl">
                    📦
                  </div>
                  <h3 className="text-sm font-bold text-slate-700">لا توجد طلبات مسجلة حتى الآن</h3>
                  <p className="text-xs text-slate-400">تصفح الهواتف والإكسسوارات وأضف ما يعجبك للسلة.</p>
                  <Link
                    href="/"
                    className="inline-block px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-black shadow-md shadow-emerald-600/20"
                  >
                    تصفح الأجهزة
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((ord) => (
                    <div
                      key={ord.id}
                      className="p-4 rounded-2xl border border-slate-100 hover:border-emerald-200 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-50/50"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs text-slate-900">#{ord.orderNumber}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800">
                            {ord.status}
                          </span>
                          {ord.paymentMethod === "INSTALLMENT" && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-blue-100 text-blue-800">
                              تقسيط ميسر
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500">
                          الإجمالي: <span className="font-black text-slate-900">{ord.totalAmount?.toLocaleString()} د.ع</span>
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

          {/* WISHLIST TAB */}
          {activeTab === "wishlist" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h2 className="text-base font-black text-slate-900">المنتجات المحفوظة في المفضلة</h2>
                <Link href="/wishlist" className="text-xs font-bold text-emerald-700 hover:underline">
                  فتح صفحة المفضلة الكاملة ←
                </Link>
              </div>
              <div className="text-center py-10 space-y-3">
                <Heart className="w-12 h-12 text-red-400 mx-auto fill-red-50" />
                <p className="text-xs text-slate-600">
                  يمكنك استعراض وإدارة جميع الأجهزة والإكسسوارات المحفوظة للشراء لاحقاً.
                </p>
                <Link
                  href="/wishlist"
                  className="inline-block px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-black shadow-md shadow-emerald-600/20"
                >
                  الانتقال لصفحة المفضلة ({wishlistCount})
                </Link>
              </div>
            </div>
          )}

          {/* PROFILE TAB */}
          {activeTab === "profile" && (
            <div className="space-y-4">
              <h2 className="text-base font-black text-slate-900 border-b border-slate-100 pb-3">
                معلومات الحساب الشخصي
              </h2>
              <div className="space-y-3 max-w-md">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">الاسم الكامل:</label>
                  <input
                    type="text"
                    defaultValue={user?.name || "حيدر الكرخي"}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">البريد الإلكتروني:</label>
                  <input
                    type="email"
                    defaultValue={user?.email || "buyer@store.com"}
                    disabled
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-400 bg-slate-100 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">رقم الهاتف العراقي:</label>
                  <input
                    type="tel"
                    defaultValue={user?.phone || "+9647701234567"}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
                  />
                </div>
                <button
                  type="button"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-black hover:bg-emerald-700 transition-colors shadow-sm"
                >
                  حفظ التعديلات
                </button>
              </div>
            </div>
          )}

          {/* ADDRESSES TAB */}
          {activeTab === "addresses" && (
            <div className="space-y-4">
              <h2 className="text-base font-black text-slate-900 border-b border-slate-100 pb-3">
                عناوين الاستلام والشحن
              </h2>
              <div className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-emerald-900">العنوان الرئيسي المعتمد:</span>
                  <span className="text-[10px] bg-emerald-200 text-emerald-900 font-bold px-2 py-0.5 rounded-full">افتراضي</span>
                </div>
                <p className="text-xs text-slate-700">بغداد، المنصور، شارع 14 رمضان، مجمع المنصور التجاري</p>
                <p className="text-[11px] text-slate-500 font-mono">رقم التواصل: 07701234567</p>
              </div>
            </div>
          )}

          {/* SUPPORT TAB */}
          {activeTab === "support" && (
            <div className="space-y-4">
              <h2 className="text-base font-black text-slate-900 border-b border-slate-100 pb-3">
                خدمة الزبائن والدعم الفني
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href="https://wa.me/9647712345678"
                  target="_blank"
                  rel="noreferrer"
                  className="p-4 rounded-2xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/30 transition-all flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#25D366]/20 text-[#1b9a4a] flex items-center justify-center text-xl">
                    💬
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">محادثة واتساب فورية</h3>
                    <p className="text-[10px] text-slate-500">متاح 24/7 للرد على الاستفسارات</p>
                  </div>
                </a>

                <a
                  href="tel:+9647712345678"
                  className="p-4 rounded-2xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/30 transition-all flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">الاتصال المباشر</h3>
                    <p className="text-[10px] text-slate-500">07712345678 (سما الخضراء)</p>
                  </div>
                </a>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-600 space-y-1">
                <span className="font-black text-slate-800 block">أوقات العمل الرسمية:</span>
                <p>السبت - الخميس: من 9:00 صباحاً حتى 11:00 مساءً</p>
                <p>الجمعة: من 2:00 ظهراً حتى 11:00 مساءً</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
