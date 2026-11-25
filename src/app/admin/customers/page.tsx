"use client";

import { useState } from "react";
import globalStore from "@/lib/data/store";
import { formatCurrency } from "@/lib/utils";
import { Users, Search, Phone, Mail, MapPin } from "lucide-react";

export default function AdminCustomersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const customers = globalStore.getCustomers();

  const filtered = customers.filter((c) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      c.full_name.toLowerCase().includes(term) ||
      c.email.toLowerCase().includes(term) ||
      c.phone.includes(term)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-forest-950">
            Customers & Pet Profiles CRM
          </h1>
          <p className="text-xs text-charcoal-500">
            Directory of registered pet parents, pets, and internal customer care notes.
          </p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-cream-200 shadow-sm max-w-md">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by customer name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-cream-300 text-xs focus:ring-2 focus:ring-forest-800"
          />
          <Search className="w-4 h-4 text-charcoal-400 absolute left-3 top-2.5" />
        </div>
      </div>

      <div className="space-y-6">
        {filtered.map((customer) => {
          const pets = globalStore.getPetsByCustomerId(customer.id);
          const apts = globalStore.getAppointments({ customerId: customer.id });
          const totalSpent = apts
            .filter((a) => a.status === "COMPLETED")
            .reduce((sum, a) => sum + a.total_amount, 0);

          return (
            <div
              key={customer.id}
              className="bg-white rounded-3xl p-6 border border-cream-200 shadow-sm space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-cream-200 pb-4">
                <div>
                  <h3 className="font-bold text-lg text-forest-950">
                    {customer.full_name}
                  </h3>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-charcoal-500 mt-1">
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5" />
                      {customer.phone}
                    </span>
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5" />
                      {customer.email}
                    </span>
                  </div>
                </div>

                <div className="text-right text-xs">
                  <div className="text-charcoal-400 font-semibold uppercase">
                    Total Bookings
                  </div>
                  <div className="text-base font-bold text-forest-900">
                    {apts.length} appointments
                  </div>
                </div>
              </div>

              {/* Pets for this customer */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-charcoal-700">
                  Registered Pets ({pets.length}):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {pets.map((pet) => (
                    <div
                      key={pet.id}
                      className="p-3 rounded-xl bg-cream-50 border border-cream-200 flex items-center gap-3 text-xs"
                    >
                      <img
                        src={
                          pet.photo_url ||
                          "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=200"
                        }
                        alt={pet.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <div className="font-bold text-forest-950">
                          {pet.name} ({pet.size_category})
                        </div>
                        <div className="text-charcoal-500">
                          {pet.breed} • {pet.weight_kg} kg
                        </div>
                        <div className="text-[11px] text-charcoal-600 italic">
                          Handling: {pet.special_handling_notes || "None"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Internal Notes */}
              {customer.internal_notes && (
                <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900">
                  <strong>Staff Internal Note:</strong> {customer.internal_notes}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

