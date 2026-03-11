"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { PRODUCTS } from "@/lib/mock-data";
import { CartItem } from "@/types";
import { formatCurrency, cn } from "@/lib/utils";
import {
  ArrowLeft,
  CheckCircle,
  Zap,
  ShoppingBag,
  CreditCard,
} from "lucide-react";

type Step = "info" | "payment" | "success";

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [step, setStep] = useState<Step>("info");

  // Rebuild cart from query string
  const [cart, setCart] = useState<CartItem[]>([]);
  useEffect(() => {
    try {
      const raw = searchParams.get("cart");
      if (!raw) return;
      const items: { id: string; qty: number }[] = JSON.parse(raw);
      const rebuilt: CartItem[] = items
        .map((item) => {
          const product = PRODUCTS.find((p) => p.id === item.id);
          return product ? { product, quantity: item.qty } : null;
        })
        .filter(Boolean) as CartItem[];
      setCart(rebuilt);
    } catch {}
  }, [searchParams]);

  const subtotal = cart.reduce((s, i) => s + i.product.price * i.quantity, 0);

  // Form state
  const [info, setInfo] = useState({ name: "", email: "", phone: "", address: "", city: "", state: "", zip: "" });
  const [payment, setPayment] = useState({ cardNumber: "", expiry: "", cvv: "", nameOnCard: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validateInfo() {
    const e: Record<string, string> = {};
    if (!info.name.trim()) e.name = "Required";
    if (!info.email.includes("@")) e.email = "Valid email required";
    if (!info.phone.trim()) e.phone = "Required";
    if (!info.address.trim()) e.address = "Required";
    if (!info.city.trim()) e.city = "Required";
    if (!info.state.trim()) e.state = "Required";
    if (!info.zip.trim()) e.zip = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function validatePayment() {
    const e: Record<string, string> = {};
    if (payment.cardNumber.replace(/\s/g, "").length < 16) e.cardNumber = "Enter a valid card number";
    if (!payment.expiry.match(/^\d{2}\/\d{2}$/)) e.expiry = "MM/YY";
    if (payment.cvv.length < 3) e.cvv = "Required";
    if (!payment.nameOnCard.trim()) e.nameOnCard = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleInfoNext(e: React.FormEvent) {
    e.preventDefault();
    if (validateInfo()) setStep("payment");
  }

  function handlePlaceOrder(e: React.FormEvent) {
    e.preventDefault();
    if (validatePayment()) setStep("success");
  }

  if (cart.length === 0 && step !== "success") {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4 text-gray-500">
        <ShoppingBag className="w-12 h-12 opacity-30" />
        <p className="text-sm">Your cart is empty.</p>
        <Link href="/store" className="text-sm text-orange-500 hover:underline">Back to store</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center gap-3">
          <div className="w-7 h-7 bg-orange-500 rounded-lg flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-bold text-gray-900">Apex Roofing</span>
          <span className="text-gray-300">/</span>
          <span className="text-sm text-gray-500">Checkout</span>
        </div>
      </header>

      {step === "success" ? (
        <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Order placed!</h1>
          <p className="text-gray-500 text-sm mb-1">Thank you, <strong>{info.name || "Customer"}</strong>. Your order has been received.</p>
          <p className="text-gray-400 text-xs mb-8">A confirmation will be sent to <strong>{info.email || "your email"}</strong>.</p>
          <div className="flex gap-3">
            <Link href="/store" className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all">
              Continue Shopping
            </Link>
          </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Steps */}
            <div className="flex items-center gap-2">
              {["info", "payment"].map((s, i) => (
                <div key={s} className="flex items-center gap-2">
                  <div className={cn("w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                    step === s ? "bg-orange-500 text-white" : i === 0 && step === "payment" ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500"
                  )}>
                    {i === 0 && step === "payment" ? <CheckCircle className="w-3.5 h-3.5" /> : i + 1}
                  </div>
                  <span className={cn("text-xs font-medium capitalize", step === s ? "text-gray-900" : "text-gray-400")}>{s === "info" ? "Shipping" : "Payment"}</span>
                  {i === 0 && <span className="text-gray-300 mx-1">›</span>}
                </div>
              ))}
            </div>

            {/* Step 1: Shipping info */}
            {step === "info" && (
              <form onSubmit={handleInfoNext} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
                <h2 className="text-base font-semibold text-gray-900">Shipping Information</h2>
                <div className="grid grid-cols-2 gap-4">
                  <CheckoutField label="Full Name" error={errors.name} span={2}>
                    <input value={info.name} onChange={(e) => setInfo((p) => ({ ...p, name: e.target.value }))}
                      placeholder="John Smith" className={inputCls(errors.name)} />
                  </CheckoutField>
                  <CheckoutField label="Email" error={errors.email}>
                    <input type="email" value={info.email} onChange={(e) => setInfo((p) => ({ ...p, email: e.target.value }))}
                      placeholder="john@example.com" className={inputCls(errors.email)} />
                  </CheckoutField>
                  <CheckoutField label="Phone" error={errors.phone}>
                    <input value={info.phone} onChange={(e) => setInfo((p) => ({ ...p, phone: e.target.value }))}
                      placeholder="(555) 000-0000" className={inputCls(errors.phone)} />
                  </CheckoutField>
                  <CheckoutField label="Street Address" error={errors.address} span={2}>
                    <input value={info.address} onChange={(e) => setInfo((p) => ({ ...p, address: e.target.value }))}
                      placeholder="123 Main St" className={inputCls(errors.address)} />
                  </CheckoutField>
                  <CheckoutField label="City" error={errors.city}>
                    <input value={info.city} onChange={(e) => setInfo((p) => ({ ...p, city: e.target.value }))}
                      placeholder="Austin" className={inputCls(errors.city)} />
                  </CheckoutField>
                  <div className="grid grid-cols-2 gap-4">
                    <CheckoutField label="State" error={errors.state}>
                      <input value={info.state} onChange={(e) => setInfo((p) => ({ ...p, state: e.target.value }))}
                        placeholder="TX" className={inputCls(errors.state)} />
                    </CheckoutField>
                    <CheckoutField label="ZIP" error={errors.zip}>
                      <input value={info.zip} onChange={(e) => setInfo((p) => ({ ...p, zip: e.target.value }))}
                        placeholder="78701" className={inputCls(errors.zip)} />
                    </CheckoutField>
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <Link href="/store" className="flex items-center gap-1.5 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors">
                    <ArrowLeft className="w-3.5 h-3.5" /> Back to store
                  </Link>
                  <button type="submit" className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-lg transition-all">
                    Continue to Payment →
                  </button>
                </div>
              </form>
            )}

            {/* Step 2: Payment */}
            {step === "payment" && (
              <form onSubmit={handlePlaceOrder} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-semibold text-gray-900">Payment</h2>
                  <CreditCard className="w-4 h-4 text-gray-400" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <CheckoutField label="Card Number" error={errors.cardNumber} span={2}>
                    <input
                      value={payment.cardNumber}
                      onChange={(e) => {
                        const v = e.target.value.replace(/\D/g, "").slice(0, 16);
                        setPayment((p) => ({ ...p, cardNumber: v.replace(/(.{4})/g, "$1 ").trim() }));
                      }}
                      placeholder="1234 5678 9012 3456"
                      className={inputCls(errors.cardNumber)}
                    />
                  </CheckoutField>
                  <CheckoutField label="Name on Card" error={errors.nameOnCard} span={2}>
                    <input value={payment.nameOnCard} onChange={(e) => setPayment((p) => ({ ...p, nameOnCard: e.target.value }))}
                      placeholder="John Smith" className={inputCls(errors.nameOnCard)} />
                  </CheckoutField>
                  <CheckoutField label="Expiry (MM/YY)" error={errors.expiry}>
                    <input
                      value={payment.expiry}
                      onChange={(e) => {
                        let v = e.target.value.replace(/\D/g, "").slice(0, 4);
                        if (v.length > 2) v = v.slice(0, 2) + "/" + v.slice(2);
                        setPayment((p) => ({ ...p, expiry: v }));
                      }}
                      placeholder="08/28"
                      className={inputCls(errors.expiry)}
                    />
                  </CheckoutField>
                  <CheckoutField label="CVV" error={errors.cvv}>
                    <input type="password" maxLength={4} value={payment.cvv} onChange={(e) => setPayment((p) => ({ ...p, cvv: e.target.value.replace(/\D/g, "") }))}
                      placeholder="•••" className={inputCls(errors.cvv)} />
                  </CheckoutField>
                </div>
                <p className="text-xs text-gray-400 flex items-center gap-1">
                  🔒 Secured with 256-bit encryption. Card details are not stored.
                </p>
                <div className="flex items-center justify-between pt-2">
                  <button type="button" onClick={() => setStep("info")} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
                    <ArrowLeft className="w-3.5 h-3.5" /> Back
                  </button>
                  <button type="submit" className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-lg transition-all">
                    Place Order · {formatCurrency(subtotal)}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Order summary */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Order Summary</h3>
              <ul className="space-y-3">
                {cart.map(({ product, quantity }) => (
                  <li key={product.id} className="flex justify-between text-sm">
                    <div>
                      <p className="text-gray-800 font-medium leading-snug">{product.name}</p>
                      <p className="text-xs text-gray-400">Qty {quantity} × {formatCurrency(product.price)}</p>
                    </div>
                    <span className="font-semibold text-gray-900">{formatCurrency(product.price * quantity)}</span>
                  </li>
                ))}
              </ul>
              <div className="border-t border-gray-100 mt-4 pt-4 space-y-1.5 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span><span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Shipping</span><span className="text-green-600 font-medium">Free</span>
                </div>
                <div className="flex justify-between font-bold text-gray-900 text-base pt-1 border-t border-gray-100">
                  <span>Total</span><span>{formatCurrency(subtotal)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function inputCls(error?: string) {
  return cn(
    "w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 transition-all",
    error ? "border-red-300 focus:ring-red-300" : "border-gray-200 focus:ring-orange-400"
  );
}

function CheckoutField({ label, error, span, children }: { label: string; error?: string; span?: number; children: React.ReactNode }) {
  return (
    <div className={cn(span === 2 ? "col-span-2" : "")}>
      <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
