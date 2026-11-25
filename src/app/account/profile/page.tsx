"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import globalStore from "@/lib/data/store";
import { ArrowLeft, Save, User, Phone, MapPin, Shield } from "lucide-react";

export default function ProfilePage() {
  const session = globalStore.getSession();
  const customer = globalStore.getCustomerByUserId(session.userId) || globalStore.getCustomers()[0];

  const [fullName, setFullName] = useState(customer.full_name);
  const [phone, setPhone] = useState(customer.phone);
  const [address, setAddress] = useState(customer.address || "");
  const [emergency, setEmergency] = useState(customer.emergency_contact || "");
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    customer.full_name = fullName;
    customer.phone = phone;
    customer.address = address;
    customer.emergency_contact = emergency;
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <>
      <Navbar />

      <main className="flex-1 py-10 lg:py-14 bg-cream-100">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <Link
            href="/account"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal-500 hover:text-forest-900"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Overview</span>
          </Link>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-200 shadow-soft space-y-6">
            <div className="space-y-1">
              <h1 className="text-2xl font-serif font-bold text-forest-950">
                Pet Parent Profile & Emergency Contact
              </h1>
              <p className="text-xs text-charcoal-500">
                Used to reach you for appointment confirmations and grooming completion pick-up notifications.
              </p>
            </div>

            {saved && (
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs border border-emerald-200">
                Profile updated successfully.
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-charcoal-700">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-charcoal-700">Email Address (Read-only)</label>
                <input
                  type="email"
                  disabled
                  value={customer.email}
                  className="w-full px-4 py-2.5 rounded-xl border border-cream-200 bg-cream-50 text-charcoal-500 text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-charcoal-700">Primary Mobile Phone</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-charcoal-700">Home Address</label>
                <textarea
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm"
                  placeholder="e.g. Apt 4B, Palm Meadows, Bangalore"
                ></textarea>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-charcoal-700">Emergency Alternate Contact</label>
                <input
                  type="text"
                  value={emergency}
                  onChange={(e) => setEmergency(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm"
                  placeholder="e.g. +91 98765 11112 (Partner / Family)"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-forest-900 hover:bg-forest-800 text-white font-semibold text-xs shadow-soft flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
