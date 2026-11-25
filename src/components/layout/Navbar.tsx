"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Menu,
  X,
  Calendar,
  User,
  Shield,
  Scissors,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import globalStore from "@/lib/data/store";
import { UserRole } from "@/lib/types";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const session = globalStore.getSession();

  const handleRoleSwitch = (newRole: UserRole) => {
    globalStore.setSession(newRole);
    setRoleMenuOpen(false);
    window.location.reload();
  };

  const navLinks = [
    { href: "/services", label: "Services" },
    { href: "/pricing", label: "Pricing" },
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-cream-50/95 backdrop-blur-md border-b border-cream-200">
      {/* Top operational banner */}
      <div className="bg-forest-900 text-cream-100 text-xs py-1.5 px-4 text-center flex items-center justify-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span>
          Now Accepting Appointments • Bangalore Studio • Safe & Fear-Free Care
        </span>
        <span className="hidden sm:inline-block text-forest-300">|</span>
        <span className="hidden sm:inline-block bg-forest-800 text-cream-200 px-2 py-0.5 rounded text-[10px] font-semibold tracking-wide">
          DEMO MODE ACTIVE
        </span>
      </div>

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-2xl bg-forest-800 flex items-center justify-center text-white shadow-soft group-hover:scale-105 transition-transform">
            <Scissors className="w-6 h-6 text-coral-400 -rotate-45" />
          </div>
          <div>
            <span className="text-xl font-bold font-serif tracking-tight text-forest-950 flex items-center gap-1.5">
              Pawsome
              <span className="text-xs px-1.5 py-0.5 rounded-full bg-forest-100 text-forest-800 font-sans font-medium">
                Grooming
              </span>
            </span>
            <span className="block text-xs text-charcoal-500 font-medium">
              Care • Style • Wellness
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-forest-800 ${
                  isActive
                    ? "text-forest-900 font-semibold border-b-2 border-forest-800 pb-1"
                    : "text-charcoal-600"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Right CTA and Quick Portal Switcher */}
        <div className="hidden md:flex items-center gap-3">
          {/* Role switcher for quick review of customer, groomer, admin */}
          <div className="relative">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-cream-300 bg-white text-charcoal-700 hover:bg-cream-100 transition-colors"
              title="Test role switcher"
            >
              <Shield className="w-3.5 h-3.5 text-forest-700" />
              <span>Role: <strong className="capitalize">{session.role}</strong></span>
              <ChevronDown className="w-3 h-3 text-charcoal-400" />
            </button>

            {roleMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-cream-200 py-1.5 z-50 text-xs">
                <div className="px-3 py-1 text-charcoal-400 font-semibold uppercase tracking-wider text-[10px]">
                  Switch Active Role (Demo)
                </div>
                <button
                  onClick={() => handleRoleSwitch("customer")}
                  className={`w-full text-left px-3 py-2 flex items-center gap-2 hover:bg-cream-100 ${
                    session.role === "customer" ? "font-bold text-forest-900 bg-forest-50" : "text-charcoal-700"
                  }`}
                >
                  <User className="w-3.5 h-3.5 text-forest-700" />
                  <span>Customer (Rohit)</span>
                </button>
                <button
                  onClick={() => handleRoleSwitch("groomer")}
                  className={`w-full text-left px-3 py-2 flex items-center gap-2 hover:bg-cream-100 ${
                    session.role === "groomer" ? "font-bold text-forest-900 bg-forest-50" : "text-charcoal-700"
                  }`}
                >
                  <Scissors className="w-3.5 h-3.5 text-forest-700" />
                  <span>Groomer (Arjun)</span>
                </button>
                <button
                  onClick={() => handleRoleSwitch("admin")}
                  className={`w-full text-left px-3 py-2 flex items-center gap-2 hover:bg-cream-100 ${
                    session.role === "admin" ? "font-bold text-forest-900 bg-forest-50" : "text-charcoal-700"
                  }`}
                >
                  <Shield className="w-3.5 h-3.5 text-forest-700" />
                  <span>Admin / Owner</span>
                </button>
              </div>
            )}
          </div>

          {/* Portal Links based on role */}
          {session.role === "admin" && (
            <Link
              href="/admin"
              className="text-xs font-semibold px-3 py-2 rounded-lg bg-forest-100 text-forest-900 hover:bg-forest-200 transition-colors flex items-center gap-1.5"
            >
              <Shield className="w-3.5 h-3.5" />
              Admin Portal
            </Link>
          )}

          {session.role === "groomer" && (
            <Link
              href="/groomer"
              className="text-xs font-semibold px-3 py-2 rounded-lg bg-forest-100 text-forest-900 hover:bg-forest-200 transition-colors flex items-center gap-1.5"
            >
              <Scissors className="w-3.5 h-3.5" />
              Groomer Portal
            </Link>
          )}

          {session.role === "customer" && (
            <Link
              href="/account"
              className="text-xs font-medium px-3 py-2 rounded-lg text-charcoal-700 hover:bg-cream-200 transition-colors flex items-center gap-1.5"
            >
              <User className="w-3.5 h-3.5 text-forest-700" />
              My Account
            </Link>
          )}

          {/* Book Now Button */}
          <Link
            href="/booking"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-coral-500 hover:bg-coral-600 text-white font-medium text-sm shadow-soft transition-all hover:shadow-hover hover:-translate-y-0.5"
          >
            <Calendar className="w-4 h-4" />
            <span>Book Appointment</span>
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden items-center gap-2">
          <Link
            href="/booking"
            className="px-3 py-1.5 rounded-lg bg-coral-500 text-white font-medium text-xs flex items-center gap-1"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Book</span>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-charcoal-700 hover:bg-cream-200"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-cream-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <div className="grid grid-cols-2 gap-2 pb-2 border-b border-cream-200">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-sm font-medium text-charcoal-800 hover:bg-cream-100 rounded-lg"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <div className="text-xs text-charcoal-400 font-semibold uppercase tracking-wider">
              Switch Role for Testing
            </div>
            <div className="grid grid-cols-3 gap-1.5 text-xs">
              <button
                onClick={() => handleRoleSwitch("customer")}
                className={`py-1.5 px-2 rounded border text-center ${
                  session.role === "customer" ? "bg-forest-900 text-white border-forest-900" : "bg-cream-100"
                }`}
              >
                Customer
              </button>
              <button
                onClick={() => handleRoleSwitch("groomer")}
                className={`py-1.5 px-2 rounded border text-center ${
                  session.role === "groomer" ? "bg-forest-900 text-white border-forest-900" : "bg-cream-100"
                }`}
              >
                Groomer
              </button>
              <button
                onClick={() => handleRoleSwitch("admin")}
                className={`py-1.5 px-2 rounded border text-center ${
                  session.role === "admin" ? "bg-forest-900 text-white border-forest-900" : "bg-cream-100"
                }`}
              >
                Admin
              </button>
            </div>

            <div className="pt-2 flex gap-2">
              <Link
                href="/account"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 py-2 text-center text-xs font-semibold rounded-lg border border-forest-800 text-forest-800"
              >
                Customer Portal
              </Link>
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 py-2 text-center text-xs font-semibold rounded-lg bg-forest-900 text-white"
              >
                Admin Suite
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
