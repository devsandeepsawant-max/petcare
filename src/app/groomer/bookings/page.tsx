"use client";

import Link from "next/link";
import globalStore from "@/lib/data/store";
import { formatTime, formatDate } from "@/lib/utils";
import { Scissors } from "lucide-react";

export default function GroomerBookingsPage() {
  const groomers = globalStore.getGroomers();
  const currentGroomer = groomers[0];
  const appointments = globalStore.getAppointments({
    groomerId: currentGroomer.id,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-forest-950">
          All Assigned Appointments ({appointments.length})
        </h1>
        <p className="text-xs text-charcoal-500">
          Full schedule of past and upcoming clients assigned to you.
        </p>
      </div>

      <div className="space-y-4">
        {appointments.map((apt) => (
          <div
            key={apt.id}
            className="bg-white p-6 rounded-3xl border border-cream-200 shadow-soft space-y-3"
          >
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono font-bold bg-cream-200 px-2 py-0.5 rounded">
                {apt.reference_code}
              </span>
              <span className="font-bold text-forest-950">
                {formatDate(apt.scheduled_date)} at {formatTime(apt.start_time)}
              </span>
            </div>

            <div className="text-xs space-y-1">
              <div className="font-bold text-sm text-forest-950">
                {apt.pet?.name} ({apt.pet?.breed})
              </div>
              <div className="text-charcoal-600">
                Service: {apt.service?.name}
              </div>
              <div className="text-charcoal-500">
                Parent: {apt.customer?.full_name} ({apt.customer?.phone})
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-cream-200">
              <Link
                href={`/groomer/sessions/${apt.id}`}
                className="text-xs px-3 py-1.5 rounded-lg bg-forest-900 text-white font-medium hover:bg-forest-800"
              >
                Open Grooming Session →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

