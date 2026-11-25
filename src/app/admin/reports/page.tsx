"use client";

import { useState } from "react";
import globalStore from "@/lib/data/store";
import { formatCurrency } from "@/lib/utils";
import { BarChart3, Download, Calendar, DollarSign, Users } from "lucide-react";

export default function AdminReportsPage() {
  const [dateRange, setDateRange] = useState("ALL");
  const appointments = globalStore.getAppointments();
  const services = globalStore.getServices();
  const groomers = globalStore.getGroomers();

  const totalGross = appointments
    .filter((a) => a.status !== "CANCELLED")
    .reduce((sum, a) => sum + a.total_amount, 0);

  const completedRevenue = appointments
    .filter((a) => a.status === "COMPLETED")
    .reduce((sum, a) => sum + a.total_amount, 0);

  const exportCSV = () => {
    const headers = [
      "Reference",
      "Date",
      "Customer",
      "Pet",
      "Service",
      "Groomer",
      "Amount",
      "Status",
    ];
    const rows = appointments.map((a) => [
      a.reference_code,
      a.scheduled_date,
      `"${a.customer?.full_name || ""}"`,
      `"${a.pet?.name || ""}"`,
      `"${a.service?.name || ""}"`,
      `"${a.groomer?.name || ""}"`,
      a.total_amount,
      a.status,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `pawsome-report-${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-forest-950">
            Revenue & Booking Reports
          </h1>
          <p className="text-xs text-charcoal-500">
            Financial analytics and appointment statistics with CSV export.
          </p>
        </div>

        <button
          onClick={exportCSV}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-forest-900 hover:bg-forest-800 text-white font-semibold text-xs shadow-soft transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV Report</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-cream-200 space-y-1">
          <div className="text-xs text-charcoal-400 font-semibold uppercase">
            Gross Booked Pipeline
          </div>
          <div className="text-2xl font-serif font-bold text-forest-950">
            {formatCurrency(totalGross)}
          </div>
          <div className="text-[11px] text-charcoal-500">
            All active confirmed sessions
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-cream-200 space-y-1">
          <div className="text-xs text-charcoal-400 font-semibold uppercase">
            Realized Collected Revenue
          </div>
          <div className="text-2xl font-serif font-bold text-emerald-700">
            {formatCurrency(completedRevenue)}
          </div>
          <div className="text-[11px] text-charcoal-500">
            Completed service appointments
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-cream-200 space-y-1">
          <div className="text-xs text-charcoal-400 font-semibold uppercase">
            Cancellation Rate
          </div>
          <div className="text-2xl font-serif font-bold text-rose-700">
            {Math.round(
              (appointments.filter((a) => a.status === "CANCELLED").length /
                Math.max(appointments.length, 1)) *
                100
            )}
            %
          </div>
          <div className="text-[11px] text-charcoal-500">
            {appointments.filter((a) => a.status === "CANCELLED").length} cancellations
          </div>
        </div>
      </div>

      {/* Breakdown tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-cream-200 shadow-sm space-y-4">
          <h3 className="font-serif font-bold text-forest-950 text-base">
            Service-wise Revenue Breakdown
          </h3>
          <div className="space-y-3">
            {services.map((svc) => {
              const svcAppointments = appointments.filter(
                (a) => a.service_id === svc.id && a.status !== "CANCELLED"
              );
              const svcRev = svcAppointments.reduce(
                (sum, a) => sum + a.total_amount,
                0
              );

              return (
                <div
                  key={svc.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-cream-50 text-xs"
                >
                  <div>
                    <div className="font-bold text-forest-950">{svc.name}</div>
                    <div className="text-charcoal-500">
                      {svcAppointments.length} sessions
                    </div>
                  </div>
                  <div className="font-bold text-forest-900 text-sm">
                    {formatCurrency(svcRev)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-cream-200 shadow-sm space-y-4">
          <h3 className="font-serif font-bold text-forest-950 text-base">
            Groomer Workload & Performance
          </h3>
          <div className="space-y-3">
            {groomers.map((g) => {
              const gApts = appointments.filter(
                (a) => a.groomer_id === g.id && a.status !== "CANCELLED"
              );
              const gRev = gApts.reduce((sum, a) => sum + a.total_amount, 0);

              return (
                <div
                  key={g.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-cream-50 text-xs"
                >
                  <div>
                    <div className="font-bold text-forest-950">{g.name}</div>
                    <div className="text-charcoal-500">{gApts.length} sessions</div>
                  </div>
                  <div className="font-bold text-forest-900 text-sm">
                    {formatCurrency(gRev)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

