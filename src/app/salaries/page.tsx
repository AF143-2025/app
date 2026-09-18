"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Banknote,
  CreditCard,
  Building,
  ShieldCheck,
  CheckCircle2,
  Clock,
  MapPin,
  PhoneCall,
  Sparkles,
  Award,
  Zap,
  Check,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ArrowRight,
  Layers,
  HeartHandshake,
  Users,
  GraduationCap,
  HeartPulse,
  Shield,
  Briefcase,
  Printer,
  Smartphone,
  MessageCircle,
  Coins
} from "lucide-react";

interface SalaryCardInfo {
  id: string;
  name: string;
  bankName: string;
  gradient: string;
  chipColor: string;
  brandBadge: string;
  cardNumberDisplay: string;
  cardHolder: string;
  targetAudience: string;
  features: string[];
  supportedSectors: string[];
}

const SALARY_CARDS: SalaryCardInfo[] = [
  {
    id: "rafidain",
    name: "ماستر كارد مصرف الرافدين",
    bankName: "مصرف الرافدين الحكومي",
    gradient: "from-blue-900 via-indigo-950 to-slate-950",
    chipColor: "bg-amber-300 border-amber-400",
    brandBadge: "🏛️ الرافدين • Rafidain",
    cardNumberDisplay: "5314 •••• •••• 9012",
    cardHolder: "موظف / متقاعد مصرف الرافدين",
    targetAudience: "موظفو الوزارات الحكومية والمتقاعدين المدنيين والعسكريين",
    features: [
      "صرف فوري للنقد بالدينار العراقي خلال أقل من دقيقة",
      "طباعة إيصال رسمي فوري واستعلام الرصيد المتبقي",
      "أقل عمولة سحب رسمية مطابقة لتعليمات البنك المركزي",
      "توفر سيولة نقدية عالية حتى في أوقات الذروة",
    ],
    supportedSectors: [
      "وزارة التربية",
      "وزارة الصحة",
      "وزارة التعليم العالي",
      "المتقاعدين المدنيين",
      "دوائر المحافظة والبلديات",
    ],
  },
  {
    id: "rasheed",
    name: "ماستر كارد مصرف الرشيد (نخيل)",
    bankName: "مصرف الرشيد الحكومي",
    gradient: "from-emerald-900 via-teal-950 to-slate-950",
    chipColor: "bg-emerald-300 border-emerald-400",
    brandBadge: "🌴 نخيل • Al-Rasheed",
    cardNumberDisplay: "5285 •••• •••• 4421",
    cardHolder: "منتسب / موظف مصرف الرشيد",
    targetAudience: "منتسبو القوات الأمنية ووزارة الدفاع والداخلية والوزارات التابعة للرشيد",
    features: [
      "سحب مباشر بدون تأخير أو انتظار",
      "أجهزة POS حديثة متصلة بالسيرفر المركزي مباشرة لمنع رفض البطاقة",
      "تسليم الراتب كاملاً مع إشعار ورقي معتمد",
      "إمكانية تجزئة السحب أو سحب الراتب كاملاً دفعة واحدة",
    ],
    supportedSectors: [
      "وزارة الدفاع",
      "وزارة الداخلية",
      "الأجهزة الأمنية المشتركة",
      "وزارة العدل",
      "متقاعدو مصرف الرشيد",
    ],
  },
  {
    id: "qi_card",
    name: "بطاقة الكي كارد الذكية (Qi Card)",
    bankName: "الشركة العالمية للبطاقة الذكية",
    gradient: "from-amber-700 via-amber-900 to-slate-950",
    chipColor: "bg-amber-300 border-amber-400",
    brandBadge: "💳 كي كارد • Qi Card",
    cardNumberDisplay: "6360 •••• •••• 7731",
    cardHolder: "متقاعد / مشمول بالرعاية",
    targetAudience: "المتقاعدين الكرام وذوي الشهداء والجرحى وشبكة الحماية",
    features: [
      "مسار صرف خاص وسريع لكبار السن والمتقاعدين الكرام",
      "دعم قراءة البصمة والشريحة الذكية بكفاءة",
      "خدمة استعلام الرصيد مجاناً قبل السحب",
      "معاملة راقية واحترام كامل للمراجعين",
    ],
    supportedSectors: [
      "هيئة التقاعد الوطنية",
      "متقاعدو الجيش والشرطة",
      "مؤسسة الشهداء والسجناء",
      "نقابة المعلمين المتقاعدين",
    ],
  },
  {
    id: "social_care",
    name: "بطاقة شبكة الحماية الاجتماعية",
    bankName: "وزارة العمل والشؤون الاجتماعية",
    gradient: "from-purple-900 via-violet-950 to-slate-950",
    chipColor: "bg-purple-300 border-purple-400",
    brandBadge: "🤝 الحماية الاجتماعية",
    cardNumberDisplay: "5378 •••• •••• 3319",
    cardHolder: "مشمول بشبكة الرعاية الاجتماعية",
    targetAudience: "الأسر المتعففة، المرأة، ذوي الإعاقة والاحتياجات الخاصة",
    features: [
      "أولوية مطلقة في الصرف فور إطلاق دفعات الإعانة",
      "تسليم الإعانة النقدية كاملة دون أي استقطاع غير رسمي",
      "مساعدة المستفيدين وتوضيح أي استفسار حول حالة البطاقة",
      "أجهزة حديثة تعمل طيلة أيام الأسبوع",
    ],
    supportedSectors: [
      "إعانة الحماية الاجتماعية للرجال",
      "إعانة الحماية الاجتماعية للمرأة",
      "هيئة ذوي الإعاقة والاحتياجات الخاصة",
      "العاطلون عن العمل المسجلون",
    ],
  },
  {
    id: "tbi",
    name: "بطاقات المصرف العراقي للتجارة (TBI)",
    bankName: "Trade Bank of Iraq",
    gradient: "from-slate-800 via-zinc-900 to-black",
    chipColor: "bg-yellow-400 border-yellow-500",
    brandBadge: "🌐 TBI Bank",
    cardNumberDisplay: "4152 •••• •••• 1098",
    cardHolder: "موظف / عميل المصرف العراقي للتجارة",
    targetAudience: "موظفو الشركات النفطية، الهيئات المستقلة، الرئاسات والجامعات",
    features: [
      "إمكانية صرف المبالغ والرواتب العالية بسلاسة تامة",
      "دعم بطاقات Visa و Mastercard الصادرة من المصرف العراقي للتجارة",
      "توفر سيولة كافية للمؤسسات والشركات الكبرى",
      "إيصال تدقيق بنكي معتمد",
    ],
    supportedSectors: [
      "الشركات النفطية ووزارة النفط",
      "الهيئات المستقلة والبنك المركزي",
      "مجلس الوزراء ورئاسة الجمهورية",
      "موظفو الخطوط الجوية العراقية",
    ],
  },
  {
    id: "private_banks",
    name: "بطاقات المصارف الأهلية والمقسم الوطني",
    bankName: "المصارف الخاصة والشركات",
    gradient: "from-cyan-950 via-slate-900 to-slate-950",
    chipColor: "bg-cyan-300 border-cyan-400",
    brandBadge: "🏦 المقسم الوطني • 1Pay",
    cardNumberDisplay: "5086 •••• •••• 5510",
    cardHolder: "موظف القطاع الخاص والمشتركين",
    targetAudience: "موظفو الشركات الأهلية والجامعات والكليات الأهلية والمصارف الخاصة",
    features: [
      "دعم بطاقات مصرف بغداد، مصرف الشرق الأوسط، والمصرف الأهلي العراقي",
      "دعم بطاقات بنك FIB وبطاقات المحافظ المرخصة",
      "صرف فوري بنظام المقسم الوطني العراقي الموحد",
      "خدمة سريعة بدون انتظار",
    ],
    supportedSectors: [
      "شركات القطاع الخاص",
      "المستشفيات والمدارس الأهلية",
      "المصارف الأهلية والتمويل الأصغر",
      "شركات الاتصالات والإنترنت",
    ],
  },
];

const MINISTRIES = [
  { name: "وزارة التربية", icon: GraduationCap, color: "text-blue-600 bg-blue-50" },
  { name: "وزارة الصحة", icon: HeartPulse, color: "text-rose-600 bg-rose-50" },
  { name: "وزارة الداخلية", icon: Shield, color: "text-emerald-600 bg-emerald-50" },
  { name: "وزارة الدفاع", icon: Award, color: "text-amber-600 bg-amber-50" },
  { name: "هيئة التقاعد الوطنية", icon: Users, color: "text-indigo-600 bg-indigo-50" },
  { name: "الحماية الاجتماعية", icon: HeartHandshake, color: "text-purple-600 bg-purple-50" },
  { name: "وزارة التعليم العالي", icon: GraduationCap, color: "text-sky-600 bg-sky-50" },
  { name: "القطاع الخاص والشركات", icon: Briefcase, color: "text-slate-700 bg-slate-100" },
];

const ADVANTAGES = [
  {
    title: "صرف فوري بنقرات بسيطة",
    desc: "نعتمد أحدث أجهزة نقاط البيع (POS) المربوطة بالألياف الضوئية لضمان السحب السريع دون انقطاع السيرفرات.",
    icon: Zap,
    color: "bg-amber-500/10 text-amber-600",
  },
  {
    title: "سيولة نقدية عالية ودائمة",
    desc: "نضمن توفر السيولة النقدية الكافية طيلة فترات إطلاق الرواتب، حتى لا تضطر للتنقل بين المنافذ بحثاً عن الكاش.",
    icon: Coins,
    color: "bg-emerald-500/10 text-emerald-600",
  },
  {
    title: "أقل عمولة رسمية مقررة",
    desc: "نلتزم بنسبة العمولة الرسمية الصادرة عن البنك المركزي العراقي والمصارف المصدرة بدون أي مبالغ إضافية.",
    icon: ShieldCheck,
    color: "bg-blue-500/10 text-blue-600",
  },
  {
    title: "إيصال سحب ورقي موثق",
    desc: "يتم تسليم العميل وصلاً رسمياً مطبوعاً يوضح المبلغ المسحوب، والعمولة، والرصيد المتبقي بدقة متناهية.",
    icon: Printer,
    color: "bg-purple-500/10 text-purple-600",
  },
  {
    title: "أمان وخصوصية تامة للرمز السري",
    desc: "لوحة مفاتيح الأجهزة مخصصة ليدخل العميل رمزه السري بنفسه بأمان وسرية تامة دون كشفه لأحد.",
    icon: Shield,
    color: "bg-rose-500/10 text-rose-600",
  },
  {
    title: "خدمة كبار السن والمتقاعدين",
    desc: "أولوية ومسار مريح لكبار السن ومتقاعدينا الأفاضل وذوي الاحتياجات الخاصة مع تقديم المساعدة الفورية.",
    icon: Users,
    color: "bg-teal-500/10 text-teal-600",
  },
];

const STEPS = [
  {
    step: "1",
    title: "زيارة فرع سما الخضراء",
    desc: "تفضل بزيارة فرعنا المعتمد في بغداد - الكرادة، ساحة الواثق، قرب فرع الهواتف.",
  },
  {
    step: "2",
    title: "تقديم البطاقة والتحقق",
    desc: "قدّم بطاقة الماستر كارد أو الكي كارد وأدخل رمزك السري بأمان تام على جهاز الدفع.",
  },
  {
    step: "3",
    title: "استلام الراتب فوراً نقداً",
    desc: "استلم راتبك نقداً فوراً بالدينار العراقي مع وصل الحركة الرسمي المطبوع.",
  },
];

const FAQS = [
  {
    q: "هل يتوفر لديكم صرف رواتب المتقاعدين وشبكة الرعاية الاجتماعية؟",
    a: "نعم، يتوفر لدينا صرف رواتب المتقاعدين المدنيين والعسكريين، ورواتب شبكة الحماية الاجتماعية (للرجال والنساء) عبر بطاقات الكي كارد والماستر كارد فور إطلاق وجبات الصرف الرسمية.",
  },
  {
    q: "ما هي المتطلبات اللازمة لسحب الراتب من الفرع؟",
    a: "تحتاج فقط إلى جلب بطاقة الراتب الذكية (ماستر كارد أو كي كارد) ومعرفة الرمز السري (PIN)، ويُفضل اصطحاب البطاقة الوطنية الموحدة أو هوية الأحوال المدنية.",
  },
  {
    q: "كم تبلغ عمولة سحب الراتب؟",
    a: "نلتزم بنسبة العمولة الرسمية المعيارية المحددة من البنك المركزي العراقي والمصارف المصدرة (مثل مصرف الرافدين والرشيد)، دون فرض أي رسوم غير رسمية أو إضافية.",
  },
  {
    q: "هل يمكنني استعلام الرصيد لمعرفة هل نزل الراتب أم لا؟",
    a: "نعم بالتأكيد! يمكنك زيارة الفرع ونقوم بفحص رصيد بطاقتك وطباعة إشعار الرصيد مجاناً لمعرفة ما إذا تم إيداع الراتب في حسابك.",
  },
  {
    q: "ما هي أوقات العمل في منفذ الصيرفة؟",
    a: "نعمل يومياً طيلة أيام الأسبوع (بما فيها أيام الجمعة والعطل الرسمية) من الساعة 9:00 صباحاً وحتى الساعة 11:00 مساءً، مع تمديد أوقات العمل في أيام إطلاق الرواتب الكبرى.",
  },
];

export default function SalariesShowcasePage() {
  const [selectedCard, setSelectedCard] = useState<string>("rafidain");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const currentCard = SALARY_CARDS.find((c) => c.id === selectedCard) || SALARY_CARDS[0];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 text-slate-800 pb-20 pt-6 selection:bg-emerald-100 selection:text-emerald-900" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Top Header with Breadcrumb & Back Button */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="p-2 sm:p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition-all active:scale-90 border border-slate-200/60 shadow-sm flex items-center justify-center shrink-0"
            aria-label="الرجوع للرئيسية"
            title="الرجوع للرئيسية"
          >
            <ChevronRight className="w-5 h-5 stroke-[2.5]" />
          </Link>
          <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span className="text-slate-900 font-bold">الصيرفة وصرف جميع الرواتب</span>
          </nav>
        </div>

        {/* Hero Banner Section (Fintech App Style) */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-950 text-white p-6 sm:p-12 shadow-2xl border border-emerald-500/20">
          {/* Decorative glowing background elements */}
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm font-bold backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>منفذ رسمي ومعتمد • مرخص لدى شبكات الدفع الإلكتروني</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight sm:leading-tight">
              يتوفر لدينا صرف <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">جميع الرواتب</span> نقداً وفورياً
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              في فرع «سما الخضراء»، نقدّم لموظفي الدولة، المتقاعدين، ومستفيدي شبكة الرعاية الاجتماعية أسرع وأأمن خدمة سحب وصرف للرواتب عبر أحدث أجهزة الـ POS وبأقل عمولة رسمية مقررة مع توفر دائم للسيولة النقدية.
            </p>

            {/* Quick Stat Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-3 text-center">
                <Zap className="w-5 h-5 text-amber-400 mx-auto mb-1" />
                <div className="text-xs font-black text-white">صرف فوري</div>
                <div className="text-[10px] text-slate-400">خلال دقيقة واحدة</div>
              </div>
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-3 text-center">
                <Coins className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                <div className="text-xs font-black text-white">سيولة متوفرة</div>
                <div className="text-[10px] text-slate-400">دون انقطاع الكاش</div>
              </div>
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-3 text-center">
                <Printer className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                <div className="text-xs font-black text-white">إيصال رسمي</div>
                <div className="text-[10px] text-slate-400">مطبوع ومعتمد</div>
              </div>
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-3 text-center">
                <ShieldCheck className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                <div className="text-xs font-black text-white">أمان بنكي</div>
                <div className="text-[10px] text-slate-400">خصوصية تامة للرمز</div>
              </div>
            </div>

            {/* CTA action buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <a
                href="https://wa.me/9647700000000?text=السلام%20عليكم%20استفسار%20عن%20صرف%20الرواتب"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm px-5 py-3 rounded-2xl shadow-lg shadow-emerald-600/30 transition-all active:scale-95"
              >
                <MessageCircle className="w-4 h-4" />
                <span>استفسار عن نزول راتبك عبر واتساب</span>
              </a>
              <a
                href="tel:07700000000"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white font-bold text-xs sm:text-sm px-4 py-3 rounded-2xl border border-white/20 backdrop-blur-md transition-all active:scale-95"
              >
                <PhoneCall className="w-4 h-4 text-emerald-400" />
                <span>اتصال مباشر بالفرع</span>
              </a>
            </div>
          </div>
        </section>

        {/* Bank & Salary Cards Interactive Showcase */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <span className="text-xs font-black text-emerald-700 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                منظومة البطاقات المشمولة
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
                البطاقات المصرفية المدعومة للصرف
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                نستقبل جميع أنواع البطاقات الذكية الصادرة من المصارف الحكومية والأهلية المعتمدة
              </p>
            </div>
            <div className="text-xs font-bold text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-2xl self-start sm:self-auto shadow-sm">
              اختر البطاقة لاستعراض تفاصيلها وميزاتها 💳
            </div>
          </div>

          {/* Cards Selector Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {SALARY_CARDS.map((card) => {
              const isSelected = card.id === selectedCard;
              return (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => setSelectedCard(card.id)}
                  className={`p-3 rounded-2xl text-right transition-all border text-xs font-bold flex flex-col justify-between min-h-[90px] ${
                    isSelected
                      ? "bg-slate-900 text-white border-slate-900 shadow-lg scale-102 ring-2 ring-emerald-500/30"
                      : "bg-white text-slate-700 border-slate-200 hover:border-emerald-300 hover:bg-slate-50 shadow-sm"
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-base">💳</span>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    )}
                  </div>
                  <div className="font-black leading-snug mt-2 line-clamp-2">
                    {card.name}
                  </div>
                  <div className={`text-[10px] mt-1 font-semibold ${isSelected ? "text-emerald-400" : "text-slate-400"}`}>
                    {card.bankName}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Card Detailed Showcase Box */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Visual Digital Card Preview (Left/Top) */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-sm">
                <div
                  className={`aspect-[1.58/1] rounded-3xl p-6 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between border border-white/20 bg-gradient-to-br ${currentCard.gradient}`}
                >
                  {/* Glossy overlay effect */}
                  <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
                  <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none" />

                  {/* Card Header: Chip and Brand */}
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {/* EMV Chip visual */}
                      <div className={`w-11 h-8 rounded-lg border flex items-center justify-center p-1 shadow-inner ${currentCard.chipColor}`}>
                        <div className="w-full h-full border border-black/20 rounded grid grid-cols-3 gap-0.5 opacity-60">
                          <div className="border-r border-black/20" />
                          <div className="border-r border-black/20" />
                          <div />
                        </div>
                      </div>
                      <span className="text-[10px] tracking-widest text-white/70 font-mono">EMV SMART</span>
                    </div>
                    <span className="text-xs font-black px-2.5 py-1 rounded-full bg-black/30 backdrop-blur-md border border-white/20">
                      {currentCard.brandBadge}
                    </span>
                  </div>

                  {/* Card Number */}
                  <div className="relative z-10 my-auto">
                    <div className="text-lg sm:text-xl font-mono tracking-widest font-black text-white/95 text-center drop-shadow-md">
                      {currentCard.cardNumberDisplay}
                    </div>
                    <div className="text-[10px] text-white/60 text-center font-mono mt-0.5">
                      AUTHORIZED SALARY DISBURSEMENT
                    </div>
                  </div>

                  {/* Card Footer: Holder & Bank */}
                  <div className="relative z-10 flex items-end justify-between text-xs">
                    <div>
                      <div className="text-[9px] text-white/60 uppercase font-mono">الجهة والمستفيد</div>
                      <div className="font-black text-white/95 tracking-wide text-xs">
                        {currentCard.cardHolder}
                      </div>
                    </div>
                    <div className="text-left font-black text-sm tracking-wider text-amber-300 font-mono">
                      DEBIT
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card Information & Advantages (Right) */}
            <div className="lg:col-span-7 space-y-5">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold mb-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{currentCard.bankName}</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
                  {currentCard.name}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                  <strong className="text-slate-800">الفئات المستهدفة:</strong> {currentCard.targetAudience}
                </p>
              </div>

              {/* Supported Sectors Tags */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-700">
                  الدوائر والوزارات المعتمدة في هذا النظام:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {currentCard.supportedSectors.map((sector, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold"
                    >
                      ✓ {sector}
                    </span>
                  ))}
                </div>
              </div>

              {/* Features List */}
              <div className="space-y-2.5 pt-2 border-t border-slate-100">
                <div className="text-xs font-bold text-slate-700">
                  مزايا الصرف في فرع سما الخضراء:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {currentCard.features.map((feat, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2 text-xs font-semibold text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100"
                    >
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Covered Sectors and Ministries Grid */}
        <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-black text-emerald-700 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              تغطية شاملة لكافة الموظفين
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              الوزارات والجهات المشمولة بالصرف
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              نوفر خدمة الصرف لكافة موظفي القطاع الحكومي والخاص وهيئات الدولة والمتقاعدين الكرام
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {MINISTRIES.map((m, idx) => {
              const Icon = m.icon;
              return (
                <div
                  key={idx}
                  className="p-4 rounded-2xl border border-slate-100 bg-slate-50/70 hover:bg-slate-50 hover:border-emerald-200 transition-all flex flex-col items-center text-center gap-2.5 shadow-sm group"
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm ${m.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="font-black text-slate-800 text-xs sm:text-sm">
                    {m.name}
                  </div>
                  <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                    صرف متاح يومياً
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Why Choose Our Branch (Advantages) */}
        <section className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-black text-emerald-700 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              الجودة والاحترافية
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              لماذا تختار فرع سما الخضراء لصرف راتبك؟
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              معايير مصرفية وتقنية متقدمة تضمن لك تجربة سحب مريحة وسريعة بدون طوابير
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ADVANTAGES.map((adv, idx) => {
              const Icon = adv.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-3"
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${adv.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h4 className="font-black text-slate-900 text-base">
                    {adv.title}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {adv.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* 3 Easy Steps to Disburse */}
        <section className="bg-gradient-to-br from-emerald-900 via-teal-950 to-slate-950 text-white rounded-3xl p-6 sm:p-12 shadow-xl border border-emerald-500/20 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-black text-amber-400 uppercase tracking-wider bg-white/10 px-3 py-1 rounded-full backdrop-blur-md">
              خطوات بسيطة وسريعة
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              كيف تستلم راتبك من فرعنا؟
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              3 خطوات سريعة ومريحة تفصلك عن استلام راتبك نقداً
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STEPS.map((s, idx) => (
              <div
                key={idx}
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 space-y-3 relative"
              >
                <div className="w-10 h-10 rounded-full bg-emerald-500 text-white font-black flex items-center justify-center text-lg shadow-lg shadow-emerald-500/30">
                  {s.step}
                </div>
                <h4 className="text-base font-black text-white">
                  {s.title}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed font-normal">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Frequently Asked Questions (FAQ) */}
        <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-black text-emerald-700 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              الأسئلة الشائعة
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              كل ما تود معرفته عن خدمة الصيرفة وصرف الرواتب
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 text-right flex items-center justify-between font-black text-slate-900 text-xs sm:text-sm hover:bg-slate-50 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{faq.q}</span>
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? "rotate-180 text-emerald-600" : ""}`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3 bg-slate-50/50">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Branch Location & Working Hours Info Box */}
        <section className="bg-gradient-to-r from-slate-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-emerald-500/20 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
              <MapPin className="w-3.5 h-3.5" />
              <span>موقع الفرع المعتمد</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              فرع سما الخضراء للهواتف والصيرفة
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              بغداد - الكرادة، ساحة الواثق، مجاور مصرف الرافدين، فرع شركة سما الخضراء للهواتف وخدمات الدفع الإلكتروني.
            </p>

            <div className="space-y-2 pt-2 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span><strong>ساعات العمل:</strong> يومياً من 9:00 صباحاً حتى 11:00 مساءً (طيلة أيام الأسبوع بما فيها الجمعة).</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <PhoneCall className="w-4 h-4 text-emerald-400 shrink-0" />
                <span><strong>هاتف الاستعلامات:</strong> 0770 000 0000 / 0780 000 0000</span>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 space-y-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
              <Coins className="w-7 h-7" />
            </div>
            <h4 className="text-lg font-black text-white">
              هل تم إطلاق راتبك اليوم؟
            </h4>
            <p className="text-xs text-slate-300">
              تواصل معنا مباشرة للتأكد من توفر الرصيد والسيولة قبل زيارتنا أو استفسر عن أي تفاصيل تتعلق ببطاقتك.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <a
                href="https://wa.me/9647700000000?text=السلام%20عليكم%20استفسار%20عن%20صرف%20الرواتب"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>مراسلة واتساب</span>
              </a>
              <a
                href="tel:07700000000"
                className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs border border-white/20 transition-all flex items-center justify-center gap-2"
              >
                <PhoneCall className="w-4 h-4" />
                <span>اتصال هاتفي</span>
              </a>
            </div>
          </div>
        </section>

        {/* Bottom Back to Categories Action */}
        <div className="text-center pt-4">
          <Link
            href="/#categories-section"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white border border-slate-200 hover:border-emerald-400 text-slate-800 hover:text-emerald-700 text-sm font-bold shadow-sm transition-all active:scale-95 group"
          >
            <ArrowRight className="w-4 h-4 text-emerald-600 transition-transform group-hover:-translate-x-1" />
            <span>رجوع لتصفح أقسام ومتجر سما الخضراء</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
