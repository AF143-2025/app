"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { MessageCircle, X } from "lucide-react";
import { STORE_CONFIG, getWhatsAppUrl } from "@/lib/store-config";

export function FloatingWhatsApp() {
  const pathname = usePathname();
  const [showTooltip, setShowTooltip] = useState(true);

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const handleWhatsAppClick = () => {
    window.open(getWhatsAppUrl(), "_blank");
  };

  return (
    <div
      className="fixed bottom-[5.5rem] left-3 md:bottom-8 md:left-8 z-30 flex items-center gap-2 select-none no-print"
      dir="ltr"
    >
      {/* Mini Tooltip Badge */}
      {showTooltip && (
        <div className="hidden md:flex items-center gap-2 bg-slate-900/95 text-white text-[11px] font-bold py-1.5 px-3 rounded-2xl shadow-xl backdrop-blur-md border border-slate-700 animate-in fade-in slide-in-from-left duration-200">
          <span>تواصل مع {STORE_CONFIG.name} عبر واتساب 💬</span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowTooltip(false);
            }}
            className="text-slate-400 hover:text-white transition-colors"
            aria-label="إغلاق"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        type="button"
        onClick={handleWhatsAppClick}
        className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#25D366] hover:bg-[#20bd5a] active:scale-95 text-white flex items-center justify-center shadow-2xl shadow-[#25D366]/50 transition-all group relative border-2 border-white cursor-pointer"
        title="محادثة واتساب فورية مع متجر سما الخضراء"
        aria-label="تواصل عبر واتساب"
      >
        <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full animate-ping" />
        <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full" />
        <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 fill-white group-hover:scale-110 transition-transform" />
      </button>
    </div>
  );
}
