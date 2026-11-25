"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import globalStore from "@/lib/data/store";
import { Lock, Mail, ArrowRight, ShieldCheck, User } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("rohit@example.com");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter a valid email address.");
      return;
    }
    // Switch to customer session
    globalStore.setSession("customer", "u-customer-1");
    router.push("/account");
  };

  const handleQuickDemo = (role: "customer" | "groomer" | "admin") => {
    globalStore.setSession(role);
    if (role === "admin") router.push("/admin");
    else if (role === "groomer") router.push("/groomer");
    else router.push("/account");
  };

  return (
    <>
      <Navbar />

      <main className="flex-1 py-12 lg:py-20 bg-cream-100 flex items-center justify-center">
        <div className="max-w-md w-full mx-4 bg-white p-8 rounded-3xl border border-cream-200 shadow-soft space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-forest-900 text-white flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6 text-coral-400" />
            </div>
            <h1 className="text-2xl font-serif font-bold text-forest-950">
              Welcome Back
            </h1>
            <p className="text-xs text-charcoal-500">
              Log in to manage your pets, view appointments, and book grooming.
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-charcoal-700">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-cream-300 focus:outline-none focus:ring-2 focus:ring-forest-800 text-sm"
                  placeholder="rohit@example.com"
                />
                <Mail className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-charcoal-700">Password</label>
                <a href="#" className="text-[11px] text-forest-800 hover:underline">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-cream-300 focus:outline-none focus:ring-2 focus:ring-forest-800 text-sm"
                  placeholder="••••••••"
                />
                <Lock className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-forest-900 hover:bg-forest-800 text-white font-semibold text-sm shadow-soft transition-colors flex items-center justify-center gap-2"
            >
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Switcher */}
          <div className="pt-4 border-t border-cream-200 space-y-2">
            <div className="text-[11px] uppercase tracking-wider text-charcoal-400 font-semibold text-center">
              Quick 1-Click Demo Login
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo("customer")}
                className="py-2 px-1 text-xs font-medium rounded-lg bg-cream-100 hover:bg-cream-200 text-charcoal-800 border border-cream-300"
              >
                Customer
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo("groomer")}
                className="py-2 px-1 text-xs font-medium rounded-lg bg-cream-100 hover:bg-cream-200 text-charcoal-800 border border-cream-300"
              >
                Groomer
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo("admin")}
                className="py-2 px-1 text-xs font-medium rounded-lg bg-cream-100 hover:bg-cream-200 text-charcoal-800 border border-cream-300"
              >
                Admin
              </button>
            </div>
          </div>

          <div className="text-center text-xs text-charcoal-600">
            Don't have an account yet?{" "}
            <Link href="/register" className="font-bold text-coral-600 hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
