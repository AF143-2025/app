"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Store,
  Package,
  Plus,
  Trash2,
  Edit2,
  TrendingUp,
  DollarSign,
  Truck,
  CheckCircle2,
  AlertTriangle,
  Star,
  RefreshCw,
  Eye,
  Layers,
} from "lucide-react";
import { useCart } from "@/components/cart-context";

export default function SellerPage() {
  const { currentRole, setCurrentRole } = useCart();
  const [activeTab, setActiveTab] = useState<"products" | "orders">("products");

  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalUnitsSold: 0,
    totalOrdersCount: 0,
    totalProducts: 0,
  });
  const [loading, setLoading] = useState(true);

  // Add Product Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newProductName, setNewProductName] = useState("");
  const [newProductCategory, setNewProductCategory] = useState("electronics");
  const [newProductPrice, setNewProductPrice] = useState("");
  const [newProductOriginalPrice, setNewProductOriginalPrice] = useState("");
  const [newProductStock, setNewProductStock] = useState("15");
  const [newProductImage, setNewProductImage] = useState(
    "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800"
  );
  const [newProductDesc, setNewProductDesc] = useState("");
  const [isSavingProduct, setIsSavingProduct] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch seller products
      const pRes = await fetch("/api/seller/products?sellerId=demo-seller-profile-id");
      const pData = await pRes.json();
      if (pData.success) {
        setProducts(pData.products || []);
      }

      // Fetch seller orders
      const oRes = await fetch("/api/seller/orders?sellerId=demo-seller-profile-id");
      const oData = await oRes.json();
      if (oData.success) {
        setOrders(oData.orderItems || []);
        setStats({
          ...oData.stats,
          totalProducts: pData.products?.length || 0,
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProduct(true);
    try {
      const res = await fetch("/api/seller/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newProductName,
          category: newProductCategory,
          price: newProductPrice,
          originalPrice: newProductOriginalPrice || undefined,
          stock: newProductStock,
          imageUrl: newProductImage,
          description: newProductDesc,
          sellerId: "demo-seller-profile-id",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setIsAddModalOpen(false);
        setNewProductName("");
        setNewProductPrice("");
        setNewProductDesc("");
        fetchData();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSavingProduct(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا المنتج من متجرك؟")) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateFulfillment = async (orderId: string, orderStatus: string) => {
    try {
      const res = await fetch("/api/seller/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, orderStatus }),
      });
      if (res.ok) {
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Store Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-3xl shadow-inner">
            🏪
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black">متجر التقنية الذهبية</h1>
              <span className="bg-emerald-500/30 text-emerald-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-400/30">
                بائع موثق ✓
              </span>
            </div>
            <p className="text-xs text-gray-300 mt-1 max-w-lg">
              لوحة تحكم البائع: إدارة الكتالوج، متابعة وتحديث شحنات الطلبات، ورصد المبيعات المباشرة.
            </p>
            <div className="flex items-center gap-3 text-xs text-gray-300 mt-2 font-medium">
              <span className="flex items-center gap-1 text-amber-400">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>4.95 تقييم المتجر</span>
              </span>
              <span>•</span>
              <span>رقم الحساب: SA982000001234567890</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-500/30 transition-all hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة منتج جديد</span>
          </button>

          <button
            onClick={fetchData}
            className="p-3 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="تحديث البيانات"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>إجمالي المبيعات المؤكدة</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              💰
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-gray-900 font-mono">
            {stats.totalRevenue.toLocaleString("ar-SA")} ر.س
          </div>
          <div className="text-[11px] text-emerald-600 font-medium">
            تحديث مباشر مع كل عملية دفع
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>المنتجات المباعة</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              📦
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-gray-900 font-mono">
            {stats.totalUnitsSold} قطعة
          </div>
          <div className="text-[11px] text-purple-600 font-medium">
            من طلبات مدفوعة ومؤكدة
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>الطلبات الواردة</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              🛍️
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-gray-900 font-mono">
            {stats.totalOrdersCount} طلبات
          </div>
          <div className="text-[11px] text-blue-600 font-medium">
            خاصة بمنتجات متجرك
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>المنتجات المعروضة</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              📑
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-gray-900 font-mono">
            {products.length} منتجات
          </div>
          <div className="text-[11px] text-amber-600 font-medium">
            متوفرة في المتجر للطلب
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
        <button
          onClick={() => setActiveTab("products")}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === "products"
              ? "bg-emerald-600 text-white shadow-sm"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>كتالوج المنتجات ({products.length})</span>
        </button>
        <button
          onClick={() => setActiveTab("orders")}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === "orders"
              ? "bg-emerald-600 text-white shadow-sm"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <Package className="w-4 h-4" />
          <span>الطلبات والمبيعات ({orders.length})</span>
        </button>
      </div>

      {/* TAB 1: Products Management */}
      {activeTab === "products" && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-bold text-gray-900 text-sm">
              قائمة المنتجات المعروضة في المتجر
            </h3>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>إضافة منتج جديد</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="bg-gray-50/70 border-b border-gray-100 text-gray-400 font-bold">
                  <th className="p-4">المنتج</th>
                  <th className="p-4">الفئة</th>
                  <th className="p-4">السعر</th>
                  <th className="p-4">المخزون</th>
                  <th className="p-4">التقييم</th>
                  <th className="p-4 text-left">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
                          <img
                            src={p.imageUrl}
                            alt={p.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="font-bold text-gray-900 max-w-xs">{p.name}</div>
                      </div>
                    </td>
                    <td className="p-4 font-semibold text-gray-600">{p.category}</td>
                    <td className="p-4 font-bold text-emerald-700 font-mono">
                      {p.price.toLocaleString("ar-SA")} ر.س
                    </td>
                    <td className="p-4 font-bold">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] ${
                          p.stock > 10
                            ? "bg-emerald-100 text-emerald-800"
                            : p.stock > 0
                            ? "bg-amber-100 text-amber-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {p.stock} متوفر
                      </span>
                    </td>
                    <td className="p-4 text-amber-500 font-bold">⭐ {p.rating.toFixed(1)}</td>
                    <td className="p-4 text-left">
                      <button
                        onClick={() => handleDeleteProduct(p.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="حذف المنتج"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Orders & Fulfillment */}
      {activeTab === "orders" && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100">
            <h3 className="font-bold text-gray-900 text-sm">
              الطلبات الواردة لمنتجاتك ومتابعة الشحن
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="bg-gray-50/70 border-b border-gray-100 text-gray-400 font-bold">
                  <th className="p-4">رقم الطلب</th>
                  <th className="p-4">المنتج</th>
                  <th className="p-4">الكمية</th>
                  <th className="p-4">المبلغ</th>
                  <th className="p-4">العميل والمدينة</th>
                  <th className="p-4">حالة الدفع</th>
                  <th className="p-4">حالة الشحن</th>
                  <th className="p-4 text-left">تحديث الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 font-mono font-bold text-gray-900">
                      {item.order.orderNumber}
                    </td>
                    <td className="p-4 font-semibold text-gray-900 max-w-[200px] truncate">
                      {item.productName}
                    </td>
                    <td className="p-4 font-bold">{item.quantity}</td>
                    <td className="p-4 font-bold text-emerald-700 font-mono">
                      {item.total.toLocaleString("ar-SA")} ر.س
                    </td>
                    <td className="p-4 text-gray-600">
                      <div>{item.order.customerName}</div>
                      <div className="text-[10px] text-gray-400">{item.order.city}</div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          item.order.paymentStatus === "Paid"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {item.order.paymentStatus}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-gray-800">
                      {item.order.orderStatus}
                    </td>
                    <td className="p-4 text-left">
                      <select
                        value={item.order.orderStatus}
                        onChange={(e) =>
                          handleUpdateFulfillment(item.order.id, e.target.value)
                        }
                        className="px-2.5 py-1 rounded-lg border border-gray-300 text-xs font-bold text-gray-700 bg-white"
                      >
                        <option value="Confirmed">مؤكد</option>
                        <option value="Processing">قيد التجهيز</option>
                        <option value="Shipped">تم الشحن</option>
                        <option value="Delivered">تم التوصيل</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsAddModalOpen(false)}
          />
          <div className="min-h-full flex items-center justify-center p-4">
            <div className="relative bg-white rounded-3xl max-w-lg w-full shadow-2xl p-6 border border-gray-100">
              <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-600" />
                <span>إضافة منتج جديد للمتجر</span>
              </h3>

              <form onSubmit={handleCreateProduct} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">اسم المنتج *</label>
                  <input
                    type="text"
                    required
                    value={newProductName}
                    onChange={(e) => setNewProductName(e.target.value)}
                    placeholder="مثال: ساعة ذكية رياضية مقاومة للماء"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">الفئة *</label>
                    <select
                      value={newProductCategory}
                      onChange={(e) => setNewProductCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold"
                    >
                      <option value="electronics">إلكترونيات</option>
                      <option value="perfume">عطور</option>
                      <option value="fashion">أزياء</option>
                      <option value="home">منزل وقهوة</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">المخزون *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={newProductStock}
                      onChange={(e) => setNewProductStock(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">السعر (ر.س) *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      step="0.01"
                      value={newProductPrice}
                      onChange={(e) => setNewProductPrice(e.target.value)}
                      placeholder="499"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">السعر الأصلي قبل الخصم</label>
                    <input
                      type="number"
                      step="0.01"
                      value={newProductOriginalPrice}
                      onChange={(e) => setNewProductOriginalPrice(e.target.value)}
                      placeholder="650"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">رابط صورة المنتج (URL)</label>
                  <input
                    type="url"
                    value={newProductImage}
                    onChange={(e) => setNewProductImage(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-left"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">وصف المنتج</label>
                  <textarea
                    rows={3}
                    value={newProductDesc}
                    onChange={(e) => setNewProductDesc(e.target.value)}
                    placeholder="مواصفات ومميزات المنتج..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs"
                  />
                </div>

                <div className="flex gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="w-1/3 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingProduct}
                    className="w-2/3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition-all"
                  >
                    {isSavingProduct ? "جاري الحفظ..." : "حفظ المنتج وإتاحته للبيع"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
