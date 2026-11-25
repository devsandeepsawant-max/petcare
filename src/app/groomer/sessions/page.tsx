"use client";

import Link from "next/link";
import globalStore from "@/lib/data/store";
import { Scissors } from "lucide-react";

export default function GroomerSessionsIndex() {
  const appointments = globalStore.getAppointments();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-forest-950">
          Grooming Session Management
        </h1>
        <p className="text-xs text-charcoal-500">
          Select an appointment below to conduct pre-groom check, record notes, or mark complete.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {appointments.map((apt) => (
          <Link
            key={apt.id}
            href={`/groomer/sessions/${apt.id}`}
            className="p-5 bg-white rounded-3xl border border-cream-200 shadow-soft hover:shadow-hover transition-all space-y-2 block"
          >
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono font-bold text-forest-900">
                {apt.reference_code}
              </span>
              <span className="font-bold px-2 py-0.5 rounded bg-cream-100 text-[10px]">
                {apt.status}
              </span>
            </div>

            <div className="font-bold text-base text-forest-950">
              {apt.pet?.name} ({apt.pet?.breed})
            </div>
            <div className="text-xs text-charcoal-600">
              {apt.service?.name}
            </div>

            <div className="text-[11px] text-coral-600 font-semibold pt-2">
              Launch Session Workflow →
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

