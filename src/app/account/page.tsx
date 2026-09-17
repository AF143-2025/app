"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Heart,
  Wrench,
  Info,
  Bell,
  ShieldCheck,
  ChevronLeft,
  Package,
  X,
  CheckCircle2,
  Phone,
  MapPin,
  Clock,
  ExternalLink,
  FileText,
} from "lucide-react";
import { useCart } from "@/components/cart-context";

export default function AccountPage() {
  const { user, userId, wishlistCount } = useCart();

  const [activeModal, setActiveModal] = useState<"none" | "maintenance" | "about" | "privacy" | "orders">("none");
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Notification toggle state
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [showNotificationToast, setShowNotificationToast] = useState(false);

  // Maintenance form state
  const [maintenanceData, setMaintenanceData] = useState({
    deviceModel: "",
    issueDescription: "",
    phone: "",
  });
  const [maintenanceSubmitted, setMaintenanceSubmitted] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("sama_notifications_enabled");
      if (stored === "true") setNotificationsEnabled(true);
    } catch {}
  }, []);

  const toggleNotifications = () => {
    const nextState = !notificationsEnabled;
    setNotificationsEnabled(nextState);
    try {
      localStorage.setItem("sama_notifications_enabled", String(nextState));
    } catch {}

    if (nextState) {
      if (typeof window !== "undefined" && "Notification" in window) {
        try {
          Notification.requestPermission();
        } catch {}
      }
      setShowNotificationToast(true);
      setTimeout(() => setShowNotificationToast(false), 3000);
    }
  };

  const handleMaintenanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!maintenanceData.deviceModel.trim() || !maintenanceData.phone.trim()) return;
    setMaintenanceSubmitted(true);
    setTimeout(() => {
      setMaintenanceSubmitted(false);
      setActiveModal("none");
      setMaintenanceData({ deviceModel: "", issueDescription: "", phone: "" });
    }, 2000);
  };

  useEffect(() => {
    if (userId) {
      setLoadingOrders(true);
      fetch(`/api/orders?userId=${userId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) setOrders(data.orders || []);
        })
        .catch(() => {})
        .finally(() => setLoadingOrders(false));
    }
  }, [userId]);

  return (
    <div className="min-h-screen bg-[#f8fafc] py-6 px-4 text-right font-sans" dir="rtl">
      <div className="max-w-md mx-auto space-y-4">
        {/* Toast Notification Alert */}
        {showNotificationToast && (
          <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-2xl shadow-xl border border-emerald-500/40 flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-top-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>تم تفعيل الإشعارات وتنبيهات العروض بنجاح!</span>
          </div>
        )}

        {/* ========================================================= */}
        {/* HEADER: APP LOGO + APP NAME ABOVE, THEN "الملف الشخصي" IN A DIFFERENT COLOR */}
        {/* ========================================================= */}
        <div className="app-card p-6 sm:p-7 text-center space-y-4 shadow-sm">
          {/* 1. شعار التطبيق واسمه (فوكاه اسم التطبيق وشعاره) */}
          <div className="flex flex-col items-center justify-center gap-2.5">
            <div className="relative w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-emerald-800 to-teal-950 p-2 shadow-lg shadow-emerald-950/20 overflow-hidden flex items-center justify-center border border-emerald-500/30 group-hover:scale-105 transition-transform">
              <Image
                src="/images/sama-logo-emblem.png"
                alt="شعار سما الخضراء"
                width={72}
                height={72}
                className="w-full h-full object-contain drop-shadow"
                priority
              />
            </div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              سما الخضراء
            </h2>
          </div>

          {/* 2. الملف الشخصي بلون مختلف (بارز ومميز) */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-center">
            <h1 className="text-xl sm:text-2xl font-black text-emerald-600 bg-emerald-50/90 border border-emerald-200/90 px-7 py-2 rounded-2xl shadow-xs tracking-tight">
              الملف الشخصي
            </h1>
          </div>
        </div>

        {/* ========================================================= */}
        {/* MENU LIST (المفضلة، طلب صيانة، من نحن، الحصول على اشعارات، سياسة الخصوصية) */}
        {/* ========================================================= */}
        <div className="app-card divide-y divide-slate-100 overflow-hidden shadow-sm">
          {/* 1. المفضلة */}
          <Link
            href="/wishlist"
            className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Heart className="w-5 h-5" />
              </div>
              <div className="text-right">
                <span className="text-xs font-black text-slate-800 group-hover:text-rose-600 transition-colors block">
                  المفضلة
                </span>
                <span className="text-[11px] text-slate-400">الأجهزة والمنتجات المحفوظة</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400">
              {wishlistCount > 0 && (
                <span className="text-xs text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded-full font-mono">
                  {wishlistCount}
                </span>
              )}
              <ChevronLeft className="w-4 h-4" />
            </div>
          </Link>

          {/* 2. طلب صيانة */}
          <button
            type="button"
            onClick={() => setActiveModal("maintenance")}
            className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Wrench className="w-5 h-5" />
              </div>
              <div className="text-right">
                <span className="text-xs font-black text-slate-800 group-hover:text-indigo-600 transition-colors block">
                  طلب صيانة
                </span>
                <span className="text-[11px] text-slate-400">فحص وتصليح الهواتف والشاشات</span>
              </div>
            </div>
            <ChevronLeft className="w-4 h-4 text-slate-400" />
          </button>

          {/* 3. من نحن */}
          <button
            type="button"
            onClick={() => setActiveModal("about")}
            className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Info className="w-5 h-5" />
              </div>
              <div className="text-right">
                <span className="text-xs font-black text-slate-800 group-hover:text-emerald-700 transition-colors block">
                  من نحن
                </span>
                <span className="text-[11px] text-slate-400">معلومات وفروع متجر سما الخضراء</span>
              </div>
            </div>
            <ChevronLeft className="w-4 h-4 text-slate-400" />
          </button>

          {/* 4. الحصول على اشعارات (مع مفتاح تشغيل فوري) */}
          <div className="w-full p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Bell className="w-5 h-5" />
              </div>
              <div className="text-right">
                <span className="text-xs font-black text-slate-800 block">
                  الحصول على إشعارات
                </span>
                <span className="text-[11px] text-slate-400">
                  {notificationsEnabled ? "مفعلة لاستقبال العروض الجديدة" : "تنبيهات العروض الحصرية والأسعار"}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={toggleNotifications}
              className={`w-12 h-6.5 flex items-center rounded-full p-1 transition-colors duration-200 ease-in-out cursor-pointer ${
                notificationsEnabled ? "bg-emerald-600 justify-start" : "bg-slate-200 justify-end"
              }`}
              aria-label="تفعيل الإشعارات"
            >
              <div className="bg-white w-4.5 h-4.5 rounded-full shadow-md transform transition-transform" />
            </button>
          </div>

          {/* 5. سياسة الخصوصية */}
          <button
            type="button"
            onClick={() => setActiveModal("privacy")}
            className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="text-right">
                <span className="text-xs font-black text-slate-800 group-hover:text-teal-700 transition-colors block">
                  سياسة الخصوصية
                </span>
                <span className="text-[11px] text-slate-400">حماية وسرية بيانات الزبائن</span>
              </div>
            </div>
            <ChevronLeft className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {/* Extra Quick Link for Orders (Compact & Clean) */}
        {orders.length > 0 && (
          <button
            onClick={() => setActiveModal("orders")}
            className="w-full p-3.5 bg-white border border-slate-200/80 rounded-2xl text-xs font-bold text-slate-700 flex items-center justify-between hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-emerald-600" />
              <span>طلباتي السابقة</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400">
              <span className="font-mono text-xs font-bold text-slate-800">{orders.length}</span>
              <ChevronLeft className="w-4 h-4" />
            </div>
          </button>
        )}

        {/* Admin Link (if Manager) */}
        {user?.role === "ADMIN" && (
          <Link
            href="/admin"
            className="w-full p-3.5 bg-slate-900 text-white rounded-2xl text-xs font-bold flex items-center justify-between shadow-sm"
          >
            <span>👑 لوحة تحكم المدير</span>
            <ChevronLeft className="w-4 h-4" />
          </Link>
        )}
      </div>

      {/* ========================================= */}
      {/* 1. MODAL: طلب صيانة                      */}
      {/* ========================================= */}
      {activeModal === "maintenance" && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 w-full max-w-md space-y-4 shadow-xl border border-slate-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Wrench className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-black text-slate-900">طلب صيانة جهاز</h3>
              </div>
              <button
                onClick={() => setActiveModal("none")}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {maintenanceSubmitted ? (
              <div className="py-6 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto animate-bounce" />
                <h4 className="text-xs font-black text-slate-900">تم إرسال طلب الصيانة بنجاح!</h4>
                <p className="text-[11px] text-slate-500">سيتواصل معك الفني المختص في أقرب وقت.</p>
              </div>
            ) : (
              <form onSubmit={handleMaintenanceSubmit} className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">نوع وموديل الجهاز:</label>
                  <input
                    type="text"
                    required
                    value={maintenanceData.deviceModel}
                    onChange={(e) => setMaintenanceData({ ...maintenanceData, deviceModel: e.target.value })}
                    placeholder="مثال: iPhone 15 Pro Max أو Galaxy S23..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">وصف العطل أو المشكلة:</label>
                  <textarea
                    rows={2}
                    value={maintenanceData.issueDescription}
                    onChange={(e) => setMaintenanceData({ ...maintenanceData, issueDescription: e.target.value })}
                    placeholder="مثال: تبديل شاشة أصلية، تبديل بطارية، لا يشحن..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">رقم الهاتف للتواصل:</label>
                  <input
                    type="tel"
                    required
                    value={maintenanceData.phone}
                    onChange={(e) => setMaintenanceData({ ...maintenanceData, phone: e.target.value })}
                    placeholder="0770xxxxxxx"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold bg-slate-50 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black transition-colors shadow-sm"
                  >
                    إرسال الطلب
                  </button>
                  <Link
                    href="/maintenance"
                    onClick={() => setActiveModal("none")}
                    className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1"
                  >
                    <span>صفحة الصيانة</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ========================================= */}
      {/* 2. MODAL: من نحن                          */}
      {/* ========================================= */}
      {activeModal === "about" && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 sm:p-6 w-full max-w-md space-y-4 shadow-xl border border-slate-100 animate-in fade-in zoom-in-95 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-black text-slate-900">من نحن - سما الخضراء</h3>
              </div>
              <button
                onClick={() => setActiveModal("none")}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
              <p className="font-medium text-slate-800">
                <strong>متجر ومعرض سما الخضراء:</strong> وجهتكم الأولى والموثوقة في العراق لشراء أحدث الهواتف الذكية الأصلية، الإكسسوارات المعتمدة، وأجهزة الطاقة مع ضمان وكالة رسمي حقيقي.
              </p>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block">الموقع الرئيسي:</strong>
                    <span>بغداد - المنصور - شارع 14 رمضان (مجمع المنصور التجاري).</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <Phone className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block">هاتف خدمة الزبائن:</strong>
                    <span className="font-mono">07712345678 (اتصال + واتساب مباشر)</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block">أوقات العمل:</strong>
                    <span>السبت - الخميس: من 9:00 صباحاً حتى 11:00 مساءً | الجمعة: من 2:00 ظهراً حتى 11:00 مساءً.</span>
                  </div>
                </div>
              </div>
            </div>

            <a
              href="https://wa.me/9647712345678"
              target="_blank"
              rel="noreferrer"
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition-colors flex items-center justify-center gap-1.5 shadow-sm"
            >
              <span>تواصل مع خدمة العملاء (واتساب)</span>
            </a>
          </div>
        </div>
      )}

      {/* ========================================= */}
      {/* 3. MODAL: سياسة الخصوصية                 */}
      {/* ========================================= */}
      {activeModal === "privacy" && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 sm:p-6 w-full max-w-md space-y-4 shadow-xl border border-slate-100 animate-in fade-in zoom-in-95 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-teal-600" />
                <h3 className="text-sm font-black text-slate-900">سياسة الخصوصية والأمان</h3>
              </div>
              <button
                onClick={() => setActiveModal("none")}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <h4 className="font-bold text-slate-900">1. سرية بيانات الزبائن:</h4>
                <p>نلتزم بحماية خصوصية جميع المستخدمين، ولا تتم مشاركة أرقام الهواتف أو العناوين مع أي جهة خارجية باستثناء مندوب الشحن لتوصيل الطلب.</p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <h4 className="font-bold text-slate-900">2. أمان المعاملات:</h4>
                <p>كافة الفواتير وأرقام الطلبات مشفرة ومحمية بالكامل، ويحق للزبون طلب حذف أو تعديل بياناته المسجلة في أي وقت.</p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <h4 className="font-bold text-slate-900">3. كفالة الشراء الآمن:</h4>
                <p>يحق للمشتري فحص وتدقيق الجهاز عند الاستلام والتأكد من أصالته وسلامة علبته قبل الدفع.</p>
              </div>
            </div>

            <button
              onClick={() => setActiveModal("none")}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black transition-colors"
            >
              فهمت ذلك
            </button>
          </div>
        </div>
      )}

      {/* ========================================= */}
      {/* 4. MODAL: طلباتي السابقة                   */}
      {/* ========================================= */}
      {activeModal === "orders" && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 w-full max-w-md max-h-[85vh] overflow-y-auto space-y-4 shadow-xl border border-slate-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-black text-slate-900">طلباتي السابقة</h3>
              <button
                onClick={() => setActiveModal("none")}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {loadingOrders ? (
              <div className="py-8 text-center text-xs text-slate-400">جاري التحميل...</div>
            ) : orders.length === 0 ? (
              <div className="py-8 text-center space-y-2">
                <div className="text-3xl">📦</div>
                <p className="text-xs font-bold text-slate-700">لا توجد طلبات مسجلة</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50 flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-slate-900">#{ord.orderNumber}</span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                          {ord.orderStatus || ord.status || "قيد المعالجة"}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 font-mono">
                        {ord.totalAmount?.toLocaleString()} د.ع
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Link
                        href={`/orders/${ord.id}`}
                        onClick={() => setActiveModal("none")}
                        className="px-3 py-1 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700"
                      >
                        عرض
                      </Link>
                      <Link
                        href={`/orders/${ord.id}/invoice`}
                        onClick={() => setActiveModal("none")}
                        className="px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold flex items-center gap-1"
                      >
                        <FileText className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
