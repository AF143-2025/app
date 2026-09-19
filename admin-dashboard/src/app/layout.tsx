import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "لوحة تحكم المدير العام • سما الخضراء",
  description: "لوحة تحكم إدارية مخصصة لإدارة متجر سما الخضراء للهواتف الذكية",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className="antialiased selection:bg-emerald-500 selection:text-white bg-slate-900 text-slate-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}
