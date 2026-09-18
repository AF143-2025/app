"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CreditCard,
  Smartphone,
  Banknote,
  Building,
  Layers,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  ShoppingBag,
  Sparkles,
  Truck,
  Check,
  PhoneCall,
  HelpCircle,
  FileText,
  Clock,
  ExternalLink,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

interface PaymentMethod {
  id: string;
  category: "ELECTRONIC" | "CASH" | "INSTALLMENT";
  name: string;
  englishName: string;
  subtitle: string;
  badge: string;
  badgeColor: string;
  gradient: string;
  chipColor: string;
  brand: string;
  cardDisplay: {
    cardNumber: string;
    holder: string;
    type: string;
  };
  description: string;
  availability: string;
  feeText: string;
  features: string[];
  howToUse: string[];
}

const AVAILABLE_PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: "COD",
    category: "CASH",
    name: "الدفع نقداً عند الاستلام",
    englishName: "Cash on Delivery (COD)",
    subtitle: "عاين جهازك وافحصه شخصياً ثم ادفع لمندوب التوصيل",
    badge: "الأكثر طلباً وموثوقية",
    badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    gradient: "from-emerald-800 via-teal-900 to-slate-950",
    chipColor: "bg-emerald-300 border-emerald-400",
    brand: "💵 كاش مباشر",
    cardDisplay: {
      cardNumber: "CASH •••• ON •••• DELIVERY",
      holder: "زبون متجر سما الخضراء",
      type: "الدفع عند الباب",
    },
    description:
      "تتيح لك هذه الوسيلة طلب أي هاتف أو ملحق من متجر سما الخضراء دون الحاجة لبطاقة بنكية مسبقة؛ حيث يتم تسليم الطلب إلى عنوانك وفحصه بحضور مندوب التوصيل قبل دفع المبلغ نقداً.",
    availability: "متوفر في بغداد وكافة محافظات العراق الـ 18",
    feeText: "بدون أي رسوم إضافية",
    features: [
      "معاينة الجهاز والعلبة والتأكد من سلامته قبل دفع الدينار",
      "استلام وصل وفاتورة الشراء الأصلية والضمان فوراً",
      "إمكانية الدفع بالدينار العراقي وفق سعر الصرف الرسمي",
      "توصيل سريع لباب المنزل خلال 24 - 48 ساعة",
    ],
    howToUse: [
      "أضف الهواتف والملحقات المطلوبة إلى سلة الشراء.",
      "في صفحة إتمام الطلب، اختر «الدفع نقداً عند الاستلام».",
      "أدخل عنوانك التفصيلي ورقم هاتفك للتواصل.",
      "عند وصول المندوب، افتح طردك وافحصه وادفع له نقداً.",
    ],
  },
  {
    id: "ZAIN_CASH",
    category: "ELECTRONIC",
    name: "محفظة زين كاش",
    englishName: "ZainCash Wallet & Mastercard",
    subtitle: "الدفع الإلكتروني الأسرع والأكثر انتشاراً في العراق",
    badge: "دفع إلكتروني فوري",
    badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    gradient: "from-amber-500 via-amber-600 to-slate-950",
    chipColor: "bg-amber-300 border-amber-400",
    brand: "🟡 ZAIN CASH",
    cardDisplay: {
      cardNumber: "5241 •••• •••• 8421",
      holder: "عميل محفظة زين كاش",
      type: "Mastercard / Wallet",
    },
    description:
      "وسيلة معتمدة رسمياً ومربوطة بنظام الدفع الفوري. تمكّنك من سداد قيمة مشترياتك عبر تطبيق زين كاش بمسح رمز QR أو تحويل مباشر برقم الهاتف دون الحاجة لحمل كاش.",
    availability: "متاح لجميع حاملي خطوط زين ومحافظ زين كاش الموثقة",
    feeText: "مجاني وبدون عمولة من المتجر",
    features: [
      "تأكيد فوري لحجز الجهاز دون انتظار",
      "إمكانية الدفع عبر مسح رمز الاستجابة السريع (QR Code)",
      "حماية كاملة وإشعار بنكي فوري بالعملية",
      "مؤهل للحصول على خصومات وقسائم ترويجية دورية",
    ],
    howToUse: [
      "اختر منتجك وتوجه لصفحة إنهاء الشراء.",
      "حدد وسيلة «زين كاش» كطريقة الدفع.",
      "سيظهر لك رقم محفظة المتجر ورمز الـ QR المخصص لدفع الفاتورة.",
      "قم بتأكيد الدفع من تطبيق زين كاش لتحصل على تأكيد الطلب فوراً.",
    ],
  },
  {
    id: "QI_CARD",
    category: "ELECTRONIC",
    name: "كي كارد والماستر كارد الوطنية",
    englishName: "Qi Card & National Mastercard",
    subtitle: "بطاقات الرواتب لمصرفي الرافدين والرشيد والمصارف العراقية",
    badge: "شائع ومعتمد حكومياً",
    badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    gradient: "from-blue-700 via-indigo-900 to-slate-950",
    chipColor: "bg-amber-300 border-amber-400",
    brand: "🔵 QI CARD",
    cardDisplay: {
      cardNumber: "5377 •••• •••• 9304",
      holder: "حامل بطاقة كي كارد",
      type: "National Mastercard",
    },
    description:
      "تتيح للموظفين والمتقاعدين وحاملي البطاقات الوطنية سداد قيمة الأجهزة الذكية مباشرة، أو الاستفادة من برامج التقسيط المالي المعتمدة لدى متجر سما الخضراء.",
    availability: "جميع بطاقات كي كارد وماستر كارد الرافدين والرشيد",
    feeText: "سداد مباشر بدون استقطاعات خفية",
    features: [
      "دعم الدفع المباشر والتقسيط لموظفي الدولة والمتقاعدين",
      "سداد آمن ومحمي بأعلى معايير مصرف الرافدين والرشيد",
      "خصم قيمة المشتريات من الرصيد مع وصل رسمي",
      "دعم نقاط البيع POS المتنقلة مع مندوب التوصيل",
    ],
    howToUse: [
      "اختر الهاتف المطلوب وانتقل لصفحة السلة.",
      "اختر وسيلة «كي كارد / ماستر كارد».",
      "أدخل معلومات بطاقتك بأمان أو اطلب الدفع عبر جهاز POS عند الاستلام.",
      "يتم تسجيل طلبك وإرسال إشعار السداد فوراً.",
    ],
  },
  {
    id: "FIB",
    category: "ELECTRONIC",
    name: "مصرف العراق الأول (FIB)",
    englishName: "First Iraqi Bank (FIB)",
    subtitle: "الحساب المصرفي الرقمي الأول في العراق والدفع بـ QR",
    badge: "عصري وفوري",
    badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    gradient: "from-purple-700 via-indigo-900 to-slate-950",
    chipColor: "bg-purple-300 border-purple-400",
    brand: "🟣 FIB BANK",
    cardDisplay: {
      cardNumber: "4820 •••• •••• 1152",
      holder: "عميل مصرف العراق الأول",
      type: "Digital Visa / FIB App",
    },
    description:
      "تجربة تسوق عصرية خالية من التعقيد. يمكنك الدفع من رصيد حسابك في بنك العراق الأول بثوانٍ معدودة عبر مسح رمز QR من خلال كاميرا تطبيق FIB مباشرة.",
    availability: "متاح لجميع مستخدمي تطبيق FIB في العراق",
    feeText: "0% عمولة - دفع مجاني تماماً",
    features: [
      "إتمام الدفع خلال 3 ثوانٍ فقط بمسح الـ QR",
      "بدون أي رسوم تحويل أو عمولات مصرفية",
      "إشعار لحظي في تطبيق FIB مع تفاصيل الفاتورة",
      "أعلى درجات الأمان المالي والتشفير الدولي",
    ],
    howToUse: [
      "اختر «مصرف العراق الأول (FIB)» عند إتمام الطلب.",
      "افتح تطبيق FIB على هاتفك واضغط على زر مسح QR.",
      "امسح رمز QR الخاص بالمتجر وأكد عملية الدفع برمز الـ PIN.",
      "يتم اعتماد الطلب وتجهيزه للشحن مباشرة.",
    ],
  },
  {
    id: "VISA_MASTER",
    category: "ELECTRONIC",
    name: "فيزا وماستر كارد العالمية",
    englishName: "Global Visa & Mastercard",
    subtitle: "بطاقات الائتمان والدفع الإلكتروني الدولي والمحلي",
    badge: "قبول دولي ومحلي",
    badgeColor: "bg-slate-500/20 text-slate-300 border-slate-500/30",
    gradient: "from-slate-900 via-slate-800 to-black",
    chipColor: "bg-slate-300 border-slate-400",
    brand: "💳 VISA & MASTERCARD",
    cardDisplay: {
      cardNumber: "4000 •••• •••• 5590",
      holder: "زبون دولي / محلي",
      type: "Credit / Debit Card",
    },
    description:
      "نقبل جميع بطاقات الدفع الإلكتروني الائتمانية والمدينة (Debit & Credit Cards) الصادرة من أي بنك داخل العراق أو خارجه، مع حماية 3D Secure والتحقق برمز OTP.",
    availability: "صالحة لكافة البطاقات البنكية المحلية والدولية",
    feeText: "دفع آمن بالدينار أو الدولار",
    features: [
      "حماية عالمية ثلاثية الأبعاد 3D Secure ورمز تحقق OTP",
      "إمكانية الدفع وطلب الهواتف كهدية من خارج العراق للأهل",
      "دعم بطاقات الائتمان ومسبقة الدفع الصادرة من جميع البنوك",
      "إصدار إيصال دفع إلكتروني دولي معتمد",
    ],
    howToUse: [
      "في صفحة الدفع، اختر «فيزا / ماستر كارد».",
      "أدخل رقم البطاقة وتاريخ الانتهاء والرمز الأمني (CVV).",
      "أدخل رمز التحقق (OTP) الذي يصلك من البنك في رسالة SMS.",
      "يتم تأكيد السداد وإصدار فاتورة الطلب المعتمدة.",
    ],
  },
  {
    id: "NEO_SWITCH",
    category: "ELECTRONIC",
    name: "نيو سويج (Neo Switch)",
    englishName: "Neo Switch Visa",
    subtitle: "المحفظة الذكية وبطاقة فيزا الرقمية",
    badge: "محفظة فيزا الحديثة",
    badgeColor: "bg-teal-500/20 text-teal-300 border-teal-500/30",
    gradient: "from-teal-600 via-emerald-800 to-slate-950",
    chipColor: "bg-emerald-300 border-emerald-400",
    brand: "🟢 NEO SWITCH",
    cardDisplay: {
      cardNumber: "4210 •••• •••• 7739",
      holder: "عميل نيو سويج",
      type: "Visa Platinum",
    },
    description:
      "تتيح لك بطاقة نيو سويج وفيزا الرقمية التسوق وشراء أحدث الهواتف الذكية والإكسسوارات مع دعم المحافظ الرقمية وإدارة الرصيد الذكي.",
    availability: "متاح لحاملي بطاقات ومحافظ نيو سويج",
    feeText: "معتمد من شبكة المدفوعات العراقية",
    features: [
      "دعم الدفع السريع والربط مع الحساب المصرفي",
      "حماية وأمان معتمد من Visa العالمية",
      "مناسب للشراء المباشر أو الشراء بالتقسيط",
      "إشعارات فورية بكافة تفاصيل العملية",
    ],
    howToUse: [
      "اختر وسيلة الدفع «نيو سويج» في مرحلة إتمام الشراء.",
      "أدخل بيانات البطاقة وقم بتأكيد الخصم المباشر.",
      "يتم ربط الدفعة برقم طلبك وتسليم الجهاز مع الضمان.",
    ],
  },
  {
    id: "INSTALLMENTS",
    category: "INSTALLMENT",
    name: "التقسيط المريح المعتمد",
    englishName: "Easy Monthly Installments",
    subtitle: "امتلك أي هاتف الآن وقسّط المبلغ على 6 أو 12 أو 24 شهراً",
    badge: "أقساط ميسرة بدون تعقيد",
    badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    gradient: "from-emerald-700 via-teal-900 to-slate-950",
    chipColor: "bg-amber-300 border-amber-400",
    brand: "🗓️ أقساط سما الخضراء",
    cardDisplay: {
      cardNumber: "EASY •••• MONTHLY •••• PLANS",
      holder: "موظف حكومي / كفيل معتمد",
      type: "نظام الأقساط الشهرية",
    },
    description:
      "برنامج تقسيط متكامل يتيح لموظفي الدولة والمتقاعدين وأصحاب المشاريع شراء أحدث الهواتف الذكية (آيفون، سامسونج، شاومي...) بدفعة أولى ميسرة وأقساط شهرية مرنة يتم استقطاعها شهرياً.",
    availability: "متوفر لحاملي بطاقات الكي كارد والماستر كارد وموظفي الدولة",
    feeText: "إجراءات ميسرة وبدون تعقيد",
    features: [
      "إمكانية التقسيط لمدة تصل إلى 24 شهراً حسب رغبتك",
      "تسليم الجهاز فور الموافقة على المعاملة مباشرة",
      "إمكانية السداد الشهري عبر زين كاش أو كي كارد أو فروعنا",
      "شمول كافة الهواتف الأصلية بالضمان المعتمد الكامل",
    ],
    howToUse: [
      "اختر خيار «شراء بالتقسيط» في صفحة إتمام الطلب أو صفحة التقسيط.",
      "حدد عدد أشهر السداد المناسبة لك والدفعة الأولى.",
      "أدخل بيانات الكفيل أو بطاقة الماستر كارد المعتمدة.",
      "سيقوم فريق المبيعات بالتواصل معك فوراً لتسليم الجهاز.",
    ],
  },
];

export default function AvailablePaymentMethodsPage() {
  const [selectedFilter, setSelectedFilter] = useState<"ALL" | "ELECTRONIC" | "CASH" | "INSTALLMENT">("ALL");
  const [activeMethod, setActiveMethod] = useState<PaymentMethod>(AVAILABLE_PAYMENT_METHODS[0]);

  const filteredMethods = AVAILABLE_PAYMENT_METHODS.filter((method) => {
    if (selectedFilter === "ALL") return true;
    return method.category === selectedFilter;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-emerald-100 selection:text-emerald-900" dir="rtl">
      {/* 1. HERO HEADER */}
      <div className="bg-gradient-to-l from-slate-950 via-slate-900 to-emerald-950 text-white py-10 sm:py-14 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]" />
        
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

        <div className="max-w-5xl mx-auto text-center space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
            <CreditCard className="w-3.5 h-3.5" />
            <span>طرق الدفع الرسمية والمعتمدة • متجر سما الخضراء للهواتف</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
            وسائل الدفع المتوفرة في المتجر
          </h1>

          <p className="text-xs sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            نوفر لك تشكيلة واسعة وآمنة 100% من وسائل الدفع المحلية والعالمية لتناسب احتياجك؛ سواء كنت تفضل الدفع كاش عند استلام جهازك وفحصه، أو عبر المحافظ الإلكترونية والبطاقات البنكية، أو بنظام التقسيط المريح.
          </p>

          {/* Key Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-[11px] sm:text-xs text-slate-300">
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full border border-white/15 backdrop-blur-sm">
              <Truck className="w-3.5 h-3.5 text-emerald-400" />
              <span>الدفع عند الاستلام متاح لكل المحافظات</span>
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full border border-white/15 backdrop-blur-sm">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>معتمد من البنك المركزي العراقي</span>
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full border border-white/15 backdrop-blur-sm">
              <Lock className="w-3.5 h-3.5 text-blue-400" />
              <span>تشفير مصرفي آمن 256-bit SSL</span>
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full border border-white/15 backdrop-blur-sm">
              <Layers className="w-3.5 h-3.5 text-purple-400" />
              <span>تقسيط ميسر حتى 24 شهراً</span>
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-10">
        {/* 2. CATEGORY FILTER BUTTONS */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-2.5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setSelectedFilter("ALL")}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                selectedFilter === "ALL"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}
            >
              جميع وسائل الدفع ({AVAILABLE_PAYMENT_METHODS.length})
            </button>

            <button
              type="button"
              onClick={() => setSelectedFilter("ELECTRONIC")}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                selectedFilter === "ELECTRONIC"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>محافظ وبطاقات إلكترونية (5)</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedFilter("CASH")}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                selectedFilter === "CASH"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}
            >
              <Banknote className="w-3.5 h-3.5" />
              <span>الدفع نقداً كاش (1)</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedFilter("INSTALLMENT")}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                selectedFilter === "INSTALLMENT"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>أقساط شهرية (1)</span>
            </button>
          </div>

          <div className="text-xs text-slate-500 font-bold px-2">
            اضغط على أي وسيلة لعرض تفاصيلها وكيفية الدفع بها
          </div>
        </div>

        {/* 3. PAYMENT METHODS SHOWCASE GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {filteredMethods.map((method) => {
            const isSelected = activeMethod.id === method.id;

            return (
              <div
                key={method.id}
                onClick={() => setActiveMethod(method)}
                className={`cursor-pointer rounded-3xl transition-all duration-300 p-5 bg-white border-2 flex flex-col justify-between group ${
                  isSelected
                    ? "border-emerald-600 shadow-xl ring-4 ring-emerald-500/15 scale-[1.01]"
                    : "border-slate-200 hover:border-slate-300 hover:shadow-md"
                }`}
              >
                {/* 3D Realistic Card Preview */}
                <div
                  className={`relative rounded-2xl p-5 text-white shadow-lg bg-gradient-to-br ${
                    method.gradient
                  } border border-white/15 overflow-hidden transition-all duration-300 group-hover:shadow-xl`}
                >
                  <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />

                  {/* Card Brand & Badge */}
                  <div className="flex items-center justify-between relative z-10">
                    <span className="text-xs font-black tracking-wide drop-shadow">
                      {method.brand}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/15 backdrop-blur-sm">
                      {method.badge}
                    </span>
                  </div>

                  {/* Microchip */}
                  <div className="my-4 flex items-center justify-between relative z-10">
                    <div className="w-8 h-6 rounded bg-gradient-to-br from-amber-200 via-amber-400 to-yellow-600 border border-amber-300/80 shadow-sm" />
                    <span className="text-[10px] font-mono text-white/80">{method.cardDisplay.type}</span>
                  </div>

                  {/* Number */}
                  <div className="font-mono text-xs sm:text-sm font-bold tracking-widest text-white/95 drop-shadow relative z-10">
                    {method.cardDisplay.cardNumber}
                  </div>

                  {/* Bottom details */}
                  <div className="mt-3 pt-2 border-t border-white/15 flex items-center justify-between text-[10px] text-white/80 relative z-10">
                    <span className="font-bold truncate">{method.cardDisplay.holder}</span>
                    <span className="text-emerald-300 font-bold">مقبول في المتجر ✓</span>
                  </div>
                </div>

                {/* Method Information */}
                <div className="pt-4 space-y-2.5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-1">
                      <h3 className="font-black text-slate-900 text-sm sm:text-base group-hover:text-emerald-700 transition-colors">
                        {method.name}
                      </h3>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md shrink-0">
                        {method.feeText}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-mono mt-0.5">{method.englishName}</p>
                    <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                      {method.subtitle}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{method.availability.slice(0, 24)}...</span>
                    </span>

                    <span
                      className={`text-xs font-black flex items-center gap-1 ${
                        isSelected ? "text-emerald-600" : "text-slate-500 group-hover:text-slate-900"
                      }`}
                    >
                      <span>عرض التفاصيل</span>
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 4. SELECTED METHOD DEEP DIVE & HOW TO USE */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-5">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>دليل الاستخدام الكامل لوسيلة: {activeMethod.name}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                {activeMethod.name} ({activeMethod.englishName})
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                {activeMethod.description}
              </p>
            </div>

            <div className="shrink-0 flex items-center gap-2">
              <Link
                href="/checkout"
                className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>الشراء بهذه الوسيلة الآن</span>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Features Box */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 space-y-3">
              <h3 className="text-xs font-black text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>مميزات هذه الوسيلة في متجر سما الخضراء:</span>
              </h3>
              <ul className="space-y-2.5 text-xs text-slate-700">
                {activeMethod.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      ✓
                    </span>
                    <span className="leading-relaxed">{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* How to Use Steps */}
            <div className="bg-emerald-50/50 rounded-2xl p-5 border border-emerald-200/80 space-y-3">
              <h3 className="text-xs font-black text-emerald-950 flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-700" />
                <span>خطوات الدفع بها عند إتمام طلبك:</span>
              </h3>
              <ol className="space-y-2.5 text-xs text-emerald-900">
                {activeMethod.howToUse.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Quick Details Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-400 block font-bold">التغطية والتوفر:</span>
              <span className="font-bold text-slate-800">{activeMethod.availability}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-400 block font-bold">رسوم العملية:</span>
              <span className="font-bold text-emerald-700">{activeMethod.feeText}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-400 block font-bold">حالة الاعتماد:</span>
              <span className="font-bold text-slate-800">معتمد 100% في نظام سما الخضراء</span>
            </div>
          </div>
        </section>

        {/* 5. 3-STEP SHOPPING & PAYMENT PROCESS */}
        <section className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-3xl p-6 sm:p-8 text-white space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-1.5">
            <span className="text-xs font-bold text-emerald-400">تسوق بأمان وراحة بال</span>
            <h3 className="text-xl sm:text-2xl font-black">كيف تشتري وتدفع في 3 خطوات بسيطة؟</h3>
            <p className="text-xs text-slate-300">
              حرصنا على جعل تجربة التسوق سهلة وفورية دون أي خطوات معقدة.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto font-black text-base">
                1
              </div>
              <h4 className="font-black text-sm text-white">اختر هاتفك أو ملحقاتك</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                تصفح تشكيلة الأجهزة الذكية الأصلية وأضف ما ترغب به إلى سلة التسوق.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto font-black text-base">
                2
              </div>
              <h4 className="font-black text-sm text-white">حدد وسيلة الدفع المناسبة</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                في صفحة الدفع، اختر وسيلتك المفضلة (كاش عند الاستلام، زين كاش، كي كارد، أو تقسيط).
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto font-black text-base">
                3
              </div>
              <h4 className="font-black text-sm text-white">استلم جهازك مع الضمان</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                يصلك الطرد مغلفاً ومختوماً مع الضمان الرسمي وفاتورة الشراء الأصلية لباب بيتك.
              </p>
            </div>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/"
              className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>تصفح الهواتف والمنتجات الآن</span>
            </Link>

            <Link
              href="/cart"
              className="px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/15"
            >
              الذهاب إلى سلة التسوق
            </Link>
          </div>
        </section>

        {/* 6. STORE PAYMENT GUARANTEES & TRUST */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-center sm:text-right">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
              <ShieldCheck className="w-6 h-6 text-emerald-600 mx-auto sm:mx-0" />
              <h4 className="font-black text-slate-900 text-xs sm:text-sm">ضمان أصلي 100%</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                كافة أجهزتنا أصلية ومشمولة بالضمان الرسمي المعتمد لمدة عام كامل.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
              <Truck className="w-6 h-6 text-blue-600 mx-auto sm:mx-0" />
              <h4 className="font-black text-slate-900 text-xs sm:text-sm">فحص قبل الاستلام</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                حق كامل لمعاينة جهازك والتأكد من مطابقته قبل تسليم المبلغ للمندوب.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
              <Lock className="w-6 h-6 text-purple-600 mx-auto sm:mx-0" />
              <h4 className="font-black text-slate-900 text-xs sm:text-sm">حماية مصرفية مشفرة</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                تشفير 256-bit SSL لحماية بيانات بطاقاتك ومعلوماتك الشخصية.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
              <PhoneCall className="w-6 h-6 text-amber-600 mx-auto sm:mx-0" />
              <h4 className="font-black text-slate-900 text-xs sm:text-sm">دعم فني واستفسارات</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                فريق خدمة العملاء جاهز لمساعدتك في أي استفسار بخصوص وسائل الدفع.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
