import { Suspense } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BookingWizard from "@/components/booking/BookingWizard";

export default function BookingPage() {
  return (
    <>
      <Navbar />

      <main className="flex-1 py-10 lg:py-16 bg-cream-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-forest-950">
              Online Appointment Booking
            </h1>
            <p className="text-xs sm:text-sm text-charcoal-600">
              Choose your dog's service, pick an available slot with our certified stylists, and receive instant confirmation.
            </p>
          </div>

          <Suspense
            fallback={
              <div className="py-12 text-center text-xs text-charcoal-500">
                Loading booking engine...
              </div>
            }
          >
            <BookingWizard />
          </Suspense>
        </div>
      </main>

      <Footer />
    </>
  );
}
