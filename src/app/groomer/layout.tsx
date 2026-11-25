"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Scissors, Calendar, Clock, ArrowLeft, User } from "lucide-react";
import globalStore from "@/lib/data/store";

export default function GroomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const groomers = globalStore.getGroomers();
  const currentGroomer = groomers[0]; // Arjun

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col">
      {/* Mobile-friendly Top Navigation */}
      <header className="bg-forest-950 text-white sticky top-0 z-40 border-b border-forest-900 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-forest-800 flex items-center justify-center text-white">
              <Scissors className="w-5 h-5 text-coral-400" />
            </div>
            <div>
              <span className="font-serif font-bold text-sm block leading-tight">
                Groomer Workstation
              </span>
              <span className="text-[10px] text-forest-300">
                Stylist: <strong>{currentGroomer.name}</strong>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="text-xs text-forest-300 hover:text-white flex items-center gap-1 px-2.5 py-1.5 rounded-lg hover:bg-forest-900"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Exit</span>
            </Link>
          </div>
        </div>

        {/* Tab Links */}
        <div className="max-w-4xl mx-auto px-4 flex gap-6 text-xs font-semibold border-t border-forest-900/60">
          <Link
            href="/groomer"
            className={`py-2.5 border-b-2 ${
              pathname === "/groomer"
                ? "border-coral-400 text-white"
                : "border-transparent text-forest-300 hover:text-white"
            }`}
          >
            Today's Schedule
          </Link>
          <Link
            href="/groomer/bookings"
            className={`py-2.5 border-b-2 ${
              pathname === "/groomer/bookings"
                ? "border-coral-400 text-white"
                : "border-transparent text-forest-300 hover:text-white"
            }`}
          >
            Assigned Bookings
          </Link>
          <Link
            href="/groomer/sessions"
            className={`py-2.5 border-b-2 ${
              pathname.startsWith("/groomer/sessions")
                ? "border-coral-400 text-white"
                : "border-transparent text-forest-300 hover:text-white"
            }`}
          >
            Active Grooming Sessions
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 pb-16">
        {children}
      </main>
    </div>
  );
}

