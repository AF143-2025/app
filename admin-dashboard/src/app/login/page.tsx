"use client";

import React, { useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Lock,
  Mail,
  AlertCircle,
  CheckCircle2,
  Store,
} from "lucide-react";
import { setAdminToken, API_BASE_URL } from "@/lib/api";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const unauthorizedParam = searchParams.get("error") === "unauthorized";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(
    unauthorizedParam
      ? "تنبيه: يتطلب الوصول إلى لوحة الإدارة تسجيل الدخول بحساب مدير معتمد أولاً."
      : null
  );
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage("يرجى إدخال البريد الإلكتروني وكلمة المرور");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/admin/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();
      if (data.success && data.token) {
        setAdminToken(data.token);
        setSuccessMessage(data.message || "تم تسجيل دخول المدير بنجاح!");
        setTimeout(() => {
          router.push("/");
        }, 500);
      } else {
        setErrorMessage(data.error || "فشل تسجيل الدخول: البريد أو كلمة المرور غير صحيحة");
      }
    } catch (err) {
      setErrorMessage("تعذر الاتصال بخادم المتجر. تأكد من أن السيرفر يعمل.");
    } finally {
      setLoading(false);
    }
  };

  const fillQuickAdmin = () => {
    setEmail("admin@store.com");
    setPassword("123456");
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white flex flex-col justify-between p-4 sm:p-6 select-none" dir="rtl">
      {/* Top Bar */}
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between py-2">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
          <Store className="w-4 h-4 text-emerald-400" />
          <span>لوحة تحكم مدير متجر سما الخضراء</span>
        </div>
        <span className="text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full border border-emerald-500/30">
          STANDALONE ADMIN PORTAL v2.0
        </span>
      </div>

      {/* Main Login Card */}
      <div className="max-w-md w-full mx-auto my-auto py-8">
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-2 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/25 border border-white/20">
              <Store className="w-8 h-8 text-white" />
            </div>

            <div>
              <h1 className="text-2xl font-black tracking-tight text-white">
                بوابة دخول المدير العام
              </h1>
              <p className="text-xs text-slate-300 mt-1">
                لوحة التحكم الإدارية المستقلة لمتجر سما الخضراء
              </p>
            </div>
          </div>

          {/* Error Message Alert */}
          {errorMessage && (
            <div className="p-3.5 bg-red-500/15 border border-red-500/30 rounded-2xl text-xs text-red-200 flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
              <span className="leading-relaxed">{errorMessage}</span>
            </div>
          )}

          {/* Success Message Alert */}
          {successMessage && (
            <div className="p-3.5 bg-emerald-500/15 border border-emerald-500/30 rounded-2xl text-xs text-emerald-200 flex items-center gap-2.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                البريد الإلكتروني المعتمد للمدير
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@store.com"
                  className="w-full pl-3 pr-10 py-3 rounded-2xl bg-white/10 border border-white/15 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs sm:text-sm text-white placeholder-slate-400 transition-all font-mono"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                كلمة المرور
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-3 pr-10 py-3 rounded-2xl bg-white/10 border border-white/15 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs sm:text-sm text-white placeholder-slate-400 transition-all font-mono"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-black text-sm shadow-xl shadow-emerald-500/25 transition-all active:scale-98 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? "جاري التحقق..." : "تسجيل الدخول إلى اللوحة"}
            </button>
          </form>

          {/* Quick Demo Credentials */}
          <div className="pt-2 border-t border-white/10 text-center">
            <button
              type="button"
              onClick={fillQuickAdmin}
              className="text-[11px] text-emerald-400 hover:text-emerald-300 underline font-bold"
            >
              تعبئة تلقائية لبيانات المدير التجريبي (admin@store.com)
            </button>
          </div>
        </div>
      </div>

      <div className="text-center text-[10px] text-slate-500 py-2">
        شركة سما الخضراء للهواتف الذكية • نظام الإدارة المستقل 2026
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center text-white text-xs">جاري التحميل...</div>}>
      <LoginForm />
    </Suspense>
  );
}
