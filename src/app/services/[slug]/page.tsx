import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import globalStore from "@/lib/data/store";
import { formatCurrency } from "@/lib/utils";
import {
  Clock,
  CheckCircle2,
  Calendar,
  Sparkles,
  ShieldCheck,
  ArrowLeft,
} from "lucide-react";

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = globalStore.getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  return (
    <>
      <Navbar />

      <main className="flex-1 py-12 lg:py-16 bg-cream-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Back link */}
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-sm font-semibold text-forest-800 hover:text-forest-950"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Services</span>
          </Link>

          {/* Main Service Card */}
          <div className="bg-white rounded-3xl border border-cream-200 overflow-hidden shadow-soft">
            <div className="relative aspect-[21/9] sm:aspect-[2/1] overflow-hidden">
              <img
                src={service.image_url}
                alt={service.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-6 sm:p-10">
                <div className="text-white space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold text-white">
                    <Clock className="w-3.5 h-3.5 text-coral-400" />
                    <span>Estimated Duration: {service.base_duration_mins} Minutes</span>
                  </div>
                  <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white">
                    {service.name}
                  </h1>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-10 space-y-8">
              {/* Description */}
              <div className="space-y-3">
                <h2 className="text-xl font-bold font-serif text-forest-950">
                  About This Treatment
                </h2>
                <p className="text-base text-charcoal-700 leading-relaxed">
                  {service.description}
                </p>
              </div>

              {/* Pricing breakdown table */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold font-serif text-forest-950">
                  Size-Based Pricing Matrix
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border border-cream-200 rounded-xl overflow-hidden">
                    <thead className="bg-cream-100 text-charcoal-700 font-semibold text-xs uppercase tracking-wider">
                      <tr>
                        <th className="p-3.5">Pet Category</th>
                        <th className="p-3.5">Approx. Weight</th>
                        <th className="p-3.5">Duration</th>
                        <th className="p-3.5">Starting Price</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-cream-200">
                      {service.pricing.map((tier) => (
                        <tr key={tier.id} className="hover:bg-cream-50">
                          <td className="p-3.5 font-bold text-forest-950">
                            {tier.pet_size} Breed
                          </td>
                          <td className="p-3.5 text-charcoal-600">
                            {tier.pet_size === "SMALL" && "Under 10 kg"}
                            {tier.pet_size === "MEDIUM" && "10 kg to 25 kg"}
                            {tier.pet_size === "LARGE" && "25 kg and above"}
                          </td>
                          <td className="p-3.5 text-charcoal-600">
                            ~{tier.estimated_duration_mins} mins
                          </td>
                          <td className="p-3.5 font-bold text-forest-900 text-base">
                            {formatCurrency(tier.base_price)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Addons if any */}
              {service.addons.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold font-serif text-forest-950 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-coral-500" />
                    <span>Optional Spa Enhancements</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {service.addons.map((addon) => (
                      <div
                        key={addon.id}
                        className="p-4 rounded-xl border border-cream-200 bg-cream-50 space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm text-forest-950">
                            {addon.name}
                          </span>
                          <span className="font-bold text-forest-900 text-sm">
                            +{formatCurrency(addon.price)}
                          </span>
                        </div>
                        <p className="text-xs text-charcoal-600">{addon.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Standards */}
              <div className="p-5 rounded-2xl bg-forest-50 border border-forest-200 flex items-start gap-4">
                <ShieldCheck className="w-6 h-6 text-forest-800 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-forest-950">
                    Pawsome Safety & Health Pledge
                  </h4>
                  <p className="text-xs text-forest-900/80 leading-relaxed">
                    Prior to grooming, our certified stylists perform a 7-point health check
                    (eyes, ears, skin, coat, paws, teeth, and temperament). If sensitive coat
                    matting or irritation is noticed, we will discuss gentle options with you.
                  </p>
                </div>
              </div>

              {/* Booking CTA Bar */}
              <div className="pt-4 border-t border-cream-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <div className="text-xs text-charcoal-500 uppercase tracking-wider font-semibold">
                    Pricing starting from
                  </div>
                  <div className="text-2xl font-serif font-bold text-forest-950">
                    {formatCurrency(Math.min(...service.pricing.map((p) => p.base_price)))}
                  </div>
                </div>

                <Link
                  href={`/booking?service=${service.slug}`}
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-coral-500 hover:bg-coral-600 text-white font-semibold text-base shadow-soft hover:shadow-hover transition-all text-center flex items-center justify-center gap-2"
                >
                  <Calendar className="w-5 h-5" />
                  <span>Book Appointment for This Service</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
