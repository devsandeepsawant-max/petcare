"use client";

import { useState } from "react";
import globalStore from "@/lib/data/store";
import { Groomer } from "@/lib/types";
import { Shield, Plus, Phone, Mail, Award, Check } from "lucide-react";

export default function AdminGroomersPage() {
  const [groomers, setGroomers] = useState(globalStore.getGroomers(false));

  const toggleActive = (g: Groomer) => {
    g.is_active = !g.is_active;
    globalStore.saveGroomer(g);
    setGroomers([...globalStore.getGroomers(false)]);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-forest-950">
            Stylist & Groomer Management
          </h1>
          <p className="text-xs text-charcoal-500">
            Staff roster, certifications, specialties, and active statuses.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {groomers.map((g) => (
          <div
            key={g.id}
            className="bg-white rounded-3xl p-6 border border-cream-200 shadow-sm space-y-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={g.avatar_url}
                  alt={g.name}
                  className="w-16 h-16 rounded-2xl object-cover shrink-0"
                />
                <div>
                  <h3 className="font-bold text-lg text-forest-950">{g.name}</h3>
                  <div className="text-xs text-charcoal-500">
                    {g.experience_years} years experience
                  </div>
                  <div className="text-xs text-charcoal-600 mt-1">{g.phone}</div>
                </div>
              </div>

              <button
                onClick={() => toggleActive(g)}
                className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                  g.is_active
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {g.is_active ? "Active" : "Inactive"}
              </button>
            </div>

            <p className="text-xs text-charcoal-600 leading-relaxed">{g.bio}</p>

            <div className="space-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-charcoal-400">
                Specialties:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {g.specialties.map((s, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2.5 py-0.5 rounded-lg bg-cream-100 text-charcoal-700 font-medium"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

