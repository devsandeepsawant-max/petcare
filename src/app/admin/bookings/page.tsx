"use client";

import { useState } from "react";
import globalStore from "@/lib/data/store";
import { AppointmentStatus } from "@/lib/types";
import { formatCurrency, formatDate, formatTime } from "@/lib/utils";
import {
  Calendar,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Scissors,
  XCircle,
  UserCheck,
} from "lucide-react";

export default function AdminBookingsPage() {
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [appointments, setAppointments] = useState(globalStore.getAppointments());
  const groomers = globalStore.getGroomers();

  const handleStatusChange = (
    id: string,
    newStatus: AppointmentStatus,
    reason?: string
  ) => {
    try {
      globalStore.updateAppointmentStatus(id, newStatus, reason);
      setAppointments(globalStore.getAppointments());
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleAssignGroomer = (id: string, groomerId: string) => {
    try {
      globalStore.assignGroomer(id, groomerId);
      setAppointments(globalStore.getAppointments());
    } catch (err: any) {
      alert(err.message);
    }
  };

  const filteredAppointments = appointments.filter((apt) => {
    if (statusFilter !== "ALL" && apt.status !== statusFilter) return false;
    if (selectedDate && apt.scheduled_date !== selectedDate) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchRef = apt.reference_code.toLowerCase().includes(term);
      const matchCust = apt.customer?.full_name.toLowerCase().includes(term);
      const matchPet = apt.pet?.name.toLowerCase().includes(term);
      return matchRef || matchCust || matchPet;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-forest-950">
            Booking & Appointment Management
          </h1>
          <p className="text-xs text-charcoal-500">
            Confirm, assign groomers, record check-ins, or manage appointment statuses.
          </p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-cream-200 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <input
            type="text"
            placeholder="Search reference, customer, or pet..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-cream-300 text-xs focus:ring-2 focus:ring-forest-800"
          />
          <Search className="w-4 h-4 text-charcoal-400 absolute left-3 top-2.5" />
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-cream-300 text-xs bg-white focus:ring-2 focus:ring-forest-800"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">PENDING</option>
            <option value="CONFIRMED">CONFIRMED</option>
            <option value="CHECKED_IN">CHECKED_IN</option>
            <option value="IN_PROGRESS">IN_PROGRESS</option>
            <option value="COMPLETED">COMPLETED</option>
            <option value="CANCELLED">CANCELLED</option>
            <option value="NO_SHOW">NO_SHOW</option>
          </select>
        </div>

        <div>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-cream-300 text-xs focus:ring-2 focus:ring-forest-800"
          />
        </div>
      </div>

      {/* Bookings List */}
      <div className="bg-white rounded-3xl border border-cream-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-cream-50 text-charcoal-600 uppercase font-semibold border-b border-cream-200">
              <tr>
                <th className="p-4">Ref Code</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Pet Details</th>
                <th className="p-4">Date & Time</th>
                <th className="p-4">Assigned Groomer</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4">Operational Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-100">
              {filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-charcoal-500">
                    No bookings found matching filters.
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-cream-50/60">
                    <td className="p-4 font-mono font-bold text-forest-950">
                      {apt.reference_code}
                    </td>

                    <td className="p-4">
                      <div className="font-semibold text-charcoal-900">
                        {apt.customer?.full_name}
                      </div>
                      <div className="text-charcoal-500">{apt.customer?.phone}</div>
                    </td>

                    <td className="p-4">
                      <div className="font-bold text-forest-950">
                        {apt.pet?.name} ({apt.pet_size})
                      </div>
                      <div className="text-charcoal-500">
                        {apt.pet?.breed} • {apt.service?.name}
                      </div>
                    </td>

                    <td className="p-4 text-charcoal-800">
                      <div>{formatDate(apt.scheduled_date)}</div>
                      <div className="text-charcoal-500">
                        {formatTime(apt.start_time)} – {formatTime(apt.end_time)}
                      </div>
                    </td>

                    <td className="p-4">
                      <select
                        value={apt.groomer_id || ""}
                        onChange={(e) => handleAssignGroomer(apt.id, e.target.value)}
                        className="px-2 py-1 rounded border border-cream-300 text-xs bg-white"
                      >
                        {groomers.map((g) => (
                          <option key={g.id} value={g.id}>
                            {g.name}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="p-4 font-bold text-forest-900">
                      {formatCurrency(apt.total_amount)}
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          apt.status === "CONFIRMED"
                            ? "bg-emerald-100 text-emerald-800"
                            : apt.status === "PENDING"
                            ? "bg-amber-100 text-amber-800"
                            : apt.status === "CHECKED_IN"
                            ? "bg-blue-100 text-blue-800"
                            : apt.status === "IN_PROGRESS"
                            ? "bg-indigo-100 text-indigo-800"
                            : apt.status === "COMPLETED"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        {apt.status}
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {apt.status === "PENDING" && (
                          <button
                            onClick={() => handleStatusChange(apt.id, "CONFIRMED")}
                            className="px-2 py-1 rounded bg-emerald-600 text-white font-medium text-[11px] hover:bg-emerald-700"
                          >
                            Confirm
                          </button>
                        )}

                        {apt.status === "CONFIRMED" && (
                          <button
                            onClick={() => handleStatusChange(apt.id, "CHECKED_IN")}
                            className="px-2 py-1 rounded bg-blue-600 text-white font-medium text-[11px] hover:bg-blue-700"
                          >
                            Check-In
                          </button>
                        )}

                        {apt.status === "CHECKED_IN" && (
                          <button
                            onClick={() => handleStatusChange(apt.id, "IN_PROGRESS")}
                            className="px-2 py-1 rounded bg-indigo-600 text-white font-medium text-[11px] hover:bg-indigo-700"
                          >
                            Start
                          </button>
                        )}

                        {apt.status === "IN_PROGRESS" && (
                          <button
                            onClick={() => handleStatusChange(apt.id, "COMPLETED")}
                            className="px-2 py-1 rounded bg-purple-600 text-white font-medium text-[11px] hover:bg-purple-700"
                          >
                            Complete
                          </button>
                        )}

                        {apt.status !== "CANCELLED" && apt.status !== "COMPLETED" && (
                          <button
                            onClick={() => {
                              const r = prompt("Reason for cancellation:");
                              if (r !== null) {
                                handleStatusChange(apt.id, "CANCELLED", r);
                              }
                            }}
                            className="px-2 py-1 rounded border border-rose-300 text-rose-700 text-[11px] hover:bg-rose-50"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

