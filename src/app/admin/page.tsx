"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  CreditCard,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Clock,
  Package,
  FileText,
  Search,
  Filter,
  RefreshCw,
  Lock,
  Layers,
  Eye,
  Plus,
  Edit2,
  Trash2,
  Wrench,
  TrendingUp,
  DollarSign,
  Smartphone,
  Check,
  X,
  ExternalLink,
  ChevronLeft,
  ShoppingBag,
  SlidersHorizontal,
  LayoutGrid,
  Users,
  LogOut,
  Store,
  Sparkles,
  MessageSquare,
  Mail,
} from "lucide-react";
import { AdminImageUploader } from "@/components/admin-image-uploader";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "overview" | "categories" | "products" | "orders" | "users" | "maintenance" | "payments" | "audit"
  >("overview");

  // Admin User Info
  const [adminUser, setAdminUser] = useState<any | null>(null);

  // Data States
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalVolume: 0,
    paidCount: 0,
    failedCount: 0,
    refundedCount: 0,
    pendingCount: 0,
    totalCount: 0,
    successRate: 100,
  });

  // UI / Filter States
  const [loading, setLoading] = useState(true);
  const [searchProduct, setSearchProduct] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("all");
  const [orderFilter, setOrderFilter] = useState("all");
  const [ticketFilter, setTicketFilter] = useState("all");

  // Category Modals
  const [isAddCatOpen, setIsAddCatOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<any | null>(null);
  const [newCat, setNewCat] = useState({
    name: "",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600",
  });

  // Product Modals
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [newProd, setNewProd] = useState({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    stock: "15",
    categoryId: "",
    imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02560?w=800",
  });

  // Maintenance Ticket Modal
  const [isAddTicketOpen, setIsAddTicketOpen] = useState(false);
  const [newTicket, setNewTicket] = useState({
    customerName: "",
    customerPhone: "",
    deviceType: "هاتف ذكي",
    brandModel: "",
    issueDescription: "",
    accessories: "الجهاز فقط",
    estimatedCost: "",
  });

  // Maintenance Reply Modal State
  const [replyModalTicket, setReplyModalTicket] = useState<any | null>(null);
  const [adminReplyText, setAdminReplyText] = useState("");
  const [replyStatus, setReplyStatus] = useState("Replied");
  const [replyCost, setReplyCost] = useState("");
  const [isReplying, setIsReplying] = useState(false);

  // Refund Modal
  const [refundTarget, setRefundTarget] = useState<any | null>(null);
  const [refundReason, setRefundReason] = useState("طلب العميل استرجاع المبلغ");
  const [isProcessingRefund, setIsProcessingRefund] = useState(false);

  // 1. Backend Verification & Initial Load
  const verifyAndFetchAll = async () => {
    try {
      setLoading(true);

      // Verify Admin Session on Backend
      const verifyRes = await fetch("/api/admin/verify");
      const verifyData = await verifyRes.json();

      if (!verifyData.success) {
        // Redirect unauthorized user to login
        window.location.href = "/admin/login?error=unauthorized";
        return;
      }
      setAdminUser(verifyData.user);

      // Fetch Categories
      const catRes = await fetch("/api/categories");
      const catData = await catRes.json();
      if (catData.success) {
        setCategories(catData.categories || []);
        if (catData.categories?.length > 0 && !newProd.categoryId) {
          setNewProd((prev) => ({ ...prev, categoryId: catData.categories[0].id }));
        }
      }

      // Fetch Products
      const prodRes = await fetch("/api/products?all=true&limit=200");
      const prodData = await prodRes.json();
      if (prodData.success) {
        setProducts(prodData.products || []);
      }

      // Fetch Orders
      const ordRes = await fetch("/api/admin/orders");
      const ordData = await ordRes.json();
      if (ordData.success) {
        setOrders(ordData.orders || []);
      }

      // Fetch Users
      const userRes = await fetch("/api/admin/users");
      const userData = await userRes.json();
      if (userData.success) {
        setUsers(userData.users || []);
      }

      // Fetch Maintenance Tickets
      const tickRes = await fetch("/api/maintenance");
      const tickData = await tickRes.json();
      if (tickData.success) {
        setTickets(tickData.tickets || []);
      }

      // Fetch Payments & Stats
      const payRes = await fetch("/api/admin/payments?status=all");
      const payData = await payRes.json();
      if (payData.success) {
        setTransactions(payData.transactions || []);
        if (payData.stats) setStats(payData.stats);
      }

      // Fetch Audit Logs
      const auditRes = await fetch("/api/admin/audit?limit=50");
      const auditData = await auditRes.json();
      if (auditData.success) {
        setAuditLogs(auditData.logs || []);
      }
    } catch (err) {
      console.error("Failed to load admin dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    verifyAndFetchAll();
  }, []);

  // Handler: Logout Admin
  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
      window.location.href = "/admin/login";
    } catch (e) {
      window.location.href = "/admin/login";
    }
  };

  // ---------------- CATEGORY CRUD ----------------
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCat.name.trim()) return alert("اسم القسم مطلوب");

    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCat),
      });
      const data = await res.json();
      if (data.success) {
        setIsAddCatOpen(false);
        setNewCat({ name: "", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600" });
        verifyAndFetchAll();
      } else {
        alert(data.error || "فشل إنشاء القسم");
      }
    } catch (err) {
      alert("حدث خطأ أثناء الاتصال بالخادم");
    }
  };

  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCat) return;

    try {
      const res = await fetch(`/api/categories/${editingCat.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingCat),
      });
      const data = await res.json();
      if (data.success) {
        setEditingCat(null);
        verifyAndFetchAll();
      } else {
        alert(data.error || "فشل تعديل القسم");
      }
    } catch (err) {
      alert("حدث خطأ أثناء تعديل القسم");
    }
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (!confirm(`هل أنت متأكد من حذف قسم "${name}"؟ سيتم فك ارتباط المنتجات التابعة له.`)) return;

    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        verifyAndFetchAll();
      } else {
        alert(data.error || "فشل حذف القسم");
      }
    } catch (err) {
      alert("حدث خطأ أثناء حذف القسم");
    }
  };

  // ---------------- PRODUCT CRUD ----------------
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProd.name || !newProd.price || !newProd.categoryId) {
      alert("يرجى ملء اسم المنتج، السعر، وتحديد القسم");
      return;
    }

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProd),
      });
      const data = await res.json();
      if (data.success) {
        setIsAddProductOpen(false);
        setNewProd({
          name: "",
          description: "",
          price: "",
          originalPrice: "",
          stock: "15",
          categoryId: categories[0]?.id || "",
          imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02560?w=800",
        });
        verifyAndFetchAll();
      } else {
        alert(data.error || "فشل إضافة المنتج");
      }
    } catch (err) {
      alert("حدث خطأ أثناء إضافة المنتج");
    }
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      const res = await fetch(`/api/products/${editingProduct.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingProduct),
      });
      const data = await res.json();
      if (data.success) {
        setEditingProduct(null);
        verifyAndFetchAll();
      } else {
        alert(data.error || "فشل تعديل المنتج");
      }
    } catch (err) {
      alert("حدث خطأ أثناء تعديل المنتج");
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`هل أنت متأكد من حذف المنتج "${name}"؟`)) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        verifyAndFetchAll();
      } else {
        alert(data.error || "فشل حذف المنتج");
      }
    } catch (err) {
      alert("حدث خطأ أثناء حذف المنتج");
    }
  };

  const handleToggleProductActive = async (id: string, currentStatus: boolean) => {
    try {
      await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus }),
      });
      verifyAndFetchAll();
    } catch (err) {
      console.error(err);
    }
  };

  // ---------------- ORDER MANAGEMENT ----------------
  const handleUpdateOrderStatus = async (orderId: string, orderStatus: string) => {
    try {
      await fetch("/api/admin/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, orderStatus }),
      });
      verifyAndFetchAll();
    } catch (e) {
      console.error(e);
    }
  };

  // ---------------- MAINTENANCE TICKET ----------------
  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicket.customerName || !newTicket.customerPhone || !newTicket.brandModel) {
      alert("يرجى ملء بيانات العميل ونوع الجهاز");
      return;
    }

    try {
      const res = await fetch("/api/maintenance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTicket),
      });
      const data = await res.json();
      if (data.success) {
        setIsAddTicketOpen(false);
        setNewTicket({
          customerName: "",
          customerPhone: "",
          deviceType: "هاتف ذكي",
          brandModel: "",
          issueDescription: "",
          accessories: "الجهاز فقط",
          estimatedCost: "",
        });
        verifyAndFetchAll();
      } else {
        alert(data.error || "فشل إنشاء تذكرة الصيانة");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateTicketStatus = async (id: string, status: string) => {
    try {
      await fetch("/api/maintenance", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      verifyAndFetchAll();
    } catch (err) {
      console.error(err);
    }
  };

  const openReplyModal = (ticket: any) => {
    setReplyModalTicket(ticket);
    setAdminReplyText(ticket.adminReply || "");
    setReplyStatus(ticket.status === "Received" ? "Replied" : ticket.status);
    setReplyCost(
      ticket.finalCost ? String(ticket.finalCost) : ticket.estimatedCost ? String(ticket.estimatedCost) : ""
    );
  };

  const handleSendAdminReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyModalTicket || !adminReplyText.trim()) return;

    try {
      setIsReplying(true);
      const res = await fetch("/api/maintenance", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: replyModalTicket.id,
          adminReply: adminReplyText.trim(),
          status: replyStatus,
          finalCost: replyCost ? parseFloat(replyCost) : undefined,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setReplyModalTicket(null);
        setAdminReplyText("");
        verifyAndFetchAll();
      } else {
        alert(data.error || "فشل إرسال الرد");
      }
    } catch (err: any) {
      alert("حدث خطأ: " + err.message);
    } finally {
      setIsReplying(false);
    }
  };

  // ---------------- REFUND MANAGEMENT ----------------
  const handleProcessRefund = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!refundTarget) return;

    setIsProcessingRefund(true);
    try {
      const res = await fetch("/api/payment/refund", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transactionId: refundTarget.transactionId,
          orderId: refundTarget.orderId,
          amount: refundTarget.amount,
          reason: refundReason,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setRefundTarget(null);
        verifyAndFetchAll();
      } else {
        alert(data.error || "فشلت عملية الاسترجاع");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessingRefund(false);
    }
  };

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const matchSearch =
      !searchProduct ||
      p.name.toLowerCase().includes(searchProduct.toLowerCase()) ||
      p.description.toLowerCase().includes(searchProduct.toLowerCase());
    const matchCat =
      selectedCategoryFilter === "all" ||
      p.categoryId === selectedCategoryFilter ||
      p.category === selectedCategoryFilter;
    return matchSearch && matchCat;
  });

  // Filtered Orders
  const filteredOrders = orders.filter((o) => {
    if (orderFilter === "all") return true;
    return o.orderStatus === orderFilter;
  });

  // Filtered Tickets
  const filteredTickets = tickets.filter((t) => {
    if (ticketFilter === "all") return true;
    return t.status === ticketFilter;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col select-none" dir="rtl">
      {/* Top Admin Navigation Bar */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-1 flex items-center justify-center text-slate-950 shadow-lg shadow-emerald-500/20">
              <Image
                src="/images/sama-logo-emblem.png"
                alt="شعار"
                width={36}
                height={36}
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-sm text-white">لوحة تحكم المدير العام</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-mono px-2 py-0.5 rounded-full border border-emerald-500/30 font-bold">
                  VERIFIED ADMIN
                </span>
              </div>
              <span className="text-[11px] text-slate-400">
                متجر سما الخضراء للهواتف الذكية • {adminUser?.name || "المدير العام"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/"
              target="_blank"
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5"
              title="معاينة المتجر في تبويب جديد"
            >
              <Store className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">معاينة المتجر</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </Link>

            <button
              onClick={handleLogout}
              className="px-3.5 py-2 rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-300 text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95"
              title="تسجيل خروج المدير"
            >
              <LogOut className="w-4 h-4" />
              <span>خروج</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 space-y-6">
        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-800 text-xs font-black scrollbar-none">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2.5 rounded-2xl transition-all flex items-center gap-2 shrink-0 ${
              activeTab === "overview"
                ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                : "text-slate-400 hover:bg-slate-900 hover:text-white"
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>نظرة عامة</span>
          </button>

          <button
            onClick={() => setActiveTab("categories")}
            className={`px-4 py-2.5 rounded-2xl transition-all flex items-center gap-2 shrink-0 ${
              activeTab === "categories"
                ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                : "text-slate-400 hover:bg-slate-900 hover:text-white"
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>الأقسام والتصنيفات ({categories.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("products")}
            className={`px-4 py-2.5 rounded-2xl transition-all flex items-center gap-2 shrink-0 ${
              activeTab === "products"
                ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                : "text-slate-400 hover:bg-slate-900 hover:text-white"
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>المنتجات والمخزون ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={`px-4 py-2.5 rounded-2xl transition-all flex items-center gap-2 shrink-0 ${
              activeTab === "orders"
                ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                : "text-slate-400 hover:bg-slate-900 hover:text-white"
            }`}
          >
            <Package className="w-4 h-4" />
            <span>الطلبات والمبيعات ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("users")}
            className={`px-4 py-2.5 rounded-2xl transition-all flex items-center gap-2 shrink-0 ${
              activeTab === "users"
                ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                : "text-slate-400 hover:bg-slate-900 hover:text-white"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>المستخدمين والزبائن ({users.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("maintenance")}
            className={`px-4 py-2.5 rounded-2xl transition-all flex items-center gap-2 shrink-0 ${
              activeTab === "maintenance"
                ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                : "text-slate-400 hover:bg-slate-900 hover:text-white"
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>الصيانة ({tickets.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("payments")}
            className={`px-4 py-2.5 rounded-2xl transition-all flex items-center gap-2 shrink-0 ${
              activeTab === "payments"
                ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                : "text-slate-400 hover:bg-slate-900 hover:text-white"
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>المالية والاسترجاع</span>
          </button>

          <button
            onClick={() => setActiveTab("audit")}
            className={`px-4 py-2.5 rounded-2xl transition-all flex items-center gap-2 shrink-0 ${
              activeTab === "audit"
                ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                : "text-slate-400 hover:bg-slate-900 hover:text-white"
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>سجل الرقابة الأمني</span>
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 shadow-sm space-y-1">
                <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
                  <span>إجمالي المبيعات</span>
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-white">
                  {stats.totalVolume.toLocaleString()} <span className="text-xs font-normal text-slate-400">دينار</span>
                </div>
                <div className="text-[10px] text-emerald-400 font-bold">
                  {stats.paidCount} عمليات شراء مكتملة
                </div>
              </div>

              <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 shadow-sm space-y-1">
                <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
                  <span>عدد الأقسام</span>
                  <LayoutGrid className="w-4 h-4 text-teal-400" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-white">
                  {categories.length}
                </div>
                <div className="text-[10px] text-teal-400 font-bold">
                  أقسام مفعلة في المتجر
                </div>
              </div>

              <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 shadow-sm space-y-1">
                <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
                  <span>إجمالي المنتجات</span>
                  <Smartphone className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-white">
                  {products.length}
                </div>
                <div className="text-[10px] text-blue-400 font-bold">
                  {products.filter((p) => p.isActive).length} معروض للبيع حالياً
                </div>
              </div>

              <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 shadow-sm space-y-1">
                <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
                  <span>الطلبات الواردة</span>
                  <Package className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-white">
                  {orders.length}
                </div>
                <div className="text-[10px] text-amber-400 font-bold">
                  {orders.filter((o) => o.orderStatus === "Pending").length} قيد الانتظار والتجهيز
                </div>
              </div>
            </div>

            {/* Quick Actions & Live Stream */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-3">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>إجراءات فورية</span>
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setIsAddCatOpen(true);
                      setActiveTab("categories");
                    }}
                    className="w-full text-right p-3 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 text-xs font-bold text-slate-200 transition-all flex items-center justify-between"
                  >
                    <span>+ إضافة قسم جديد للمتجر</span>
                    <ChevronLeft className="w-4 h-4 text-slate-400" />
                  </button>
                  <button
                    onClick={() => {
                      setIsAddProductOpen(true);
                      setActiveTab("products");
                    }}
                    className="w-full text-right p-3 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 text-xs font-bold text-slate-200 transition-all flex items-center justify-between"
                  >
                    <span>+ إضافة هاتف أو منتج جديد</span>
                    <ChevronLeft className="w-4 h-4 text-slate-400" />
                  </button>
                  <button
                    onClick={() => {
                      setIsAddTicketOpen(true);
                      setActiveTab("maintenance");
                    }}
                    className="w-full text-right p-3 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 text-xs font-bold text-slate-200 transition-all flex items-center justify-between"
                  >
                    <span>+ استلام جهاز صيانة وتوليد تذكرة</span>
                    <ChevronLeft className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
              </div>

              {/* Recent Orders Preview */}
              <div className="md:col-span-2 bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-white flex items-center gap-2">
                    <Package className="w-4 h-4 text-blue-400" />
                    <span>أحدث طلبات الزبائن</span>
                  </h3>
                  <button
                    onClick={() => setActiveTab("orders")}
                    className="text-xs font-bold text-emerald-400 hover:underline"
                  >
                    إدارة كافة الطلبات ←
                  </button>
                </div>

                <div className="space-y-2.5">
                  {orders.slice(0, 4).map((ord) => (
                    <div
                      key={ord.id}
                      className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <span className="font-mono font-bold text-white">#{ord.orderNumber}</span>
                        <span className="text-slate-400 mx-1.5">•</span>
                        <span className="text-slate-200 font-bold">{ord.customerName}</span>
                        <span className="text-slate-500 text-[11px] block">
                          {ord.totalAmount?.toLocaleString()} دينار • {ord.paymentMethod}
                        </span>
                      </div>
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
                          ord.orderStatus === "Delivered"
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            : ord.orderStatus === "Shipped"
                            ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                            : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        }`}
                      >
                        {ord.orderStatus}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CATEGORIES MANAGEMENT */}
        {activeTab === "categories" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900 p-4 rounded-3xl border border-slate-800">
              <div>
                <h2 className="text-base font-black text-white">إدارة أقسام وتصنيفات المتجر</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  أي قسم تضيفه يظهر تلقائياً في الصفحة الرئيسية للمتجر وترتبط به منتجاته عبر Category ID.
                </p>
              </div>

              <button
                onClick={() => setIsAddCatOpen(true)}
                className="px-4 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black shadow-lg shadow-emerald-500/25 transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة قسم جديد</span>
              </button>
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="bg-slate-900 p-4 rounded-3xl border border-slate-800 hover:border-slate-700 transition-all flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={cat.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600"}
                      alt={cat.name}
                      className="w-12 h-12 rounded-2xl object-cover border border-slate-700 shrink-0"
                    />
                    <div>
                      <h4 className="text-sm font-black text-white">{cat.name}</h4>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                        <span className="font-mono text-[10px] text-slate-500">ID: {cat.id}</span>
                        <span>•</span>
                        <span className="text-emerald-400 font-bold">{cat.productCount || 0} منتج</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Link
                      href={`/category/${cat.id}`}
                      target="_blank"
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                      title="معاينة شاشة القسم في المتجر"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      onClick={() => setEditingCat(cat)}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-emerald-500/20 hover:text-emerald-300 text-slate-300 transition-colors"
                      title="تعديل بيانات القسم"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(cat.id, cat.name)}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-red-500/20 hover:text-red-300 text-slate-300 transition-colors"
                      title="حذف القسم"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: PRODUCTS MANAGEMENT */}
        {activeTab === "products" && (
          <div className="space-y-4">
            <div className="bg-slate-900 p-4 rounded-3xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 w-full sm:w-auto flex-1">
                <div className="relative w-full sm:w-72">
                  <input
                    type="text"
                    value={searchProduct}
                    onChange={(e) => setSearchProduct(e.target.value)}
                    placeholder="ابحث باسم المنتج أو الوصف..."
                    className="w-full pl-3 pr-9 py-2 rounded-2xl bg-slate-800 border border-slate-700 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none text-white placeholder-slate-400"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
                </div>

                <select
                  value={selectedCategoryFilter}
                  onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                  className="py-2 px-3 rounded-2xl bg-slate-800 border border-slate-700 text-xs font-bold text-white focus:outline-none"
                >
                  <option value="all">كافة الأقسام</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => setIsAddProductOpen(true)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة منتج جديد</span>
              </button>
            </div>

            {/* Products Table */}
            <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-slate-800/70 border-b border-slate-800 text-slate-400 font-bold">
                    <tr>
                      <th className="p-3.5">المنتج</th>
                      <th className="p-3.5">القسم (Category)</th>
                      <th className="p-3.5">السعر</th>
                      <th className="p-3.5">المخزون</th>
                      <th className="p-3.5">حالة العرض</th>
                      <th className="p-3.5 text-left">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {filteredProducts.map((p) => {
                      const catName =
                        p.categoryRel?.name ||
                        categories.find((c) => c.id === p.categoryId || c.id === p.category)?.name ||
                        p.category;
                      return (
                        <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="p-3.5">
                            <div className="flex items-center gap-3">
                              <img
                                src={p.imageUrl}
                                alt={p.name}
                                className="w-10 h-10 rounded-xl object-cover border border-slate-700 shrink-0"
                              />
                              <div>
                                <div className="font-black text-white line-clamp-1">{p.name}</div>
                                <div className="text-[10px] text-slate-400 font-mono">ID: {p.id}</div>
                              </div>
                            </div>
                          </td>
                          <td className="p-3.5">
                            <span className="px-2 py-1 rounded-full bg-slate-800 border border-slate-700 text-emerald-400 text-[10px] font-bold">
                              {catName}
                            </span>
                          </td>
                          <td className="p-3.5 font-mono">
                            <span className="font-black text-white">{p.price?.toLocaleString()} دينار</span>
                            {p.originalPrice && (
                              <span className="block text-[10px] text-slate-500 line-through">
                                {p.originalPrice?.toLocaleString()} دينار
                              </span>
                            )}
                          </td>
                          <td className="p-3.5">
                            <span
                              className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                                p.stock > 5
                                  ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                                  : p.stock > 0
                                  ? "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                                  : "bg-red-500/15 text-red-300 border border-red-500/30"
                              }`}
                            >
                              {p.stock > 0 ? `${p.stock} قطعة` : "نفد"}
                            </span>
                          </td>
                          <td className="p-3.5">
                            <button
                              onClick={() => handleToggleProductActive(p.id, p.isActive)}
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${
                                p.isActive
                                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-red-500/20 hover:text-red-300"
                                  : "bg-slate-800 text-slate-500 border border-slate-700 hover:bg-emerald-500/20 hover:text-emerald-300"
                              }`}
                              title="اضغط لتبديل حالة العرض في المتجر"
                            >
                              {p.isActive ? "معروض ✓" : "مخفي ✕"}
                            </button>
                          </td>
                          <td className="p-3.5 text-left">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setEditingProduct(p)}
                                className="p-1.5 rounded-xl bg-slate-800 hover:bg-emerald-500/20 hover:text-emerald-300 text-slate-300 transition-colors"
                                title="تعديل المنتج"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(p.id, p.name)}
                                className="p-1.5 rounded-xl bg-slate-800 hover:bg-red-500/20 hover:text-red-300 text-slate-300 transition-colors"
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
            </div>
          </div>
        )}

        {/* TAB 4: ORDERS MANAGEMENT */}
        {activeTab === "orders" && (
          <div className="space-y-4">
            <div className="bg-slate-900 p-4 rounded-3xl border border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400">تصفية حسب الحالة:</span>
                <select
                  value={orderFilter}
                  onChange={(e) => setOrderFilter(e.target.value)}
                  className="py-1.5 px-3 rounded-2xl bg-slate-800 border border-slate-700 text-xs font-bold text-white focus:outline-none"
                >
                  <option value="all">كافة الحالات ({orders.length})</option>
                  <option value="Pending">قيد الانتظار</option>
                  <option value="Processing">قيد التجهيز</option>
                  <option value="Shipped">تم الشحن</option>
                  <option value="Delivered">تم التوصيل</option>
                  <option value="Cancelled">ملغي</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              {filteredOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="bg-slate-900 p-5 rounded-3xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-sm text-white">#{ord.orderNumber}</span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                          ord.orderStatus === "Delivered"
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            : ord.orderStatus === "Shipped"
                            ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                            : ord.orderStatus === "Cancelled"
                            ? "bg-red-500/20 text-red-300 border border-red-500/30"
                            : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        }`}
                      >
                        {ord.orderStatus}
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono">
                        {new Date(ord.createdAt).toLocaleDateString("ar-IQ")}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-slate-200">
                      الزبون: {ord.customerName} • {ord.customerPhone}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      العنوان: {ord.city}، {ord.shippingAddress} • طريقة الدفع: {ord.paymentMethod}
                    </div>
                    <div className="text-xs font-black text-emerald-400 pt-1">
                      الإجمالي: {ord.totalAmount?.toLocaleString()} دينار
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap self-end md:self-center">
                    <select
                      value={ord.orderStatus}
                      onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                      className="py-2 px-3 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-white focus:outline-none"
                    >
                      <option value="Pending">قيد الانتظار</option>
                      <option value="Processing">قيد التجهيز</option>
                      <option value="Shipped">تم الشحن</option>
                      <option value="Delivered">تم التوصيل</option>
                      <option value="Cancelled">إلغاء الطلب</option>
                    </select>

                    <Link
                      href={`/orders/${ord.id}`}
                      target="_blank"
                      className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center gap-1"
                    >
                      <span>الفاتورة</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: USERS MANAGEMENT */}
        {activeTab === "users" && (
          <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-black text-white">قائمة مستخدمي وزبائن المتجر</h3>
              <span className="text-xs text-slate-400 font-bold">إجمالي المستخدمين: {users.length}</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-800/70 border-b border-slate-800 text-slate-400 font-bold">
                  <tr>
                    <th className="p-3.5">المستخدم</th>
                    <th className="p-3.5">البريد الإلكتروني</th>
                    <th className="p-3.5">الهاتف</th>
                    <th className="p-3.5">الصلاحية (Role)</th>
                    <th className="p-3.5">الطلبات</th>
                    <th className="p-3.5">تاريخ الانضمام</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-3.5 font-bold text-white">{u.name}</td>
                      <td className="p-3.5 font-mono text-slate-300">{u.email}</td>
                      <td className="p-3.5 font-mono text-slate-400">{u.phone || "—"}</td>
                      <td className="p-3.5">
                        <span
                          className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] font-mono ${
                            u.role === "ADMIN" || u.role === "admin"
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                              : "bg-slate-800 text-slate-400 border border-slate-700"
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="p-3.5 font-bold text-slate-200">{u.ordersCount || 0} طلب</td>
                      <td className="p-3.5 text-slate-500 font-mono text-[11px]">
                        {new Date(u.createdAt).toLocaleDateString("ar-IQ")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: MAINTENANCE TICKETS */}
        {activeTab === "maintenance" && (
          <div className="space-y-4">
            <div className="bg-slate-900 p-4 rounded-3xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs font-bold text-slate-400">حالة الصيانة:</span>
                <select
                  value={ticketFilter}
                  onChange={(e) => setTicketFilter(e.target.value)}
                  className="py-1.5 px-3 rounded-2xl bg-slate-800 border border-slate-700 text-xs font-bold text-white focus:outline-none"
                >
                  <option value="all">كافة الأجهزة ({tickets.length})</option>
                  <option value="Received">تم الاستلام</option>
                  <option value="Inspecting">قيد الفحص</option>
                  <option value="In_Repair">جاري التصليح</option>
                  <option value="Ready">جاهز للتسليم</option>
                  <option value="Delivered">تم التسليم</option>
                </select>
              </div>

              <button
                onClick={() => setIsAddTicketOpen(true)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>استلام جهاز وصرف تذكرة</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTickets.map((tick) => (
                <div key={tick.id} className="bg-slate-900 p-5 rounded-3xl border border-slate-800 space-y-3 text-right">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-mono font-black text-xs text-amber-300 bg-amber-500/15 px-2.5 py-1 rounded-full border border-amber-500/30">
                        {tick.ticketNumber}
                      </span>
                      <h4 className="text-sm font-black text-white mt-2">
                        {tick.brandModel} ({tick.deviceType})
                      </h4>
                      <div className="text-xs text-slate-400 font-bold mt-1 space-y-0.5">
                        <p className="text-slate-300">العميل: {tick.customerName} • <span className="font-mono text-emerald-400">{tick.customerPhone}</span></p>
                        {tick.customerEmail && (
                          <p className="text-slate-400 font-mono text-[11px] font-normal flex items-center gap-1">
                            <Mail className="w-3 h-3 text-slate-500" />
                            <span>{tick.customerEmail}</span>
                          </p>
                        )}
                      </div>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
                        tick.status === "Ready"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : tick.status === "Delivered"
                          ? "bg-slate-800 text-slate-400 border border-slate-700"
                          : tick.adminReply || tick.status === "Replied"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                      }`}
                    >
                      {tick.adminReply || tick.status === "Replied" ? "تم الرد 💬" : tick.status}
                    </span>
                  </div>

                  <div className="bg-slate-800/60 p-3 rounded-2xl border border-slate-700/60 text-xs text-slate-300">
                    <span className="font-bold block text-slate-400 text-[10px]">وصف المشكلة من العميل:</span>
                    <p className="mt-0.5 text-slate-200 leading-relaxed">{tick.issueDescription}</p>
                  </div>

                  {/* ADMIN REPLY PREVIEW */}
                  {tick.adminReply && (
                    <div className="bg-emerald-950/40 p-3 rounded-2xl border border-emerald-500/30 text-xs space-y-1">
                      <div className="flex items-center justify-between text-emerald-400 font-bold text-[11px]">
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>رد الإدارة على العميل:</span>
                        </span>
                        {tick.adminRepliedAt && (
                          <span className="text-[10px] text-emerald-500/80 font-mono">
                            {new Date(tick.adminRepliedAt).toLocaleDateString("ar-IQ")}
                          </span>
                        )}
                      </div>
                      <p className="text-slate-200 text-xs leading-relaxed">{tick.adminReply}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs gap-2">
                    <button
                      type="button"
                      onClick={() => openReplyModal(tick)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-sm"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{tick.adminReply ? "تعديل الرد" : "الرد على العميل 💬"}</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 text-[11px]">الحالة:</span>
                      <select
                        value={tick.status}
                        onChange={(e) => handleUpdateTicketStatus(tick.id, e.target.value)}
                        className="py-1.5 px-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-white focus:outline-none"
                      >
                        <option value="Received">تم الاستلام</option>
                        <option value="Replied">تم الرد</option>
                        <option value="Inspecting">قيد الفحص</option>
                        <option value="In_Repair">جاري التصليح</option>
                        <option value="Ready">جاهز للتسليم</option>
                        <option value="Delivered">تم التسليم</option>
                        <option value="Cancelled">ملغي</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: PAYMENTS & REFUNDS */}
        {activeTab === "payments" && (
          <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-black text-white">سجل العمليات المالية والمدفوعات</h3>
              <span className="text-xs text-slate-400 font-bold">إجمالي العمليات: {transactions.length}</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-800/70 border-b border-slate-800 text-slate-400 font-bold">
                  <tr>
                    <th className="p-3.5">المعاملة</th>
                    <th className="p-3.5">بوابة الدفع</th>
                    <th className="p-3.5">المبلغ</th>
                    <th className="p-3.5">الحالة</th>
                    <th className="p-3.5">التاريخ</th>
                    <th className="p-3.5 text-left">الاسترجاع</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-3.5 font-mono font-bold text-white">{tx.transactionId}</td>
                      <td className="p-3.5 text-slate-300 font-bold">
                        {tx.provider} {tx.cardBrand && `(${tx.cardBrand})`}
                      </td>
                      <td className="p-3.5 font-black text-white font-mono">
                        {tx.amount?.toLocaleString()} {tx.currency}
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            tx.status === "Paid"
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                              : tx.status === "Refunded"
                              ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                              : "bg-red-500/20 text-red-300 border border-red-500/30"
                          }`}
                        >
                          {tx.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-400 font-mono text-[11px]">
                        {new Date(tx.createdAt).toLocaleDateString("ar-IQ")}
                      </td>
                      <td className="p-3.5 text-left">
                        {tx.status === "Paid" && (
                          <button
                            onClick={() => setRefundTarget(tx)}
                            className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[11px] font-bold transition-all border border-amber-500/30"
                          >
                            استرجاع (Refund)
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 8: AUDIT LOGS */}
        {activeTab === "audit" && (
          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-5 space-y-3">
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>سجل الرقابة والأمان وحركات النظام (Audit Trail)</span>
            </h3>
            <div className="space-y-2">
              {auditLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2 font-bold text-white">
                      <span className="font-mono text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-md text-[10px] border border-emerald-500/30">
                        {log.action}
                      </span>
                      <span>{log.entity}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      بواسطة: {log.userEmail || "النظام"} • IP: {log.ipAddress}
                    </div>
                  </div>
                  <span className="text-slate-500 font-mono text-[10px]">
                    {new Date(log.createdAt).toLocaleTimeString("ar-IQ")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* ================= MODALS ================= */}

      {/* 1. MODAL: ADD CATEGORY */}
      {isAddCatOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in" dir="rtl">
          <div className="bg-slate-900 text-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-800 space-y-4 text-right">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-white">إضافة قسم جديد لمتجر سما الخضراء</h3>
              <button
                onClick={() => setIsAddCatOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCategory} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">اسم القسم *</label>
                <input
                  type="text"
                  required
                  value={newCat.name}
                  onChange={(e) => setNewCat({ ...newCat, name: e.target.value })}
                  placeholder="مثال: ألعاب وملحقات جيمينج"
                  className="w-full py-2.5 px-3 rounded-2xl bg-slate-800 border border-slate-700 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none text-white"
                />
              </div>

              <AdminImageUploader
                label="صورة القسم"
                value={newCat.image}
                onChange={(url) => setNewCat({ ...newCat, image: url })}
                placeholder="https://... أو ارفع صورة من جهازك"
              />

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-2xl text-xs shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
                >
                  نشر القسم في المتجر فوراً
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddCatOpen(false)}
                  className="py-3 px-5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-2xl text-xs transition-all"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. MODAL: EDIT CATEGORY */}
      {editingCat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in" dir="rtl">
          <div className="bg-slate-900 text-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-800 space-y-4 text-right">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-white">تعديل بيانات القسم</h3>
              <button
                onClick={() => setEditingCat(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateCategory} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">اسم القسم</label>
                <input
                  type="text"
                  required
                  value={editingCat.name}
                  onChange={(e) => setEditingCat({ ...editingCat, name: e.target.value })}
                  className="w-full py-2.5 px-3 rounded-2xl bg-slate-800 border border-slate-700 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none text-white"
                />
              </div>

              <AdminImageUploader
                label="صورة القسم"
                value={editingCat.image || ""}
                onChange={(url) => setEditingCat({ ...editingCat, image: url })}
                placeholder="https://... أو ارفع صورة جديدة من جهازك"
              />

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-2xl text-xs shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
                >
                  حفظ التعديل
                </button>
                <button
                  type="button"
                  onClick={() => setEditingCat(null)}
                  className="py-3 px-5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-2xl text-xs transition-all"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. MODAL: ADD PRODUCT */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in" dir="rtl">
          <div className="bg-slate-900 text-white w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-slate-800 max-h-[90vh] overflow-y-auto space-y-4 text-right">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-white">إضافة منتج جديد لمتجر سما الخضراء</h3>
              <button
                onClick={() => setIsAddProductOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">اسم المنتج *</label>
                <input
                  type="text"
                  required
                  value={newProd.name}
                  onChange={(e) => setNewProd({ ...newProd, name: e.target.value })}
                  placeholder="مثال: iPhone 16 Pro Max 256GB"
                  className="w-full py-2.5 px-3 rounded-2xl bg-slate-800 border border-slate-700 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">القسم (ربط بـ Category ID) *</label>
                  <select
                    value={newProd.categoryId}
                    onChange={(e) => setNewProd({ ...newProd, categoryId: e.target.value })}
                    className="w-full py-2.5 px-3 rounded-2xl bg-slate-800 border border-slate-700 text-xs font-bold text-white focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">المخزون المتوفر *</label>
                  <input
                    type="number"
                    required
                    value={newProd.stock}
                    onChange={(e) => setNewProd({ ...newProd, stock: e.target.value })}
                    placeholder="15"
                    className="w-full py-2.5 px-3 rounded-2xl bg-slate-800 border border-slate-700 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">السعر (IQD) *</label>
                  <input
                    type="number"
                    required
                    value={newProd.price}
                    onChange={(e) => setNewProd({ ...newProd, price: e.target.value })}
                    placeholder="1500000"
                    className="w-full py-2.5 px-3 rounded-2xl bg-slate-800 border border-slate-700 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">السعر قبل التخفيض (اختياري)</label>
                  <input
                    type="number"
                    value={newProd.originalPrice}
                    onChange={(e) => setNewProd({ ...newProd, originalPrice: e.target.value })}
                    placeholder="1700000"
                    className="w-full py-2.5 px-3 rounded-2xl bg-slate-800 border border-slate-700 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none text-white"
                  />
                </div>
              </div>

              <AdminImageUploader
                label="صورة المنتج"
                value={newProd.imageUrl}
                onChange={(url) => setNewProd({ ...newProd, imageUrl: url })}
                placeholder="https://... أو ارفع صورة الجهاز من هاتفك أو لابتوبك"
                required
              />

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">الوصف والمواصفات</label>
                <textarea
                  rows={3}
                  value={newProd.description}
                  onChange={(e) => setNewProd({ ...newProd, description: e.target.value })}
                  placeholder="أصلي وكالة مع كفالة رسمية..."
                  className="w-full py-2.5 px-3 rounded-2xl bg-slate-800 border border-slate-700 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none text-white"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-2xl text-xs shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
                >
                  حفظ ونشر المنتج في المتجر
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddProductOpen(false)}
                  className="py-3 px-5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-2xl text-xs transition-all"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. MODAL: EDIT PRODUCT */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in" dir="rtl">
          <div className="bg-slate-900 text-white w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-slate-800 max-h-[90vh] overflow-y-auto space-y-4 text-right">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-white">تعديل بيانات المنتج</h3>
              <button
                onClick={() => setEditingProduct(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateProduct} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">اسم المنتج</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full py-2.5 px-3 rounded-2xl bg-slate-800 border border-slate-700 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">القسم (Category)</label>
                  <select
                    value={editingProduct.categoryId || editingProduct.category}
                    onChange={(e) => setEditingProduct({ ...editingProduct, categoryId: e.target.value })}
                    className="w-full py-2.5 px-3 rounded-2xl bg-slate-800 border border-slate-700 text-xs font-bold text-white focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">المخزون المتوفر</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.stock}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: e.target.value })}
                    className="w-full py-2.5 px-3 rounded-2xl bg-slate-800 border border-slate-700 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">السعر (IQD)</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                    className="w-full py-2.5 px-3 rounded-2xl bg-slate-800 border border-slate-700 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">السعر قبل التخفيض</label>
                  <input
                    type="number"
                    value={editingProduct.originalPrice || ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, originalPrice: e.target.value })}
                    className="w-full py-2.5 px-3 rounded-2xl bg-slate-800 border border-slate-700 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none text-white"
                  />
                </div>
              </div>

              <AdminImageUploader
                label="صورة المنتج"
                value={editingProduct.imageUrl || ""}
                onChange={(url) => setEditingProduct({ ...editingProduct, imageUrl: url })}
                placeholder="https://... أو ارفع صورة الجهاز من هاتفك أو لابتوبك"
                required
              />

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">الوصف</label>
                <textarea
                  rows={3}
                  value={editingProduct.description || ""}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full py-2.5 px-3 rounded-2xl bg-slate-800 border border-slate-700 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none text-white"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-2xl text-xs shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
                >
                  تأكيد التعديلات وحفظها
                </button>
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="py-3 px-5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-2xl text-xs transition-all"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. MODAL: ADD TICKET */}
      {isAddTicketOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in" dir="rtl">
          <div className="bg-slate-900 text-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-800 space-y-4 text-right">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-white">استلام جهاز للصيانة وتوليد تذكرة</h3>
              <button
                onClick={() => setIsAddTicketOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">اسم العميل *</label>
                <input
                  type="text"
                  required
                  value={newTicket.customerName}
                  onChange={(e) => setNewTicket({ ...newTicket, customerName: e.target.value })}
                  className="w-full py-2.5 px-3 rounded-2xl bg-slate-800 border border-slate-700 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">هاتف العميل *</label>
                <input
                  type="tel"
                  required
                  value={newTicket.customerPhone}
                  onChange={(e) => setNewTicket({ ...newTicket, customerPhone: e.target.value })}
                  className="w-full py-2.5 px-3 rounded-2xl bg-slate-800 border border-slate-700 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">موديل الجهاز *</label>
                <input
                  type="text"
                  required
                  value={newTicket.brandModel}
                  onChange={(e) => setNewTicket({ ...newTicket, brandModel: e.target.value })}
                  placeholder="iPhone 15 Pro"
                  className="w-full py-2.5 px-3 rounded-2xl bg-slate-800 border border-slate-700 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">وصف العطل *</label>
                <textarea
                  rows={2}
                  required
                  value={newTicket.issueDescription}
                  onChange={(e) => setNewTicket({ ...newTicket, issueDescription: e.target.value })}
                  className="w-full py-2.5 px-3 rounded-2xl bg-slate-800 border border-slate-700 text-xs text-white"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-2xl text-xs transition-all cursor-pointer"
                >
                  تأكيد استلام الجهاز
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddTicketOpen(false)}
                  className="py-3 px-5 bg-slate-800 text-slate-300 font-bold rounded-2xl text-xs"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. MODAL: REFUND */}
      {refundTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in" dir="rtl">
          <div className="bg-slate-900 text-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-800 space-y-4 text-right">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-white">تأكيد استرجاع المبلغ (Refund)</h3>
              <button
                onClick={() => setRefundTarget(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleProcessRefund} className="space-y-3.5">
              <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 text-xs space-y-1">
                <div>معاملة: <span className="font-mono text-emerald-400">{refundTarget.transactionId}</span></div>
                <div>المبلغ: <span className="font-mono font-black text-red-400">{refundTarget.amount?.toLocaleString()} {refundTarget.currency}</span></div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">سبب الاسترجاع</label>
                <textarea
                  rows={2}
                  required
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  className="w-full py-2 px-3 rounded-2xl bg-slate-800 border border-slate-700 text-xs text-white"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  disabled={isProcessingRefund}
                  className="flex-1 py-3 bg-red-500 hover:bg-red-400 text-white font-black rounded-2xl text-xs transition-all cursor-pointer"
                >
                  {isProcessingRefund ? "جاري الاسترجاع..." : "تأكيد إرجاع المبلغ"}
                </button>
                <button
                  type="button"
                  onClick={() => setRefundTarget(null)}
                  className="py-3 px-5 bg-slate-800 text-slate-300 font-bold rounded-2xl text-xs"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. MODAL: REPLY TO MAINTENANCE TICKET */}
      {replyModalTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in" dir="rtl">
          <div className="bg-slate-900 text-white w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-slate-800 space-y-4 text-right">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <MessageSquare className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-sm font-black text-white">الرد على طلب الصيانة</h3>
                  <span className="text-[11px] text-slate-400 font-mono">{replyModalTicket.ticketNumber}</span>
                </div>
              </div>
              <button
                onClick={() => setReplyModalTicket(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Customer & Issue Recap */}
            <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">العميل:</span>
                <span className="font-bold text-white">{replyModalTicket.customerName} ({replyModalTicket.customerPhone})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">الجهاز:</span>
                <span className="font-bold text-emerald-400">{replyModalTicket.brandModel} ({replyModalTicket.deviceType})</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">وصف العطل:</span>
                <p className="p-2 rounded-xl bg-slate-900/80 text-slate-300 border border-slate-750 text-[11px] leading-relaxed">
                  {replyModalTicket.issueDescription}
                </p>
              </div>
            </div>

            <form onSubmit={handleSendAdminReply} className="space-y-3.5">
              {/* Reply Text */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  نص رد المدير والورشة الفنية للعميل <span className="text-emerald-400">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="مثال: مرحباً بك، تم فحص المشكلة وتوفرت الشاشة الأصلية وكالة بضمان 6 أشهر، التكلفة المقدرة 45,000 دينار، الجهاز يستغرق 45 دقيقة ليكون جاهزاً للاستلام."
                  value={adminReplyText}
                  onChange={(e) => setAdminReplyText(e.target.value)}
                  className="w-full p-3 rounded-2xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none leading-relaxed"
                />
              </div>

              {/* Status and Cost */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">تحديث الحالة</label>
                  <select
                    value={replyStatus}
                    onChange={(e) => setReplyStatus(e.target.value)}
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none"
                  >
                    <option value="Replied">تم الرد</option>
                    <option value="Inspecting">قيد الفحص</option>
                    <option value="In_Repair">جاري التصليح</option>
                    <option value="Ready">جاهز للتسليم</option>
                    <option value="Delivered">تم التسليم</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">التكلفة المعتمدة (دينار)</label>
                  <input
                    type="number"
                    placeholder="مثال: 50000"
                    value={replyCost}
                    onChange={(e) => setReplyCost(e.target.value)}
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  disabled={isReplying}
                  className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-2xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/25 active:scale-95 disabled:opacity-50"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{isReplying ? "جاري الإرسال..." : "إرسال الرد وحفظ التحديث للعميل"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setReplyModalTicket(null)}
                  className="py-3 px-5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-2xl text-xs transition-all"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
