"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Flame,
  Image as ImageIcon,
  Settings,
  User,
  LogOut,
  Store,
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Eye,
  EyeOff,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Sparkles,
  DollarSign,
  Tag,
  Clock,
  MapPin,
  Phone,
  MessageCircle,
  Save,
  Lock,
  Layers,
  ShoppingBag,
  SlidersHorizontal,
  TrendingDown,
  Info,
} from "lucide-react";
import { AdminImageUploader } from "@/components/admin-image-uploader";

type AdminTab = "overview" | "products" | "categories" | "deals" | "banners" | "settings" | "account";

export default function AdminControlPanel() {
  const router = useRouter();

  // Navigation State
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Admin Info
  const [adminUser, setAdminUser] = useState<any | null>(null);

  // Stats State
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    availableProducts: 0,
    outOfStockProducts: 0,
    limitedStockProducts: 0,
    discountedProducts: 0,
  });
  const [lowStockItems, setLowStockItems] = useState<any[]>([]);

  // Products State
  const [products, setProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortOption, setSortOption] = useState("newest");

  // Categories State
  const [categories, setCategories] = useState<any[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  // Deals State
  const [deals, setDeals] = useState<any[]>([]);
  const [loadingDeals, setLoadingDeals] = useState(false);

  // Banners State
  const [banners, setBanners] = useState<any[]>([]);
  const [loadingBanners, setLoadingBanners] = useState(false);

  // Settings State
  const [settings, setSettings] = useState<Record<string, string>>({
    store_name: "سما الخضراء للهواتف",
    store_slogan: "متجر الهواتف الأول في بغداد • كاش، صيانة، وضمان رسمي",
    store_description: "متجر سما الخضراء: أحدث أجهزة iPhone وسامسونج الأصلية، شواحن وبنوك طاقة، ورشة صيانة فورية معتمدة.",
    primary_phone: "0770 123 4567",
    whatsapp_number: "9647701234567",
    store_address: "بغداد - الكرادة، ساحة الواثق، مجاور مصرف الرافدين",
    working_hours: "يومياً من الساعة 9:00 صباحاً حتى 11:00 مساءً",
    facebook_url: "https://facebook.com/sama.alkhadraa.phones",
    instagram_url: "https://instagram.com/sama.alkhadraa.phones",
    tiktok_url: "https://tiktok.com/@sama.alkhadraa",
    telegram_url: "https://t.me/sama_alkhadraa",
  });
  const [savingSettings, setSavingSettings] = useState(false);

  // Password State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [changingPassword, setChangingPassword] = useState(false);

  // Modals
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [productForm, setProductForm] = useState({
    name: "",
    categoryId: "",
    price: "",
    originalPrice: "",
    stock: "10",
    availabilityStatus: "AVAILABLE",
    imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02560?w=600",
    description: "",
    specs: {} as Record<string, string>,
    isActive: true,
  });

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any | null>(null);
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02560?w=600",
    icon: "",
    order: "0",
    isActive: true,
  });

  const [isDealModalOpen, setIsDealModalOpen] = useState(false);
  const [dealForm, setDealForm] = useState({
    productId: "",
    newPrice: "",
    originalPrice: "",
  });

  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<any | null>(null);
  const [bannerForm, setBannerForm] = useState({
    title: "",
    tag: "",
    offerBadge: "",
    imageUrl: "",
    targetHref: "/category/all",
    order: "0",
    isActive: true,
  });

  // Confirm Delete Dialog
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => Promise<void>;
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: async () => {},
  });

  // Toast Notification State
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error" | "info";
  }>({
    show: false,
    message: "",
    type: "info",
  });

  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 3500);
  };

  // Fetch Current Admin Info
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.user) {
          setAdminUser(data.user);
        }
      })
      .catch(() => {});
  }, []);

  // Fetch Stats
  const loadStats = async () => {
    try {
      const res = await fetch("/api/admin/stats");
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
        setLowStockItems(data.lowStockItems || []);
      }
    } catch (e) {
      console.error("Failed to load stats:", e);
    }
  };

  // Fetch Products
  const loadProducts = async () => {
    try {
      setLoadingProducts(true);
      let url = `/api/admin/products?sort=${encodeURIComponent(sortOption)}`;
      if (searchQuery.trim()) url += `&search=${encodeURIComponent(searchQuery.trim())}`;
      if (categoryFilter !== "all") url += `&categoryId=${encodeURIComponent(categoryFilter)}`;
      if (statusFilter !== "all") url += `&status=${encodeURIComponent(statusFilter)}`;
      if (activeFilter !== "all") url += `&isActive=${encodeURIComponent(activeFilter)}`;

      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setProducts(data.products || []);
      }
    } catch (e) {
      console.error("Failed to load products:", e);
      showToast("فشل تحميل المنتجات", "error");
    } finally {
      setLoadingProducts(false);
    }
  };

  // Fetch Categories
  const loadCategories = async () => {
    try {
      setLoadingCategories(true);
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      if (data.success) {
        setCategories(data.categories || []);
      }
    } catch (e) {
      console.error("Failed to load categories:", e);
    } finally {
      setLoadingCategories(false);
    }
  };

  // Fetch Deals
  const loadDeals = async () => {
    try {
      setLoadingDeals(true);
      const res = await fetch("/api/admin/deals");
      const data = await res.json();
      if (data.success) {
        setDeals(data.deals || []);
      }
    } catch (e) {
      console.error("Failed to load deals:", e);
    } finally {
      setLoadingDeals(false);
    }
  };

  // Fetch Banners
  const loadBanners = async () => {
    try {
      setLoadingBanners(true);
      const res = await fetch("/api/admin/banners");
      const data = await res.json();
      if (data.success) {
        setBanners(data.banners || []);
      }
    } catch (e) {
      console.error("Failed to load banners:", e);
    } finally {
      setLoadingBanners(false);
    }
  };

  // Fetch Settings
  const loadSettings = async () => {
    try {
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      if (data.success && data.settings) {
        setSettings((prev) => ({ ...prev, ...data.settings }));
      }
    } catch (e) {
      console.error("Failed to load settings:", e);
    }
  };

  // Initial Data Load
  useEffect(() => {
    loadStats();
    loadCategories();
  }, []);

  // Reload data on tab change
  useEffect(() => {
    if (activeTab === "overview") loadStats();
    if (activeTab === "products") loadProducts();
    if (activeTab === "categories") loadCategories();
    if (activeTab === "deals") loadDeals();
    if (activeTab === "banners") loadBanners();
    if (activeTab === "settings") loadSettings();
  }, [activeTab]);

  // Reload products when search/filter/sort changes
  useEffect(() => {
    if (activeTab === "products") {
      const debounce = setTimeout(() => {
        loadProducts();
      }, 250);
      return () => clearTimeout(debounce);
    }
  }, [searchQuery, categoryFilter, statusFilter, activeFilter, sortOption]);

  // Handle Logout
  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
      showToast("تم تسجيل الخروج بنجاح", "info");
      setTimeout(() => {
        router.push("/admin/login");
      }, 500);
    } catch (e) {
      router.push("/admin/login");
    }
  };

  // ----------------------------------------------------
  // Product Actions
  // ----------------------------------------------------
  const openAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: "",
      categoryId: categories[0]?.id || "",
      price: "",
      originalPrice: "",
      stock: "10",
      availabilityStatus: "AVAILABLE",
      imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02560?w=600",
      description: "",
      specs: {},
      isActive: true,
    });
    setIsProductModalOpen(true);
  };

  const openEditProduct = (p: any) => {
    setEditingProduct(p);
    let parsedSpecs: Record<string, string> = {};
    if (p.specs) {
      try {
        parsedSpecs = typeof p.specs === "string" ? JSON.parse(p.specs) : p.specs;
      } catch (e) {
        parsedSpecs = {};
      }
    }

    setProductForm({
      name: p.name,
      categoryId: p.categoryId || "",
      price: String(p.price),
      originalPrice: p.originalPrice ? String(p.originalPrice) : "",
      stock: String(p.stock),
      availabilityStatus: p.availabilityStatus || "AVAILABLE",
      imageUrl: p.imageUrl,
      description: p.description || "",
      specs: parsedSpecs,
      isActive: p.isActive,
    });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name.trim() || !productForm.price) {
      showToast("يرجى إدخال اسم المنتج والسعر", "error");
      return;
    }

    try {
      const url = editingProduct
        ? `/api/admin/products/${editingProduct.id}`
        : `/api/admin/products`;
      const method = editingProduct ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productForm),
      });
      const data = await res.json();

      if (data.success) {
        showToast(data.message || "تم حفظ المنتج بنجاح", "success");
        setIsProductModalOpen(false);
        loadProducts();
        loadStats();
      } else {
        showToast(data.error || "فشل حفظ المنتج", "error");
      }
    } catch (e) {
      showToast("حدث خطأ في الاتصال بالخادم", "error");
    }
  };

  const handleToggleProductActive = async (p: any) => {
    try {
      const res = await fetch(`/api/admin/products/${p.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !p.isActive }),
      });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) =>
          prev.map((item) => (item.id === p.id ? { ...item, isActive: !p.isActive } : item))
        );
        showToast(
          p.isActive ? "تم إيقاف ظهور المنتج في المتجر" : "تم تفعيل ظهور المنتج في المتجر",
          "info"
        );
      }
    } catch (e) {
      showToast("فشل تحديث حالة المنتج", "error");
    }
  };

  const handleDeleteProduct = (p: any) => {
    setDeleteDialog({
      isOpen: true,
      title: "تأكيد حذف المنتج",
      message: `هل أنت متأكد من رغبتك في حذف المنتج «${p.name}»؟ لا يمكن التراجع عن هذه الخطوة.`,
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/admin/products/${p.id}`, { method: "DELETE" });
          const data = await res.json();
          if (data.success) {
            showToast("تم حذف المنتج بنجاح", "success");
            loadProducts();
            loadStats();
          } else {
            showToast(data.error || "فشل حذف المنتج", "error");
          }
        } catch (e) {
          showToast("حدث خطأ أثناء الحذف", "error");
        }
      },
    });
  };

  // ----------------------------------------------------
  // Category Actions
  // ----------------------------------------------------
  const openAddCategory = () => {
    setEditingCategory(null);
    setCategoryForm({
      name: "",
      image: "https://images.unsplash.com/photo-1511707171634-5f897ff02560?w=600",
      icon: "",
      order: String(categories.length + 1),
      isActive: true,
    });
    setIsCategoryModalOpen(true);
  };

  const openEditCategory = (c: any) => {
    setEditingCategory(c);
    setCategoryForm({
      name: c.name,
      image: c.image || "https://images.unsplash.com/photo-1511707171634-5f897ff02560?w=600",
      icon: c.icon || "",
      order: String(c.order || 0),
      isActive: c.isActive,
    });
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryForm.name.trim()) {
      showToast("يرجى إدخال اسم القسم", "error");
      return;
    }

    try {
      const url = editingCategory
        ? `/api/admin/categories/${editingCategory.id}`
        : `/api/admin/categories`;
      const method = editingCategory ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(categoryForm),
      });
      const data = await res.json();

      if (data.success) {
        showToast(data.message || "تم حفظ القسم بنجاح", "success");
        setIsCategoryModalOpen(false);
        loadCategories();
        loadStats();
      } else {
        showToast(data.error || "فشل حفظ القسم", "error");
      }
    } catch (e) {
      showToast("حدث خطأ في الاتصال بالخادم", "error");
    }
  };

  const handleDeleteCategory = (c: any) => {
    setDeleteDialog({
      isOpen: true,
      title: "تأكيد حذف القسم",
      message: `هل أنت متأكد من حذف القسم «${c.name}»؟ سيتم فك ارتباط أي منتجات بهذا القسم دون حذفها.`,
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/admin/categories/${c.id}`, { method: "DELETE" });
          const data = await res.json();
          if (data.success) {
            showToast("تم حذف القسم بنجاح", "success");
            loadCategories();
            loadStats();
          } else {
            showToast(data.error || "فشل حذف القسم", "error");
          }
        } catch (e) {
          showToast("حدث خطأ أثناء الحذف", "error");
        }
      },
    });
  };

  // ----------------------------------------------------
  // Deal Actions
  // ----------------------------------------------------
  const openAddDeal = () => {
    setDealForm({
      productId: products[0]?.id || "",
      newPrice: "",
      originalPrice: "",
    });
    setIsDealModalOpen(true);
  };

  const handleSaveDeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dealForm.productId || !dealForm.newPrice || !dealForm.originalPrice) {
      showToast("يرجى ملء جميع حقول العرض", "error");
      return;
    }

    try {
      const res = await fetch("/api/admin/deals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dealForm),
      });
      const data = await res.json();

      if (data.success) {
        showToast("تم تفعيل العرض بنجاح", "success");
        setIsDealModalOpen(false);
        loadDeals();
        loadStats();
      } else {
        showToast(data.error || "فشل تفعيل العرض", "error");
      }
    } catch (e) {
      showToast("حدث خطأ أثناء حفظ العرض", "error");
    }
  };

  const handleRemoveDeal = (productId: string, productName: string) => {
    setDeleteDialog({
      isOpen: true,
      title: "إلغاء العرض",
      message: `هل تريد إلغاء الخصم عن المنتج «${productName}» وإعادته إلى سعره الأصلي؟`,
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/admin/deals?productId=${encodeURIComponent(productId)}`, {
            method: "DELETE",
          });
          const data = await res.json();
          if (data.success) {
            showToast("تم إلغاء العرض بنجاح", "info");
            loadDeals();
            loadStats();
          } else {
            showToast(data.error || "فشل إلغاء العرض", "error");
          }
        } catch (e) {
          showToast("حدث خطأ أثناء إلغاء العرض", "error");
        }
      },
    });
  };

  // ----------------------------------------------------
  // Banner Actions
  // ----------------------------------------------------
  const openAddBanner = () => {
    setEditingBanner(null);
    setBannerForm({
      title: "",
      tag: "عرض الأسبوع",
      offerBadge: "ضمان رسمي معتمد",
      imageUrl: "",
      targetHref: "/category/all",
      order: String(banners.length + 1),
      isActive: true,
    });
    setIsBannerModalOpen(true);
  };

  const openEditBanner = (b: any) => {
    setEditingBanner(b);
    setBannerForm({
      title: b.title || "",
      tag: b.tag || "",
      offerBadge: b.offerBadge || "",
      imageUrl: b.imageUrl,
      targetHref: b.targetHref || "/category/all",
      order: String(b.order || 0),
      isActive: b.isActive,
    });
    setIsBannerModalOpen(true);
  };

  const handleSaveBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bannerForm.imageUrl) {
      showToast("يرجى رفع أو إدخال صورة البانر", "error");
      return;
    }

    try {
      const url = editingBanner
        ? `/api/admin/banners/${editingBanner.id}`
        : `/api/admin/banners`;
      const method = editingBanner ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bannerForm),
      });
      const data = await res.json();

      if (data.success) {
        showToast(data.message || "تم حفظ البانر بنجاح", "success");
        setIsBannerModalOpen(false);
        loadBanners();
      } else {
        showToast(data.error || "فشل حفظ البانر", "error");
      }
    } catch (e) {
      showToast("حدث خطأ أثناء حفظ البانر", "error");
    }
  };

  const handleDeleteBanner = (b: any) => {
    setDeleteDialog({
      isOpen: true,
      title: "تأكيد حذف البانر",
      message: `هل أنت متأكد من رغبتك في حذف هذا البانر؟`,
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/admin/banners/${b.id}`, { method: "DELETE" });
          const data = await res.json();
          if (data.success) {
            showToast("تم حذف البانر بنجاح", "success");
            loadBanners();
          } else {
            showToast(data.error || "فشل حذف البانر", "error");
          }
        } catch (e) {
          showToast("حدث خطأ أثناء الحذف", "error");
        }
      },
    });
  };

  // ----------------------------------------------------
  // Settings Actions
  // ----------------------------------------------------
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSavingSettings(true);
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("تم حفظ إعدادات المتجر بنجاح", "success");
      } else {
        showToast(data.error || "فشل حفظ الإعدادات", "error");
      }
    } catch (e) {
      showToast("حدث خطأ في الاتصال بالخادم", "error");
    } finally {
      setSavingSettings(false);
    }
  };

  // ----------------------------------------------------
  // Password Change Action
  // ----------------------------------------------------
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      showToast("يرجى إدخال كلمة المرور الحالية والجديدة", "error");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast("كلمة المرور الجديدة وتأكيدها غير متطابقين", "error");
      return;
    }

    try {
      setChangingPassword(true);
      const res = await fetch("/api/admin/auth/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("تم تغيير كلمة المرور بنجاح", "success");
        setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        showToast(data.error || "فشل تغيير كلمة المرور", "error");
      }
    } catch (e) {
      showToast("حدث خطأ في الاتصال بالخادم", "error");
    } finally {
      setChangingPassword(false);
    }
  };

  // Format Currency
  const formatIQD = (val: number) => {
    return new Intl.NumberFormat("ar-IQ").format(Math.round(val)) + " د.ع";
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col antialiased selection:bg-emerald-500 selection:text-white" dir="rtl">
      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300 pointer-events-none">
          <div
            className={`px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-black border backdrop-blur-md ${
              toast.type === "success"
                ? "bg-emerald-950/90 border-emerald-500/50 text-emerald-200"
                : toast.type === "error"
                ? "bg-rose-950/90 border-rose-500/50 text-rose-200"
                : "bg-slate-800/95 border-slate-600 text-slate-200"
            }`}
          >
            {toast.type === "success" && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
            {toast.type === "error" && <XCircle className="w-4 h-4 text-rose-400 shrink-0" />}
            {toast.type === "info" && <Info className="w-4 h-4 text-blue-400 shrink-0" />}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 lg:hidden"
            aria-label="القائمة"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-0.5 flex items-center justify-center shadow-lg shadow-emerald-900/30">
              <Image
                src="/images/sama-logo-emblem.png"
                alt="سما الخضراء"
                width={32}
                height={32}
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="text-sm font-black tracking-tight text-white flex items-center gap-1.5">
                <span>سما الخضراء</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-1.5 py-0.5 rounded-md border border-emerald-500/30">
                  لوحة المدير
                </span>
              </div>
              <div className="text-[10px] text-slate-400 font-medium hidden sm:block">
                لوحة التحكم الإدارية وإدارة المتجر
              </div>
            </div>
          </div>
        </div>

        {/* Right Header Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-colors border border-slate-700"
          >
            <Store className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">معاينة المتجر</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-bold transition-colors border border-rose-500/30"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">خروج</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex w-full max-w-7xl mx-auto">
        {/* Sidebar Navigation */}
        <aside
          className={`fixed inset-y-0 right-0 z-40 w-64 bg-slate-900 border-l border-slate-800 p-4 space-y-6 flex flex-col justify-between transition-transform duration-300 lg:static lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0 shadow-2xl" : "translate-x-full lg:translate-x-0"
          }`}
        >
          <div className="space-y-6">
            {/* Mobile Close Button */}
            <div className="flex items-center justify-between lg:hidden pb-3 border-b border-slate-800">
              <span className="text-xs font-black text-slate-300">أقسام لوحة التحكم</span>
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Links */}
            <nav className="space-y-1">
              {[
                { id: "overview", label: "الرئيسية والإحصائيات", icon: LayoutDashboard },
                { id: "products", label: "إدارة المنتجات", icon: Package },
                { id: "categories", label: "إدارة الأقسام", icon: FolderTree },
                { id: "deals", label: "إدارة العروض", icon: Flame },
                { id: "banners", label: "إدارة البانرات", icon: ImageIcon },
                { id: "settings", label: "إعدادات المتجر", icon: Settings },
                { id: "account", label: "حساب المدير", icon: User },
              ].map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setActiveTab(item.id as AdminTab);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-black transition-all ${
                      isActive
                        ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/40"
                        : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/70"
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-slate-400"}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Sidebar Footer */}
          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-800 space-y-1 text-center">
            <div className="text-[11px] font-black text-slate-200">
              {adminUser?.name || "المدير العام"}
            </div>
            <div className="text-[10px] text-slate-400 font-mono truncate">
              {adminUser?.email || "admin@store.com"}
            </div>
          </div>
        </aside>

        {/* Sidebar Backdrop on Mobile */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-30 bg-black/60 backdrop-blur-xs lg:hidden"
          />
        )}

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-x-hidden">
          {/* ==================================================== */}
          {/* 1. OVERVIEW / DASHBOARD TAB */}
          {/* ==================================================== */}
          {activeTab === "overview" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="text-xl font-black text-white">الرئيسية والإحصائيات 📊</h1>
                  <p className="text-xs text-slate-400 mt-0.5">
                    نظرة شاملة على حالة المنتجات والأقسام والمخزون في متجر سما الخضراء
                  </p>
                </div>
                <button
                  type="button"
                  onClick={loadStats}
                  className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
                  <span>تحديث البيانات</span>
                </button>
              </div>

              {/* Stat Cards Grid (6 Stats) */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                {/* 1. Total Products */}
                <div className="p-4 sm:p-5 rounded-3xl bg-slate-800/80 border border-slate-700/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400">إجمالي المنتجات</span>
                    <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                      <Package className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-white">{stats.totalProducts}</div>
                  <div className="text-[10px] text-slate-400">جميع المنتجات المسجلة في النظام</div>
                </div>

                {/* 2. Total Categories */}
                <div className="p-4 sm:p-5 rounded-3xl bg-slate-800/80 border border-slate-700/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400">إجمالي الأقسام</span>
                    <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                      <FolderTree className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-white">{stats.totalCategories}</div>
                  <div className="text-[10px] text-slate-400">أقسام المتجر المتاحة حالياً</div>
                </div>

                {/* 3. Available Products */}
                <div className="p-4 sm:p-5 rounded-3xl bg-slate-800/80 border border-slate-700/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400">المنتجات المتوفرة</span>
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-emerald-300">{stats.availableProducts}</div>
                  <div className="text-[10px] text-slate-400">جاهزة للشراء والإضافة للسلة</div>
                </div>

                {/* 4. Limited Stock Products */}
                <div className="p-4 sm:p-5 rounded-3xl bg-slate-800/80 border border-slate-700/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400">كمية محدودة (≤ 5)</span>
                    <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-amber-300">{stats.limitedStockProducts}</div>
                  <div className="text-[10px] text-slate-400">تحتاج إلى تزويد المخزون قريباً</div>
                </div>

                {/* 5. Out of Stock Products */}
                <div className="p-4 sm:p-5 rounded-3xl bg-slate-800/80 border border-slate-700/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-rose-400">غير متوفرة (نفدت)</span>
                    <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
                      <XCircle className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-rose-300">{stats.outOfStockProducts}</div>
                  <div className="text-[10px] text-slate-400">الكمية 0 أو معينة كغير متوفرة</div>
                </div>

                {/* 6. Discounted Products */}
                <div className="p-4 sm:p-5 rounded-3xl bg-slate-800/80 border border-slate-700/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-teal-400">المنتجات المخفضة 🔥</span>
                    <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center">
                      <Flame className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-teal-300">{stats.discountedProducts}</div>
                  <div className="text-[10px] text-slate-400">منتجات خاضعة لخصومات وعروض</div>
                </div>
              </div>

              {/* Quick Actions Shortcuts */}
              <div className="p-5 rounded-3xl bg-gradient-to-r from-slate-800 to-slate-800/60 border border-slate-700 space-y-3">
                <div className="text-xs font-black text-slate-200">إجراءات سريعة:</div>
                <div className="flex flex-wrap gap-2.5">
                  <button
                    type="button"
                    onClick={openAddProduct}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-900/30 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>إضافة منتج جديد</span>
                  </button>

                  <button
                    type="button"
                    onClick={openAddCategory}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold transition-colors"
                  >
                    <FolderTree className="w-4 h-4" />
                    <span>إضافة قسم جديد</span>
                  </button>

                  <button
                    type="button"
                    onClick={openAddDeal}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-amber-600/80 hover:bg-amber-500 text-white text-xs font-bold transition-colors"
                  >
                    <Flame className="w-4 h-4" />
                    <span>إنشاء عرض جديد</span>
                  </button>

                  <button
                    type="button"
                    onClick={openAddBanner}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-indigo-600/80 hover:bg-indigo-500 text-white text-xs font-bold transition-colors"
                  >
                    <ImageIcon className="w-4 h-4" />
                    <span>إضافة بانر إعلاني</span>
                  </button>
                </div>
              </div>

              {/* Low Stock Alerts Table */}
              {lowStockItems.length > 0 && (
                <div className="p-5 rounded-3xl bg-slate-800/80 border border-slate-700 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                      <h2 className="text-sm font-black text-white">تنبيهات المخزون (منتجات أوشكت على النفاد أو نفدت)</h2>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab("products");
                        setStatusFilter("LIMITED");
                      }}
                      className="text-xs text-emerald-400 hover:underline font-bold"
                    >
                      عرض جميع المنتجات المحدودة ↗
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-right text-xs">
                      <thead>
                        <tr className="border-b border-slate-700 text-slate-400 font-bold">
                          <th className="py-2.5 px-3">المنتج</th>
                          <th className="py-2.5 px-3">القسم</th>
                          <th className="py-2.5 px-3">السعر</th>
                          <th className="py-2.5 px-3">الكمية المتبقية</th>
                          <th className="py-2.5 px-3">الحالة</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-700/60">
                        {lowStockItems.map((item) => (
                          <tr key={item.id} className="hover:bg-slate-700/30 transition-colors">
                            <td className="py-2.5 px-3 font-bold text-white">{item.name}</td>
                            <td className="py-2.5 px-3 text-slate-400">{item.categoryName}</td>
                            <td className="py-2.5 px-3 font-mono font-bold text-emerald-300">
                              {formatIQD(item.price)}
                            </td>
                            <td className="py-2.5 px-3">
                              <span
                                className={`font-mono font-black px-2 py-0.5 rounded-md ${
                                  item.stock === 0
                                    ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                                    : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                                }`}
                              >
                                {item.stock} قطعة
                              </span>
                            </td>
                            <td className="py-2.5 px-3">
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  item.status === "OUT_OF_STOCK"
                                    ? "bg-rose-950 text-rose-300"
                                    : "bg-amber-950 text-amber-300"
                                }`}
                              >
                                {item.status === "OUT_OF_STOCK" ? "نفدت الكمية" : "كمية محدودة"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ==================================================== */}
          {/* 2. PRODUCTS TAB */}
          {/* ==================================================== */}
          {activeTab === "products" && (
            <div className="space-y-5 animate-in fade-in duration-300">
              {/* Header & Add Button */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="text-xl font-black text-white">إدارة المنتجات 📦</h1>
                  <p className="text-xs text-slate-400 mt-0.5">
                    إضافة، تعديل، حذف، تغيير الأسعار والمخزون وحالة التوفر
                  </p>
                </div>
                <button
                  type="button"
                  onClick={openAddProduct}
                  className="self-start sm:self-auto flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-lg shadow-emerald-900/30 transition-all active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>إضافة منتج جديد</span>
                </button>
              </div>

              {/* Filters & Search Bar */}
              <div className="p-4 rounded-3xl bg-slate-800/80 border border-slate-700 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
                  {/* Search */}
                  <div className="relative lg:col-span-2">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="ابحث بالاسم أو الوصف..."
                      className="w-full pr-9 pl-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white placeholder-slate-400"
                    />
                    <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>

                  {/* Category Filter */}
                  <div>
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="w-full py-2 px-3 text-xs rounded-xl bg-slate-900 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-200 cursor-pointer"
                    >
                      <option value="all">جميع الأقسام</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Availability Status Filter */}
                  <div>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full py-2 px-3 text-xs rounded-xl bg-slate-900 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-200 cursor-pointer"
                    >
                      <option value="all">كل حالات التوفر</option>
                      <option value="AVAILABLE">متوفر</option>
                      <option value="LIMITED">كمية محدودة</option>
                      <option value="OUT_OF_STOCK">غير متوفر</option>
                      <option value="COMING_SOON">سيتوفر قريبًا</option>
                    </select>
                  </div>

                  {/* Sort Filter */}
                  <div>
                    <select
                      value={sortOption}
                      onChange={(e) => setSortOption(e.target.value)}
                      className="w-full py-2 px-3 text-xs rounded-xl bg-slate-900 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-200 cursor-pointer"
                    >
                      <option value="newest">الأحدث وصولاً</option>
                      <option value="oldest">الأقدم</option>
                      <option value="price-asc">الأقل سعراً</option>
                      <option value="price-desc">الأعلى سعراً</option>
                      <option value="stock-asc">الأقل مخزوناً</option>
                      <option value="stock-desc">الأكثر مخزوناً</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Products Table */}
              <div className="p-4 rounded-3xl bg-slate-800/80 border border-slate-700 overflow-hidden">
                {loadingProducts ? (
                  <div className="py-16 text-center text-slate-400 text-xs font-bold">
                    جاري تحميل المنتجات...
                  </div>
                ) : products.length === 0 ? (
                  <div className="py-16 text-center space-y-2">
                    <Package className="w-10 h-10 text-slate-600 mx-auto" />
                    <div className="text-sm font-black text-slate-300">لا توجد منتجات مطابقة للبحث أو الفلتر</div>
                    <div className="text-xs text-slate-500">جرب تغيير كلمات البحث أو مسح الفلاتر</div>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-right text-xs">
                      <thead>
                        <tr className="border-b border-slate-700 text-slate-400 font-bold">
                          <th className="py-3 px-3">المنتج</th>
                          <th className="py-3 px-3">القسم</th>
                          <th className="py-3 px-3">السعر الحالي</th>
                          <th className="py-3 px-3">السعر السابق</th>
                          <th className="py-3 px-3">المخزون</th>
                          <th className="py-3 px-3">حالة التوفر</th>
                          <th className="py-3 px-3 text-center">الظهور في المتجر</th>
                          <th className="py-3 px-3 text-center">الإجراءات</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-700/60">
                        {products.map((p) => {
                          return (
                            <tr key={p.id} className="hover:bg-slate-700/30 transition-colors">
                              {/* Product Info */}
                              <td className="py-3 px-3">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-900 border border-slate-700 shrink-0 relative">
                                    <img
                                      src={p.imageUrl}
                                      alt={p.name}
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        (e.target as HTMLImageElement).src =
                                          "https://images.unsplash.com/photo-1511707171634-5f897ff02560?w=200";
                                      }}
                                    />
                                  </div>
                                  <div className="max-w-[220px]">
                                    <div className="font-black text-white truncate" title={p.name}>
                                      {p.name}
                                    </div>
                                    <div className="text-[10px] text-slate-400 font-mono">
                                      ID: {p.id}
                                    </div>
                                  </div>
                                </div>
                              </td>

                              {/* Category */}
                              <td className="py-3 px-3 text-slate-300 font-medium">
                                {p.categoryRel?.name || "بدون قسم"}
                              </td>

                              {/* Price */}
                              <td className="py-3 px-3 font-mono font-black text-emerald-300">
                                {formatIQD(p.price)}
                              </td>

                              {/* Old Price */}
                              <td className="py-3 px-3 font-mono text-slate-400">
                                {p.originalPrice ? (
                                  <span className="line-through text-rose-400/80">
                                    {formatIQD(p.originalPrice)}
                                  </span>
                                ) : (
                                  "—"
                                )}
                              </td>

                              {/* Stock */}
                              <td className="py-3 px-3 font-mono font-bold">
                                <span
                                  className={`px-2 py-0.5 rounded-md ${
                                    p.stock === 0
                                      ? "bg-rose-500/20 text-rose-300"
                                      : p.stock <= 5
                                      ? "bg-amber-500/20 text-amber-300"
                                      : "text-slate-200"
                                  }`}
                                >
                                  {p.stock}
                                </span>
                              </td>

                              {/* Availability Status */}
                              <td className="py-3 px-3">
                                <span
                                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                    p.availabilityStatus === "AVAILABLE"
                                      ? "bg-emerald-950 text-emerald-300 border border-emerald-500/30"
                                      : p.availabilityStatus === "LIMITED"
                                      ? "bg-amber-950 text-amber-300 border border-amber-500/30"
                                      : p.availabilityStatus === "OUT_OF_STOCK"
                                      ? "bg-rose-950 text-rose-300 border border-rose-500/30"
                                      : "bg-blue-950 text-blue-300 border border-blue-500/30"
                                  }`}
                                >
                                  {p.availabilityStatus === "AVAILABLE"
                                    ? "متوفر"
                                    : p.availabilityStatus === "LIMITED"
                                    ? "كمية محدودة"
                                    : p.availabilityStatus === "OUT_OF_STOCK"
                                    ? "غير متوفر"
                                    : "سيتوفر قريبًا"}
                                </span>
                              </td>

                              {/* Active Toggle */}
                              <td className="py-3 px-3 text-center">
                                <button
                                  type="button"
                                  onClick={() => handleToggleProductActive(p)}
                                  className={`p-1 rounded-full transition-colors ${
                                    p.isActive
                                      ? "text-emerald-400 hover:text-emerald-300"
                                      : "text-slate-600 hover:text-slate-400"
                                  }`}
                                  title={p.isActive ? "مفعل في المتجر (اضغط للإيقاف)" : "معطل (اضغط للتفعيل)"}
                                >
                                  {p.isActive ? (
                                    <CheckCircle2 className="w-5 h-5 fill-emerald-500/20" />
                                  ) : (
                                    <XCircle className="w-5 h-5 fill-slate-800" />
                                  )}
                                </button>
                              </td>

                              {/* Actions */}
                              <td className="py-3 px-3 text-center">
                                <div className="flex items-center justify-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => openEditProduct(p)}
                                    className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 hover:text-white transition-colors"
                                    title="تعديل المنتج"
                                  >
                                    <Edit className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteProduct(p)}
                                    className="p-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 hover:text-rose-300 transition-colors"
                                    title="حذف المنتج"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* 3. CATEGORIES TAB */}
          {/* ==================================================== */}
          {activeTab === "categories" && (
            <div className="space-y-5 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="text-xl font-black text-white">إدارة أقسام المتجر 🗂️</h1>
                  <p className="text-xs text-slate-400 mt-0.5">
                    إضافة أقسام، تعديل الأسماء، ترتيب الأقسام، وحذفها
                  </p>
                </div>
                <button
                  type="button"
                  onClick={openAddCategory}
                  className="self-start sm:self-auto flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-lg shadow-emerald-900/30 transition-all active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>إضافة قسم جديد</span>
                </button>
              </div>

              {/* Categories Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((c) => (
                  <div
                    key={c.id}
                    className="p-4 rounded-3xl bg-slate-800/80 border border-slate-700/80 space-y-3 hover:border-slate-600 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl overflow-hidden bg-slate-900 border border-slate-700 shrink-0">
                        <img
                          src={c.image || "https://images.unsplash.com/photo-1511707171634-5f897ff02560?w=300"}
                          alt={c.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-black text-sm text-white truncate">{c.name}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {c.productsCount || 0} منتج مسجل
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => openEditCategory(c)}
                          className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors"
                          title="تعديل القسم"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteCategory(c)}
                          className="p-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 transition-colors"
                          title="حذف القسم"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
                      <span>الترتيب: {c.order || 0}</span>
                      <span className={c.isActive ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>
                        {c.isActive ? "مفعل في المتجر" : "معطل"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* 4. DEALS & OFFERS TAB */}
          {/* ==================================================== */}
          {activeTab === "deals" && (
            <div className="space-y-5 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="text-xl font-black text-white">إدارة العروض والتخفيضات 🔥</h1>
                  <p className="text-xs text-slate-400 mt-0.5">
                    تحديد المنتجات المخفضة، إظهار نسبة الخصم وتحديث الأسعار الترويجية
                  </p>
                </div>
                <button
                  type="button"
                  onClick={openAddDeal}
                  className="self-start sm:self-auto flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-black shadow-lg shadow-amber-900/30 transition-all active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>تفعيل عرض على منتج</span>
                </button>
              </div>

              {/* Deals Table */}
              <div className="p-4 rounded-3xl bg-slate-800/80 border border-slate-700 overflow-hidden">
                {loadingDeals ? (
                  <div className="py-16 text-center text-slate-400 text-xs font-bold">
                    جاري تحميل العروض...
                  </div>
                ) : deals.length === 0 ? (
                  <div className="py-16 text-center space-y-2">
                    <Flame className="w-10 h-10 text-slate-600 mx-auto" />
                    <div className="text-sm font-black text-slate-300">لا توجد عروض أو خصومات مفعلة حالياً</div>
                    <div className="text-xs text-slate-500">اضغط على زر «تفعيل عرض على منتج» لإضافة خصم</div>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-right text-xs">
                      <thead>
                        <tr className="border-b border-slate-700 text-slate-400 font-bold">
                          <th className="py-3 px-3">المنتج</th>
                          <th className="py-3 px-3">القسم</th>
                          <th className="py-3 px-3">السعر الأصلي</th>
                          <th className="py-3 px-3">سعر العرض</th>
                          <th className="py-3 px-3">مقدار الخصم</th>
                          <th className="py-3 px-3">نسبة الخصم</th>
                          <th className="py-3 px-3 text-center">إلغاء العرض</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-700/60">
                        {deals.map((d) => (
                          <tr key={d.id} className="hover:bg-slate-700/30 transition-colors">
                            <td className="py-3 px-3">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-900 border border-slate-700 shrink-0">
                                  <img src={d.imageUrl} alt={d.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="font-bold text-white max-w-[220px] truncate">{d.name}</div>
                              </div>
                            </td>
                            <td className="py-3 px-3 text-slate-300">{d.categoryName}</td>
                            <td className="py-3 px-3 font-mono text-slate-400 line-through">
                              {formatIQD(d.originalPrice || d.price)}
                            </td>
                            <td className="py-3 px-3 font-mono font-black text-emerald-300">
                              {formatIQD(d.price)}
                            </td>
                            <td className="py-3 px-3 font-mono font-bold text-amber-300">
                              {formatIQD(d.discountAmount)}
                            </td>
                            <td className="py-3 px-3">
                              <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold font-mono">
                                {d.discountPercent}% خصم
                              </span>
                            </td>
                            <td className="py-3 px-3 text-center">
                              <button
                                type="button"
                                onClick={() => handleRemoveDeal(d.id, d.name)}
                                className="px-2.5 py-1 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 text-xs font-bold transition-colors"
                              >
                                إلغاء الخصم
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* 5. BANNERS TAB */}
          {/* ==================================================== */}
          {activeTab === "banners" && (
            <div className="space-y-5 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="text-xl font-black text-white">إدارة البانرات الإعلانية 🖼️</h1>
                  <p className="text-xs text-slate-400 mt-0.5">
                    التحكم في البانرات المتحركة المعروضة في واجهة المتجر الرئيسية
                  </p>
                </div>
                <button
                  type="button"
                  onClick={openAddBanner}
                  className="self-start sm:self-auto flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-lg shadow-emerald-900/30 transition-all active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>إضافة بانر جديد</span>
                </button>
              </div>

              {/* Banners List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {banners.map((b) => (
                  <div
                    key={b.id}
                    className="rounded-3xl bg-slate-800/80 border border-slate-700/80 overflow-hidden space-y-3"
                  >
                    {/* Banner Image Preview */}
                    <div className="h-36 sm:h-44 w-full bg-slate-950 relative overflow-hidden">
                      <img src={b.imageUrl} alt={b.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex flex-col justify-end p-4">
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-md self-start mb-1">
                          {b.tag || "بانر إعلاني"}
                        </span>
                        <h3 className="text-sm font-black text-white">{b.title || "بدون عنوان"}</h3>
                        <p className="text-[11px] text-slate-300">{b.offerBadge}</p>
                      </div>
                    </div>

                    <div className="p-4 pt-1 space-y-3">
                      <div className="text-[11px] text-slate-400 flex items-center justify-between">
                        <span>الرابط: <code className="text-slate-200 font-mono">{b.targetHref}</code></span>
                        <span>الترتيب: {b.order}</span>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-700">
                        <span className={b.isActive ? "text-emerald-400 text-xs font-bold" : "text-rose-400 text-xs font-bold"}>
                          {b.isActive ? "مفعل في الواجهة" : "معطل"}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => openEditBanner(b)}
                            className="px-3 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-xs font-bold text-white transition-colors"
                          >
                            تعديل
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteBanner(b)}
                            className="px-3 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-xs font-bold text-rose-400 transition-colors"
                          >
                            حذف
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* 6. SETTINGS TAB */}
          {/* ==================================================== */}
          {activeTab === "settings" && (
            <div className="space-y-5 animate-in fade-in duration-300 max-w-4xl">
              <div>
                <h1 className="text-xl font-black text-white">إعدادات المتجر ⚙️</h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  تعديل اسم المتجر، الشعار، أرقام التواصل، العنوان، وروابط الشبكات الاجتماعية
                </p>
              </div>

              <form onSubmit={handleSaveSettings} className="p-6 rounded-3xl bg-slate-800/80 border border-slate-700 space-y-5">
                {/* Store Basic Info */}
                <div className="space-y-4">
                  <h3 className="text-xs font-black text-emerald-400 uppercase tracking-wider">
                    المعلومات الأساسية للمتجر
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">اسم المتجر</label>
                      <input
                        type="text"
                        value={settings.store_name || ""}
                        onChange={(e) => setSettings({ ...settings, store_name: e.target.value })}
                        className="w-full py-2.5 px-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">الشعار اللفظي (Slogan)</label>
                      <input
                        type="text"
                        value={settings.store_slogan || ""}
                        onChange={(e) => setSettings({ ...settings, store_slogan: e.target.value })}
                        className="w-full py-2.5 px-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">وصف المتجر</label>
                    <textarea
                      rows={3}
                      value={settings.store_description || ""}
                      onChange={(e) => setSettings({ ...settings, store_description: e.target.value })}
                      className="w-full py-2.5 px-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {/* Contact & Location */}
                <div className="space-y-4 pt-4 border-t border-slate-700">
                  <h3 className="text-xs font-black text-emerald-400 uppercase tracking-wider">
                    بيانات الاتصال والعنوان
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">رقم الهاتف الرئيسي</label>
                      <input
                        type="text"
                        value={settings.primary_phone || ""}
                        onChange={(e) => setSettings({ ...settings, primary_phone: e.target.value })}
                        className="w-full py-2.5 px-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-mono text-left focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        dir="ltr"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">رقم WhatsApp (بدون +)</label>
                      <input
                        type="text"
                        value={settings.whatsapp_number || ""}
                        onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
                        className="w-full py-2.5 px-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-mono text-left focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        dir="ltr"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">عنوان المتجر</label>
                    <input
                      type="text"
                      value={settings.store_address || ""}
                      onChange={(e) => setSettings({ ...settings, store_address: e.target.value })}
                      className="w-full py-2.5 px-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">أوقات وساعات العمل</label>
                    <input
                      type="text"
                      value={settings.working_hours || ""}
                      onChange={(e) => setSettings({ ...settings, working_hours: e.target.value })}
                      className="w-full py-2.5 px-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {/* Social Channels */}
                <div className="space-y-4 pt-4 border-t border-slate-700">
                  <h3 className="text-xs font-black text-emerald-400 uppercase tracking-wider">
                    روابط التواصل الاجتماعي
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">Facebook</label>
                      <input
                        type="url"
                        value={settings.facebook_url || ""}
                        onChange={(e) => setSettings({ ...settings, facebook_url: e.target.value })}
                        className="w-full py-2.5 px-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-mono text-left focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        dir="ltr"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">Instagram</label>
                      <input
                        type="url"
                        value={settings.instagram_url || ""}
                        onChange={(e) => setSettings({ ...settings, instagram_url: e.target.value })}
                        className="w-full py-2.5 px-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-mono text-left focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        dir="ltr"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">TikTok</label>
                      <input
                        type="url"
                        value={settings.tiktok_url || ""}
                        onChange={(e) => setSettings({ ...settings, tiktok_url: e.target.value })}
                        className="w-full py-2.5 px-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-mono text-left focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        dir="ltr"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">Telegram</label>
                      <input
                        type="url"
                        value={settings.telegram_url || ""}
                        onChange={(e) => setSettings({ ...settings, telegram_url: e.target.value })}
                        className="w-full py-2.5 px-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-mono text-left focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        dir="ltr"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-700 flex justify-end">
                  <button
                    type="submit"
                    disabled={savingSettings}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-lg shadow-emerald-900/30 transition-all active:scale-95 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{savingSettings ? "جاري الحفظ..." : "حفظ التعديلات"}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ==================================================== */}
          {/* 7. ACCOUNT TAB */}
          {/* ==================================================== */}
          {activeTab === "account" && (
            <div className="space-y-5 animate-in fade-in duration-300 max-w-2xl">
              <div>
                <h1 className="text-xl font-black text-white">حساب المدير العام 👤</h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  إدارة بيانات تسجيل الدخول وتغيير كلمة المرور
                </p>
              </div>

              {/* Profile Card */}
              <div className="p-6 rounded-3xl bg-slate-800/80 border border-slate-700 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-black text-xl">
                    {adminUser?.name?.charAt(0) || "M"}
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white">{adminUser?.name || "المدير العام"}</h3>
                    <div className="text-xs text-slate-400 font-mono mt-0.5">{adminUser?.email || "admin@store.com"}</div>
                    <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-md border border-emerald-500/30 mt-1 inline-block">
                      صلاحية كاملة: {adminUser?.role || "ADMIN"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Change Password Form */}
              <form onSubmit={handleChangePassword} className="p-6 rounded-3xl bg-slate-800/80 border border-slate-700 space-y-4">
                <div className="flex items-center gap-2 text-xs font-black text-emerald-400">
                  <Lock className="w-4 h-4" />
                  <span>تغيير كلمة المرور</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">كلمة المرور الحالية</label>
                  <input
                    type="password"
                    required
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">كلمة المرور الجديدة</label>
                    <input
                      type="password"
                      required
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      className="w-full py-2.5 px-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">تأكيد كلمة المرور الجديدة</label>
                    <input
                      type="password"
                      required
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      className="w-full py-2.5 px-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={changingPassword}
                    className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black transition-all active:scale-95 disabled:opacity-50"
                  >
                    {changingPassword ? "جاري التغيير..." : "تحديث كلمة المرور"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>

      {/* ==================================================== */}
      {/* MODAL: ADD / EDIT PRODUCT */}
      {/* ==================================================== */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm sm:text-base font-black text-white">
                  {editingProduct ? "تعديل بيانات المنتج" : "إضافة منتج جديد للمتجر"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsProductModalOpen(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveProduct} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {/* Product Name */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  اسم المنتج <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="مثال: آيفون 16 برو ماكس 256GB تيتانيوم"
                  className="w-full py-2.5 px-3 rounded-2xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                />
              </div>

              {/* Category & Availability Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">القسم</label>
                  <select
                    value={productForm.categoryId}
                    onChange={(e) => setProductForm({ ...productForm, categoryId: e.target.value })}
                    className="w-full py-2.5 px-3 rounded-2xl bg-slate-800 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                  >
                    <option value="">بدون قسم</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">حالة التوفر</label>
                  <select
                    value={productForm.availabilityStatus}
                    onChange={(e) => setProductForm({ ...productForm, availabilityStatus: e.target.value })}
                    className="w-full py-2.5 px-3 rounded-2xl bg-slate-800 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                  >
                    <option value="AVAILABLE">متوفر (جاهز للشراء)</option>
                    <option value="LIMITED">كمية محدودة</option>
                    <option value="OUT_OF_STOCK">غير متوفر (نفد)</option>
                    <option value="COMING_SOON">سيتوفر قريبًا</option>
                  </select>
                </div>
              </div>

              {/* Price, Old Price & Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    السعر بالدينار العراقي (IQD) <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    placeholder="1850000"
                    className="w-full py-2.5 px-3 rounded-2xl bg-slate-800 border border-slate-700 text-xs text-white font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    السعر السابق (في حال وجود خصم)
                  </label>
                  <input
                    type="number"
                    value={productForm.originalPrice}
                    onChange={(e) => setProductForm({ ...productForm, originalPrice: e.target.value })}
                    placeholder="2000000"
                    className="w-full py-2.5 px-3 rounded-2xl bg-slate-800 border border-slate-700 text-xs text-white font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">الكمية في المخزون</label>
                  <input
                    type="number"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                    className="w-full py-2.5 px-3 rounded-2xl bg-slate-800 border border-slate-700 text-xs text-white font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Image Uploader */}
              <AdminImageUploader
                label="صورة المنتج الرئيسية"
                value={productForm.imageUrl}
                onChange={(url) => setProductForm({ ...productForm, imageUrl: url })}
                required
              />

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">وصف المنتج</label>
                <textarea
                  rows={3}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  placeholder="وصف تفصيلي عن مواصفات ومزايا الجهاز والضمان المرفق..."
                  className="w-full py-2.5 px-3 rounded-2xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Active Switch */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="prod-is-active"
                  checked={productForm.isActive}
                  onChange={(e) => setProductForm({ ...productForm, isActive: e.target.checked })}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 bg-slate-800 border-slate-700 cursor-pointer"
                />
                <label htmlFor="prod-is-active" className="text-xs font-bold text-slate-300 cursor-pointer">
                  تفعيل ظهور المنتج فوراً في تطبيق المتجر للعملاء
                </label>
              </div>

              {/* Modal Actions */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-xs font-black text-white shadow-lg shadow-emerald-900/40 transition-all active:scale-95"
                >
                  {editingProduct ? "حفظ التعديلات" : "إضافة المنتج الآن"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL: ADD / EDIT CATEGORY */}
      {/* ==================================================== */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FolderTree className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-black text-white">
                  {editingCategory ? "تعديل القسم" : "إضافة قسم جديد"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCategoryModalOpen(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="p-4 sm:p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  اسم القسم <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  placeholder="مثال: إكسسوارات ذكية"
                  className="w-full py-2.5 px-3 rounded-2xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">ترتيب الظهور</label>
                <input
                  type="number"
                  value={categoryForm.order}
                  onChange={(e) => setCategoryForm({ ...categoryForm, order: e.target.value })}
                  className="w-full py-2.5 px-3 rounded-2xl bg-slate-800 border border-slate-700 text-xs text-white font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <AdminImageUploader
                label="صورة أو أيقونة القسم"
                value={categoryForm.image}
                onChange={(url) => setCategoryForm({ ...categoryForm, image: url })}
              />

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="cat-is-active"
                  checked={categoryForm.isActive}
                  onChange={(e) => setCategoryForm({ ...categoryForm, isActive: e.target.checked })}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 bg-slate-800 border-slate-700 cursor-pointer"
                />
                <label htmlFor="cat-is-active" className="text-xs font-bold text-slate-300 cursor-pointer">
                  تفعيل القسم في شريط أقسام المتجر
                </label>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-xs font-black text-white shadow-lg shadow-emerald-900/40 transition-all active:scale-95"
                >
                  {editingCategory ? "حفظ التعديل" : "إضافة القسم"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL: ADD DEAL */}
      {/* ==================================================== */}
      {isDealModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-black text-white">تفعيل عرض تخفيض على منتج</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsDealModalOpen(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDeal} className="p-4 sm:p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  اختر المنتج المشمول بالعرض <span className="text-rose-400">*</span>
                </label>
                <select
                  required
                  value={dealForm.productId}
                  onChange={(e) => {
                    const selected = products.find((p) => p.id === e.target.value);
                    setDealForm({
                      productId: e.target.value,
                      newPrice: selected ? String(selected.price * 0.9) : "",
                      originalPrice: selected ? String(selected.price) : "",
                    });
                  }}
                  className="w-full py-2.5 px-3 rounded-2xl bg-slate-800 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                >
                  <option value="">اختر منتجاً...</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} — {formatIQD(p.price)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  السعر القديم قبل الخصم (IQD) <span className="text-rose-400">*</span>
                </label>
                <input
                  type="number"
                  required
                  value={dealForm.originalPrice}
                  onChange={(e) => setDealForm({ ...dealForm, originalPrice: e.target.value })}
                  placeholder="2000000"
                  className="w-full py-2.5 px-3 rounded-2xl bg-slate-800 border border-slate-700 text-xs text-white font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  سعر العرض المخفض الجديد (IQD) <span className="text-rose-400">*</span>
                </label>
                <input
                  type="number"
                  required
                  value={dealForm.newPrice}
                  onChange={(e) => setDealForm({ ...dealForm, newPrice: e.target.value })}
                  placeholder="1750000"
                  className="w-full py-2.5 px-3 rounded-2xl bg-slate-800 border border-slate-700 text-xs text-white font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsDealModalOpen(false)}
                  className="px-4 py-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-2xl bg-amber-600 hover:bg-amber-500 text-xs font-black text-white shadow-lg shadow-amber-900/40 transition-all active:scale-95"
                >
                  تفعيل العرض فوراً
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL: ADD / EDIT BANNER */}
      {/* ==================================================== */}
      {isBannerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-indigo-400" />
                <h3 className="text-sm font-black text-white">
                  {editingBanner ? "تعديل البانر الإعلاني" : "إضافة بانر إعلاني جديد"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsBannerModalOpen(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBanner} className="p-4 sm:p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">عنوان البانر</label>
                <input
                  type="text"
                  value={bannerForm.title}
                  onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })}
                  placeholder="مثال: أحدث أجهزة iPhone 16 Pro Max"
                  className="w-full py-2.5 px-3 rounded-2xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">الوسم (Tag)</label>
                  <input
                    type="text"
                    value={bannerForm.tag}
                    onChange={(e) => setBannerForm({ ...bannerForm, tag: e.target.value })}
                    placeholder="مثال: عرض الأسبوع"
                    className="w-full py-2.5 px-3 rounded-2xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">شارة العرض (Badge)</label>
                  <input
                    type="text"
                    value={bannerForm.offerBadge}
                    onChange={(e) => setBannerForm({ ...bannerForm, offerBadge: e.target.value })}
                    placeholder="مثال: أفضل سعر مع ضمان رسمي"
                    className="w-full py-2.5 px-3 rounded-2xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <AdminImageUploader
                label="صورة البانر"
                value={bannerForm.imageUrl}
                onChange={(url) => setBannerForm({ ...bannerForm, imageUrl: url })}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">الرابط المستهدف</label>
                  <input
                    type="text"
                    value={bannerForm.targetHref}
                    onChange={(e) => setBannerForm({ ...bannerForm, targetHref: e.target.value })}
                    placeholder="/category/phones"
                    className="w-full py-2.5 px-3 rounded-2xl bg-slate-800 border border-slate-700 text-xs text-white font-mono text-left focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">الترتيب</label>
                  <input
                    type="number"
                    value={bannerForm.order}
                    onChange={(e) => setBannerForm({ ...bannerForm, order: e.target.value })}
                    className="w-full py-2.5 px-3 rounded-2xl bg-slate-800 border border-slate-700 text-xs text-white font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="banner-is-active"
                  checked={bannerForm.isActive}
                  onChange={(e) => setBannerForm({ ...bannerForm, isActive: e.target.checked })}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 bg-slate-800 border-slate-700 cursor-pointer"
                />
                <label htmlFor="banner-is-active" className="text-xs font-bold text-slate-300 cursor-pointer">
                  تفعيل البانر في الواجهة الرئيسية
                </label>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsBannerModalOpen(false)}
                  className="px-4 py-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-xs font-black text-white shadow-lg shadow-indigo-900/40 transition-all active:scale-95"
                >
                  {editingBanner ? "حفظ التعديل" : "إضافة البانر"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* GENERIC CONFIRM DELETE DIALOG */}
      {/* ==================================================== */}
      {deleteDialog.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-slate-900 border border-rose-500/30 rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/15 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/30">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="text-base font-black text-white">{deleteDialog.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{deleteDialog.message}</p>
            </div>

            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setDeleteDialog({ ...deleteDialog, isOpen: false })}
                className="px-5 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition-colors"
              >
                تراجع
              </button>
              <button
                type="button"
                onClick={async () => {
                  await deleteDialog.onConfirm();
                  setDeleteDialog({ ...deleteDialog, isOpen: false });
                }}
                className="px-6 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-xs font-black text-white shadow-lg shadow-rose-900/40 transition-all active:scale-95"
              >
                تأكيد الحذف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
