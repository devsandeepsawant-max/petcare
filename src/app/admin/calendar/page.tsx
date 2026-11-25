"use client";

import { useState } from "react";
import globalStore from "@/lib/data/store";
import { formatDate, formatTime } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";

export default function AdminCalendarPage() {
  const [currentDate, setCurrentDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const appointments = globalStore.getAppointments({ date: currentDate });
  const groomers = globalStore.getGroomers();

  const hours = [
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-forest-950">
            Salon Daily Schedule
          </h1>
          <p className="text-xs text-charcoal-500">
            Visual room and stylist schedule grid for {formatDate(currentDate)}.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="date"
            value={currentDate}
            onChange={(e) => setCurrentDate(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-cream-300 text-xs bg-white font-medium"
          />
        </div>
      </div>

      {/* Grid view by Groomers */}
      <div className="bg-white rounded-3xl border border-cream-200 shadow-sm overflow-hidden p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {groomers.map((groomer) => {
            const groomerAppointments = appointments.filter(
              (a) => a.groomer_id === groomer.id && a.status !== "CANCELLED"
            );

            return (
              <div
                key={groomer.id}
                className="rounded-2xl border border-cream-300 overflow-hidden bg-cream-50"
              >
                <div className="bg-forest-900 text-white p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={groomer.avatar_url}
                      alt={groomer.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-bold text-sm">{groomer.name}</h3>
                      <div className="text-[11px] text-forest-300">
                        {groomer.specialties.join(", ")}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 bg-forest-800 rounded-full">
                    {groomerAppointments.length} bookings today
                  </span>
                </div>

                <div className="p-4 space-y-3">
                  {groomerAppointments.length === 0 ? (
                    <div className="py-8 text-center text-xs text-charcoal-400">
                      No active bookings for this groomer on this date.
                    </div>
                  ) : (
                    groomerAppointments.map((apt) => (
                      <div
                        key={apt.id}
                        className="bg-white p-4 rounded-xl border border-cream-200 shadow-sm space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-bold text-forest-900">
                            {formatTime(apt.start_time)} – {formatTime(apt.end_time)}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              apt.status === "CONFIRMED"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {apt.status}
                          </span>
                        </div>

                        <div className="text-xs">
                          <div className="font-bold text-forest-950">
                            {apt.pet?.name} ({apt.pet?.breed})
                          </div>
                          <div className="text-charcoal-600">
                            {apt.service?.name}
                          </div>
                          <div className="text-charcoal-500 mt-1">
                            Parent: {apt.customer?.full_name} ({apt.customer?.phone})
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

