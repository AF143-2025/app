"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Lock,
  Mail,
  AlertCircle,
  CheckCircle2,
  Store,
  Server,
  Globe,
  Settings,
  RefreshCw,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { setAdminToken, getApiBaseUrl, setCustomApiUrl } from "@/lib/api";

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

  // Server URL settings
  const [apiUrl, setApiUrl] = useState("");
  const [showServerSettings, setShowServerSettings] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<"idle" | "success" | "error">("idle");
  const [connectionMessage, setConnectionMessage] = useState<string | null>(null);

  useEffect(() => {
    setApiUrl(getApiBaseUrl());
  }, []);

  const handleSaveApiUrl = (newUrl: string) => {
    setApiUrl(newUrl);
    setCustomApiUrl(newUrl);
    setConnectionStatus("idle");
    setConnectionMessage(null);
  };

  const handleTestConnection = async () => {
    const targetUrl = apiUrl.trim() || getApiBaseUrl();
    setTestingConnection(true);
    setConnectionStatus("idle");
    setConnectionMessage(null);

    try {
      // Ping products or health endpoint
      const res = await fetch(`${targetUrl}/api/products`, {
        method: "GET",
        headers: { Accept: "application/json" },
      });

      if (res.ok || res.status === 200) {
        setConnectionStatus("success");
        setConnectionMessage("تم الاتصال بسيرفر المتجر بنجاح! السيرفر يعمل بشكل ممتاز.");
      } else {
        // Even if 401 or 404, server responded!
        setConnectionStatus("success");
        setConnectionMessage(`تم الوصول إلى السيرفر (كود الاستجابة: ${res.status}). السيرفر يعمل.`);
      }
    } catch (err: any) {
      setConnectionStatus("error");
      setConnectionMessage(
        `تعذر الاتصال بالسيرفر (${targetUrl}). تأكد من أن السيرفر يعمل وأن الرابط صحيح ويبدأ بـ https://`
      );
    } finally {
      setTestingConnection(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage("يرجى إدخال البريد الإلكتروني وكلمة المرور");
      return;
    }

    const currentBaseUrl = apiUrl.trim() || getApiBaseUrl();

    try {
      setLoading(true);
      const res = await fetch(`${currentBaseUrl}/api/admin/auth/login`, {
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
      setShowServerSettings(true);
      setErrorMessage(
        `تعذر الاتصال بخادم المتجر على (${currentBaseUrl}). يرجى التحقق من إعدادات "رابط السيرفر" أدناه والتأكد من تشغيل خادم المتجر.`
      );
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
              <div className="space-y-1 leading-relaxed">
                <div>{errorMessage}</div>
              </div>
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
              {loading ? "جاري التحقق والاتصال..." : "تسجيل الدخول إلى اللوحة"}
            </button>
          </form>

          {/* Quick Demo Credentials */}
          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px]">
            <button
              type="button"
              onClick={fillQuickAdmin}
              className="text-emerald-400 hover:text-emerald-300 underline font-bold"
            >
              تعبئة بيانات المدير الافتراضية
            </button>

            <button
              type="button"
              onClick={() => setShowServerSettings(!showServerSettings)}
              className="text-slate-400 hover:text-white flex items-center gap-1 font-medium transition-colors"
            >
              <Server className="w-3.5 h-3.5 text-emerald-400" />
              <span>إعداد رابط السيرفر</span>
              {showServerSettings ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>

          {/* Collapsible Server Settings */}
          {showServerSettings && (
            <div className="p-4 bg-black/40 rounded-2xl border border-white/10 space-y-3 text-xs animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-300 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-emerald-400" />
                  رابط خادم المتجر (Backend URL)
                </span>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed">
                ضع هنا رابط موقع متجرك الرئيسي (مثال: <code className="text-emerald-300 bg-white/5 px-1 py-0.5 rounded">https://app-xxxx.vercel.app</code>) لتقوم لوحة الإدارة بالتواصل معه.
              </p>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={apiUrl}
                  onChange={(e) => handleSaveApiUrl(e.target.value)}
                  placeholder="https://your-store.vercel.app"
                  className="flex-1 px-3 py-2 rounded-xl bg-white/10 border border-white/15 focus:outline-none focus:ring-1 focus:ring-emerald-400 text-xs font-mono text-white placeholder-slate-500"
                />
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={testingConnection}
                  className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs flex items-center gap-1 shrink-0 disabled:opacity-50 transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${testingConnection ? "animate-spin" : ""}`} />
                  <span>فحص</span>
                </button>
              </div>

              {connectionMessage && (
                <div
                  className={`p-2.5 rounded-xl text-[11px] flex items-start gap-2 ${
                    connectionStatus === "success"
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : "bg-red-500/20 text-red-300 border border-red-500/30"
                  }`}
                >
                  {connectionStatus === "success" ? (
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5 text-emerald-400" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-red-400" />
                  )}
                  <span>{connectionMessage}</span>
                </div>
              )}
            </div>
          )}
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
