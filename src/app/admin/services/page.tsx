"use client";

import { useState } from "react";
import globalStore from "@/lib/data/store";
import { Service, PetSize } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { Scissors, Plus, Check, Edit2 } from "lucide-react";

export default function AdminServicesPage() {
  const [services, setServices] = useState(globalStore.getServices(false));
  const [editingService, setEditingService] = useState<Service | null>(null);

  const toggleActive = (service: Service) => {
    service.is_active = !service.is_active;
    globalStore.saveService(service);
    setServices([...globalStore.getServices(false)]);
  };

  const handleUpdatePrice = (
    serviceId: string,
    size: PetSize,
    newPrice: number
  ) => {
    const svc = services.find((s) => s.id === serviceId);
    if (!svc) return;
    const tier = svc.pricing.find((p) => p.pet_size === size);
    if (tier) {
      tier.base_price = newPrice;
      globalStore.saveService(svc);
      setServices([...globalStore.getServices(false)]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-forest-950">
            Services & Pricing Configuration
          </h1>
          <p className="text-xs text-charcoal-500">
            Manage your service catalog, duration, and size-tiered prices.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {services.map((service) => (
          <div
            key={service.id}
            className="bg-white rounded-3xl p-6 border border-cream-200 shadow-sm space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cream-200 pb-4">
              <div className="flex items-center gap-3">
                <img
                  src={service.image_url}
                  alt={service.name}
                  className="w-16 h-16 rounded-xl object-cover shrink-0"
                />
                <div>
                  <h3 className="font-bold text-lg text-forest-950">
                    {service.name}
                  </h3>
                  <div className="text-xs text-charcoal-500">
                    Base Duration: {service.base_duration_mins} mins • Slug:{" "}
                    <code>{service.slug}</code>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleActive(service)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                    service.is_active
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {service.is_active ? "Active" : "Inactive (Deactivated)"}
                </button>
              </div>
            </div>

            <p className="text-xs text-charcoal-600">{service.description}</p>

            {/* Size Price Matrix */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-charcoal-700">
                Size-Based Pricing (₹ INR):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {service.pricing.map((tier) => (
                  <div
                    key={tier.id}
                    className="p-3 rounded-xl bg-cream-50 border border-cream-200 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-forest-950">
                        {tier.pet_size} Dog
                      </div>
                      <div className="text-charcoal-400 text-[11px]">
                        ~{tier.estimated_duration_mins} mins
                      </div>
                    </div>
                    <div className="flex items-center gap-1 font-bold text-forest-900">
                      <span>₹</span>
                      <input
                        type="number"
                        step="50"
                        value={tier.base_price}
                        onChange={(e) =>
                          handleUpdatePrice(
                            service.id,
                            tier.pet_size,
                            parseFloat(e.target.value) || 0
                          )
                        }
                        className="w-20 px-2 py-1 rounded border border-cream-300 text-right text-xs font-bold"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Addons List */}
            {service.addons.length > 0 && (
              <div className="pt-2 text-xs text-charcoal-600">
                <span className="font-semibold text-charcoal-700">Add-ons: </span>
                {service.addons.map((a) => (
                  <span
                    key={a.id}
                    className="inline-block mr-2 px-2 py-0.5 bg-cream-100 rounded text-charcoal-700"
                  >
                    {a.name} (+{formatCurrency(a.price)})
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

