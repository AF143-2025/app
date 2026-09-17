"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  User,
  Package,
  Heart,
  MapPin,
  ChevronLeft,
  Phone,
  ShieldCheck,
  FileText,
  Search,
  CheckCircle2,
  X,
} from "lucide-react";
import { useCart } from "@/components/cart-context";

export default function AccountPage() {
  const { user, userId, wishlistCount } = useCart();

  const [activeModal, setActiveModal] = useState<"none" | "orders" | "address" | "warranty">("none");
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [orderSearch, setOrderSearch] = useState("");

  // Warranty check
  const [serial, setSerial] = useState("");
  const [warrantyChecked, setWarrantyChecked] = useState(false);

  // Address
  const [address, setAddress] = useState({
    governorate: "بغداد",
    area: "المنصور",
    phone: "07701234567",
  });
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("sama_customer_address");
      if (stored) setAddress(JSON.parse(stored));
    } catch {}
  }, []);

  const saveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem("sama_customer_address", JSON.stringify(address));
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        setActiveModal("none");
      }, 1500);
    } catch {}
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

  const filteredOrders = orders.filter((o) => {
    if (!orderSearch.trim()) return true;
    return o.orderNumber?.toLowerCase().includes(orderSearch.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] py-6 px-4 text-right" dir="rtl">
      <div className="max-w-md mx-auto space-y-4">
        {/* Header Profile Card */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-emerald-600/20 shrink-0">
              <User className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-base font-black text-slate-900">حسابي</h1>
              <p className="text-xs text-slate-400">متجر سما الخضراء</p>
            </div>
          </div>
          <span className="text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold px-3 py-1 rounded-full">
            معتمد
          </span>
        </div>

        {/* Quick Order Status Row */}
        <div className="bg-white rounded-2xl p-3 border border-slate-200/80 shadow-xs grid grid-cols-4 gap-1 text-center">
          <button
            onClick={() => setActiveModal("orders")}
            className="p-2 rounded-xl hover:bg-slate-50 transition-colors flex flex-col items-center gap-1"
          >
            <span className="text-base">⏳</span>
            <span className="text-[11px] font-bold text-slate-700">قيد التأكيد</span>
          </button>
          <button
            onClick={() => setActiveModal("orders")}
            className="p-2 rounded-xl hover:bg-slate-50 transition-colors flex flex-col items-center gap-1"
          >
            <span className="text-base">⚙️</span>
            <span className="text-[11px] font-bold text-slate-700">قيد التجهيز</span>
          </button>
          <button
            onClick={() => setActiveModal("orders")}
            className="p-2 rounded-xl hover:bg-slate-50 transition-colors flex flex-col items-center gap-1"
          >
            <span className="text-base">🚚</span>
            <span className="text-[11px] font-bold text-slate-700">قيد الشحن</span>
          </button>
          <button
            onClick={() => setActiveModal("orders")}
            className="p-2 rounded-xl hover:bg-slate-50 transition-colors flex flex-col items-center gap-1"
          >
            <span className="text-base">✅</span>
            <span className="text-[11px] font-bold text-slate-700">تم التسليم</span>
          </button>
        </div>

        {/* Action Menu List */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs divide-y divide-slate-100 overflow-hidden">
          {/* طلباتي */}
          <button
            onClick={() => setActiveModal("orders")}
            className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Package className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-800">طلباتي</span>
            </div>
            <div className="flex items-center gap-1 text-slate-400">
              <span className="text-xs font-mono">{orders.length}</span>
              <ChevronLeft className="w-4 h-4" />
            </div>
          </button>

          {/* المفضلة */}
          <Link
            href="/wishlist"
            className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <Heart className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-800">قائمة المفضلة</span>
            </div>
            <div className="flex items-center gap-1 text-slate-400">
              {wishlistCount > 0 && (
                <span className="text-xs text-rose-600 font-bold font-mono">{wishlistCount}</span>
              )}
              <ChevronLeft className="w-4 h-4" />
            </div>
          </Link>

          {/* عنوان التوصيل */}
          <button
            onClick={() => setActiveModal("address")}
            className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <MapPin className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-800">عنوان التوصيل</span>
            </div>
            <div className="flex items-center gap-1 text-slate-400">
              <span className="text-xs">{address.governorate}</span>
              <ChevronLeft className="w-4 h-4" />
            </div>
          </button>

          {/* الضمان والكفالة */}
          <button
            onClick={() => setActiveModal("warranty")}
            className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-800">الضمان والكفالة</span>
            </div>
            <div className="flex items-center gap-1 text-slate-400">
              <span className="text-[10px] bg-teal-50 text-teal-700 font-bold px-2 py-0.5 rounded">12 شهر</span>
              <ChevronLeft className="w-4 h-4" />
            </div>
          </button>

          {/* خدمة العملاء واتساب */}
          <a
            href="https://wa.me/9647712345678"
            target="_blank"
            rel="noreferrer"
            className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#25D366]/15 text-[#1b9a4a] flex items-center justify-center text-sm font-bold">
                💬
              </div>
              <span className="text-xs font-bold text-slate-800">خدمة العملاء (واتساب)</span>
            </div>
            <ChevronLeft className="w-4 h-4 text-slate-400" />
          </a>

          {/* الاتصال المباشر */}
          <a
            href="tel:+9647712345678"
            className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Phone className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-800">الاتصال المباشر</span>
            </div>
            <span className="text-xs text-slate-400 font-mono">07712345678</span>
          </a>
        </div>

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
      {/* ORDERS MODAL                             */}
      {/* ========================================= */}
      {activeModal === "orders" && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 w-full max-w-md max-h-[85vh] overflow-y-auto space-y-4 shadow-xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-black text-slate-900">طلباتي السابقة</h3>
              <button
                onClick={() => setActiveModal("none")}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {orders.length > 0 && (
              <div className="relative">
                <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  placeholder="ابحث برقم الطلب..."
                  className="w-full pr-9 pl-3 py-2 rounded-xl border border-slate-200 text-xs font-medium bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            )}

            {loadingOrders ? (
              <div className="py-8 text-center text-xs text-slate-400">جاري التحميل...</div>
            ) : filteredOrders.length === 0 ? (
              <div className="py-8 text-center space-y-2">
                <div className="text-3xl">📦</div>
                <p className="text-xs font-bold text-slate-700">لا توجد طلبات مسجلة</p>
                <Link
                  href="/"
                  onClick={() => setActiveModal("none")}
                  className="inline-block px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold"
                >
                  تصفح المنتجات
                </Link>
              </div>
            ) : (
              <div className="space-y-2.5">
                {filteredOrders.map((ord) => (
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

      {/* ========================================= */}
      {/* ADDRESS MODAL                             */}
      {/* ========================================= */}
      {activeModal === "address" && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 w-full max-w-md space-y-4 shadow-xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-black text-slate-900">عنوان التوصيل</h3>
              <button
                onClick={() => setActiveModal("none")}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {savedSuccess && (
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>تم حفظ العنوان بنجاح!</span>
              </div>
            )}

            <form onSubmit={saveAddress} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">المحافظة:</label>
                <select
                  value={address.governorate}
                  onChange={(e) => setAddress({ ...address, governorate: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold bg-slate-50"
                >
                  <option value="بغداد">بغداد</option>
                  <option value="البصرة">البصرة</option>
                  <option value="أربيل">أربيل</option>
                  <option value="النجف الأشرف">النجف الأشرف</option>
                  <option value="كربلاء المقدسة">كربلاء المقدسة</option>
                  <option value="بابل">بابل</option>
                  <option value="نينوى">نينوى</option>
                  <option value="السليمانية">السليمانية</option>
                  <option value="ديالى">ديالى</option>
                  <option value="الأنبار">الأنبار</option>
                  <option value="كركوك">كركوك</option>
                  <option value="واسط">واسط</option>
                  <option value="صلاح الدين">صلاح الدين</option>
                  <option value="ميسان">ميسان</option>
                  <option value="ذي قار">ذي قار</option>
                  <option value="المثنى">المثنى</option>
                  <option value="الديوانية">الديوانية</option>
                  <option value="دهوك">دهوك</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">المنطقة أو الحي:</label>
                <input
                  type="text"
                  value={address.area}
                  onChange={(e) => setAddress({ ...address, area: e.target.value })}
                  placeholder="مثال: المنصور، شارع 14 رمضان..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold bg-slate-50"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">رقم الهاتف:</label>
                <input
                  type="tel"
                  value={address.phone}
                  onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                  placeholder="0770xxxxxxx"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold bg-slate-50 font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition-colors"
              >
                حفظ
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================= */}
      {/* WARRANTY MODAL                            */}
      {/* ========================================= */}
      {activeModal === "warranty" && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 w-full max-w-md space-y-4 shadow-xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-black text-slate-900">الضمان والكفالة</h3>
              <button
                onClick={() => setActiveModal("none")}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs text-slate-700">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-2.5">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>ضمان وكالة رسمي 12 شهراً على الأجهزة</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-2.5">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>استبدال فوري خلال 48 ساعة لأي خلل مصنعي</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-2.5">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>قطع غيار وبطاريات أصلية 100%</span>
              </div>
            </div>

            {/* Quick Serial Checker */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <label className="text-xs font-bold text-slate-700 block">فحص سريال الضمان (IMEI):</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={serial}
                  onChange={(e) => setSerial(e.target.value)}
                  placeholder="أدخل رقم السيريال..."
                  className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono bg-slate-50"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (serial.trim()) setWarrantyChecked(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold"
                >
                  فحص
                </button>
              </div>

              {warrantyChecked && (
                <div className="p-2.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold flex items-center justify-between">
                  <span>الضمان نشط ومعتمد لدى سما الخضراء</span>
                  <span className="text-[10px] bg-teal-100 px-2 py-0.5 rounded font-mono">12 شهراً</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
