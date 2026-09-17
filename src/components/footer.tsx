"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  MapPin,
  PhoneCall,
  MessageCircle,
  Clock,
  ShieldCheck,
  Truck,
  ExternalLink,
  Layers,
  Wrench,
  Store,
  CreditCard,
} from "lucide-react";
import { STORE_CONFIG, getWhatsAppUrl, getPhoneCallUrl } from "@/lib/store-config";

export function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const whatsappUrl = getWhatsAppUrl();
  const phoneCallUrl = getPhoneCallUrl();

  return (
    <footer className="bg-slate-950 text-white border-t border-slate-900 pt-12 pb-24 md:pb-12 mt-auto no-print w-full max-w-full" dir="rtl">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-10">
        
        {/* Top Grid: 4 Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Col 1: Brand & Bio */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white p-1 flex items-center justify-center shadow-xs ring-1 ring-emerald-500/30 overflow-hidden shrink-0">
                <Image
                  src="/images/sama-logo-emblem.png"
                  alt="شعار سما الخضراء"
                  width={40}
                  height={40}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h3 className="text-base font-black text-white">{STORE_CONFIG.name}</h3>
                <p className="text-[11px] text-emerald-400 font-bold">للهواتف الذكية والصيانة</p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              {STORE_CONFIG.description}
            </p>

            <div className="flex items-center gap-2 pt-1 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>أجهزة أصلية وكالة 100% مع كفالة رسمية</span>
            </div>
          </div>

          {/* Col 2: Quick Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-emerald-400 uppercase tracking-wider">
              أقسام المتجر
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <Link href="/category/phones" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>هواتف آيفون وسامسونج</span>
                </Link>
              </li>
              <li>
                <Link href="/category/headphones" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>السماعات والصوتيات</span>
                </Link>
              </li>
              <li>
                <Link href="/category/chargers" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>الشواحن وبنوك الطاقة</span>
                </Link>
              </li>
              <li>
                <Link href="/category/smartwatches" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>الساعات الذكية الأصلية</span>
                </Link>
              </li>
              <li>
                <Link href="/category/cases" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>كفرات ماج سيف وحماية 360</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Services & In-Store Installments */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-emerald-400 uppercase tracking-wider">
              الخدمات والمعاملات
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <Link href="/maintenance" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <Wrench className="w-3.5 h-3.5 text-amber-400" />
                  <span>ورشة الصيانة الفورية</span>
                </Link>
              </li>
              <li>
                <Link href="/installments" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-emerald-400" />
                  <span>التقسيط داخل المحل (بدون كفيل)</span>
                </Link>
              </li>
              <li>
                <Link href="/salaries" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-cyan-400" />
                  <span>الصيرفة وصرف جميع الرواتب</span>
                </Link>
              </li>
              <li>
                <Link href="/wallets" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-purple-400" />
                  <span>وسائل الدفع والمحافظ الإلكترونية</span>
                </Link>
              </li>
              <li>
                <Link href="/orders" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-sky-400" />
                  <span>سجل الطلبات وتتبع الشحنة</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Branch Info & Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-emerald-400 uppercase tracking-wider">
              معلومات الفرع والتواصل
            </h4>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{STORE_CONFIG.location.fullAddress}</span>
              </div>

              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p>{STORE_CONFIG.location.workingHours.weekdays}</p>
                  <p className="text-slate-400 text-[11px]">{STORE_CONFIG.location.workingHours.friday}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <PhoneCall className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href={phoneCallUrl} className="hover:text-white font-bold">
                  {STORE_CONFIG.contact.primaryPhone} / {STORE_CONFIG.contact.secondaryPhone}
                </a>
              </div>

              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-[#25D366] shrink-0" />
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#25D366] hover:underline font-bold"
                >
                  {STORE_CONFIG.contact.whatsappDisplay} (واتساب مباشر)
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Middle Bar: Accepted Payment Methods Badges */}
        <div className="pt-6 border-t border-slate-900 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-bold">وسائل الدفع المعتمدة:</span>
            <span className="bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800 text-slate-200">الدفع نقداً عند الاستلام</span>
            <span className="bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800 text-slate-200">زين كاش (ZainCash)</span>
            <span className="bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800 text-slate-200">الكي كارد (Qi Card)</span>
            <span className="bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800 text-slate-200">ماستر كارد / فيزا</span>
          </div>

          <a
            href={STORE_CONFIG.location.googleMapsUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-bold"
          >
            <span>عرض موقع المحل على خرائط Google</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Bottom Bar: Copyright & Admin Portal Link */}
        <div className="pt-6 border-t border-slate-900/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500 text-center sm:text-right">
          <p>
            جميع الحقوق محفوظة © {new Date().getFullYear()} {STORE_CONFIG.fullName}.
          </p>

          <div className="flex items-center gap-4">
            <span>بغداد - العراق</span>
            <span>•</span>
            <Link href="/admin/login" className="text-slate-600 hover:text-slate-400 transition-colors">
              بوابة الإدارة
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
