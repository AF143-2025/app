"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  X,
  Lock,
  Mail,
  User,
  Phone,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Check,
} from "lucide-react";
import { useCart } from "./cart-context";

export function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, login } = useCart();
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Google Selector Modal State
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState("");

  if (!isAuthModalOpen) return null;

  // Password strength calculator
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, text: "", color: "bg-slate-200" };
    if (pass.length < 6) return { score: 1, text: "قصيرة جداً", color: "bg-red-500 text-red-500" };
    if (pass.length < 8) return { score: 2, text: "متوسطة", color: "bg-amber-500 text-amber-500" };
    return { score: 3, text: "قوية وممتازة", color: "bg-emerald-500 text-emerald-500" };
  };

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!identifier.trim() || !password) {
      setErrorMessage("يرجى إدخال البريد الإلكتروني أو رقم الهاتف وكلمة المرور");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        if (data.isAdmin || data.user.role === "ADMIN" || data.redirect === "/admin") {
          setSuccessMessage("تم تسجيل دخول المدير بنجاح! جاري الانتقال إلى لوحة التحكم...");
          login(data.user);
          setTimeout(() => {
            window.location.href = "/admin";
          }, 400);
          return;
        }
        setSuccessMessage("تم تسجيل الدخول بنجاح!");
        setTimeout(() => {
          login(data.user);
        }, 400);
      } else {
        setErrorMessage(data.error || "فشل تسجيل الدخول");
      }
    } catch (err: any) {
      setErrorMessage("حدث خطأ في الاتصال بالسيرفر");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!name.trim() || !email.trim() || !password) {
      setErrorMessage("يرجى ملء جميع الحقول المطلوبة (الاسم، البريد، كلمة المرور)");
      return;
    }

    if (!agreeTerms) {
      setErrorMessage("يرجى الموافقة على شروط الاستخدام وسياسة الخصوصية للمتابعة");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, phone, role: "BUYER" }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        setSuccessMessage("تم إنشاء الحساب بنجاح! جاري الدخول...");
        setTimeout(() => {
          login(data.user);
        }, 500);
      } else {
        setErrorMessage(data.error || "فشل إنشاء الحساب");
      }
    } catch (err: any) {
      setErrorMessage("حدث خطأ في إنشاء الحساب");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async (googleEmail: string, googleName?: string) => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setGoogleLoading(true);

    try {
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: googleEmail,
          name: googleName || googleEmail.split("@")[0],
          googleId: "google_" + Math.random().toString(36).substring(2, 10),
        }),
      });

      const data = await res.json();
      if (data.success && data.user) {
        setSuccessMessage(data.message || "تم تسجيل الدخول عبر Google بنجاح");
        setShowGoogleModal(false);
        setTimeout(() => {
          login(data.user);
        }, 400);
      } else {
        setErrorMessage(data.error || "فشلت المصادقة عبر Google");
      }
    } catch (err) {
      setErrorMessage("حدث خطأ أثناء الاتصال بخدمة Google");
    } finally {
      setGoogleLoading(false);
    }
  };

  const quickDemoLogin = (emailPreset: string, roleName: string) => {
    setIdentifier(emailPreset);
    setPassword("123456");
    setErrorMessage(null);

    setLoading(true);
    fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier: emailPreset, password: "123456" }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.user) {
          login(data.user);
          if (data.isAdmin || data.user.role === "ADMIN" || data.redirect === "/admin") {
            setTimeout(() => {
              window.location.href = "/admin";
            }, 300);
          }
        } else {
          setErrorMessage(data.error || "فشل تسجيل الدخول التجريبي");
        }
      })
      .catch(() => setErrorMessage("خطأ في الاتصال"))
      .finally(() => setLoading(false));
  };

  const strength = getPasswordStrength(password);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto" dir="rtl">
      <div className="relative w-full max-w-md max-h-[94vh] flex flex-col bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden text-right">
        {/* Header decoration */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-emerald-950 p-5 sm:p-6 text-white relative border-b border-white/10">
          <button
            onClick={closeAuthModal}
            className="absolute top-4 left-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5 mb-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-1 flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/20">
              <Image
                src="/images/sama-logo-emblem.png"
                alt="سما الخضراء"
                width={32}
                height={32}
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <span className="text-xs font-black tracking-wide text-emerald-400 block">
                متجر سما الخضراء للهواتف الذكية
              </span>
              <span className="text-[10px] text-slate-300">
                بوابة الحساب والخدمات الرقمية
              </span>
            </div>
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            {activeTab === "login" ? "تسجيل الدخول" : "إنشاء حساب جديد"}
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            {activeTab === "login"
              ? "مرحباً بك مجدداً! سجّل دخولك لإدارة طلباتك وأقساطك"
              : "انضم الآن وتمتع بأقساط ميسرة وضمان رسمي على كافة الأجهزة"}
          </p>
        </div>

        {/* Tab switcher */}
        <div className="grid grid-cols-2 p-1.5 bg-slate-100/90 border-b border-slate-200 text-xs font-black">
          <button
            type="button"
            onClick={() => {
              setActiveTab("login");
              setErrorMessage(null);
              setSuccessMessage(null);
            }}
            className={`py-2.5 rounded-2xl transition-all ${
              activeTab === "login"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            تسجيل الدخول
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab("register");
              setErrorMessage(null);
              setSuccessMessage(null);
            }}
            className={`py-2.5 rounded-2xl transition-all ${
              activeTab === "register"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            إنشاء حساب جديد
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 touch-scroll">
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-700 flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-700 flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* 1. Official Google Sign-In Button (World-Class Global Design) */}
          <div className="space-y-2">
            <button
              type="button"
              disabled={googleLoading || loading}
              onClick={() => setShowGoogleModal(true)}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white hover:bg-slate-50 text-slate-700 font-black text-xs sm:text-sm rounded-2xl border border-slate-300 shadow-sm hover:shadow transition-all active:scale-[0.98]"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>
                {googleLoading
                  ? "جاري الاتصال بـ Google..."
                  : activeTab === "login"
                  ? "المتابعة باستخدام Google"
                  : "إنشاء حساب فوري عبر Google"}
              </span>
            </button>

            {/* Divider */}
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink mx-3 text-[11px] text-slate-400 font-bold">
                {activeTab === "login" ? "أو عبر البريد ورقم الهاتف" : "أو التسجيل عبر البريد الإلكتروني"}
              </span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>
          </div>

          {activeTab === "login" ? (
            /* Login Form */
            <form onSubmit={handleLogin} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  البريد الإلكتروني أو رقم الهاتف
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="مثال: buyer@store.com أو 07701234567"
                    className="w-full pl-3 pr-10 py-2.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs sm:text-sm bg-slate-50/50 focus:bg-white transition-all"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700">
                    كلمة المرور
                  </label>
                  <span className="text-[10px] text-emerald-700 font-bold cursor-pointer hover:underline">
                    نسيت كلمة المرور؟
                  </span>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs sm:text-sm bg-slate-50/50 focus:bg-white transition-all"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3.5 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || googleLoading}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-2xl font-black text-xs sm:text-sm shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                {loading ? "جاري التحقق والدخول..." : "دخول إلى الحساب"}
                <ArrowRight className="w-4 h-4 rotate-180" />
              </button>

              {/* Quick Demo Access (ADMIN & BUYER ONLY - NO CASHIER) */}
              <div className="pt-3 border-t border-slate-100">
                <div className="text-[10px] font-bold text-slate-400 mb-2 text-center">
                  دخول سريع مباشر للتجربة:
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => quickDemoLogin("admin@store.com", "المدير العام")}
                    className="p-2.5 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 hover:from-black hover:to-slate-900 text-white border border-slate-700 text-center transition-all text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
                  >
                    <span>👑</span>
                    <span className="font-black text-[11px]">المدير العام (تحكم كامل)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => quickDemoLogin("buyer@store.com", "زبون")}
                    className="p-2.5 rounded-2xl bg-slate-50 hover:bg-emerald-50 hover:border-emerald-200 border border-slate-200 text-center transition-all text-xs flex items-center justify-center gap-1.5 active:scale-95"
                  >
                    <span>👤</span>
                    <span className="font-bold text-slate-800 text-[11px]">زبون المتجر</span>
                  </button>
                </div>
              </div>
            </form>
          ) : (
            /* Register Form (World-Class Standard) */
            <form onSubmit={handleRegister} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  الاسم الكامل *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="مثال: أحمد العراقي"
                    className="w-full pl-3 pr-10 py-2.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs sm:text-sm bg-slate-50/50 focus:bg-white"
                  />
                  <User className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  البريد الإلكتروني *
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-3 pr-10 py-2.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs sm:text-sm bg-slate-50/50 focus:bg-white"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  رقم الهاتف (لخدمات التقسيط والتوصيل)
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0770 123 4567"
                    className="w-full pl-3 pr-10 py-2.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs sm:text-sm bg-slate-50/50 focus:bg-white"
                  />
                  <Phone className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  كلمة المرور *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="6 أحرف أو أرقام على الأقل"
                    className="w-full pl-10 pr-10 py-2.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs sm:text-sm bg-slate-50/50 focus:bg-white"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3.5 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {password && (
                  <div className="mt-1 flex items-center justify-between text-[10px]">
                    <span className="text-slate-400 font-bold">قوة كلمة المرور:</span>
                    <span className={`font-bold ${strength.color}`}>{strength.text}</span>
                  </div>
                )}
              </div>

              {/* Agreement checkbox */}
              <label className="flex items-start gap-2 pt-1 text-[11px] text-slate-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span>
                  أوافق على{" "}
                  <span className="text-emerald-700 font-bold underline">شروط الخدمة</span> و{" "}
                  <span className="text-emerald-700 font-bold underline">سياسة الخصوصية</span> لمتجر سما الخضراء.
                </span>
              </label>

              <button
                type="submit"
                disabled={loading || googleLoading}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-2xl font-black text-xs sm:text-sm shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 active:scale-95 mt-2"
              >
                {loading ? "جاري إنشاء الحساب..." : "تأكيد إنشاء الحساب"}
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[10px] text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>حماية متقدمة وتشفير لكافة المعاملات والبيانات</span>
        </div>
      </div>

      {/* Interactive Google Account Selector Modal (World-Class Experience) */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-slate-100 space-y-4 text-right">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" />
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z" />
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z" />
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
                </svg>
                <span className="text-xs font-black text-slate-800">تسجيل الدخول عبر Google</span>
              </div>
              <button
                type="button"
                onClick={() => setShowGoogleModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              اختر أحد الحسابات أو أدخل بريد Google الخاص بك للمتابعة الفورية:
            </p>

            <div className="space-y-2">
              {/* Preset Google Account 1 */}
              <button
                type="button"
                onClick={() => handleGoogleAuth("user.iraq@gmail.com", "مستخدم Google العراقي")}
                className="w-full flex items-center justify-between p-3 rounded-2xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/30 transition-all text-right group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-black flex items-center justify-center text-sm shadow-sm">
                    G
                  </div>
                  <div>
                    <div className="text-xs font-black text-slate-900 group-hover:text-emerald-700">
                      مستخدم Google العراقي
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      user.iraq@gmail.com
                    </div>
                  </div>
                </div>
                <Check className="w-4 h-4 text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>

              {/* Custom Google Email input */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <label className="block text-[11px] font-bold text-slate-700">
                  أو استخدم حساب Google آخر:
                </label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={customGoogleEmail}
                    onChange={(e) => setCustomGoogleEmail(e.target.value)}
                    placeholder="yourname@gmail.com"
                    className="flex-1 py-2 px-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    disabled={!customGoogleEmail.trim() || googleLoading}
                    onClick={() => handleGoogleAuth(customGoogleEmail.trim())}
                    className="px-4 py-2 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-black disabled:opacity-40 transition-all"
                  >
                    متابعة
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
