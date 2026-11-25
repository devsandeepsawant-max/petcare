"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarCheck,
  CalendarDays,
  Scissors,
  Users,
  BarChart3,
  Settings,
  ArrowLeft,
  Shield,
  Bell,
} from "lucide-react";
import globalStore from "@/lib/data/store";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const session = globalStore.getSession();

  const links = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/bookings", label: "Bookings", icon: CalendarCheck },
    { href: "/admin/calendar", label: "Calendar", icon: CalendarDays },
    { href: "/admin/services", label: "Services & Pricing", icon: Scissors },
    { href: "/admin/customers", label: "Customers & Pets", icon: Users },
    { href: "/admin/groomers", label: "Groomers", icon: Shield },
    { href: "/admin/reports", label: "Reports & Analytics", icon: BarChart3 },
    { href: "/admin/settings", label: "Business Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-forest-950 text-cream-200 flex flex-col justify-between p-4 border-r border-forest-900 shrink-0">
        <div className="space-y-6">
          {/* Logo & Header */}
          <div className="flex items-center justify-between pb-4 border-b border-forest-900">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-forest-800 flex items-center justify-center text-white">
                <Scissors className="w-5 h-5 text-coral-400 -rotate-45" />
              </div>
              <div>
                <span className="font-serif font-bold text-white text-base block leading-tight">
                  Pawsome
                </span>
                <span className="text-[10px] text-forest-300 font-semibold tracking-wider uppercase">
                  Admin Console
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive =
                link.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                    isActive
                      ? "bg-forest-800 text-white font-bold"
                      : "text-forest-200 hover:bg-forest-900 hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4 text-coral-400 shrink-0" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer options */}
        <div className="pt-4 border-t border-forest-900 space-y-2 text-xs">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-forest-300 hover:text-white hover:bg-forest-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Public Site</span>
          </Link>
          <div className="p-2.5 rounded-xl bg-forest-900/60 text-[11px] text-forest-300">
            Logged in as <strong>{session.profile.full_name}</strong> (Admin)
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-cream-200 px-6 flex items-center justify-between shrink-0">
          <div className="text-sm font-bold text-forest-950 flex items-center gap-2">
            <span>Pawsome Grooming Studio</span>
            <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
              Live Operations
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/admin/bookings"
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-coral-500 hover:bg-coral-600 text-white shadow-sm"
            >
              + Walk-In Booking
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

