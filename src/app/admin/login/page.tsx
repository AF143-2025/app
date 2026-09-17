"use client";

import React, { useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
  CheckCircle2,
  Sparkles,
  Store,
} from "lucide-react";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const unauthorizedParam = searchParams.get("error") === "unauthorized" || searchParams.get("unauthorized");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMessage(data.message || "تم تسجيل دخول المدير بنجاح!");
        setTimeout(() => {
          window.location.href = data.redirect || "/admin";
        }, 500);
      } else {
        setErrorMessage(data.error || "فشل تسجيل الدخول");
      }
    } catch (err) {
      setErrorMessage("حدث خطأ في الاتصال بالخادم");
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
        <Link
          href="/"
          className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-emerald-400 transition-colors"
        >
          <Store className="w-4 h-4" />
          <span>العودة لمتجر سما الخضراء</span>
        </Link>
        <span className="text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full border border-emerald-500/30">
          ADMIN SECURITY SYSTEM v2.0
        </span>
      </div>

      {/* Main Login Card */}
      <div className="max-w-md w-full mx-auto my-auto py-8">
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-1 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/25 border border-white/20">
              <Image
                src="/images/sama-logo-emblem.png"
                alt="سما الخضراء"
                width={50}
                height={50}
                className="w-full h-full object-contain"
              />
            </div>

            <div>
              <h1 className="text-2xl font-black tracking-tight text-white">
                بوابة دخول المدير العام
              </h1>
              <p className="text-xs text-slate-300 mt-1">
                لوحة التحكم الإدارية وإدارة المخزون والطلبات
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
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 rounded-2xl bg-white/10 border border-white/15 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs sm:text-sm text-white placeholder-slate-400 transition-all"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3.5 top-3.5 text-slate-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-50 text-slate-950 rounded-2xl font-black text-xs sm:text-sm shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
            >
              {loading ? "جاري التحقق من الصلاحيات..." : "تسجيل الدخول إلى لوحة التحكم"}
              <ArrowRight className="w-4 h-4 rotate-180" />
            </button>
          </form>

          {/* Quick Demo Credentials for Testing */}
          <div className="pt-2 border-t border-white/10 text-center space-y-2">
            <button
              type="button"
              onClick={fillQuickAdmin}
              className="w-full py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300 font-bold transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <span>👑 تعبئة بيانات المدير المعتمد (admin@store.com)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-md w-full mx-auto text-center text-[10px] text-slate-400 py-2 flex items-center justify-center gap-1.5">
        <ShieldCheck className="w-4 h-4 text-emerald-400" />
        <span>نظام محمي ومراقب على مستوى السيرفر وقاعدة البيانات 100%</span>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white text-sm">
          جاري التحميل...
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}

