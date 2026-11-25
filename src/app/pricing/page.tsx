"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import globalStore from "@/lib/data/store";
import { PetSize } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { Check, Calendar, Sparkles, HelpCircle, ArrowRight } from "lucide-react";

export default function PricingPage() {
  const [selectedSize, setSelectedSize] = useState<PetSize>("SMALL");
  const services = globalStore.getServices();

  const sizeInfo: Record<PetSize, { label: string; weight: string; examples: string }> = {
    SMALL: {
      label: "Small Dogs",
      weight: "Under 10 kg",
      examples: "Shih Tzu, Pomeranian, Beagle, Pug, Indie Puppy",
    },
    MEDIUM: {
      label: "Medium Dogs",
      weight: "10 kg – 25 kg",
      examples: "Cocker Spaniel, Indie Adult, French Bulldog, Border Collie",
    },
    LARGE: {
      label: "Large Dogs",
      weight: "25 kg and above",
      examples: "Golden Retriever, Labrador, German Shepherd, Husky",
    },
  };

  return (
    <>
      <Navbar />

      <main className="flex-1 py-12 lg:py-20 bg-cream-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header */}
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-coral-600 bg-coral-50 border border-coral-200 px-3 py-1 rounded-full">
              Transparent Pricing
            </span>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold text-forest-950">
              Interactive Size-Based Pricing Guide
            </h1>
            <p className="text-base text-charcoal-600 leading-relaxed">
              We believe in honest, predictable rates with zero surprise charges.
              Select your dog's size below to see exact package pricing and estimated durations.
            </p>
          </div>

          {/* Pet Size Switcher Tabs */}
          <div className="bg-white p-3 rounded-2xl border border-cream-200 shadow-sm max-w-2xl mx-auto">
            <div className="grid grid-cols-3 gap-2">
              {(["SMALL", "MEDIUM", "LARGE"] as PetSize[]).map((size) => {
                const active = selectedSize === size;
                return (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-3 px-2 rounded-xl text-center transition-all ${
                      active
                        ? "bg-forest-900 text-white font-bold shadow-soft"
                        : "bg-cream-50 text-charcoal-700 hover:bg-cream-100 font-medium"
                    }`}
                  >
                    <div className="text-sm">{sizeInfo[size].label}</div>
                    <div
                      className={`text-[11px] ${
                        active ? "text-forest-200" : "text-charcoal-500"
                      }`}
                    >
                      {sizeInfo[size].weight}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="text-center pt-3 text-xs text-charcoal-500">
              Typical breeds: <strong className="text-charcoal-700">{sizeInfo[selectedSize].examples}</strong>
            </div>
          </div>

          {/* Pricing Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => {
              const tier =
                service.pricing.find((p) => p.pet_size === selectedSize) ||
                service.pricing[0];

              return (
                <div
                  key={service.id}
                  className="bg-white rounded-3xl border border-cream-200 p-6 sm:p-8 flex flex-col justify-between shadow-soft hover:shadow-hover transition-all"
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <h3 className="text-xl font-bold font-serif text-forest-950">
                        {service.name}
                      </h3>
                      <span className="text-xs bg-forest-100 text-forest-800 font-semibold px-2.5 py-1 rounded-full">
                        ~{tier.estimated_duration_mins} mins
                      </span>
                    </div>

                    <p className="text-xs text-charcoal-600 leading-relaxed">
                      {service.short_description}
                    </p>

                    <div className="pt-2">
                      <div className="text-xs text-charcoal-400 font-semibold uppercase">
                        Price for {sizeInfo[selectedSize].label}
                      </div>
                      <div className="text-3xl font-serif font-bold text-forest-950 mt-1">
                        {formatCurrency(tier.base_price)}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-cream-200 space-y-2 text-xs text-charcoal-700">
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Organic Hypoallergenic Shampoos</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Ear Cleanse & Nail Polish/Trim</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Warm Towel & Low-Noise Blowout</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-cream-200">
                    <Link
                      href={`/booking?service=${service.slug}&size=${selectedSize}`}
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-coral-500 hover:bg-coral-600 text-white font-semibold text-sm shadow-soft transition-all"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>Book for {sizeInfo[selectedSize].label}</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Assessment Note */}
          <div className="bg-cream-50 border border-cream-200 p-6 rounded-2xl flex items-start gap-4">
            <HelpCircle className="w-6 h-6 text-forest-800 shrink-0 mt-0.5" />
            <div className="space-y-1 text-sm text-charcoal-700">
              <strong className="text-forest-950 font-bold block">
                Pre-Service Assessment Policy:
              </strong>
              <p className="text-xs leading-relaxed text-charcoal-600">
                While the base price covers standard coats, severe matting, compacted undercoats,
                or flea infestations require specialized extra time and therapeutic baths.
                Our certified stylists will inspect your pet during check-in and confirm any
                optional add-ons before starting.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
