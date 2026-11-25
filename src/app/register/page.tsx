"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import globalStore from "@/lib/data/store";
import { User, Mail, Phone, Lock, ArrowRight, ShieldCheck } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !phone) {
      setError("Please fill in all required fields.");
      return;
    }
    if (!agreed) {
      setError("Please agree to our safe grooming and cancellation terms.");
      return;
    }

    // Auto log in as customer
    globalStore.setSession("customer", "u-customer-1");
    router.push("/account/pets/new");
  };

  return (
    <>
      <Navbar />

      <main className="flex-1 py-12 lg:py-20 bg-cream-100 flex items-center justify-center">
        <div className="max-w-md w-full mx-4 bg-white p-8 rounded-3xl border border-cream-200 shadow-soft space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-forest-900 text-white flex items-center justify-center mx-auto">
              <User className="w-6 h-6 text-coral-400" />
            </div>
            <h1 className="text-2xl font-serif font-bold text-forest-950">
              Create Pet Parent Account
            </h1>
            <p className="text-xs text-charcoal-500">
              Register to save your pet’s health preferences and manage bookings.
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-charcoal-700">Full Name *</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-cream-300 focus:outline-none focus:ring-2 focus:ring-forest-800 text-sm"
                  placeholder="Rohit Verma"
                />
                <User className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-charcoal-700">Email Address *</label>
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
              <label className="text-xs font-semibold text-charcoal-700">Phone Number *</label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-cream-300 focus:outline-none focus:ring-2 focus:ring-forest-800 text-sm"
                  placeholder="+91 98765 43210"
                />
                <Phone className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-charcoal-700">Password *</label>
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

            <label className="flex items-start gap-2.5 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 rounded text-forest-800 focus:ring-forest-800"
              />
              <span className="text-xs text-charcoal-600 leading-tight">
                I agree to the studio's safe handling policies, vaccination declaration,
                and 24-hour cancellation terms.
              </span>
            </label>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-coral-500 hover:bg-coral-600 text-white font-semibold text-sm shadow-soft transition-colors flex items-center justify-center gap-2"
            >
              <span>Create Account & Add Pet</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center text-xs text-charcoal-600 pt-2 border-t border-cream-200">
            Already registered?{" "}
            <Link href="/login" className="font-bold text-forest-900 hover:underline">
              Sign in here
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
