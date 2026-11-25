"use client";

import { useState } from "react";
import Link from "next/link";
import globalStore from "@/lib/data/store";
import { formatTime, formatDate } from "@/lib/utils";
import {
  Clock,
  Scissors,
  CheckCircle2,
  AlertTriangle,
  Play,
  ArrowRight,
} from "lucide-react";

export default function GroomerDashboardPage() {
  const groomers = globalStore.getGroomers();
  const currentGroomer = groomers[0];
  const today = new Date().toISOString().split("T")[0];

  const [appointments, setAppointments] = useState(
    globalStore.getAppointments({
      groomerId: currentGroomer.id,
    })
  );

  const todayApts = appointments.filter((a) => a.scheduled_date === today);

  const handleStartSession = (aptId: string) => {
    globalStore.updateAppointmentStatus(aptId, "IN_PROGRESS");
    setAppointments(
      globalStore.getAppointments({ groomerId: currentGroomer.id })
    );
  };

  const handleCheckIn = (aptId: string) => {
    globalStore.updateAppointmentStatus(aptId, "CHECKED_IN");
    setAppointments(
      globalStore.getAppointments({ groomerId: currentGroomer.id })
    );
  };

  return (
    <div className="space-y-6">
      {/* Header card */}
      <div className="bg-forest-900 text-white p-6 rounded-3xl space-y-2 shadow-soft">
        <span className="text-xs uppercase tracking-wider font-semibold text-coral-400">
          Daily Operational Roster
        </span>
        <h1 className="text-2xl font-serif font-bold">
          Welcome, {currentGroomer.name}
        </h1>
        <p className="text-xs text-forest-200">
          You have <strong>{todayApts.length} appointments</strong> scheduled for
          today ({formatDate(today)}).
        </p>
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        <h2 className="text-lg font-serif font-bold text-forest-950">
          Today's Assigned Appointments
        </h2>

        {todayApts.length === 0 ? (
          <div className="bg-white p-8 rounded-3xl border border-cream-200 text-center text-xs text-charcoal-500">
            No appointments scheduled for today yet.
          </div>
        ) : (
          todayApts.map((apt) => (
            <div
              key={apt.id}
              className="bg-white p-6 rounded-3xl border border-cream-200 shadow-soft space-y-4"
            >
              <div className="flex items-center justify-between border-b border-cream-200 pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold bg-cream-200 px-2 py-0.5 rounded text-charcoal-800">
                    {apt.reference_code}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      apt.status === "CONFIRMED"
                        ? "bg-amber-100 text-amber-800"
                        : apt.status === "CHECKED_IN"
                        ? "bg-blue-100 text-blue-800"
                        : apt.status === "IN_PROGRESS"
                        ? "bg-indigo-100 text-indigo-800"
                        : "bg-purple-100 text-purple-800"
                    }`}
                  >
                    {apt.status}
                  </span>
                </div>

                <div className="text-xs font-bold text-forest-950">
                  {formatTime(apt.start_time)} – {formatTime(apt.end_time)}
                </div>
              </div>

              {/* Pet & Service Details */}
              <div className="flex items-start gap-4">
                <img
                  src={
                    apt.pet?.photo_url ||
                    "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=200"
                  }
                  alt={apt.pet?.name}
                  className="w-16 h-16 rounded-2xl object-cover shrink-0"
                />
                <div className="space-y-1 flex-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-forest-950">
                      {apt.pet?.name} ({apt.pet?.breed})
                    </span>
                    <span className="text-charcoal-500">
                      Parent: {apt.customer?.full_name} ({apt.customer?.phone})
                    </span>
                  </div>

                  <div className="text-charcoal-700">
                    <strong>Service:</strong> {apt.service?.name} (
                    {apt.pet_size} Category)
                  </div>

                  {apt.pet?.special_handling_notes && (
                    <div className="p-2 rounded-lg bg-cream-100 text-[11px] text-charcoal-700">
                      <strong>Handling:</strong> {apt.pet.special_handling_notes}
                    </div>
                  )}

                  {apt.special_instructions && (
                    <div className="text-[11px] text-charcoal-600 italic">
                      "Customer Note: {apt.special_instructions}"
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-cream-200">
                {apt.status === "CONFIRMED" && (
                  <button
                    onClick={() => handleCheckIn(apt.id)}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm"
                  >
                    Mark Pet Checked-In
                  </button>
                )}

                {apt.status === "CHECKED_IN" && (
                  <button
                    onClick={() => handleStartSession(apt.id)}
                    className="px-4 py-2 rounded-xl bg-forest-900 hover:bg-forest-800 text-white font-semibold text-xs shadow-sm flex items-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Start Grooming Session</span>
                  </button>
                )}

                <Link
                  href={`/groomer/sessions/${apt.id}`}
                  className="px-4 py-2 rounded-xl bg-coral-500 hover:bg-coral-600 text-white font-semibold text-xs shadow-sm flex items-center gap-1.5"
                >
                  <Scissors className="w-3.5 h-3.5" />
                  <span>Session Workflow →</span>
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

