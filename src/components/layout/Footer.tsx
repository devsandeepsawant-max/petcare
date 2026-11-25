import Link from "next/link";
import { Scissors, MapPin, Phone, Mail, Clock, ShieldCheck, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-forest-950 text-cream-200 pt-16 pb-12 border-t border-forest-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-forest-900">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-forest-800 flex items-center justify-center text-white">
                <Scissors className="w-5 h-5 text-coral-400 -rotate-45" />
              </div>
              <span className="text-xl font-bold font-serif text-white">
                Pawsome Grooming
              </span>
            </div>
            <p className="text-sm text-forest-200 leading-relaxed">
              Because Every Dog Deserves a Little Extra Care. Certified, fear-free
              canine wellness and grooming studio in Bangalore.
            </p>
            <div className="flex items-center gap-2 text-xs text-forest-300 bg-forest-900/60 p-2.5 rounded-lg border border-forest-800">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Certified Pet First-Aid & Fear-Free Certified Handlers</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm text-forest-200">
              <li>
                <Link href="/services" className="hover:text-coral-400 transition-colors">
                  All Grooming Services
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-coral-400 transition-colors">
                  Size-Based Pricing Guide
                </Link>
              </li>
              <li>
                <Link href="/booking" className="hover:text-coral-400 transition-colors">
                  Online Appointment Booking
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-coral-400 transition-colors">
                  Our Fear-Free Philosophy
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-coral-400 transition-colors">
                  Studio Location & Hours
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Signature Treatments
            </h4>
            <ul className="space-y-2.5 text-sm text-forest-200">
              <li>
                <Link href="/services/full-grooming" className="hover:text-coral-400 transition-colors">
                  Full Breed-Specific Grooming
                </Link>
              </li>
              <li>
                <Link href="/services/basic-bath-dry" className="hover:text-coral-400 transition-colors">
                  Organic Bath & Blowout
                </Link>
              </li>
              <li>
                <Link href="/services/de-shedding" className="hover:text-coral-400 transition-colors">
                  Undercoat De-shedding Therapy
                </Link>
              </li>
              <li>
                <Link href="/services/nail-paw-care" className="hover:text-coral-400 transition-colors">
                  Paw Pad & Nail Spa
                </Link>
              </li>
              <li>
                <Link href="/services/hygiene-touch-up" className="hover:text-coral-400 transition-colors">
                  Hygiene & Sanitary Touch-up
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact and Location */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Visit Studio
            </h4>
            <div className="flex items-start gap-2.5 text-sm text-forest-200">
              <MapPin className="w-4 h-4 text-coral-400 shrink-0 mt-0.5" />
              <span>124 Green Glen Park, Bellandur, Bangalore 560103</span>
            </div>
            <div className="flex items-center gap-2.5 text-sm text-forest-200">
              <Phone className="w-4 h-4 text-coral-400 shrink-0" />
              <span>+91 98765 43210</span>
            </div>
            <div className="flex items-center gap-2.5 text-sm text-forest-200">
              <Mail className="w-4 h-4 text-coral-400 shrink-0" />
              <span>contact@pawsomecare.com</span>
            </div>
            <div className="flex items-center gap-2.5 text-sm text-forest-200">
              <Clock className="w-4 h-4 text-coral-400 shrink-0" />
              <span>Tue - Sun: 9:00 AM - 7:00 PM (Mon Closed)</span>
            </div>
          </div>
        </div>

        {/* Bottom Note */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-forest-400 gap-4">
          <p>© {new Date().getFullYear()} Pawsome Grooming Studio. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="text-forest-400">
              Crafted with <Heart className="w-3.5 h-3.5 text-coral-400 inline mx-0.5 fill-coral-400" /> for dogs of all breeds.
            </span>
            <span className="bg-forest-900 px-2.5 py-1 rounded text-cream-300 font-mono">
              MVP Release v1.0
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
