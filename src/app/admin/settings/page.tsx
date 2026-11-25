"use client";

import { useState } from "react";
import globalStore from "@/lib/data/store";
import { Settings, Save } from "lucide-react";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState(globalStore.getSettings());
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    globalStore.updateSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-forest-950">
          Business & Operational Settings
        </h1>
        <p className="text-xs text-charcoal-500">
          Configure operating hours, booking lead times, cancellation policy, and payment toggles.
        </p>
      </div>

      {saved && (
        <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs border border-emerald-200">
          Settings successfully saved.
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-cream-200 shadow-sm space-y-6">
        <div className="space-y-4">
          <h2 className="text-base font-bold font-serif text-forest-950">
            Salon Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-charcoal-700">Salon Name</label>
              <input
                type="text"
                value={settings.business_name}
                onChange={(e) =>
                  setSettings({ ...settings, business_name: e.target.value })
                }
                className="w-full px-3 py-2 rounded-xl border border-cream-300"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-charcoal-700">Contact Phone</label>
              <input
                type="text"
                value={settings.phone}
                onChange={(e) =>
                  setSettings({ ...settings, phone: e.target.value })
                }
                className="w-full px-3 py-2 rounded-xl border border-cream-300"
              />
            </div>
          </div>

          <div className="space-y-1 text-xs">
            <label className="font-semibold text-charcoal-700">Studio Address</label>
            <input
              type="text"
              value={settings.address}
              onChange={(e) =>
                setSettings({ ...settings, address: e.target.value })
              }
              className="w-full px-3 py-2 rounded-xl border border-cream-300"
            />
          </div>
        </div>

        {/* Operating Hours */}
        <div className="space-y-4 pt-4 border-t border-cream-200">
          <h2 className="text-base font-bold font-serif text-forest-950">
            Hours & Cancellation Policy
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-charcoal-700">Opening Time</label>
              <input
                type="time"
                value={settings.opening_time}
                onChange={(e) =>
                  setSettings({ ...settings, opening_time: e.target.value })
                }
                className="w-full px-3 py-2 rounded-xl border border-cream-300"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-charcoal-700">Closing Time</label>
              <input
                type="time"
                value={settings.closing_time}
                onChange={(e) =>
                  setSettings({ ...settings, closing_time: e.target.value })
                }
                className="w-full px-3 py-2 rounded-xl border border-cream-300"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-charcoal-700">
                Cancellation Window (Hours)
              </label>
              <input
                type="number"
                value={settings.cancellation_hours_window}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    cancellation_hours_window: parseInt(e.target.value, 10),
                  })
                }
                className="w-full px-3 py-2 rounded-xl border border-cream-300"
              />
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="space-y-3 pt-4 border-t border-cream-200">
          <h2 className="text-base font-bold font-serif text-forest-950">
            Payment Methods
          </h2>

          <div className="space-y-2 text-xs">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.cash_enabled}
                onChange={(e) =>
                  setSettings({ ...settings, cash_enabled: e.target.checked })
                }
              />
              <span>Enable Cash on Pick-up</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.upi_enabled}
                onChange={(e) =>
                  setSettings({ ...settings, upi_enabled: e.target.checked })
                }
              />
              <span>Enable UPI QR Codes (GPay / PhonePe)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.razorpay_enabled}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    razorpay_enabled: e.target.checked,
                  })
                }
              />
              <span>Enable Razorpay (Demo / Sandbox Mode active when unconfigured)</span>
            </label>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-forest-900 hover:bg-forest-800 text-white font-semibold text-xs shadow-soft flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
}

