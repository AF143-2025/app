"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  CreditCard,
  Lock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Smartphone,
  Building,
  Banknote,
  KeyRound,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

interface PaymentModalProps {
  orderId: string;
  orderNumber: string;
  totalAmount: number;
  paymentIntent: {
    transactionId: string;
    clientSecret: string;
    gatewayReference: string;
    amount: number;
    currency: string;
    paymentMethod: string;
  };
  onClose: () => void;
  onSuccess: (orderId: string) => void;
}

type GatewayStep = "CARD_INPUT" | "OTP_CHALLENGE" | "VERIFYING_SERVER" | "SUCCESS" | "FAILED";

export function PaymentModal({
  orderId,
  orderNumber,
  totalAmount,
  paymentIntent,
  onClose,
  onSuccess,
}: PaymentModalProps) {
  const router = useRouter();
  const [step, setStep] = useState<GatewayStep>("CARD_INPUT");
  const [selectedMethod, setSelectedMethod] = useState(paymentIntent.paymentMethod || "CARD");

  // Hosted Fields state (Client-side only, NEVER saved to database)
  const [cardHolder, setCardHolder] = useState("سارة أحمد");
  const [cardNumber, setCardNumber] = useState("4242 •••• •••• 4242");
  const [cardExpiry, setCardExpiry] = useState("12/28");
  const [cardCvv, setCardCvv] = useState("•••");
  const [cardBrand, setCardBrand] = useState("Visa / Mada");
  const [otpCode, setOtpCode] = useState("8921");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [webhookDetails, setWebhookDetails] = useState<any | null>(null);

  // Quick-fill test credentials
  const fillSuccessCard = () => {
    setCardNumber("4242 4242 4242 4242");
    setCardBrand("Visa / Mada");
    setCardExpiry("12/28");
    setCardCvv("123");
  };

  const fillFailedCard = () => {
    setCardNumber("4000 0000 0000 0002");
    setCardBrand("MasterCard");
    setCardExpiry("05/25");
    setCardCvv("999");
  };

  // Step 1: Submit card to Gateway Sandbox (Initiate 3D Secure)
  const handleAuthorizeCard = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setStep("OTP_CHALLENGE");
  };

  // Step 2: Submit OTP & Trigger Gateway Signed Webhook
  const handleVerifyOtp = async (simulatedStatus: "Paid" | "Failed" = "Paid") => {
    setStep("VERIFYING_SERVER");
    setErrorMessage(null);

    try {
      // Simulate external Payment Gateway sending signed webhook to our server
      const isFailed = simulatedStatus === "Failed" || cardNumber.endsWith("0002");
      const statusToReport = isFailed ? "Failed" : "Paid";

      const res = await fetch("/api/payment/simulate-gateway-callback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transactionId: paymentIntent.transactionId,
          orderId,
          status: statusToReport,
          cardBrand,
          lastFourDigits: cardNumber.replace(/\D/g, "").slice(-4) || "4242",
          failureReason: isFailed ? "تم رفض المعاملة من البنك المصدر (Insufficient Funds / Card Declined)" : undefined,
        }),
      });

      const data = await res.json();

      if (data.success && !isFailed) {
        setWebhookDetails(data.simulatedGatewayResponse);
        setStep("SUCCESS");
      } else {
        setErrorMessage(
          isFailed
            ? "تم رفض العملية من البنك المصدر للبطاقة. يمكنك المحاولة ببطاقة أخرى."
            : data.error || "فشل التحقق من الدفع"
        );
        setStep("FAILED");
      }
    } catch (err: any) {
      setErrorMessage("حدث خطأ أثناء الاتصال ببوابة الدفع: " + err.message);
      setStep("FAILED");
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-md transition-opacity animate-in fade-in" />

      <div className="min-h-full flex items-center justify-center p-4">
        <div className="relative bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden border border-gray-100 animate-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold flex items-center gap-1.5">
                    <span>بوابة الدفع الإلكتروني الآمنة</span>
                    <span className="text-[10px] bg-emerald-500/30 text-emerald-300 px-1.5 py-0.5 rounded font-mono">
                      PCI-DSS
                    </span>
                  </h3>
                  <div className="text-[11px] text-gray-300 mt-0.5">
                    رقم الطلب: <span className="font-mono text-white">{orderNumber}</span>
                  </div>
                </div>
              </div>

              <div className="text-left">
                <div className="text-[11px] text-gray-400">المبلغ المستحق</div>
                <div className="text-lg font-black text-emerald-400">
                  {totalAmount.toLocaleString("ar-SA")} ر.س
                </div>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-6">
            {/* STEP 1: Card Input */}
            {step === "CARD_INPUT" && (
              <div>
                {/* Method Tabs */}
                <div className="grid grid-cols-3 gap-2 mb-5">
                  <button
                    type="button"
                    onClick={() => setSelectedMethod("CARD")}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                      selectedMethod === "CARD"
                        ? "border-emerald-600 bg-emerald-50/50 text-emerald-800 shadow-sm"
                        : "border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>بطاقة بنكية</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedMethod("WALLET")}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                      selectedMethod === "WALLET"
                        ? "border-emerald-600 bg-emerald-50/50 text-emerald-800 shadow-sm"
                        : "border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>Apple / STC Pay</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedMethod("LOCAL_GATEWAY")}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                      selectedMethod === "LOCAL_GATEWAY"
                        ? "border-emerald-600 bg-emerald-50/50 text-emerald-800 shadow-sm"
                        : "border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <Building className="w-4 h-4" />
                    <span>سداد / كي نت</span>
                  </button>
                </div>

                {/* Test Credentials Shortcut */}
                <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-3 mb-4 text-xs">
                  <div className="font-bold text-amber-900 flex items-center gap-1.5 mb-1.5">
                    <span>⚡ بطاقات تجريبية للاختبار السريع:</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={fillSuccessCard}
                      className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[11px] hover:bg-emerald-700 transition-colors"
                    >
                      بطاقة ناجحة (Success)
                    </button>
                    <button
                      type="button"
                      onClick={fillFailedCard}
                      className="px-2.5 py-1 rounded-lg bg-red-600 text-white font-bold text-[11px] hover:bg-red-700 transition-colors"
                    >
                      بطاقة مرفوضة (Decline)
                    </button>
                  </div>
                </div>

                {/* Form Fields */}
                <form onSubmit={handleAuthorizeCard} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      اسم حامل البطاقة
                    </label>
                    <input
                      type="text"
                      required
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                      placeholder="كما هو مكتوب على البطاقة"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-gray-700">رقم البطاقة</label>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                        {cardBrand}
                      </span>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono tracking-wider text-left"
                        dir="ltr"
                        placeholder="•••• •••• •••• ••••"
                      />
                      <CreditCard className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        تاريخ الانتهاء
                      </label>
                      <input
                        type="text"
                        required
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-center"
                        placeholder="MM/YY"
                        maxLength={5}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        رمز الأمان (CVV)
                      </label>
                      <input
                        type="password"
                        required
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-center"
                        placeholder="•••"
                        maxLength={4}
                      />
                    </div>
                  </div>

                  {/* Security Notice */}
                  <div className="text-[11px] text-gray-500 bg-gray-50 p-2.5 rounded-xl flex items-start gap-2 border border-gray-100">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>
                      لن يتم تخزين بيانات بطاقتك أو رمز الأمان داخل السيرفر مطلقاً. المعالجة مشفرة
                      مباشرة مع البوابة الرسمية.
                    </span>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="w-1/3 py-3 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      إلغاء
                    </button>
                    <button
                      type="submit"
                      className="w-2/3 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all active:scale-95 flex items-center justify-center gap-1.5"
                    >
                      <span>متابعة والتحقق البنكي (3DS)</span>
                      <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* STEP 2: 3D Secure OTP Challenge */}
            {step === "OTP_CHALLENGE" && (
              <div className="text-center py-2 space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center border border-emerald-200">
                  <KeyRound className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-gray-900">التحقق بخطوتين (3D Secure)</h4>
                  <p className="text-xs text-gray-500 max-w-xs mx-auto mt-1">
                    أرسل البنك رمز التحقق إلى هاتفك المسجل المنتهي برقم{" "}
                    <span className="font-mono font-bold text-gray-800">•••567</span>
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 max-w-xs mx-auto">
                  <div className="text-xs text-gray-500 mb-2">أدخل رمز التحقق (رمز تجريبي: 8921)</div>
                  <input
                    type="text"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    className="w-full text-center text-xl font-mono tracking-widest font-black py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500"
                    maxLength={6}
                  />
                </div>

                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => handleVerifyOtp("Paid")}
                    className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition-all active:scale-95"
                  >
                    تأكيد المعاملة وإرسال إشعار الدفع للبوابة
                  </button>

                  <button
                    type="button"
                    onClick={() => handleVerifyOtp("Failed")}
                    className="w-full py-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold transition-all"
                  >
                    محاكاة فشل العملية من البنك
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Verifying with Server Webhook */}
            {step === "VERIFYING_SERVER" && (
              <div className="text-center py-8 space-y-4">
                <div className="w-14 h-14 rounded-full border-4 border-emerald-600 border-t-transparent animate-spin mx-auto" />
                <div>
                  <h4 className="text-base font-bold text-gray-900">
                    جاري التحقق المشفر من الـ Webhook
                  </h4>
                  <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
                    يتم التحقق من توقيع HMAC-SHA256 وتأكيد العملية من خادم المتجر بشكل مستقل...
                  </p>
                </div>
              </div>
            )}

            {/* STEP 4: Success State */}
            {step === "SUCCESS" && (
              <div className="text-center py-2 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div>
                  <h4 className="text-lg font-black text-gray-900">
                    تم تأكيد الدفع بنجاح! 🎉
                  </h4>
                  <p className="text-xs text-gray-600 mt-1">
                    تم تأكيد العملية من السيرفر عبر الويب هوك الرسمي، وتحديث حالة الطلب إلى{" "}
                    <span className="font-bold text-emerald-700">مؤكد (Confirmed)</span>
                  </p>
                </div>

                {/* Webhook Proof Badge */}
                <div className="bg-emerald-50 border border-emerald-200 text-right p-3 rounded-xl text-[11px] space-y-1">
                  <div className="text-emerald-800 font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>شهادة التحقق الأمني من الخادم (Server Verified):</span>
                  </div>
                  <div className="text-gray-600 font-mono text-[10px] break-all">
                    المرجع البنكي: {paymentIntent.gatewayReference}
                  </div>
                  <div className="text-gray-600 font-mono text-[10px]">
                    نوع البطاقة: {cardBrand} (ينتهي بـ {cardNumber.replace(/\D/g, "").slice(-4) || "4242"})
                  </div>
                  <div className="text-emerald-700 font-bold text-[10px]">
                    ✓ تم إصدار الفاتورة الإلكترونية وتسجيلها في Audit Logs
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => router.push(`/orders/${orderId}`)}
                    className="w-1/2 py-3 rounded-xl bg-gray-900 text-white text-xs font-bold hover:bg-black transition-colors"
                  >
                    متابعة وتتبع الطلب
                  </button>
                  <button
                    onClick={() => router.push(`/orders/${orderId}/invoice`)}
                    className="w-1/2 py-3 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors shadow-sm"
                  >
                    عرض الفاتورة الرقمية 🧾
                  </button>
                </div>
              </div>
            )}

            {/* STEP 5: Failed State */}
            {step === "FAILED" && (
              <div className="text-center py-2 space-y-4">
                <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 mx-auto flex items-center justify-center">
                  <XCircle className="w-10 h-10" />
                </div>
                <div>
                  <h4 className="text-lg font-black text-gray-900">فشلت عملية الدفع</h4>
                  <p className="text-xs text-red-600 mt-1 max-w-xs mx-auto">
                    {errorMessage || "لم تتم عملية الخصم. يرجى التحقق من بيانات البطاقة أو الرصيد."}
                  </p>
                </div>

                <div className="bg-red-50 border border-red-200 text-right p-3 rounded-xl text-[11px] text-red-800 space-y-1">
                  <div className="font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                    <span>تم توثيق محاولة الدفع الفاشلة في سجلات الأمان.</span>
                  </div>
                  <div className="text-[10px] text-gray-600">
                    حالة الطلب لا تزال معلقة لحين اختيار وسيلة دفع أخرى أو إعادة المحاولة.
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={onClose}
                    className="w-1/2 py-3 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    إغلاق
                  </button>
                  <button
                    onClick={() => setStep("CARD_INPUT")}
                    className="w-1/2 py-3 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors"
                  >
                    إعادة المحاولة ببطاقة أخرى
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
