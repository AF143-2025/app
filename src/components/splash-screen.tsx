"use client";

import { useState, useEffect } from "react";
import { Search, ShoppingCart, Package } from "lucide-react";

export function SplashScreen() {
  const [stage, setStage] = useState<"loading" | "splash" | "onboarding" | "done">("loading");
  const [onboardingStep, setOnboardingStep] = useState(0);

  useEffect(() => {
    // Check if user has already seen the splash screen in this session
    const hasSeenSplash = sessionStorage.getItem("sama_splash_seen");
    if (hasSeenSplash) {
      setStage("done");
      return;
    }

    // 1. Show splash logo
    setStage("splash");

    // 2. After 1.5s, start onboarding
    const splashTimer = setTimeout(() => {
      setStage("onboarding");
    }, 1500);

    return () => clearTimeout(splashTimer);
  }, []);

  useEffect(() => {
    if (stage === "onboarding") {
      // Auto-play onboarding steps every 1.5 seconds
      const interval = setInterval(() => {
        setOnboardingStep((prev) => {
          if (prev >= 2) {
            clearInterval(interval);
            // Finish onboarding after the last step is shown for 1.5s
            setTimeout(() => {
              sessionStorage.setItem("sama_splash_seen", "true");
              setStage("done");
            }, 1500);
            return prev;
          }
          return prev + 1;
        });
      }, 1500);

      return () => clearInterval(interval);
    }
  }, [stage]);

  if (stage === "loading" || stage === "done") return null;

  const steps = [
    {
      icon: Search,
      title: "ابحث",
      desc: "تصفح أحدث الأجهزة الذكية بسهولة",
      color: "text-emerald-500",
      bg: "bg-emerald-50",
    },
    {
      icon: ShoppingCart,
      title: "اطلب",
      desc: "كاش أو بالأقساط الميسرة",
      color: "text-emerald-600",
      bg: "bg-emerald-100/50",
    },
    {
      icon: Package,
      title: "استلم",
      desc: "توصيل سريع وآمن لباب بيتك",
      color: "text-emerald-700",
      bg: "bg-emerald-100",
    },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#F8FAFC] overflow-hidden" dir="rtl">
      
      {/* 1. Splash Screen (Logo) */}
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center bg-white transition-opacity duration-700 ${
          stage === "splash" ? "opacity-100 z-50" : "opacity-0 pointer-events-none z-0"
        }`}
      >
        <div className="relative w-40 h-40 sm:w-48 sm:h-48 animate-pulse-slow">
          <img
            src="/images/sama-logo-emblem.png"
            alt="سما الخضراء"
            className="w-full h-full object-contain drop-shadow-xl"
          />
        </div>
        <div className="mt-8 flex gap-1.5">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" />
        </div>
      </div>

      {/* 2. Onboarding Screen */}
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center bg-white transition-all duration-700 ${
          stage === "onboarding" ? "opacity-100 translate-y-0 z-50" : "opacity-0 translate-y-8 pointer-events-none z-0"
        }`}
      >
        <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md px-6 text-center space-y-8 mb-10">
          
          {/* Icons container */}
          <div className="relative w-full h-64 flex items-center justify-center">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isActive = idx === onboardingStep;
              return (
                <div
                  key={idx}
                  className={`absolute transition-all duration-500 ease-out ${
                    isActive
                      ? "opacity-100 scale-100 translate-x-0"
                      : idx < onboardingStep
                      ? "opacity-0 scale-50 translate-x-12"
                      : "opacity-0 scale-50 -translate-x-12"
                  }`}
                >
                  <div className={`w-32 h-32 rounded-[2.5rem] ${step.bg} flex items-center justify-center shadow-lg shadow-emerald-500/10`}>
                    <Icon className={`w-14 h-14 ${step.color} stroke-[1.5]`} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Text container */}
          <div className="space-y-3 h-24">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              {steps[onboardingStep].title}
            </h2>
            <p className="text-sm font-bold text-slate-500 max-w-[250px] mx-auto leading-relaxed">
              {steps[onboardingStep].desc}
            </p>
          </div>

          {/* Dots */}
          <div className="flex gap-2 pt-4">
            {steps.map((_, idx) => (
              <div
                key={idx}
                className={`transition-all duration-300 rounded-full h-1.5 ${
                  idx === onboardingStep ? "w-8 bg-emerald-500" : "w-2 bg-slate-200"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}