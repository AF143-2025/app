"use client";

import React from "react";
import Link from "next/link";
import {
  Layers,
  ShieldCheck,
  CreditCard,
  CheckCircle2,
  Clock,
  PhoneCall,
  MessageCircle,
  MapPin,
  ChevronLeft,
  Sparkles,
  FileText,
  BadgeCheck,
  Building2,
  HelpCircle,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import { STORE_CONFIG, getWhatsAppUrl, getPhoneCallUrl } from "@/lib/store-config";

export default function InstallmentsPage() {
  const whatsappUrl = getWhatsAppUrl(
    "مرحباً شركة سما الخضراء، أود الاستفسار عن خدمة تقسيط الهواتف المتوفرة داخل المحل والمستمسكات المطلوبة."
  );
  const phoneCallUrl = getPhoneCallUrl();

  const supportedCards = [
    {
      name: "ماستر كارد مصرف الرافدين",
      target: "موظفي الوزارات والمتقاعدين وحاملي البطاقات الذكية",
      badge: "معتمد فورياً",
      gradient: "from-amber-700 via-yellow-700 to-amber-900",
    },
    {
      name: "ماستر كارد مصرف الرشيد (نخيل)",
      target: "منتسبي وزارتي الدفاع والداخلية والوزارات الموطنة",
      badge: "بدون كفيل",
      gradient: "from-emerald-700 via-teal-700 to-slate-900",
    },
    {
      name: "بطاقة الكي كارد الذكية (Qi Card)",
      target: "المتقاعدين وذوي الشهداء والرعاية الموطنة",
      badge: "صرف وتسليم فوري",
      gradient: "from-blue-700 via-indigo-800 to-slate-950",
    },
    {
      name: "بطاقات المصرف العراقي للتجارة (TBI)",
      target: "موظفي الهيئات المستقلة والشركات النفطية",
      badge: "أعلى سقف ائتماني",
      gradient: "from-purple-800 via-indigo-900 to-slate-950",
    },
    {
      name: "بطاقات المقسم الوطني و1Pay",
      target: "موظفي القطاع الخاص والمصارف الأهلية الشريكة",
      badge: "إجراءات ميسرة",
      gradient: "from-slate-800 via-slate-900 to-black",
    },
  ];

  const benefits = [
    {
      icon: Clock,
      title: "تسليم فوري خلال 15 دقيقة",
      desc: "تتم الموافقة وتسليم جهازك الجديد داخل الفرع مباشرة في نفس الجلسة دون أي انتظار أو تأخير.",
    },
    {
      icon: ShieldCheck,
      title: "بدون كفيل للمشمولين",
      desc: "يكفي وجود بطاقتك المصرفية الذكية للجهات الموطنة رواتبهم دون اشتراط كفيل ضامن.",
    },
    {
      icon: Layers,
      title: "أقساط ميسرة من 3 إلى 24 شهراً",
      desc: "خيارات سداد مرنة تتناسب مع دخلك الشهري بأقل نسبة فائدة وعمولة رسمية معتمدة.",
    },
    {
      icon: BadgeCheck,
      title: "أجهزة أصلية مع كفالة سنة كاملة",
      desc: "كافة أجهزة الآيفون والسامسونج بالكرتونة والضمان الرسمي المعتمد لضمان راحة بالك التامة.",
    },
  ];

  const steps = [
    {
      num: "1",
      title: "زيارة فرع سما الخضراء في الكرادة",
      desc: "تفضل بزيارة فرعنا المعتمد في ساحة الواثق واختيار الهاتف أو الجهاز الذي ترغب باقتنائه.",
    },
    {
      num: "2",
      title: "تقديم البطاقة الذكية والتحقق السريع",
      desc: "يقوم موظف المبيعات بالتحقق الفوري من البطاقة الذكية والمستمسكات وإدخال المعاملة خلال دقائق.",
    },
    {
      num: "3",
      title: "استلام الجهاز الجديد فوراً وبدء الاستخدام",
      desc: "استلم هاتفك الجديد ومعه فاتورة وضمان رسمي، مع توفير خدمة نقل البيانات والحسابات مجاناً.",
    },
  ];

  const faqs = [
    {
      q: "هل يمكن التقديم على التقسيط أو التعاقد عبر الموقع إلكترونياً؟",
      a: "خدمة التقسيط متوفرة حصراً بالحضور الشخصي إلى فرع المتجر في بغداد - الكرادة لضمان أمان وسرية العملية ومطابقة البطاقة المصرفية وصاحب العلاقة.",
    },
    {
      q: "ما هي المستمسكات المطلوبة عند مراجعة الفرع؟",
      a: "يرجى جلب: البطاقة المصرفية الذكية (الماستر كارد أو الكي كارد)، البطاقة الوطنية الموحدة (أو هوية الأحوال المدنية)، وهاتف مفعل لاستلام رمز التأكيد.",
    },
    {
      q: "ما هي الأجهزة المشمولة بخدمة التقسيط داخل المحل؟",
      a: "كافة هواتف iPhone الحديثة، أجهزة Samsung Galaxy، الآيبادات والأجهزة اللوحية، والساعات الذكية الأصلية المتوفرة في صالة العرض.",
    },
  ];

  return (
    <div className="min-h-screen pb-16 space-y-8 sm:space-y-12 text-right w-full max-w-full overflow-hidden" dir="rtl">
      {/* 1. HERO BANNER - In-Store Installment Guarantee */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white py-12 sm:py-20 px-3 sm:px-6 lg:px-8 border-b border-emerald-900/30">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
        <div className="absolute -left-20 -top-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        {/* Back Button */}
        <div className="absolute top-4 right-4 z-20">
          <Link
            href="/"
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all active:scale-90 border border-white/10 backdrop-blur-md flex items-center justify-center shadow-lg"
            aria-label="الرجوع للرئيسية"
            title="الرجوع للرئيسية"
          >
            <ChevronRight className="w-5 h-5 stroke-[2.5]" />
          </Link>
        </div>

        <div className="max-w-4xl mx-auto text-center space-y-4 sm:space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm font-black">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>خدمة معتمدة داخل المحل</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight sm:leading-snug text-white">
            {STORE_CONFIG.installments.headline}
          </h1>

          <p className="text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {STORE_CONFIG.installments.subheadline}. استلم جهازك فوراً بضمان رسمي ووثائق معتمدة في زيارة واحدة فقط.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-black text-sm flex items-center justify-center gap-2.5 shadow-xl shadow-[#25D366]/30 transition-all active:scale-95"
            >
              <MessageCircle className="w-5 h-5 fill-white" />
              <span>استفسر عن التقسيط عبر واتساب</span>
            </a>

            <a
              href={phoneCallUrl}
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-black text-sm flex items-center justify-center gap-2 border border-white/20 transition-all active:scale-95 backdrop-blur-md"
            >
              <PhoneCall className="w-5 h-5 text-emerald-400" />
              <span>اتصال بمسؤول الأقساط ({STORE_CONFIG.contact.primaryPhone})</span>
            </a>
          </div>

          <div className="text-xs text-slate-400 pt-2 flex items-center justify-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span>{STORE_CONFIG.location.fullAddress}</span>
          </div>
        </div>
      </section>

      {/* 2. Key Value Pillars */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-8 sm:space-y-12">
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {benefits.map((b, idx) => {
            const Icon = b.icon;
            return (
              <div
                key={idx}
                className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all space-y-3"
              >
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shadow-xs">
                  <Icon className="w-6 h-6 stroke-[2.2]" />
                </div>
                <h3 className="text-base font-black text-slate-900">{b.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{b.desc}</p>
              </div>
            );
          })}
        </section>

        {/* 3. Supported Cards & Institutions */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                <CreditCard className="w-6 h-6 text-emerald-600" />
                <span>البطاقات المصرفية المشمولة بالتقسيط</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                ندعم بطاقات الدفع الإلكتروني لموظفي الدولة والمتقاعدين الموطنة رواتبهم
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200 self-start sm:self-auto">
              معتمد من البنك المركزي العراقي
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {supportedCards.map((card, idx) => (
              <div
                key={idx}
                className={`relative p-5 rounded-3xl text-white bg-gradient-to-br ${card.gradient} shadow-md space-y-3 overflow-hidden`}
              >
                <div className="absolute top-0 left-0 w-32 h-32 bg-white/5 rounded-full blur-xl pointer-events-none" />
                
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-lg border border-white/20">
                    {card.badge}
                  </span>
                  <div className="w-8 h-6 rounded-md bg-amber-400/80 border border-amber-300/40 shadow-xs" />
                </div>

                <div className="pt-2">
                  <h3 className="text-base font-black leading-snug">{card.name}</h3>
                  <p className="text-xs text-white/80 mt-1 leading-relaxed">{card.target}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Three Steps to Get Installment */}
        <section className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-xl sm:text-3xl font-black text-white">
              3 خطوات سهلة لاقتناء هاتفك بالتقسيط
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              إجراءات شفافة وواضحة بدون أي تعقيد أو انتظار
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className="bg-white/5 border border-white/10 rounded-3xl p-6 relative space-y-3 backdrop-blur-sm"
              >
                <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-slate-950 font-black text-lg flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  {step.num}
                </div>
                <h3 className="text-base font-black text-white">{step.title}</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 5. Frequently Asked Questions */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg sm:text-2xl font-black text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-6 h-6 text-emerald-600" />
              <span>الأسئلة الشائعة حول خدمة التقسيط</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              إجابات واضحة لجميع استفسارات زبائننا الكرام
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200/80 space-y-2">
                <h3 className="text-sm sm:text-base font-black text-slate-900 flex items-start gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 mt-2 shrink-0" />
                  <span>{faq.q}</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pr-4">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 6. Call To Action Footer Card */}
        <section className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-right">
            <h3 className="text-xl sm:text-2xl font-black">جاهز لزيارة الفرع أو لديك استفسار؟</h3>
            <p className="text-xs sm:text-sm text-emerald-100 max-w-lg">
              فريق المبيعات جاهز للرد على كافة أسئلتك وتجهيز هاتفك المفضل فور وصولك.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 rounded-2xl bg-white text-emerald-800 font-black text-xs sm:text-sm shadow-md hover:bg-emerald-50 transition-all active:scale-95 flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              <span>محادثة واتساب فورية</span>
            </a>

            <Link
              href="/category/all"
              className="px-6 py-3 rounded-2xl bg-emerald-800/60 hover:bg-emerald-800 text-white font-black text-xs sm:text-sm border border-white/20 transition-all active:scale-95"
            >
              تصفح الأجهزة المتوفرة ←
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
