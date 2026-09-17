import {
  Smartphone,
  Headphones,
  Zap,
  Cable,
  Shield,
  BatteryCharging,
  Watch,
  Sparkles,
  Wrench,
  LayoutGrid,
  LucideIcon,
} from "lucide-react";

export interface CategoryItem {
  id: string;
  label: string;
  icon: LucideIcon;
  accent: string;
  bgGradient: string;
  description: string;
  subcategories: string[];
  customHref?: string;
}

export const STORE_CATEGORIES: CategoryItem[] = [
  // Row 1 (5 items)
  {
    id: "all",
    label: "الكل",
    icon: LayoutGrid,
    accent: "text-emerald-700 bg-emerald-500/15 border-emerald-500/30",
    bgGradient: "from-emerald-700 to-teal-800",
    description: "تصفح جميع المنتجات والأجهزة الأصلية المتوفرة في متجر سما الخضراء",
    subcategories: ["الكل", "هواتف ذكية", "شواحن وكوابل", "سماعات وصوتيات", "ساعات وبطاريات"],
    customHref: "/category/all",
  },
  {
    id: "phones",
    label: "هواتف ذكية",
    icon: Smartphone,
    accent: "text-blue-700 bg-blue-500/15 border-blue-500/30",
    bgGradient: "from-blue-600 to-indigo-700",
    description: "أحدث هواتف أبل آيفون وسامسونج وشاومي الأصلية مع ضمان رسمي معتمد",
    subcategories: ["الكل", "أبل iPhone", "سامسونج Galaxy", "شاومي Xiaomi", "مستعمل مفحوص A+"],
  },
  {
    id: "headphones",
    label: "سماعات",
    icon: Headphones,
    accent: "text-purple-700 bg-purple-500/15 border-purple-500/30",
    bgGradient: "from-purple-600 to-indigo-600",
    description: "سماعات إيربودز لاسلكية، سماعات رأس محيطية، وسبيكرات استوديو فائقة النقاء",
    subcategories: ["الكل", "إيربودز لاسلكية", "سماعات رأس Over-Ear", "سبيكرات ومكبرات صوت", "سماعات سلكية"],
  },
  {
    id: "chargers",
    label: "شواحن",
    icon: Zap,
    accent: "text-amber-700 bg-amber-500/15 border-amber-500/30",
    bgGradient: "from-amber-600 to-orange-600",
    description: "شواحن GaN فائقة السرعة، شواحن MagSafe، كوابل وبنوك طاقة أصلية معتمدة",
    subcategories: ["الكل", "شواحن GaN سريعة", "شواحن MagSafe", "شواحن سيارة", "منصات شحن مكتبية"],
  },
  {
    id: "cables",
    label: "كوابل",
    icon: Cable,
    accent: "text-teal-700 bg-teal-500/15 border-teal-500/30",
    bgGradient: "from-teal-600 to-emerald-700",
    description: "كوابل Type-C فائقة التحمل، كوابل أبل المنسوجة، ووصلات نقل البيانات السريعة",
    subcategories: ["الكل", "كوابل Type-C", "كوابل أبل منسوجة", "كوابل شحن 100W+", "محولات وتوصيلات"],
  },

  // Row 2 (5 items)
  {
    id: "cases",
    label: "كفرات وحماية",
    icon: Shield,
    accent: "text-rose-700 bg-rose-500/15 border-rose-500/30",
    bgGradient: "from-rose-600 to-pink-700",
    description: "كفرات ماج سيف أصلية، حماية شاشة نانو 360°، وحماية عدسات الكاميرا",
    subcategories: ["الكل", "كفرات ماج سيف", "حماية شاشة نانو 360", "كفرات سيليكون أصلية", "حماية عدسات"],
  },
  {
    id: "powerbanks",
    label: "باوربانك",
    icon: BatteryCharging,
    accent: "text-emerald-700 bg-emerald-500/15 border-emerald-500/30",
    bgGradient: "from-emerald-600 to-teal-700",
    description: "بنوك طاقة أنكر وباسيوس بسعات ضخمة وشحن سريع للرحلات والاستخدام اليومي",
    subcategories: ["الكل", "سعة 20,000mAh+", "ماج سيف لاسلكي", "شواحن متنقلة GaN", "شاشة ذكية LED"],
  },
  {
    id: "smartwatches",
    label: "ساعات ذكية",
    icon: Watch,
    accent: "text-indigo-700 bg-indigo-500/15 border-indigo-500/30",
    bgGradient: "from-indigo-600 to-blue-700",
    description: "ساعات أبل وسامسونج الذكية، أساور رياضية، أحزمة فاخرة وشواحن مخصصة",
    subcategories: ["الكل", "ساعات أبل ووتش", "ساعات سامسونج Galaxy", "أساور رياضية", "أحزمة وإكسسوارات"],
  },
  {
    id: "accessories",
    label: "إكسسوارات",
    icon: Sparkles,
    accent: "text-orange-700 bg-orange-500/15 border-orange-500/30",
    bgGradient: "from-orange-600 to-amber-700",
    description: "ستاندات مكتبية، مسكات ماج سيف، محولات ذكية، وإكسسوارات الهواتف",
    subcategories: ["الكل", "ستاندات وقواعد ماج سيف", "مسكات وخواتم", "محولات متعددة 8 في 1", "منظمات"],
  },
  {
    id: "maintenance",
    label: "طلب صيانة",
    icon: Wrench,
    accent: "text-cyan-700 bg-cyan-500/15 border-cyan-500/30",
    bgGradient: "from-cyan-600 to-blue-700",
    description: "تقديم طلب صيانة فوري: سجّل بياناتك وموديل جهازك وتفاصيل العطل وسيقوم المدير العام بالرد المباشر عليك",
    subcategories: ["الكل", "تبديل شاشات أصلية", "تبديل بطاريات بضمان", "صيانة آي سي وباور", "معالجة سوائل"],
    customHref: "/maintenance",
  },
];

export function getCategoryById(id: string): CategoryItem | undefined {
  if (id === "audio") return STORE_CATEGORIES.find((c) => c.id === "headphones");
  if (id === "watches") return STORE_CATEGORIES.find((c) => c.id === "smartwatches");
  if (id === "electronics") return STORE_CATEGORIES.find((c) => c.id === "phones");
  return STORE_CATEGORIES.find((cat) => cat.id === id);
}
