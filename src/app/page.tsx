import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  Calendar,
  Sparkles,
  ShieldCheck,
  HeartHandshake,
  Clock,
  ArrowRight,
  CheckCircle2,
  Scissors,
  Award,
  HelpCircle,
  MapPin,
  Star,
} from "lucide-react";
import globalStore from "@/lib/data/store";
import { formatCurrency } from "@/lib/utils";

export default function HomePage() {
  const services = globalStore.getServices();

  const faqs = [
    {
      q: "How often should my dog be professionally groomed?",
      a: "For most breeds, professional grooming is recommended every 4 to 6 weeks to prevent matting, maintain healthy skin, and keep nails trimmed.",
    },
    {
      q: "What if my dog is anxious or nervous about grooming?",
      a: "We practice certified Fear-Free handling! We take quiet breaks, use positive praise, warm organic products, and never rush sensitive dogs.",
    },
    {
      q: "Are vaccinations required before booking?",
      a: "Yes. For the safety of all pets in our salon, up-to-date Rabies and DHPP/DHLPP vaccinations are required.",
    },
    {
      q: "Why do prices vary by dog size?",
      a: "Larger breeds require substantially more time, specialized ergonomic equipment, blow-drying time, and organic bathing formulations.",
    },
  ];

  const processSteps = [
    {
      step: "01",
      title: "Friendly Assessment",
      desc: "We greet your pet calmly, review coat health, inspect skin conditions, and confirm your preferred haircut styling.",
    },
    {
      step: "02",
      title: "Therapeutic Bath & Blowout",
      desc: "Hydro-massage bath using hypoallergenic botanical shampoos, warm blueberry facial, and gentle low-noise warm drying.",
    },
    {
      step: "03",
      title: "Precision Breed Styling",
      desc: "Hand-scissored styling, nail clipping and rounding, paw pad conditioning, and gentle ear cleansing.",
    },
    {
      step: "04",
      title: "Happy Pick-up",
      desc: "Your pup is spritzed with aromatic natural fragrance, given a celebratory bandana, and ready for hugs!",
    },
  ];

  return (
    <>
      <Navbar />

      <main className="flex-1">
        {/* 1. HERO SECTION */}
        <section className="relative overflow-hidden bg-gradient-to-b from-cream-200/80 via-cream-100 to-white pt-12 pb-20 lg:pt-20 lg:pb-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Text content */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest-100 text-forest-900 text-xs font-semibold tracking-wide border border-forest-200">
                  <Sparkles className="w-3.5 h-3.5 text-forest-700" />
                  <span>Bangalore's Premier Fear-Free Canine Spa</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-forest-950 tracking-tight leading-[1.15]">
                  Because Every Dog Deserves a Little Extra Care.
                </h1>

                <p className="text-lg text-charcoal-600 leading-relaxed max-w-2xl">
                  Gentle, stress-free grooming tailored to your dog’s unique breed, coat,
                  and temperament. Experience pure organic hygiene and professional breed styling in a calm, modern studio.
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                  <Link
                    href="/booking"
                    className="flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl bg-coral-500 hover:bg-coral-600 text-white font-semibold text-base shadow-soft hover:shadow-hover transition-all hover:-translate-y-0.5"
                  >
                    <Calendar className="w-5 h-5" />
                    <span>Book an Appointment</span>
                  </Link>

                  <Link
                    href="/services"
                    className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-white border border-forest-200 text-forest-900 font-semibold text-base hover:bg-forest-50 transition-colors shadow-sm"
                  >
                    <span>Explore Services</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                {/* Highlights */}
                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-cream-300">
                  <div>
                    <div className="text-2xl font-bold font-serif text-forest-900">100%</div>
                    <div className="text-xs text-charcoal-500 font-medium">Organic Shampoos</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold font-serif text-forest-900">Fear-Free</div>
                    <div className="text-xs text-charcoal-500 font-medium">Gentle Handling</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold font-serif text-forest-900">1-on-1</div>
                    <div className="text-xs text-charcoal-500 font-medium">Stylist Attention</div>
                  </div>
                </div>
              </div>

              {/* Hero Image */}
              <div className="lg:col-span-5 relative">
                <div className="relative mx-auto max-w-md lg:max-w-none">
                  <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-hover border-4 border-white">
                    <img
                      src="https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&q=80&w=900"
                      alt="Happy dog getting pampered at dog grooming studio"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Floating badge */}
                  <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-hover border border-cream-200 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-forest-100 flex items-center justify-center text-forest-800">
                      <Scissors className="w-6 h-6 text-forest-800" />
                    </div>
                    <div>
                      <div className="text-xs text-charcoal-500 font-medium">Certified Stylists</div>
                      <div className="text-sm font-bold text-forest-950">Safety & Comfort First</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. WHY CHOOSE US */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-xs font-bold uppercase tracking-wider text-coral-600 mb-2">
                The Pawsome Difference
              </h2>
              <h3 className="text-3xl sm:text-4xl font-serif font-bold text-forest-950">
                A Calm, Trustworthy Spa Experience for Your Furry Best Friend
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="p-6 rounded-2xl bg-cream-50 border border-cream-200 space-y-3">
                <div className="w-12 h-12 rounded-xl bg-forest-800 text-white flex items-center justify-center">
                  <HeartHandshake className="w-6 h-6 text-coral-400" />
                </div>
                <h4 className="text-lg font-bold text-forest-950">Fear-Free Handling</h4>
                <p className="text-sm text-charcoal-600 leading-relaxed">
                  We never rush or force nervous dogs. Gentle positive reinforcement, soothing sounds, and patience ensure zero stress.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-cream-50 border border-cream-200 space-y-3">
                <div className="w-12 h-12 rounded-xl bg-forest-800 text-white flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-coral-400" />
                </div>
                <h4 className="text-lg font-bold text-forest-950">Natural Organic Care</h4>
                <p className="text-sm text-charcoal-600 leading-relaxed">
                  Soap-free, hypoallergenic shampoos enriched with aloe vera, oatmeal, and argan oil designed for sensitive canine coats.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-cream-50 border border-cream-200 space-y-3">
                <div className="w-12 h-12 rounded-xl bg-forest-800 text-white flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-coral-400" />
                </div>
                <h4 className="text-lg font-bold text-forest-950">Hospital-Grade Hygiene</h4>
                <p className="text-sm text-charcoal-600 leading-relaxed">
                  Grooming tables, clippers, scissors, and bathtubs are hospital-grade sterilized after every single guest session.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-cream-50 border border-cream-200 space-y-3">
                <div className="w-12 h-12 rounded-xl bg-forest-800 text-white flex items-center justify-center">
                  <Award className="w-6 h-6 text-coral-400" />
                </div>
                <h4 className="text-lg font-bold text-forest-950">Breed-Specific Mastery</h4>
                <p className="text-sm text-charcoal-600 leading-relaxed">
                  From Shih Tzu teddy-bear styles to Golden Retriever de-shedding blowouts, our stylists are formally trained in breed standards.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. POPULAR GROOMING SERVICES */}
        <section className="py-20 bg-cream-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-coral-600 mb-2">
                  Tailored Treatments
                </h2>
                <h3 className="text-3xl sm:text-4xl font-serif font-bold text-forest-950">
                  Popular Grooming Packages
                </h3>
              </div>
              <Link
                href="/services"
                className="inline-flex items-center gap-1.5 text-forest-800 font-semibold text-sm hover:text-forest-950 group"
              >
                <span>View all services & full pricing</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.slice(0, 3).map((service) => {
                const minPrice = Math.min(...service.pricing.map((p) => p.base_price));
                return (
                  <div
                    key={service.id}
                    className="bg-white rounded-2xl overflow-hidden border border-cream-300 shadow-soft hover:shadow-hover transition-all flex flex-col group"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img
                        src={service.image_url}
                        alt={service.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-semibold text-forest-900 flex items-center gap-1 shadow-sm">
                        <Clock className="w-3.5 h-3.5 text-forest-700" />
                        <span>~{service.base_duration_mins} mins</span>
                      </div>
                    </div>

                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <h4 className="text-xl font-bold font-serif text-forest-950">
                          {service.name}
                        </h4>
                        <p className="text-sm text-charcoal-600 line-clamp-2">
                          {service.description}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-cream-200 flex items-center justify-between">
                        <div>
                          <div className="text-[11px] uppercase tracking-wider text-charcoal-400 font-semibold">
                            Starting from
                          </div>
                          <div className="text-xl font-bold font-serif text-forest-900">
                            {formatCurrency(minPrice)}
                          </div>
                        </div>

                        <Link
                          href={`/booking?service=${service.slug}`}
                          className="px-4 py-2 rounded-xl bg-forest-900 hover:bg-forest-800 text-white font-medium text-xs shadow-sm transition-colors"
                        >
                          Book Now
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 4. GROOMING PROCESS */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-xs font-bold uppercase tracking-wider text-coral-600 mb-2">
                Our 4-Step Journey
              </h2>
              <h3 className="text-3xl sm:text-4xl font-serif font-bold text-forest-950">
                How We Pamper Your Pup
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
              {processSteps.map((step, idx) => (
                <div key={idx} className="relative p-6 rounded-2xl bg-cream-50 border border-cream-200 space-y-3">
                  <div className="text-3xl font-serif font-bold text-coral-500">
                    {step.step}
                  </div>
                  <h4 className="text-lg font-bold text-forest-950">{step.title}</h4>
                  <p className="text-sm text-charcoal-600 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. BEFORE & AFTER GALLERY */}
        <section className="py-20 bg-cream-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-xs font-bold uppercase tracking-wider text-coral-600 mb-2">
                Real Transformations
              </h2>
              <h3 className="text-3xl sm:text-4xl font-serif font-bold text-forest-950">
                Fresh Cuts & Happy Faces
              </h3>
              <p className="text-sm text-charcoal-600 mt-2">
                A sample of daily breed styling transformations at our studio.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-4 rounded-2xl shadow-soft border border-cream-200 space-y-3">
                <div className="aspect-[4/3] rounded-xl overflow-hidden relative">
                  <img
                    src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=600"
                    alt="Shih Tzu Teddy Cut"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded">
                    Milo • Shih Tzu Teddy Cut
                  </div>
                </div>
                <div className="text-xs text-charcoal-600">
                  Full Grooming & Blueberry Facial • Stylist: Arjun
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl shadow-soft border border-cream-200 space-y-3">
                <div className="aspect-[4/3] rounded-xl overflow-hidden relative">
                  <img
                    src="https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=600"
                    alt="Golden Retriever De-shedding"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded">
                    Bruno • Golden Retriever Blowout
                  </div>
                </div>
                <div className="text-xs text-charcoal-600">
                  Intensive De-Shedding & Paw Balm • Stylist: Priya
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl shadow-soft border border-cream-200 space-y-3">
                <div className="aspect-[4/3] rounded-xl overflow-hidden relative">
                  <img
                    src="https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&q=80&w=600"
                    alt="Beagle Bath and Shine"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded">
                    Leo • Beagle Fresh Bath
                  </div>
                </div>
                <div className="text-xs text-charcoal-600">
                  Basic Bath & Nail Trimming • Stylist: Arjun
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6. TESTIMONIALS (IDENTIFIED DEMO CONTENT) */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-cream-200 text-charcoal-700 px-2.5 py-1 rounded-full">
                Verified Sample Reviews (Demo Mode)
              </span>
              <h3 className="text-3xl font-serif font-bold text-forest-950 mt-3">
                Loved by Pet Parents Across Bangalore
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 rounded-2xl bg-cream-50 border border-cream-200 space-y-4">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-500" />
                  ))}
                </div>
                <p className="text-sm text-charcoal-700 italic leading-relaxed">
                  "Milo used to shake at previous groomers. At Pawsome, Arjun took 15 minutes just letting him sniff around before bathing him. Milo looked incredible and was wagging his tail the entire pick-up!"
                </p>
                <div className="pt-2 border-t border-cream-200">
                  <div className="text-sm font-bold text-forest-950">Rohit V.</div>
                  <div className="text-xs text-charcoal-500">Pet Parent to Milo (Shih Tzu)</div>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-cream-50 border border-cream-200 space-y-4">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-500" />
                  ))}
                </div>
                <p className="text-sm text-charcoal-700 italic leading-relaxed">
                  "The de-shedding treatment on my Golden Retriever was phenomenal. My house has 80% less hair, and his coat is silky soft. Highly recommend booking through their online slot system."
                </p>
                <div className="pt-2 border-t border-cream-200">
                  <div className="text-sm font-bold text-forest-950">Ananya S.</div>
                  <div className="text-xs text-charcoal-500">Pet Parent to Bruno (Golden Retriever)</div>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-cream-50 border border-cream-200 space-y-4">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-500" />
                  ))}
                </div>
                <p className="text-sm text-charcoal-700 italic leading-relaxed">
                  "Cleanest grooming salon I've seen in Bangalore. No wet dog smell, crystal-clean stainless tubs, and super transparent pricing for small dogs."
                </p>
                <div className="pt-2 border-t border-cream-200">
                  <div className="text-sm font-bold text-forest-950">Vikram R.</div>
                  <div className="text-xs text-charcoal-500">Pet Parent to Coco (Cocker Spaniel)</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 7. FAQS */}
        <section className="py-20 bg-cream-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-xs font-bold uppercase tracking-wider text-coral-600 mb-2">
                Got Questions?
              </h2>
              <h3 className="text-3xl font-serif font-bold text-forest-950">
                Frequently Asked Questions
              </h3>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="bg-white p-6 rounded-2xl border border-cream-200 shadow-sm space-y-2"
                >
                  <h4 className="text-base font-bold text-forest-950 flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-forest-700 shrink-0" />
                    <span>{faq.q}</span>
                  </h4>
                  <p className="text-sm text-charcoal-600 pl-7 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 8. LOCATION & HOURS CTA */}
        <section className="py-20 bg-forest-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <h3 className="text-3xl sm:text-4xl font-serif font-bold">
              Ready to Treat Your Pup to a Refreshing Spa Day?
            </h3>
            <p className="text-forest-200 max-w-2xl mx-auto text-base">
              Book online in under 2 minutes. Choose your preferred package, select your pet size, and pick a guaranteed time slot.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/booking"
                className="px-8 py-4 rounded-xl bg-coral-500 hover:bg-coral-600 text-white font-semibold text-base shadow-soft hover:shadow-hover transition-all"
              >
                Book Appointment Online
              </Link>
              <Link
                href="/pricing"
                className="px-8 py-4 rounded-xl bg-forest-800 hover:bg-forest-700 text-cream-100 font-semibold text-base border border-forest-700 transition-colors"
              >
                View Pricing Guide
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
