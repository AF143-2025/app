"use client";

import React, { useState, useEffect } from "react";
import {
  Calculator,
  Search,
  Plus,
  Minus,
  Trash2,
  Printer,
  CheckCircle2,
  CreditCard,
  Banknote,
  Smartphone,
  Sparkles,
  ShoppingBag,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

export default function PosPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Cart in POS
  const [posItems, setPosItems] = useState<{ product: any; quantity: number }[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("CASH_IQD");
  const [customerName, setCustomerName] = useState("زبون مباشر");
  const [customerPhone, setCustomerPhone] = useState("");
  const [discount, setDiscount] = useState("0");
  const [isProcessing, setIsProcessing] = useState(false);

  // Active Receipt Modal
  const [completedOrder, setCompletedOrder] = useState<any | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/products");
      const data = await res.json();
      if (data.success) {
        setProducts(data.products || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addToPos = (prod: any) => {
    const existing = posItems.find((i) => i.product.id === prod.id);
    if (existing) {
      if (existing.quantity >= prod.stock) {
        alert("تجاوزت الكمية المتوفرة في المخزن");
        return;
      }
      setPosItems(
        posItems.map((i) =>
          i.product.id === prod.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      );
    } else {
      setPosItems([...posItems, { product: prod, quantity: 1 }]);
    }
  };

  const updateQuantity = (id: string, qty: number) => {
    if (qty <= 0) {
      setPosItems(posItems.filter((i) => i.product.id !== id));
      return;
    }
    setPosItems(
      posItems.map((i) => (i.product.id === id ? { ...i, quantity: qty } : i))
    );
  };

  const subtotal = posItems.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
    0
  );
  const totalAmount = Math.max(0, subtotal - parseFloat(discount || "0"));

  const handleCompleteSale = async () => {
    if (posItems.length === 0) return;
    setIsProcessing(true);
    try {
      const res = await fetch("/api/pos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: posItems.map((i) => ({
            productId: i.product.id,
            quantity: i.quantity,
          })),
          paymentMethod,
          customerName,
          customerPhone,
          discount: parseFloat(discount || "0"),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setCompletedOrder(data.order);
        setPosItems([]);
        setDiscount("0");
        fetchProducts(); // Refresh stocks
      } else {
        alert(data.error || "فشل إتمام البيع");
      }
    } catch (err: any) {
      alert("حدث خطأ: " + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="p-2 sm:p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition-all active:scale-90 border border-slate-200/60 shadow-sm flex items-center justify-center"
            aria-label="الرجوع للرئيسية"
            title="الرجوع للرئيسية"
          >
            <ChevronRight className="w-5 h-5 stroke-[2.5]" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900">
                نقطة البيع السريع (POS كاشير سما الخضراء للهواتف)
              </h1>
              <p className="text-xs text-gray-500">
                بيع مباشر فوري، خصم تلقائي من المخزن، ودعم الدفع كاش أو عبر زين كاش وكي كارد و FIB.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Products Selector Grid (Left/Center 2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ابحث بالاسم أو باركود المنتج..."
                className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-emerald-500"
              />
              <Search className="w-4 h-4 text-gray-400 absolute right-3.5 top-3" />
            </div>
            <span className="text-xs text-gray-400 font-bold whitespace-nowrap">
              {filteredProducts.length} منتج
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {filteredProducts.map((p) => (
              <div
                key={p.id}
                onClick={() => addToPos(p)}
                className="bg-white rounded-2xl border border-gray-100 p-3 shadow-sm hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div className="aspect-video w-full rounded-xl bg-gray-50 overflow-hidden mb-2 relative">
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                    متبقي: {p.stock}
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-gray-900 text-xs line-clamp-1 mb-1">
                    {p.name}
                  </h4>
                  <div className="text-xs font-black text-emerald-700 font-mono">
                    {p.price.toLocaleString("en-US")} دينار
                  </div>
                </div>

                <button
                  type="button"
                  className="mt-2 w-full py-1.5 rounded-lg bg-gray-100 hover:bg-emerald-600 hover:text-white text-gray-700 font-bold text-[10px] transition-colors"
                >
                  + إضافة للكاشير
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* POS Register Panel (Right Col) */}
        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xl space-y-4 sticky top-20">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h2 className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
              <ShoppingBag className="w-4 h-4 text-emerald-600" />
              <span>فاتورة الكاشير الحالية ({posItems.length})</span>
            </h2>
            {posItems.length > 0 && (
              <button
                onClick={() => setPosItems([])}
                className="text-[10px] text-red-600 font-bold hover:underline"
              >
                مسح الفاتورة
              </button>
            )}
          </div>

          {/* Selected Items */}
          <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
            {posItems.length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-xs">
                انقر على المنتجات لإضافتها لفاتورة البيع المباشر.
              </div>
            ) : (
              posItems.map((item) => (
                <div
                  key={item.product.id}
                  className="flex items-center justify-between gap-2 text-xs bg-gray-50/70 p-2.5 rounded-xl"
                >
                  <div className="flex-1 truncate">
                    <div className="font-bold text-gray-900 truncate">
                      {item.product.name}
                    </div>
                    <div className="text-[10px] text-gray-500 font-mono">
                      {item.product.price.toLocaleString("en-US")} دينار
                    </div>
                  </div>

                  <div className="flex items-center border border-gray-200 rounded-lg bg-white">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="w-6 h-6 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-6 text-center font-bold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      disabled={item.quantity >= item.product.stock}
                      className="w-6 h-6 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-30"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="font-black text-gray-900 font-mono text-left w-20">
                    {(item.product.price * item.quantity).toLocaleString("en-US")} دينار
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Payment Method Selector */}
          <div className="pt-2 border-t border-gray-100 space-y-2 text-xs">
            <label className="block font-bold text-gray-700">طريقة استلام المبلغ:</label>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: "CASH_IQD", label: "كاش دينار (IQD)", icon: Banknote },
                { id: "CASH_USD", label: "كاش دولار (USD)", icon: Banknote },
                { id: "ZAIN_CASH", label: "محفظة زين كاش", icon: Smartphone },
                { id: "QI_CARD", label: "بطاقة كي كارد", icon: CreditCard },
                { id: "FIB", label: "حساب FIB", icon: Smartphone },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setPaymentMethod(m.id)}
                  className={`p-2 rounded-xl border text-[11px] font-bold text-right transition-all flex items-center gap-1.5 ${
                    paymentMethod === m.id
                      ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                      : "border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <m.icon className="w-3.5 h-3.5" />
                  <span>{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Customer & Discount */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <label className="block text-[10px] font-bold text-gray-500 mb-1">اسم الزبون</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 mb-1">خصم نقدي (دينار)</label>
              <input
                type="number"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs font-mono"
              />
            </div>
          </div>

          {/* Totals & Submit */}
          <div className="pt-3 border-t border-gray-100 space-y-2">
            <div className="flex justify-between text-xs text-gray-500">
              <span>المجموع الفرعي:</span>
              <span className="font-mono">{subtotal.toLocaleString("en-US")} دينار</span>
            </div>
            {parseFloat(discount || "0") > 0 && (
              <div className="flex justify-between text-xs text-red-600">
                <span>الخصم الممنوح:</span>
                <span className="font-mono">-{parseFloat(discount).toLocaleString("en-US")} دينار</span>
              </div>
            )}
            <div className="flex justify-between text-base font-black text-gray-900 pt-2 border-t border-gray-200">
              <span>المبلغ الإجمالي:</span>
              <span className="text-emerald-700 font-mono">
                {totalAmount.toLocaleString("en-US")} دينار
              </span>
            </div>

            <button
              type="button"
              onClick={handleCompleteSale}
              disabled={posItems.length === 0 || isProcessing}
              className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-lg shadow-emerald-600/20 transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-40"
            >
              {isProcessing ? "جاري الحفظ والخصم..." : "إتمام البيع المباشر وطباعة الفاتورة ✓"}
            </button>
          </div>
        </div>
      </div>

      {/* POS Receipt Modal */}
      {completedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setCompletedOrder(null)}
          />
          <div className="min-h-full flex items-center justify-center p-4">
            <div className="relative bg-white rounded-3xl max-w-sm w-full shadow-2xl p-6 border border-gray-200 text-xs space-y-4">
              <div className="text-center pb-3 border-b border-gray-200">
                <div className="font-black text-lg text-gray-900">سما الخضراء للهواتف</div>
                <div className="text-[10px] text-gray-500">فاتورة بيع مباشر POS</div>
                <div className="font-mono font-bold text-emerald-700 text-sm mt-1">
                  {completedOrder.orderNumber}
                </div>
              </div>

              <div className="space-y-1 text-gray-600 text-[11px]">
                <div>الزبون: {completedOrder.customerName}</div>
                <div>الدفع: {completedOrder.paymentMethod}</div>
                <div>التاريخ: {new Date(completedOrder.createdAt).toLocaleString("en-US")}</div>
              </div>

              <div className="border-y border-gray-100 py-2 space-y-1.5">
                {completedOrder.items?.map((item: any) => (
                  <div key={item.id} className="flex justify-between text-gray-800">
                    <span className="truncate max-w-[170px]">
                      {item.productName} ({item.quantity}×)
                    </span>
                    <span className="font-mono font-bold">
                      {item.total.toLocaleString("en-US")} دينار
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between text-base font-black text-emerald-800 pt-1">
                <span>الإجمالي المدفوع:</span>
                <span className="font-mono">
                  {completedOrder.totalAmount.toLocaleString("en-US")} دينار
                </span>
              </div>

              <div className="text-center text-[9px] text-gray-400">
                شكراً لتعاملكم مع سما الخضراء • البضاعة المباعة ترد وتستبدل حسب الشروط
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  onClick={() => setCompletedOrder(null)}
                  className="w-1/2 py-2 rounded-xl border border-gray-200 font-bold"
                >
                  إغلاق
                </button>
                <button
                  onClick={() => window.print()}
                  className="w-1/2 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center justify-center gap-1"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>طباعة الفاتورة</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
