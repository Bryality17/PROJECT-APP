"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Zap, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate login delay
    await new Promise((r) => setTimeout(r, 800));
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-lg font-bold text-white leading-none">Baselyne</p>
            <p className="text-[11px] text-gray-500 leading-none mt-0.5">Freeze Chaos. Heat Results.</p>
          </div>
        </div>

        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-7 shadow-2xl">
          <h1 className="text-lg font-bold text-white mb-1">Sign in</h1>
          <p className="text-sm text-gray-500 mb-6">Access your organization dashboard</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-300 block mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
                className="w-full rounded-lg border border-gray-700 bg-gray-800 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent py-2.5 px-3"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-300 block mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent py-2.5 px-3 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-3.5 h-3.5 accent-orange-500" />
                <span className="text-xs text-gray-400">Remember me</span>
              </label>
              <button type="button" className="text-xs text-orange-400 hover:text-orange-300">
                Forgot password?
              </button>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold py-2.5 px-4 rounded-lg text-sm transition-colors shadow-lg shadow-orange-500/20 mt-2"
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <p className="text-center text-xs text-gray-500 mt-5">
            Don&apos;t have an account?{" "}
            <Link href="/dashboard" className="text-orange-400 hover:text-orange-300 font-medium">
              Request access
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-gray-600 mt-4">
          &copy; 2026 Baselyne. All rights reserved.
        </p>
      </div>
    </div>
  );
}
