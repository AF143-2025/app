"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeftRight,
  ArrowRight,
  DollarSign,
  Banknote,
  Plus,
  Minus,
  RefreshCw,
  TrendingUp,
  ShieldCheck,
  Calculator,
  ArrowDownLeft,
  ArrowUpRight,
} from "lucide-react";

export default function VaultPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [balance, setBalance] = useState({ iqd: 25000000, usd: 12500 });
  const [loading, setLoading] = useState(true);

  // Exchange Calculator State
  const [exchangeMode, setExchangeMode] = useState<"USD_TO_IQD" | "IQD_TO_USD">("USD_TO_IQD");
  const [exchangeAmount, setExchangeAmount] = useState("100");
  const [marketRate, setMarketRate] = useState("1530");
  const [isProcessingTx, setIsProcessingTx] = useState(false);

  // Cash In/Out Modal
  const [isCashModalOpen, setIsCashModalOpen] = useState(false);
  const [cashType, setCashType] = useState<"INCOME_CASH" | "EXPENSE_CASH">("INCOME_CASH");
  const [cashCurrency, setCashCurrency] = useState<"IQD" | "USD">("IQD");
  const [cashAmount, setCashAmount] = useState("");
  const [cashDesc, setCashDesc] = useState("");

  const fetchVault = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/vault");
      const data = await res.json();
      if (data.success) {
        setTransactions(data.transactions || []);
        if (data.currentBalance) setBalance(data.currentBalance);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVault();
  }, []);

  const handleExecuteExchange = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessingTx(true);
    try {
      const numAmt = parseFloat(exchangeAmount);
      const numRate = parseFloat(marketRate);
      const res = await fetch("/api/vault", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "EXCHANGE",
          currency: exchangeMode === "USD_TO_IQD" ? "USD" : "IQD",
          amount: numAmt,
          exchangeRate: numRate,
          description:
            exchangeMode === "USD_TO_IQD"
              ? `تصريف ${numAmt}$ إلى دينار بسعر ${numRate}`
              : `شراء دولار بمبلغ ${numAmt.toLocaleString()} د.ع بسعر ${numRate}`,
        }),
      });
      const data = await res.json();
      if (data.success) {
        fetchVault();
        alert("تمت عملية تبادل وتصريف العملة وتحديث رصيد القاصة بنجاح!");
      }
    } catch (err: any) {
      alert("حدث خطأ: " + err.message);
    } finally {
      setIsProcessingTx(false);
    }
  };

  const handleCashMovement = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessingTx(true);
    try {
      const res = await fetch("/api/vault", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: cashType,
          currency: cashCurrency,
          amount: cashAmount,
          description: cashDesc || (cashType === "INCOME_CASH" ? "مقبوضات صندوق" : "مصروفات صندوق"),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setIsCashModalOpen(false);
        setCashAmount("");
        setCashDesc("");
        fetchVault();
      }
    } catch (err: any) {
      alert("حدث خطأ: " + err.message);
    } finally {
      setIsProcessingTx(false);
    }
  };

  const calculatedResult =
    exchangeMode === "USD_TO_IQD"
      ? (parseFloat(exchangeAmount || "0") * parseFloat(marketRate || "0")).toLocaleString("ar-IQ") + " د.ع"
      : (parseFloat(exchangeAmount || "0") / (parseFloat(marketRate || "1") || 1)).toFixed(2) + " $";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Back to Categories Bar */}
      <div className="flex items-center justify-between pb-2 border-b border-gray-100">
        <span className="text-xs text-gray-500 font-bold">إدارة العملات والصيرفة</span>
        <Link
          href="/#categories-section"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-gray-200 hover:border-emerald-400 text-gray-700 hover:text-emerald-700 text-xs font-bold shadow-sm transition-all active:scale-95 group"
        >
          <ArrowRight className="w-4 h-4 text-emerald-600 transition-transform group-hover:-translate-x-1" />
          <span>رجوع للأقسام</span>
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
              <ArrowLeftRight className="w-5 h-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
              القاصة المركزية وتبادل العملات (IQD / USD)
            </h1>
          </div>
          <p className="text-xs text-gray-500">
            إدارة رصيد صندوق سما الخضراء، مقبوضات ومدفوعات الكاش، وحاسبة تصريف وتبادل العملات بالأسعار المباشرة.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCashModalOpen(true)}
            className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            <span>تسجيل مقبوضات / مدفوعات</span>
          </button>
          <button
            onClick={fetchVault}
            className="p-3 rounded-2xl border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Balances Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* IQD Card */}
        <div className="bg-gradient-to-br from-emerald-800 to-teal-950 rounded-3xl p-6 text-white shadow-lg space-y-2 border border-emerald-700/50 relative overflow-hidden">
          <div className="text-xs text-emerald-300 font-bold flex items-center justify-between">
            <span>رصيد القاصة - الدينار العراقي</span>
            <span className="bg-emerald-500/30 px-2.5 py-0.5 rounded-full text-[10px]">IQD</span>
          </div>
          <div className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-white">
            {balance.iqd.toLocaleString("ar-IQ")} <span className="text-lg text-emerald-400">د.ع</span>
          </div>
          <div className="text-[11px] text-emerald-200/80 pt-1">
            السيولة النقدية المتوفرة للصرف والشحن
          </div>
        </div>

        {/* USD Card */}
        <div className="bg-gradient-to-br from-slate-900 to-blue-950 rounded-3xl p-6 text-white shadow-lg space-y-2 border border-blue-800/50 relative overflow-hidden">
          <div className="text-xs text-blue-300 font-bold flex items-center justify-between">
            <span>رصيد القاصة - الدولار الأمريكي</span>
            <span className="bg-blue-500/30 px-2.5 py-0.5 rounded-full text-[10px]">USD</span>
          </div>
          <div className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-white">
            ${balance.usd.toLocaleString("en-US")} <span className="text-lg text-blue-400">USD</span>
          </div>
          <div className="text-[11px] text-blue-200/80 pt-1">
            رصيد العملة الصعبة المتوفر للتبادل والتصريف
          </div>
        </div>
      </div>

      {/* Exchange Calculator Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base font-bold text-gray-900">
              حاسبة تصريف وتبادل العملات (بورصة الكفاح / الحارثية)
            </h2>
          </div>
          <div className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            100$ = {(parseFloat(marketRate || "0") * 100).toLocaleString("ar-IQ")} د.ع
          </div>
        </div>

        <form onSubmit={handleExecuteExchange} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">اتجاه التبادل</label>
            <select
              value={exchangeMode}
              onChange={(e) => setExchangeMode(e.target.value as any)}
              className="w-full px-3.5 py-3 rounded-xl border border-gray-200 text-xs font-bold"
            >
              <option value="USD_TO_IQD">تصريف دولار إلى دينار ($ → د.ع)</option>
              <option value="IQD_TO_USD">شراء دولار بالدينار (د.ع → $)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              المبلغ المراد تبادله {exchangeMode === "USD_TO_IQD" ? "($)" : "(د.ع)"}
            </label>
            <input
              type="number"
              required
              min="1"
              value={exchangeAmount}
              onChange={(e) => setExchangeAmount(e.target.value)}
              className="w-full px-3.5 py-3 rounded-xl border border-gray-200 text-xs font-bold font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              سعر الصرف (دينار لكل 1 دولار)
            </label>
            <input
              type="number"
              required
              min="1000"
              value={marketRate}
              onChange={(e) => setMarketRate(e.target.value)}
              className="w-full px-3.5 py-3 rounded-xl border border-gray-200 text-xs font-bold font-mono text-emerald-700"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isProcessingTx}
              className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all active:scale-95"
            >
              {isProcessingTx ? "جاري المعالجة..." : "تنفيذ عملية التبادل وتحديث القاصة"}
            </button>
          </div>
        </form>

        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 flex items-center justify-between text-xs">
          <span className="text-gray-600 font-medium">الناتج المسلم للزبون:</span>
          <span className="text-base font-black text-emerald-800 font-mono">
            {calculatedResult}
          </span>
        </div>
      </div>

      {/* Transactions History */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden p-5 space-y-4">
        <h3 className="font-bold text-gray-900 text-sm">سجل حركات القاصة والتبادل المالي</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 font-bold">
                <th className="p-3.5">نوع الحركة</th>
                <th className="p-3.5">البيان / الوصف</th>
                <th className="p-3.5">المبلغ</th>
                <th className="p-3.5">سعر الصرف</th>
                <th className="p-3.5">رصيد الدينار بعد العملية</th>
                <th className="p-3.5">رصيد الدولار بعد العملية</th>
                <th className="p-3.5">التاريخ والوقت</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {transactions.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-3.5">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        t.type === "INCOME_CASH"
                          ? "bg-emerald-100 text-emerald-800"
                          : t.type === "EXPENSE_CASH"
                          ? "bg-red-100 text-red-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {t.type === "INCOME_CASH"
                        ? "إيداع مقبوضات"
                        : t.type === "EXPENSE_CASH"
                        ? "صرف مدفوعات"
                        : "تبادل عملات"}
                    </span>
                  </td>
                  <td className="p-3.5 font-medium text-gray-900">{t.description}</td>
                  <td className="p-3.5 font-bold font-mono">
                    {t.amount.toLocaleString()}{" "}
                    <span className="text-gray-400 font-sans">{t.currency}</span>
                  </td>
                  <td className="p-3.5 font-mono text-gray-600">
                    {t.exchangeRate ? `${t.exchangeRate} د.ع/$` : "—"}
                  </td>
                  <td className="p-3.5 font-mono font-bold text-emerald-700">
                    {t.balanceIQD.toLocaleString("ar-IQ")} د.ع
                  </td>
                  <td className="p-3.5 font-mono font-bold text-blue-700">
                    ${t.balanceUSD.toLocaleString()}
                  </td>
                  <td className="p-3.5 text-gray-400 text-[11px]">
                    {new Date(t.createdAt).toLocaleTimeString("ar-IQ")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cash In/Out Modal */}
      {isCashModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsCashModalOpen(false)}
          />
          <div className="min-h-full flex items-center justify-center p-4">
            <div className="relative bg-white rounded-3xl max-w-md w-full shadow-2xl p-6 border border-gray-100 text-xs">
              <h3 className="text-base font-black text-gray-900 mb-4">
                تسجيل حركة في القاصة (مقبوضات / مدفوعات)
              </h3>

              <form onSubmit={handleCashMovement} className="space-y-3.5">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setCashType("INCOME_CASH")}
                    className={`py-2.5 rounded-xl border font-bold ${
                      cashType === "INCOME_CASH"
                        ? "bg-emerald-600 text-white border-emerald-600"
                        : "border-gray-200 text-gray-600"
                    }`}
                  >
                    إيداع مقبوضات (+)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCashType("EXPENSE_CASH")}
                    className={`py-2.5 rounded-xl border font-bold ${
                      cashType === "EXPENSE_CASH"
                        ? "bg-red-600 text-white border-red-600"
                        : "border-gray-200 text-gray-600"
                    }`}
                  >
                    صرف مدفوعات (-)
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">العملة</label>
                    <select
                      value={cashCurrency}
                      onChange={(e) => setCashCurrency(e.target.value as any)}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 font-bold"
                    >
                      <option value="IQD">دينار عراقي (IQD)</option>
                      <option value="USD">دولار أمريكي (USD)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">المبلغ *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={cashAmount}
                      onChange={(e) => setCashAmount(e.target.value)}
                      placeholder="المبلغ"
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 font-mono font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">بيان وسبب الحركة *</label>
                  <textarea
                    rows={2}
                    required
                    value={cashDesc}
                    onChange={(e) => setCashDesc(e.target.value)}
                    placeholder="مثلاً: إيداع أرباح مبيعات اليوم، سحب مصاريف كهرباء وإيجار، إلخ"
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsCashModalOpen(false)}
                    className="w-1/3 py-2.5 rounded-xl border border-gray-200 font-bold text-gray-600"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    disabled={isProcessingTx}
                    className="w-2/3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md"
                  >
                    {isProcessingTx ? "جاري الحفظ..." : "حفظ الحركة وتحديث القاصة"}
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
