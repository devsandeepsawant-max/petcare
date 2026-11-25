"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      <Navbar />

      <main className="flex-1 py-12 lg:py-20 bg-cream-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-coral-600 bg-coral-50 border border-coral-200 px-3 py-1 rounded-full">
              Get in Touch
            </span>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold text-forest-950">
              Visit Our Bangalore Studio
            </h1>
            <p className="text-base text-charcoal-600 leading-relaxed">
              Have a special breed requirement or want to drop in for a greeting sniff before booking? We’d love to hear from you.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Contact info card */}
            <div className="lg:col-span-5 bg-forest-900 text-white rounded-3xl p-8 space-y-8">
              <div>
                <h3 className="text-2xl font-serif font-bold text-white mb-2">
                  Studio Headquarters
                </h3>
                <p className="text-sm text-forest-200">
                  Located in the heart of Green Glen Park, easily accessible with dedicated pet parking.
                </p>
              </div>

              <div className="space-y-6 text-sm text-forest-100">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-coral-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-white">Address</div>
                    <div>124 Green Glen Park, Bellandur, Bangalore, Karnataka 560103</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-coral-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-white">Call / WhatsApp</div>
                    <div>+91 98765 43210</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-coral-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-white">Email</div>
                    <div>contact@pawsomecare.com</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-coral-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-white">Grooming Hours</div>
                    <div>Tuesday – Sunday: 9:00 AM – 7:00 PM</div>
                    <div className="text-xs text-forest-300">Closed on Mondays for deep sanitization</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Inquiries Form */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-8 border border-cream-200 shadow-soft">
              <h3 className="text-2xl font-serif font-bold text-forest-950 mb-2">
                Send an Inquiry
              </h3>
              <p className="text-sm text-charcoal-600 mb-6">
                Fill in your details and our salon coordinator will reply within a few hours.
              </p>

              {submitted ? (
                <div className="p-8 text-center space-y-3 bg-emerald-50 border border-emerald-200 rounded-2xl">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h4 className="text-lg font-bold text-forest-950">Thank You! Message Received.</h4>
                  <p className="text-xs text-charcoal-600">
                    We will be in touch shortly. In the meantime, you can explore our available dates on the booking engine.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-charcoal-700">Your Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Aditi Sharma"
                        className="w-full px-4 py-2.5 rounded-xl border border-cream-300 focus:outline-none focus:ring-2 focus:ring-forest-800 text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-charcoal-700">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 00000"
                        className="w-full px-4 py-2.5 rounded-xl border border-cream-300 focus:outline-none focus:ring-2 focus:ring-forest-800 text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-charcoal-700">Dog's Breed & Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Golden Retriever (Cooper)"
                        className="w-full px-4 py-2.5 rounded-xl border border-cream-300 focus:outline-none focus:ring-2 focus:ring-forest-800 text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-charcoal-700">Email Address</label>
                      <input
                        type="email"
                        placeholder="aditi@example.com"
                        className="w-full px-4 py-2.5 rounded-xl border border-cream-300 focus:outline-none focus:ring-2 focus:ring-forest-800 text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-charcoal-700">Your Message / Questions</label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Tell us about your pet's temperament, coat condition, or preferred appointment dates..."
                      className="w-full px-4 py-2.5 rounded-xl border border-cream-300 focus:outline-none focus:ring-2 focus:ring-forest-800 text-sm"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-6 rounded-xl bg-forest-900 hover:bg-forest-800 text-white font-semibold text-sm shadow-soft transition-colors flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Message</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
