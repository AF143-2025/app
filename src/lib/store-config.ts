/**
 * Centralized Store Configuration for Sama Al-Khadraa Mobile & Tech Store
 * سما الخضراء للهواتف الذكية، الصيانة، وخدمات التقسيط المعتمدة داخل المحل
 */

export interface StoreGuarantee {
  title: string;
  desc: string;
  badge: string;
}

export const STORE_CONFIG = {
  name: "سما الخضراء للهواتف",
  fullName: "شركة سما الخضراء للهواتف الذكية والصيانة المعتمدة",
  slogan: "متجر الهواتف الأول في بغداد • بيع كاش، أقساط بالفرع، وصيانة فورية وكالة",
  description:
    "متجر سما الخضراء: أحدث أجهزة iPhone وسامسونج الأصلية، شواحن وبنوك طاقة، ورشة صيانة فورية معتمدة، وتقسيط ميسر لموظفي الدولة والمتقاعدين داخل الفرع.",
  
  // Official Store Contact Details
  contact: {
    primaryPhone: "0770 123 4567",
    secondaryPhone: "0780 123 4567",
    primaryPhoneClean: "07701234567",
    secondaryPhoneClean: "07801234567",
    whatsappNumber: "9647701234567",
    whatsappDisplay: "+964 770 123 4567",
    email: "info@sama-alkhadraa.com",
    supportEmail: "support@sama-alkhadraa.com",
  },

  // Physical Location & Working Hours
  location: {
    city: "بغداد",
    district: "الكرادة",
    landmark: "ساحة الواثق، مجاور مصرف الرافدين",
    fullAddress: "بغداد - الكرادة، ساحة الواثق، مجاور مصرف الرافدين، فرع شركة سما الخضراء للهواتف",
    googleMapsUrl: "https://maps.google.com/?q=Baghdad+Karrada+Al-Wathiq",
    coordinates: {
      lat: 33.3089,
      lng: 44.4285,
    },
    workingHours: {
      weekdays: "يومياً من الساعة 9:00 صباحاً حتى 11:00 مساءً",
      friday: "الجمعة والعطل الرسمية من 1:00 ظهراً حتى 11:00 مساءً",
      support: "خدمة العملاء وواتساب متوفرة 24/7",
    },
  },

  // Social Channels
  social: {
    facebook: "https://facebook.com/sama.alkhadraa.phones",
    instagram: "https://instagram.com/sama.alkhadraa.phones",
    telegram: "https://t.me/sama_alkhadraa",
    tiktok: "https://tiktok.com/@sama.alkhadraa",
  },

  // Store Trust Guarantees
  guarantees: [
    {
      title: "أصلي 100% وكالة",
      desc: "كافة الأجهزة والإكسسوارات جديدة وأصلية ومضمونة من الوكلاء الرسميين.",
      badge: "كفالة معتمدة",
    },
    {
      title: "فحص دقيق قبل الاستلام",
      desc: "يحق للزبون فحص الجهاز والتأكد من مطابقته الكاملة قبل إتمام الدفع.",
      badge: "حق الفحص",
    },
    {
      title: "صيانة فورية بالقطع الأصلية",
      desc: "ورشة متكاملة مجهزة بأحدث أدوات الفحص الدقيق والقطع الوكالة مع الضمان.",
      badge: "ورشة معتمدة",
    },
    {
      title: "توصيل سريع لكافة المحافظات",
      desc: "شحن باب إلى باب لبغداد وجميع المحافظات العراقية الـ 18 خلال 24 ساعة.",
      badge: "شحن 24 ساعة",
    },
  ] as StoreGuarantee[],

  // In-Store Installment Program
  installments: {
    headline: "نوفر خدمة التقسيط داخل المحل وفق الشروط والأحكام المعتمدة",
    subheadline: "بدون كفيل وبإجراءات فورية خلال 15 دقيقة لموظفي الدولة والمتقاعدين",
    supportedCards: [
      "ماستر كارد مصرف الرافدين",
      "ماستر كارد مصرف الرشيد (نخيل)",
      "بطاقة الكي كارد الذكية (Qi Card)",
      "بطاقات المصرف العراقي للتجارة (TBI)",
      "بطاقات شبكة 1Pay والمصارف الأهلية",
    ],
    terms: [
      "التقسيط يتم حصراً بالحضور الشخصي إلى فرع المتجر في الكرادة.",
      "جلب البطاقة المصرفية الذكية والهوية الشخصية أو البطاقة الوطنية الموحدة.",
      "استلام الجهاز فوري ومباشر في نفس الجلسة بعد توثيق العملية.",
      "فترات سداد ميسرة من 3 إلى 24 شهراً بأقل فائدة رسمية ممكنة.",
    ],
  },
};

/**
 * Generate a pre-filled WhatsApp click-to-chat URL
 */
export function getWhatsAppUrl(customMessage?: string): string {
  const defaultMsg = "مرحباً " + STORE_CONFIG.name + "، أود الاستفسار عن الأجهزة المتوفرة والخدمات المتوفرة في المحل.";
  const text = encodeURIComponent(customMessage || defaultMsg);
  return "https://wa.me/" + STORE_CONFIG.contact.whatsappNumber + "?text=" + text;
}

/**
 * Generate a pre-filled WhatsApp URL for a specific product
 */
export function getProductWhatsAppUrl(product: { name: string; price: number; id: string }): string {
  const message = "مرحباً " + STORE_CONFIG.name + "، أستفسر عن توفر هاتف: " + product.name + " (السعر: " + product.price.toLocaleString("ar-IQ") + " د.ع). هل هو متوفر في الفرع حالياً؟";
  return getWhatsAppUrl(message);
}

/**
 * Generate a direct tel link
 */
export function getPhoneCallUrl(cleanPhone = STORE_CONFIG.contact.primaryPhoneClean): string {
  return "tel:" + cleanPhone;
}
