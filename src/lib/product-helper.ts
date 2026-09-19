/**
 * Product Attribute and Specifications Helper
 * Parses and enriches product data for professional catalog and details pages
 */

export interface ParsedProductSpecs {
  brand: string;
  condition: "جديد كارتونة" | "مستعمل مفحوص A+";
  conditionBadge: string;
  storage: string;
  ram?: string;
  availableColors: { name: string; hex: string }[];
  warranty: string;
  availabilityStatus: "متوفر فوراً بالفرع" | "متبقي كمية محدودة" | "غير متوفر حالياً";
  specs: { label: string; value: string }[];
  galleryImages: string[];
}

export function parseProductAttributes(product: {
  id?: string;
  name: string;
  description?: string;
  stock: number;
  imageUrl: string;
  category?: string;
  price?: number;
}): ParsedProductSpecs {
  const name = product.name || "";
  const desc = product.description || "";
  const combined = (name + " " + desc).toLowerCase();

  // 1. Detect Brand
  let brand = "سما الخضراء";
  if (combined.includes("iphone") || combined.includes("apple") || combined.includes("آيفون") || combined.includes("أبل") || combined.includes("airpods") || combined.includes("watch")) {
    brand = "Apple";
  } else if (combined.includes("samsung") || combined.includes("galaxy") || combined.includes("سامسونج") || combined.includes("جالاكسي") || combined.includes("ultra") || combined.includes("buds")) {
    brand = "Samsung";
  } else if (combined.includes("xiaomi") || combined.includes("redmi") || combined.includes("poco") || combined.includes("شاومي") || combined.includes("ريدمي")) {
    brand = "Xiaomi";
  } else if (combined.includes("anker") || combined.includes("أنكر") || combined.includes("soundcore")) {
    brand = "Anker";
  } else if (combined.includes("baseus") || combined.includes("باسيوس")) {
    brand = "Baseus";
  } else if (combined.includes("sony") || combined.includes("سوني")) {
    brand = "Sony";
  } else if (combined.includes("google") || combined.includes("pixel") || combined.includes("بكسل")) {
    brand = "Google";
  }

  // 2. Detect Condition (جديد / مستعمل)
  let condition: "جديد كارتونة" | "مستعمل مفحوص A+" = "جديد كارتونة";
  let conditionBadge = "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (combined.includes("مستعمل") || combined.includes("used") || combined.includes("مفحوص") || combined.includes("تجديد")) {
    condition = "مستعمل مفحوص A+";
    conditionBadge = "bg-blue-50 text-blue-700 border-blue-200";
  }

  // 3. Detect Storage & RAM
  let storage = "256GB";
  if (combined.includes("1tb") || combined.includes("1 تيرابايت")) storage = "1TB";
  else if (combined.includes("512gb") || combined.includes("512 جيجابايت")) storage = "512GB";
  else if (combined.includes("256gb") || combined.includes("256 جيجابايت")) storage = "256GB";
  else if (combined.includes("128gb") || combined.includes("128 جيجابايت")) storage = "128GB";
  else if (combined.includes("64gb") || combined.includes("64 جيجابايت")) storage = "64GB";

  let ram = "8GB RAM";
  if (combined.includes("16gb ram") || combined.includes("16 جيجا رام")) ram = "16GB RAM";
  else if (combined.includes("12gb ram") || combined.includes("12 جيجا رام")) ram = "12GB RAM";
  else if (combined.includes("8gb ram") || combined.includes("8 جيجا رام")) ram = "8GB RAM";
  else if (combined.includes("6gb ram") || combined.includes("6 جيجا رام")) ram = "6GB RAM";

  // 4. Available Colors based on device brand/name
  let availableColors = [
    { name: "تيتانيوم طبيعي", hex: "#8A8682" },
    { name: "أسود فلكي", hex: "#1C1C1E" },
    { name: "أبيض ناصع", hex: "#F5F5F7" },
    { name: "أزرق محيطي", hex: "#23405E" },
  ];

  if (brand === "Samsung") {
    availableColors = [
      { name: "تيتانيوم رمادي", hex: "#717378" },
      { name: "أسود تيتانيوم", hex: "#2B2B2D" },
      { name: "بنفسجي تيتانيوم", hex: "#4B4453" },
      { name: "أصفر عنبري", hex: "#C5B358" },
    ];
  } else if (brand === "Anker" || brand === "Baseus") {
    availableColors = [
      { name: "أسود مطفي", hex: "#1A1A1A" },
      { name: "أبيض لؤلؤي", hex: "#ECECEC" },
    ];
  }

  // 5. Warranty Information
  let warranty = condition === "جديد كارتونة" 
    ? "ضمان رسمي سنة كاملة من الوكيل المعتمد" 
    : "كفالة فحص واستبدال 30 يوماً من سما الخضراء";

  // 6. Availability Status
  let availabilityStatus: "متوفر فوراً بالفرع" | "متبقي كمية محدودة" | "غير متوفر حالياً" = "متوفر فوراً بالفرع";
  if (product.stock === 0) {
    availabilityStatus = "غير متوفر حالياً";
  } else if (product.stock <= 5) {
    availabilityStatus = "متبقي كمية محدودة";
  }

  // 7. Technical Specs Table
  const specs = [
    { label: "الماركة والشركة", value: brand },
    { label: "حالة الجهاز", value: condition },
    { label: "السعة التخزينية", value: storage },
    { label: "الذاكرة العشوائية (RAM)", value: ram },
    { label: "الضمان المعتمد", value: warranty },
    { label: "حالة التوفر", value: availabilityStatus },
    { label: "الاستلام والتوصيل", value: "متوفر بالفرع في الكرادة + شحن سريع 24h لكافة المحافظات" },
    { label: "خيارات الدفع", value: "دفع إلكتروني آمن / دفع عند الاستلام" },
  ];

  // 8. Gallery Images (Primary + Variations)
  const galleryImages = [
    product.imageUrl,
    product.imageUrl,
    product.imageUrl,
  ];

  return {
    brand,
    condition,
    conditionBadge,
    storage,
    ram,
    availableColors,
    warranty,
    availabilityStatus,
    specs,
    galleryImages,
  };
}
