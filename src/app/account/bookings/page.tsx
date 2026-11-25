"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import globalStore from "@/lib/data/store";
import { formatCurrency, formatDate, formatTime } from "@/lib/utils";
import { Calendar, Clock, AlertTriangle, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function BookingsHistoryPage() {
  const session = globalStore.getSession();
  const customer = globalStore.getCustomerByUserId(session.userId) || globalStore.getCustomers()[0];
  const [appointments, setAppointments] = useState(
    globalStore.getAppointments({ customerId: customer.id })
  );
  const [actionMessage, setActionMessage] = useState("");

  const handleCancelBooking = (id: string, scheduledDate: string) => {
    // Check 24 hour policy
    const aptTime = new Date(scheduledDate).getTime();
    const now = Date.now();
    const diffHours = (aptTime - now) / (1000 * 60 * 60);

    if (diffHours < 24) {
      if (
        !confirm(
          "Notice: This appointment is scheduled within 24 hours. Under salon policy, late cancellation may incur a booking fee. Would you like to proceed?"
        )
      ) {
        return;
      }
    } else {
      if (!confirm("Are you sure you want to cancel this booking?")) return;
    }

    try {
      globalStore.updateAppointmentStatus(id, "CANCELLED", "Cancelled by customer");
      setAppointments(globalStore.getAppointments({ customerId: customer.id }));
      setActionMessage("Appointment successfully cancelled.");
    } catch (err: any) {
      alert(err.message);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-emerald-100 text-emerald-800";
      case "PENDING":
        return "bg-amber-100 text-amber-800";
      case "CHECKED_IN":
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800";
      case "COMPLETED":
        return "bg-purple-100 text-purple-800";
      case "CANCELLED":
        return "bg-rose-100 text-rose-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <>
      <Navbar />

      <main className="flex-1 py-10 lg:py-14 bg-cream-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Link
                href="/account"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal-500 hover:text-forest-900"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Overview</span>
              </Link>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-forest-950">
                Booking History & Appointments
              </h1>
            </div>

            <Link
              href="/booking"
              className="px-5 py-2.5 rounded-xl bg-coral-500 hover:bg-coral-600 text-white text-xs font-semibold flex items-center gap-1.5 shadow-soft transition-colors"
            >
              <Calendar className="w-4 h-4" />
              <span>Book New Session</span>
            </Link>
          </div>

          {actionMessage && (
            <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{actionMessage}</span>
            </div>
          )}

          {appointments.length === 0 ? (
            <div className="bg-white p-8 rounded-3xl border border-cream-200 text-center space-y-4">
              <Calendar className="w-10 h-10 text-charcoal-400 mx-auto" />
              <h3 className="text-lg font-bold text-forest-950">No Booking Records Found</h3>
              <p className="text-xs text-charcoal-600">
                You haven't scheduled any grooming appointments yet.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {appointments.map((apt) => (
                <div
                  key={apt.id}
                  className="bg-white rounded-3xl p-6 border border-cream-200 shadow-soft space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-cream-200 pb-4">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold bg-cream-200 px-2.5 py-1 rounded text-charcoal-800">
                        {apt.reference_code}
                      </span>
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-full ${getStatusBadge(
                          apt.status
                        )}`}
                      >
                        {apt.status}
                      </span>
                    </div>

                    <div className="text-xs text-charcoal-500">
                      Booked on: {new Date(apt.created_at).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="text-xs text-charcoal-400 font-semibold uppercase">Pet & Service</div>
                      <div className="font-bold text-forest-950 mt-0.5">
                        {apt.pet?.name} ({apt.pet?.size_category})
                      </div>
                      <div className="text-xs text-charcoal-600">{apt.service?.name}</div>
                    </div>

                    <div>
                      <div className="text-xs text-charcoal-400 font-semibold uppercase">Scheduled Time</div>
                      <div className="font-bold text-forest-950 mt-0.5">
                        {formatDate(apt.scheduled_date)}
                      </div>
                      <div className="text-xs text-charcoal-600">
                        {formatTime(apt.start_time)} – {formatTime(apt.end_time)}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-charcoal-400 font-semibold uppercase">Groomer</div>
                      <div className="font-bold text-forest-950 mt-0.5">
                        {apt.groomer?.name || "Assigned on arrival"}
                      </div>
                      {apt.special_instructions && (
                        <div className="text-xs text-charcoal-500 italic truncate">
                          "{apt.special_instructions}"
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col justify-center sm:items-end">
                      <div className="text-xs text-charcoal-400 font-semibold uppercase">Total Amount</div>
                      <div className="text-xl font-bold font-serif text-forest-900 mt-0.5">
                        {formatCurrency(apt.total_amount)}
                      </div>

                      {/* Cancel action if permitted */}
                      {apt.status !== "CANCELLED" && apt.status !== "COMPLETED" && (
                        <button
                          onClick={() => handleCancelBooking(apt.id, apt.scheduled_date)}
                          className="text-xs text-rose-600 font-semibold mt-2 hover:underline"
                        >
                          Cancel Appointment
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
