"use client";

import Link from "next/link";
import globalStore from "@/lib/data/store";
import { formatCurrency, formatDate, formatTime } from "@/lib/utils";
import {
  Calendar,
  CheckCircle2,
  Clock,
  TrendingUp,
  Users,
  DollarSign,
  ArrowUpRight,
  Scissors,
} from "lucide-react";

export default function AdminDashboardPage() {
  const appointments = globalStore.getAppointments();
  const customers = globalStore.getCustomers();
  const services = globalStore.getServices();

  const totalBookings = appointments.length;
  const today = new Date().toISOString().split("T")[0];
  const todayAppointments = appointments.filter(
    (a) => a.scheduled_date === today
  );
  const completedAppointments = appointments.filter(
    (a) => a.status === "COMPLETED"
  );
  const pendingAppointments = appointments.filter(
    (a) => a.status === "PENDING" || a.status === "CONFIRMED"
  );
  const totalRevenue = appointments
    .filter((a) => a.status !== "CANCELLED")
    .reduce((sum, a) => sum + a.total_amount, 0);

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-forest-950">
            Operations & Revenue Overview
          </h1>
          <p className="text-xs text-charcoal-500">
            Real-time appointment metrics and financial performance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs bg-cream-200 text-charcoal-700 font-semibold px-3 py-1.5 rounded-lg border border-cream-300">
            Single Location: Bangalore Studio
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-cream-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-charcoal-400 text-xs font-semibold uppercase">
            <span>Total Bookings</span>
            <Calendar className="w-4 h-4 text-forest-800" />
          </div>
          <div className="text-2xl font-serif font-bold text-forest-950">
            {totalBookings}
          </div>
          <div className="text-[11px] text-emerald-700 font-medium">
            Active salon pipeline
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-cream-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-charcoal-400 text-xs font-semibold uppercase">
            <span>Today's Sessions</span>
            <Clock className="w-4 h-4 text-forest-800" />
          </div>
          <div className="text-2xl font-serif font-bold text-forest-950">
            {todayAppointments.length}
          </div>
          <div className="text-[11px] text-charcoal-500">
            {todayAppointments.filter((a) => a.status === "CHECKED_IN").length} checked in
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-cream-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-charcoal-400 text-xs font-semibold uppercase">
            <span>Registered Customers</span>
            <Users className="w-4 h-4 text-forest-800" />
          </div>
          <div className="text-2xl font-serif font-bold text-forest-950">
            {customers.length}
          </div>
          <div className="text-[11px] text-emerald-700 font-medium">
            100% verified profiles
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-cream-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-charcoal-400 text-xs font-semibold uppercase">
            <span>Gross Revenue</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-serif font-bold text-forest-900">
            {formatCurrency(totalRevenue)}
          </div>
          <div className="text-[11px] text-charcoal-500">
            Excludes cancellations
          </div>
        </div>
      </div>

      {/* Popular Services & Revenue chart breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-cream-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold font-serif text-forest-950">
            Popular Grooming Services
          </h2>
          <div className="space-y-3">
            {services.map((svc) => {
              const svcBookings = appointments.filter(
                (a) => a.service_id === svc.id
              ).length;
              const percentage = Math.round(
                (svcBookings / Math.max(totalBookings, 1)) * 100
              );

              return (
                <div key={svc.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-charcoal-800">
                      {svc.name}
                    </span>
                    <span className="text-charcoal-500 font-medium">
                      {svcBookings} bookings ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-cream-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-forest-800 h-full rounded-full"
                      style={{ width: `${Math.max(percentage, 10)}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-cream-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold font-serif text-forest-950">
            Appointment Status Pipeline
          </h2>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
              <div className="text-charcoal-500">Pending / Confirmed</div>
              <div className="text-xl font-bold text-amber-900 mt-1">
                {pendingAppointments.length}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-purple-50 border border-purple-200">
              <div className="text-charcoal-500">Completed Sessions</div>
              <div className="text-xl font-bold text-purple-900 mt-1">
                {completedAppointments.length}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200">
              <div className="text-charcoal-500">In Studio</div>
              <div className="text-xl font-bold text-blue-900 mt-1">
                {
                  appointments.filter(
                    (a) =>
                      a.status === "CHECKED_IN" || a.status === "IN_PROGRESS"
                  ).length
                }
              </div>
            </div>
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200">
              <div className="text-charcoal-500">Cancellations</div>
              <div className="text-xl font-bold text-rose-900 mt-1">
                {appointments.filter((a) => a.status === "CANCELLED").length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Bookings Table */}
      <div className="bg-white rounded-3xl border border-cream-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-cream-200 flex items-center justify-between">
          <h2 className="text-lg font-bold font-serif text-forest-950">
            Recent Appointments
          </h2>
          <Link
            href="/admin/bookings"
            className="text-xs text-forest-800 font-semibold hover:underline flex items-center gap-1"
          >
            <span>View all bookings</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-cream-50 text-charcoal-600 uppercase font-semibold border-b border-cream-200">
              <tr>
                <th className="p-4">Reference</th>
                <th className="p-4">Customer & Pet</th>
                <th className="p-4">Service</th>
                <th className="p-4">Date & Time</th>
                <th className="p-4">Groomer</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-100">
              {appointments.slice(0, 5).map((apt) => (
                <tr key={apt.id} className="hover:bg-cream-50/60">
                  <td className="p-4 font-mono font-bold text-forest-950">
                    {apt.reference_code}
                  </td>
                  <td className="p-4">
                    <div className="font-semibold text-charcoal-900">
                      {apt.customer?.full_name}
                    </div>
                    <div className="text-charcoal-500">
                      {apt.pet?.name} ({apt.pet?.breed})
                    </div>
                  </td>
                  <td className="p-4 text-charcoal-800">
                    {apt.service?.name}
                  </td>
                  <td className="p-4 text-charcoal-700">
                    <div>{formatDate(apt.scheduled_date)}</div>
                    <div className="text-charcoal-400">
                      {formatTime(apt.start_time)}
                    </div>
                  </td>
                  <td className="p-4 font-medium text-charcoal-800">
                    {apt.groomer?.name || "Unassigned"}
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
                          : apt.status === "COMPLETED"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {apt.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <Link
                      href="/admin/bookings"
                      className="text-xs text-forest-800 font-semibold hover:underline"
                    >
                      Manage →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

