"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Wrench,
  Send,
  CheckCircle2,
  Clock,
  Smartphone,
  Laptop,
  Watch,
  Tablet,
  Search,
  MessageSquare,
  ShieldCheck,
  User,
  Phone,
  Mail,
  FileText,
  Sparkles,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  MessageCircle,
  Cpu,
  BatteryCharging,
  Layers,
  Settings,
  Zap,
} from "lucide-react";
import { STORE_CONFIG, getWhatsAppUrl, getPhoneCallUrl } from "@/lib/store-config";

export default function MaintenanceRequestPage() {
  const [activeTab, setActiveTab] = useState<"showcase" | "new" | "track">("showcase");

  const whatsappMaintenanceUrl = getWhatsAppUrl(
    "مرحباً ورشة صيانة سما الخضراء، أود الاستفسار وحجز فحص وصيانة لجهازي (نوع الجهاز والعطل): "
  );
  const phoneCallUrl = getPhoneCallUrl();

  // Form Fields
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [deviceType, setDeviceType] = useState("هاتف ذكي");
  const [brandModel, setBrandModel] = useState("");
  const [issueDescription, setIssueDescription] = useState("");
  const [accessories, setAccessories] = useState("الجهاز فقط");

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<any | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Tracking State
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [trackedTickets, setTrackedTickets] = useState<any[]>([]);
  const [searchPerformed, setSearchPerformed] = useState(false);

  const deviceTypes = [
    { label: "هاتف ذكي", icon: Smartphone },
    { label: "جهاز لوحي (تابلت)", icon: Tablet },
    { label: "ساعة ذكية", icon: Watch },
    { label: "لابتوب / كمبيوتر", icon: Laptop },
    { label: "إكسسوار آخر", icon: Wrench },
  ];

  const maintenanceServices = [
    {
      icon: Smartphone,
      title: "تبديل الشاشات الأصلية",
      desc: "شاشات وكالة OLED و Super Retina بدقة ألوان كاملة مع نقل مستشعر True Tone وحساسات البصمة والوجه.",
      badge: "قطع أصلية",
    },
    {
      icon: BatteryCharging,
      title: "استبدال البطاريات المعتمدة",
      desc: "بطاريات أصلية جديدة مع استعادة نسبة الصحة 100% وإزالة رسائل التنبيه المزعجة مع كفالة 6 أشهر.",
      badge: "كفالة 6 أشهر",
    },
    {
      icon: Cpu,
      title: "صيانة المذربورد والـ IC الدقيقة",
      desc: "إصلاح أعطال الشحن والباور، آي سي الصوت والشبكة، ومشاكل الإقلاع والريستارت تحت المجهر الإلكتروني.",
      badge: "فنيون معتمدون",
    },
    {
      icon: Zap,
      title: "معالجة أضرار المياه والرطوبة",
      desc: "غسيل بالموجات فوق الصوتية وتجفيف البورد ومعالجة دوائر الشورت والتآكل بأعلى نسب نجاح ممكنة.",
      badge: "إنقاذ فوري",
    },
    {
      icon: Settings,
      title: "السوفتوير ونقل البيانات",
      desc: "فك تعليق التفاحة، استرجاع البيانات، نقل محادثات الواتساب كاملة، وإنشاء حسابات Apple ID و Gmail بأمان.",
      badge: "حماية الخصوصية",
    },
    {
      icon: Wrench,
      title: "صيانة المنافذ والسماعات",
      desc: "استبدال مداخل الشحن Type-C و Lightning، سماعات الأذن والميكروفونات، وتنظيف شبكات الغبار باحترافية.",
      badge: "صيانة سريعة",
    },
  ];

  const handledIssues = [
    "شاشة مكسورة أو توقف اللمس (Touch)",
    "البطارية تنفد بسرعة أو الجهاز ينطفئ فجأة",
    "الجهاز لا يقبل الشحن أو الشحن بطيء جداً",
    "انقطاع الصوت في المكالمات أو تشويش المايك",
    "سقوط الجهاز في الماء أو تعرضه للسوائل",
    "تعليق الجهاز على شعار آبل أو الأندرويد",
    "فقدان الشبكة أو ظهور «لا توجد خدمة»",
    "نسيان رمز الدخول أو مشاكل الحسابات الرسمية",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!customerName.trim() || !customerPhone.trim() || !issueDescription.trim()) {
      setErrorMessage("يرجى إدخال اسمك ورقم هاتفك وتفاصيل المشكلة");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch("/api/maintenance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: customerName.trim(),
          customerPhone: customerPhone.trim(),
          customerEmail: customerEmail.trim() || null,
          deviceType,
          brandModel: brandModel.trim() || "غير محدد",
          issueDescription: issueDescription.trim(),
          accessories,
        }),
      });

      const data = await res.json();
      if (data.success && data.ticket) {
        setSubmittedTicket(data.ticket);
        setBrandModel("");
        setIssueDescription("");
      } else {
        setErrorMessage(data.error || "فشل إرسال الطلب، يرجى المحاولة لاحقاً");
      }
    } catch (err: any) {
      setErrorMessage("حدث خطأ أثناء الإرسال: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTrackSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      setIsSearching(true);
      setSearchPerformed(true);
      const res = await fetch(
        `/api/maintenance?query=${encodeURIComponent(searchQuery.trim())}`
      );
      const data = await res.json();
      if (data.success) {
        setTrackedTickets(data.tickets || []);
      } else {
        setTrackedTickets([]);
      }
    } catch (err) {
      console.error("Failed to track maintenance ticket:", err);
      setTrackedTickets([]);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen pb-16 space-y-8 sm:space-y-12 text-right w-full max-w-full overflow-hidden" dir="rtl">
      {/* 1. HERO HEADER */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 text-white py-12 sm:py-16 px-3 sm:px-6 lg:px-8 border-b border-amber-900/30">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
        <div className="absolute -left-20 -top-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center space-y-4 sm:space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs sm:text-sm font-black">
            <Wrench className="w-4 h-4 text-amber-400" />
            <span>ورشة الصيانة الفورية المعتمدة في بغداد</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight text-white">
            صيانة احترافية لكافة هواتف آيفون وسامسونج
          </h1>

          <p className="text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            فحص فوري دقيق، قطع غيار أصلية وكالة 100%، وضمان معتمد على كافة أعمال الصيانة بيد مهندسين متخصصين.
          </p>

          {/* Quick Direct Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
            <a
              href={whatsappMaintenanceUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-black text-sm flex items-center justify-center gap-2.5 shadow-xl shadow-[#25D366]/30 transition-all active:scale-95"
            >
              <MessageCircle className="w-5 h-5 fill-white" />
              <span>احجز / استفسر عن الصيانة عبر واتساب</span>
            </a>

            <a
              href={phoneCallUrl}
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-black text-sm flex items-center justify-center gap-2 border border-white/20 transition-all active:scale-95 backdrop-blur-md"
            >
              <Phone className="w-4 h-4 text-amber-400" />
              <span>اتصال مباشر بورشة الصيانة ({STORE_CONFIG.contact.primaryPhone})</span>
            </a>
          </div>

          {/* Tabs Switcher */}
          <div className="flex items-center justify-center gap-2 pt-6">
            <button
              type="button"
              onClick={() => setActiveTab("showcase")}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                activeTab === "showcase"
                  ? "bg-amber-500 text-slate-950 shadow-md"
                  : "bg-white/10 text-white hover:bg-white/15 border border-white/15"
              }`}
            >
              خدمات وأنواع الصيانة
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("new")}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                activeTab === "new"
                  ? "bg-amber-500 text-slate-950 shadow-md"
                  : "bg-white/10 text-white hover:bg-white/15 border border-white/15"
              }`}
            >
              تسجيل طلب صيانة جديد
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("track")}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                activeTab === "track"
                  ? "bg-amber-500 text-slate-950 shadow-md"
                  : "bg-white/10 text-white hover:bg-white/15 border border-white/15"
              }`}
            >
              تتبع جهاز في الصيانة 🔍
            </button>
          </div>
        </div>
      </section>

      {/* 2. BODY CONTENT BASED ON ACTIVE TAB */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-8 sm:space-y-12">
        {activeTab === "showcase" && (
          <div className="space-y-8 sm:space-y-12 animate-in fade-in">
            {/* Maintenance Types Grid */}
            <section className="space-y-4">
              <div className="border-b border-slate-200 pb-3">
                <h2 className="text-lg sm:text-2xl font-black text-slate-900">
                  أنواع وخدمات الصيانة المعتمدة
                </h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  نستخدم أحدث معدات الفحص وقطع الغيار الأصلية المعتمدة
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {maintenanceServices.map((srv, idx) => {
                  const Icon = srv.icon;
                  return (
                    <div
                      key={idx}
                      className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:border-amber-400 hover:shadow-md transition-all space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center shadow-2xs">
                          <Icon className="w-6 h-6 stroke-[2.2]" />
                        </div>
                        <span className="text-[10px] font-black text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                          {srv.badge}
                        </span>
                      </div>
                      <h3 className="text-base font-black text-slate-900">{srv.title}</h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{srv.desc}</p>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Common Handled Issues */}
            <section className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
              <div className="space-y-1">
                <span className="text-xs font-bold text-amber-400">تشخيص وإصلاح فوري</span>
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  أبرز مشاكل الأجهزة التي نتعامل معها يومياً
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {handledIssues.map((issue, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 bg-white/5 border border-white/10 p-3.5 rounded-2xl text-xs sm:text-sm font-bold text-slate-200"
                  >
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>{issue}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Quality & Warranty Guarantees */}
            <section className="bg-amber-50/70 border border-amber-200/80 rounded-3xl p-6 sm:p-8 space-y-4">
              <h3 className="text-base sm:text-lg font-black text-amber-950 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-600" />
                <span>ضمانات الجودة والخصوصية في ورشة سما الخضراء</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-amber-950/90">
                <div className="bg-white/80 p-4 rounded-2xl border border-amber-200/50 space-y-1">
                  <h4 className="font-black text-sm text-amber-900">فحص فوري مجاني</h4>
                  <p className="leading-relaxed">تشخيص دقيق للعطل وتحديد التكلفة المسبقة قبل البدء بأي خطوة.</p>
                </div>
                <div className="bg-white/80 p-4 rounded-2xl border border-amber-200/50 space-y-1">
                  <h4 className="font-black text-sm text-amber-900">قطع وكالة مضمونة</h4>
                  <p className="leading-relaxed">ضمان مكتوب وموثق على الشاشات والبطاريات وكافة القطع المستبدلة.</p>
                </div>
                <div className="bg-white/80 p-4 rounded-2xl border border-amber-200/50 space-y-1">
                  <h4 className="font-black text-sm text-amber-900">سرية وأمان البيانات</h4>
                  <p className="leading-relaxed">حفاظ كامل وتشفير لكافة ملفات وصور ورسائل الزبائن أثناء الإصلاح.</p>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* Form Tab */}
        {activeTab === "new" && (
          <div className="max-w-2xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 animate-in fade-in">
            <div>
              <h2 className="text-xl font-black text-slate-900">تسجيل طلب صيانة مسبق</h2>
              <p className="text-xs text-slate-500 mt-1">
                سجل بياناتك وموديل جهازك وسيتم تجهيز القطع والتواصل معك مباشرة
              </p>
            </div>

            {submittedTicket ? (
              <div className="p-6 rounded-3xl bg-emerald-50 border border-emerald-200 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto text-2xl">
                  ✓
                </div>
                <h3 className="text-lg font-black text-emerald-950">تم تسجيل طلبك بنجاح!</h3>
                <p className="text-xs text-emerald-800">
                  رقم تذكرة الصيانة الخاصة بك: <strong>{submittedTicket.ticketNumber}</strong>
                </p>
                <div className="flex justify-center gap-2 pt-2">
                  <a
                    href={getWhatsAppUrl(
                      `مرحباً سما الخضراء، لقد سجلت طلب صيانة برقم تذكرة: ${submittedTicket.ticketNumber} لجهاز: ${submittedTicket.brandModel}`
                    )}
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-md"
                  >
                    متابعة الطلب عبر واتساب
                  </a>
                  <button
                    type="button"
                    onClick={() => setSubmittedTicket(null)}
                    className="px-5 py-2.5 bg-white text-slate-700 border border-slate-200 rounded-xl text-xs font-bold"
                  >
                    تسجيل جهاز آخر
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMessage && (
                  <div className="p-3 rounded-xl bg-red-50 text-red-700 border border-red-200 text-xs font-bold">
                    {errorMessage}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-black text-slate-800 block mb-1">الاسم الكامل *</label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="مثال: علي كريم"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-black text-slate-800 block mb-1">رقم الهاتف *</label>
                    <input
                      type="text"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="0770 123 4567"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-black text-slate-800 block mb-1">نوع الجهاز</label>
                    <select
                      value={deviceType}
                      onChange={(e) => setDeviceType(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      {deviceTypes.map((dt) => (
                        <option key={dt.label} value={dt.label}>
                          {dt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-black text-slate-800 block mb-1">موديل الجهاز</label>
                    <input
                      type="text"
                      value={brandModel}
                      onChange={(e) => setBrandModel(e.target.value)}
                      placeholder="مثال: iPhone 15 Pro Max"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-black text-slate-800 block mb-1">وصف العطل أو المشكلة *</label>
                  <textarea
                    rows={3}
                    required
                    value={issueDescription}
                    onChange={(e) => setIssueDescription(e.target.value)}
                    placeholder="اشرح المشكلة: كسر شاشة، بطارية، لا يشحن، تعليق..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs sm:text-sm shadow-md transition-all active:scale-98"
                >
                  {isSubmitting ? "جاري تسجيل الطلب..." : "إرسال طلب الصيانة للمدير الفني"}
                </button>
              </form>
            )}
          </div>
        )}

        {/* Tracking Tab */}
        {activeTab === "track" && (
          <div className="max-w-2xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 animate-in fade-in">
            <div>
              <h2 className="text-xl font-black text-slate-900">تتبع حالة جهاز في الصيانة</h2>
              <p className="text-xs text-slate-500 mt-1">
                أدخل رقم الهاتف أو رقم تذكرة الصيانة للاستعلام الفوري
              </p>
            </div>

            <form onSubmit={handleTrackSearch} className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="أدخل رقم الهاتف أو رقم التذكرة (مثال: TKT-1234)"
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button
                type="submit"
                disabled={isSearching}
                className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-black transition-all active:scale-95"
              >
                {isSearching ? "جاري البحث..." : "استعلام"}
              </button>
            </form>

            {searchPerformed && (
              <div className="space-y-3 pt-2">
                {trackedTickets.length > 0 ? (
                  trackedTickets.map((t) => (
                    <div key={t.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-black text-xs text-slate-900">تذكرة #{t.ticketNumber}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-800">
                          {t.status === "Pending" ? "قيد الفحص" : t.status === "InProgress" ? "جاري الإصلاح" : "جاهز للتسليم"}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600">الجهاز: {t.brandModel || t.deviceType}</p>
                      <p className="text-xs text-slate-500">العطل: {t.issueDescription}</p>
                      {t.costEstimate && (
                        <p className="text-xs font-black text-emerald-700">التكلفة التقديرية: {t.costEstimate.toLocaleString()} د.ع</p>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 text-center py-6">
                    لم نتمكن من العثور على أجهزة مطابقة لرقم البحث. يرجى التأكد من الرقم أو التواصل معنا.
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
