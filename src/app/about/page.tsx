import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ShieldCheck, Heart, Award, Sparkles, CheckCircle } from "lucide-react";

export default function AboutPage() {
  return (
    <>
      <Navbar />

      <main className="flex-1 py-12 lg:py-20 bg-cream-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Header */}
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-coral-600 bg-coral-50 border border-coral-200 px-3 py-1 rounded-full">
              Our Ethos & Story
            </span>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold text-forest-950">
              Redefining Dog Grooming with Empathy & Professional Care
            </h1>
            <p className="text-base text-charcoal-600 leading-relaxed">
              Founded on a simple belief: grooming should never be stressful. We treat every dog as an individual family member deserving of patience, gentleness, and clean spaces.
            </p>
          </div>

          {/* Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-3xl border border-cream-200 shadow-soft space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-forest-800 text-white flex items-center justify-center">
                <Heart className="w-6 h-6 text-coral-400" />
              </div>
              <h3 className="text-xl font-bold font-serif text-forest-950">Fear-Free Philosophy</h3>
              <p className="text-sm text-charcoal-600 leading-relaxed">
                We take time for greeting sniffs, positive treats, and quiet breaks. No cage dryers, no rushing, and no harsh handling.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-cream-200 shadow-soft space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-forest-800 text-white flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-coral-400" />
              </div>
              <h3 className="text-xl font-bold font-serif text-forest-950">Sanitized Environment</h3>
              <p className="text-sm text-charcoal-600 leading-relaxed">
                Hospital-grade disinfectants, fresh towels for every dog, stainless steel hydraulic tubs, and zero cross-contamination.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-cream-200 shadow-soft space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-forest-800 text-white flex items-center justify-center">
                <Award className="w-6 h-6 text-coral-400" />
              </div>
              <h3 className="text-xl font-bold font-serif text-forest-950">Certified Stylists</h3>
              <p className="text-sm text-charcoal-600 leading-relaxed">
                Experienced groomers skilled in breed-specific anatomy, coat health, sensitive skin therapy, and canine body language.
              </p>
            </div>
          </div>

          {/* Hygiene Commitment */}
          <div className="bg-forest-900 text-white rounded-3xl p-8 sm:p-12 space-y-6">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold">
              Our 5-Point Wellness & Cleanliness Standard
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-forest-200">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-coral-400 shrink-0" />
                <span>100% Biodegradable & Organic Shampoos</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-coral-400 shrink-0" />
                <span>Double UV Sanitization on all blades & combs</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-coral-400 shrink-0" />
                <span>Temperature-controlled warm hydro-baths</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-coral-400 shrink-0" />
                <span>Strict vaccination checks for all guests</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-coral-400 shrink-0" />
                <span>First-aid certified staff on-site at all times</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
