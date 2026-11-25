import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import globalStore from "@/lib/data/store";
import { formatCurrency, formatDate, formatTime } from "@/lib/utils";
import {
  Calendar,
  Plus,
  Clock,
  ArrowRight,
  ShieldCheck,
  User,
  Heart,
} from "lucide-react";

export default function AccountDashboard() {
  const session = globalStore.getSession();
  const customer = globalStore.getCustomerByUserId(session.userId) || globalStore.getCustomers()[0];
  const pets = globalStore.getPetsByCustomerId(customer.id);
  const appointments = globalStore.getAppointments({ customerId: customer.id });
  const upcomingApt = appointments.find((a) => a.status === "CONFIRMED" || a.status === "PENDING");

  return (
    <>
      <Navbar />

      <main className="flex-1 py-10 lg:py-14 bg-cream-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Header Banner */}
          <div className="bg-forest-900 text-white p-6 sm:p-8 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-soft">
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-wider font-semibold text-coral-400">
                Customer Account Dashboard
              </span>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                Hello, {customer.full_name}
              </h1>
              <p className="text-xs sm:text-sm text-forest-200">
                Phone: {customer.phone} • {pets.length} registered pets
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/account/pets/new"
                className="px-4 py-2.5 rounded-xl bg-forest-800 hover:bg-forest-700 text-white text-xs font-semibold flex items-center gap-1.5 border border-forest-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Another Pet</span>
              </Link>
              <Link
                href="/booking"
                className="px-5 py-2.5 rounded-xl bg-coral-500 hover:bg-coral-600 text-white text-xs font-semibold flex items-center gap-1.5 shadow-soft transition-colors"
              >
                <Calendar className="w-4 h-4" />
                <span>Book New Session</span>
              </Link>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-cream-300 gap-4 sm:gap-8 text-sm font-medium">
            <Link
              href="/account"
              className="pb-3 border-b-2 border-forest-900 text-forest-950 font-bold"
            >
              Overview
            </Link>
            <Link
              href="/account/pets"
              className="pb-3 text-charcoal-600 hover:text-forest-900 transition-colors"
            >
              My Pets ({pets.length})
            </Link>
            <Link
              href="/account/bookings"
              className="pb-3 text-charcoal-600 hover:text-forest-900 transition-colors"
            >
              Booking History ({appointments.length})
            </Link>
            <Link
              href="/account/profile"
              className="pb-3 text-charcoal-600 hover:text-forest-900 transition-colors"
            >
              Profile & Emergency Contact
            </Link>
          </div>

          {/* Next Upcoming Appointment Highlight */}
          {upcomingApt ? (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-cream-200 shadow-soft space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-forest-800 bg-forest-50 px-3 py-1 rounded-full border border-forest-200">
                  Next Scheduled Appointment
                </span>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800">
                  {upcomingApt.status}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-2">
                <div>
                  <div className="text-xs text-charcoal-400 font-semibold uppercase">Pet & Service</div>
                  <div className="text-lg font-bold text-forest-950 mt-0.5">
                    {upcomingApt.pet?.name} ({upcomingApt.pet?.breed})
                  </div>
                  <div className="text-xs text-charcoal-600">{upcomingApt.service?.name}</div>
                </div>

                <div>
                  <div className="text-xs text-charcoal-400 font-semibold uppercase">Date & Time</div>
                  <div className="text-base font-bold text-forest-950 mt-0.5">
                    {formatDate(upcomingApt.scheduled_date)}
                  </div>
                  <div className="text-xs text-charcoal-600">
                    {formatTime(upcomingApt.start_time)} – {formatTime(upcomingApt.end_time)}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-charcoal-400 font-semibold uppercase">Assigned Groomer</div>
                  <div className="text-base font-bold text-forest-950 mt-0.5">
                    {upcomingApt.groomer?.name || "Assigned at Studio"}
                  </div>
                  <div className="text-xs text-charcoal-600">Reference: {upcomingApt.reference_code}</div>
                </div>

                <div className="flex flex-col justify-center sm:items-end">
                  <div className="text-xs text-charcoal-400 font-semibold uppercase">Estimated Total</div>
                  <div className="text-xl font-bold font-serif text-forest-900 mt-0.5">
                    {formatCurrency(upcomingApt.total_amount)}
                  </div>
                  <Link
                    href="/account/bookings"
                    className="text-xs text-forest-800 font-semibold mt-1 hover:underline"
                  >
                    View booking details →
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-3xl border border-cream-200 text-center space-y-4">
              <Calendar className="w-10 h-10 text-charcoal-400 mx-auto" />
              <h3 className="text-lg font-bold text-forest-950">No Active Appointments Scheduled</h3>
              <p className="text-xs text-charcoal-600 max-w-md mx-auto">
                Is your pup due for a fresh bath or breed trim? Reserve an upcoming slot with one click.
              </p>
              <Link
                href="/booking"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-coral-500 hover:bg-coral-600 text-white font-semibold text-xs shadow-soft"
              >
                <Calendar className="w-4 h-4" />
                <span>Book an Appointment</span>
              </Link>
            </div>
          )}

          {/* Pets Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-serif font-bold text-forest-950">
                Your Registered Pets
              </h2>
              <Link
                href="/account/pets/new"
                className="text-xs text-forest-800 font-semibold hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Pet</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {pets.map((pet) => (
                <div
                  key={pet.id}
                  className="bg-white rounded-3xl p-6 border border-cream-200 shadow-soft flex items-start gap-4 hover:shadow-hover transition-all"
                >
                  <img
                    src={pet.photo_url || "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=300"}
                    alt={pet.name}
                    className="w-20 h-20 rounded-2xl object-cover shrink-0"
                  />
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-forest-950">{pet.name}</h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cream-200 text-charcoal-700">
                        {pet.size_category}
                      </span>
                    </div>
                    <div className="text-xs text-charcoal-600">
                      {pet.breed} • {pet.weight_kg} kg • {pet.gender}
                    </div>
                    <div className="text-xs text-charcoal-500 line-clamp-1">
                      Temperament: {pet.temperament}
                    </div>
                    <div className="pt-2 flex items-center justify-between">
                      <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Vaccines {pet.vaccination_status === "UP_TO_DATE" ? "Verified" : "Pending"}
                      </span>
                      <Link
                        href={`/account/pets/${pet.id}`}
                        className="text-xs font-semibold text-forest-800 hover:underline"
                      >
                        Edit Profile →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
