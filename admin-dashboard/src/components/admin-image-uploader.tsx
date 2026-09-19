"use client";

import React, { useState, useRef } from "react";
import {
  Upload,
  Link2,
  CheckCircle2,
  Trash2,
  Loader2,
  Image as ImageIcon,
  ExternalLink,
} from "lucide-react";
import { adminApiFetch, API_BASE_URL } from "@/lib/api";

interface AdminImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
}

export function AdminImageUploader({
  value,
  onChange,
  label = "صورة المنتج / القسم",
  placeholder = "https://...",
  required = false,
}: AdminImageUploaderProps) {
  const [mode, setMode] = useState<"upload" | "url">(
    value && !value.startsWith("/uploads/") && !value.startsWith("data:")
      ? "url"
      : "upload"
  );
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await adminApiFetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success && data.url) {
        // If relative URL returned, format with API_BASE_URL
        const finalUrl = data.url.startsWith("http")
          ? data.url
          : `${API_BASE_URL}${data.url}`;
        onChange(finalUrl);
      } else {
        // Fallback to local Base64 Data URL if upload failed
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === "string") {
            onChange(reader.result);
          }
        };
        reader.readAsDataURL(file);
      }
    } catch (err: any) {
      // Fallback to Base64
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          onChange(reader.result);
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="space-y-2 text-right" dir="rtl">
      {/* Header & Mode Switcher */}
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-300">
          {label} {required && <span className="text-rose-400">*</span>}
        </label>
        <div className="flex items-center gap-1 bg-slate-800/80 p-0.5 rounded-xl border border-slate-700">
          <button
            type="button"
            onClick={() => setMode("upload")}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-all ${
              mode === "upload"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>رفع من الجهاز</span>
          </button>
          <button
            type="button"
            onClick={() => setMode("url")}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-all ${
              mode === "url"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Link2 className="w-3.5 h-3.5" />
            <span>رابط مباشر (URL)</span>
          </button>
        </div>
      </div>

      {/* Upload Mode */}
      {mode === "upload" && (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="relative border-2 border-dashed border-slate-700 hover:border-emerald-500/60 rounded-2xl p-4 text-center bg-slate-800/40 hover:bg-slate-800/60 transition-all cursor-pointer group select-none"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          {isUploading ? (
            <div className="py-2 flex flex-col items-center justify-center gap-2">
              <Loader2 className="w-6 h-6 text-emerald-400 animate-spin" />
              <span className="text-xs text-slate-300 font-bold">جاري رفع ومعالجة الصورة...</span>
            </div>
          ) : (
            <div className="space-y-1.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                <Upload className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold text-slate-200">
                اضغط هنا لاختيار صورة من اللابتوب أو الهاتف
              </div>
              <div className="text-[10px] text-slate-400">
                يدعم صيغ JPG و PNG و WebP و GIF حتى 10 ميجابايت
              </div>
            </div>
          )}
        </div>
      )}

      {/* URL Mode */}
      {mode === "url" && (
        <div>
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full py-2.5 px-3 rounded-2xl bg-slate-800 border border-slate-700 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none text-white font-mono text-left"
            dir="ltr"
          />
        </div>
      )}

      {/* Error Message */}
      {uploadError && (
        <div className="text-[11px] text-rose-400 font-bold bg-rose-500/10 p-2 rounded-xl border border-rose-500/20">
          ⚠️ {uploadError}
        </div>
      )}

      {/* Live Preview Thumbnail */}
      {value && (
        <div className="flex items-center gap-3 p-2 bg-slate-800/90 rounded-2xl border border-slate-700">
          <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-600 shrink-0 bg-slate-950 flex items-center justify-center">
            <img
              src={value}
              alt="معاينة"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://images.unsplash.com/photo-1511707171634-5f897ff02560?w=200";
              }}
            />
          </div>
          <div className="flex-1 min-w-0 text-right">
            <div className="text-xs font-bold text-slate-200 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>تم اختيار الصورة</span>
            </div>
            <div className="text-[10px] text-slate-400 truncate font-mono mt-0.5" dir="ltr">
              {value}
            </div>
          </div>
          <button
            type="button"
            onClick={() => onChange("")}
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
            title="إزالة الصورة"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
