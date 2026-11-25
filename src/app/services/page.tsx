import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import globalStore from "@/lib/data/store";
import { formatCurrency } from "@/lib/utils";
import { Clock, CheckCircle, Sparkles, ArrowRight } from "lucide-react";

export default function ServicesPage() {
  const services = globalStore.getServices();

  return (
    <>
      <Navbar />

      <main className="flex-1 py-12 lg:py-20 bg-cream-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-coral-600 bg-coral-50 border border-coral-200 px-3 py-1 rounded-full">
              Full Care Catalog
            </span>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold text-forest-950">
              Grooming Packages & Spa Services
            </h1>
            <p className="text-base text-charcoal-600 leading-relaxed">
              Every appointment is a dedicated 1-on-1 experience. All packages include
              gentle organic products, ear cleaning, and certified fear-free handling.
            </p>
          </div>

          {/* Services List */}
          <div className="space-y-12">
            {services.map((service, index) => {
              const minPrice = Math.min(...service.pricing.map((p) => p.base_price));
              const isEven = index % 2 === 0;

              return (
                <div
                  key={service.id}
                  className="bg-white rounded-3xl overflow-hidden border border-cream-200 shadow-soft hover:shadow-hover transition-all grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-8"
                >
                  {/* Image */}
                  <div
                    className={`lg:col-span-5 relative aspect-[16/11] rounded-2xl overflow-hidden ${
                      isEven ? "lg:order-1" : "lg:order-2"
                    }`}
                  >
                    <img
                      src={service.image_url}
                      alt={service.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4 bg-forest-900/90 text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 backdrop-blur-sm">
                      <Clock className="w-3.5 h-3.5 text-coral-400" />
                      <span>Est. {service.base_duration_mins} mins</span>
                    </div>
                  </div>

                  {/* Details */}
                  <div
                    className={`lg:col-span-7 space-y-5 ${
                      isEven ? "lg:order-2" : "lg:order-1"
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-forest-700 mb-1">
                        Professional Treatment
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-serif font-bold text-forest-950">
                        {service.name}
                      </h2>
                    </div>

                    <p className="text-sm sm:text-base text-charcoal-600 leading-relaxed">
                      {service.description}
                    </p>

                    {/* Size-Based Pricing Matrix */}
                    <div className="p-4 rounded-2xl bg-cream-50 border border-cream-200 space-y-2">
                      <div className="text-xs font-semibold text-charcoal-500 uppercase tracking-wider">
                        Pricing by Pet Size (Calculated Dynamically)
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {service.pricing.map((tier) => (
                          <div
                            key={tier.id}
                            className="bg-white p-2.5 rounded-xl border border-cream-200 text-center"
                          >
                            <div className="text-[11px] font-bold text-charcoal-500">
                              {tier.pet_size === "SMALL" && "Small (<10 kg)"}
                              {tier.pet_size === "MEDIUM" && "Medium (10-25 kg)"}
                              {tier.pet_size === "LARGE" && "Large (>25 kg)"}
                            </div>
                            <div className="text-base font-bold text-forest-900 mt-0.5">
                              {formatCurrency(tier.base_price)}
                            </div>
                            <div className="text-[10px] text-charcoal-400">
                              ~{tier.estimated_duration_mins} mins
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Addons preview if available */}
                    {service.addons.length > 0 && (
                      <div className="space-y-1.5">
                        <div className="text-xs font-semibold text-charcoal-700 flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5 text-coral-500" />
                          <span>Available Spa Add-ons:</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {service.addons.map((addon) => (
                            <span
                              key={addon.id}
                              className="text-xs px-2.5 py-1 rounded-lg bg-cream-200 text-charcoal-700"
                            >
                              {addon.name} (+{formatCurrency(addon.price)})
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                      <Link
                        href={`/booking?service=${service.slug}`}
                        className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-coral-500 hover:bg-coral-600 text-white font-semibold text-sm shadow-soft transition-all"
                      >
                        <span>Book This Service</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>

                      <Link
                        href={`/services/${service.slug}`}
                        className="flex items-center justify-center px-5 py-3 rounded-xl border border-cream-300 text-charcoal-700 font-medium text-sm hover:bg-cream-50 transition-colors"
                      >
                        View Full Details
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
