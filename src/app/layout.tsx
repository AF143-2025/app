import type { Metadata, Viewport } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/cart-context";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-cairo",
});
import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import { CartDrawer } from "@/components/cart-drawer";
import { MobileTabBar } from "@/components/mobile-tab-bar";
import { FloatingWhatsApp } from "@/components/floating-whatsapp";
import { SplashScreen } from "@/components/splash-screen";
import Image from "next/image";
import { Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "سما الخضراء | متجر الهواتف الذكية، الأقساط، والصيانة المعتمدة",
  description: "تطبيق متجر سما الخضراء: أحدث هواتف iPhone و Samsung، بيع كاش وبالأقساط الميسرة، صيانة فورية للأجهزة، واستبدال بضمان رسمي معتمد.",
  manifest: "/manifest.json",
  icons: {
    icon: "/images/app-icon-modern.jpg",
    apple: "/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "سما الخضراء",
  },
  openGraph: {
    title: "سما الخضراء للهواتف والأقساط",
    description: "أحدث أجهزة iPhone و Samsung كاش وبالأقساط الميسرة مع ورشة صيانة فورية",
    siteName: "سما الخضراء",
    locale: "ar_IQ",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#047857",
  interactiveWidget: "resizes-content",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={cairo.variable}>
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="application-name" content="سما الخضراء" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ElectronicsStore",
              "name": "شركة سما الخضراء للهواتف الذكية والصيانة المعتمدة",
              "image": "https://netscape-circulation-java-poll.trycloudflare.com/images/sama-logo-emblem.png",
              "telephone": "+9647701234567",
              "url": "https://netscape-circulation-java-poll.trycloudflare.com",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "الكرادة، ساحة الواثق، مجاور مصرف الرافدين",
                "addressLocality": "بغداد",
                "addressCountry": "IQ"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 33.3089,
                "longitude": 44.4285
              },
              "openingHoursSpecification": [
                {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
                  "opens": "09:00",
                  "closes": "23:00"
                },
                {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": ["Friday"],
                  "opens": "13:00",
                  "closes": "23:00"
                }
              ],
              "priceRange": "$$"
            })
          }}
        />
      </head>
      <body className={`${cairo.className} min-h-screen flex antialiased bg-slate-50 text-slate-900 selection:bg-emerald-100 selection:text-emerald-900 font-sans`}>
        <SplashScreen />
        <CartProvider>
          {/* Slide-out Navigation Drawer */}
          <Sidebar />

          {/* Main App Canvas */}
          <div className="flex-1 flex flex-col min-h-screen transition-all duration-300 w-full max-w-full">
            <Navbar />
            <CartDrawer />
            <main className="flex-1 w-full max-w-full pb-[calc(env(safe-area-inset-bottom,0px)+5.5rem)] md:pb-16">{children}</main>
          </div>

          {/* Mobile Native Bottom Navigation Bar (Active on mobile viewports) */}
          <MobileTabBar />
          <FloatingWhatsApp />
        </CartProvider>
      </body>
    </html>
  );
}
