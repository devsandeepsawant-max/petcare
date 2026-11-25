"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import globalStore from "@/lib/data/store";
import { Pet, PetSize } from "@/lib/types";
import { ArrowLeft, Save, Upload, ShieldCheck } from "lucide-react";

export default function NewPetPage() {
  const router = useRouter();
  const session = globalStore.getSession();
  const customer = globalStore.getCustomerByUserId(session.userId) || globalStore.getCustomers()[0];

  const [name, setName] = useState("");
  const [breed, setBreed] = useState("");
  const [sizeCategory, setSizeCategory] = useState<PetSize>("SMALL");
  const [weightKg, setWeightKg] = useState("6.0");
  const [gender, setGender] = useState<"MALE" | "FEMALE">("MALE");
  const [coatType, setCoatType] = useState("Short / Smooth");
  const [allergies, setAllergies] = useState("");
  const [temperament, setTemperament] = useState("Friendly & relaxed");
  const [handlingNotes, setHandlingNotes] = useState("");
  const [vaccinationStatus, setVaccinationStatus] = useState<"UP_TO_DATE" | "EXPIRED" | "NOT_DECLARED">("UP_TO_DATE");
  const [photoUrl, setPhotoUrl] = useState(
    "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=400"
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !breed) return;

    const newPet: Pet = {
      id: `pet-${Date.now()}`,
      customer_id: customer.id,
      name,
      breed,
      size_category: sizeCategory,
      weight_kg: parseFloat(weightKg) || 5,
      gender,
      coat_type: coatType,
      allergies: allergies || undefined,
      temperament,
      special_handling_notes: handlingNotes || undefined,
      vaccination_status: vaccinationStatus,
      photo_url: photoUrl,
      is_demo: true,
      created_at: new Date().toISOString(),
    };

    globalStore.savePet(newPet);
    router.push("/account/pets");
  };

  return (
    <>
      <Navbar />

      <main className="flex-1 py-10 lg:py-14 bg-cream-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <Link
            href="/account/pets"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal-500 hover:text-forest-900"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Cancel and return to pets</span>
          </Link>

          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-cream-200 shadow-soft space-y-6">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-forest-950">
                Register New Dog Profile
              </h1>
              <p className="text-xs text-charcoal-500">
                Accurate weight and handling details ensure safe, stress-free grooming tailored to your dog.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Pet Basics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-charcoal-700">Pet Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Milo"
                    className="w-full px-4 py-2.5 rounded-xl border border-cream-300 focus:outline-none focus:ring-2 focus:ring-forest-800 text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-charcoal-700">Breed *</label>
                  <input
                    type="text"
                    required
                    value={breed}
                    onChange={(e) => setBreed(e.target.value)}
                    placeholder="e.g. Shih Tzu, Indie, Golden Retriever"
                    className="w-full px-4 py-2.5 rounded-xl border border-cream-300 focus:outline-none focus:ring-2 focus:ring-forest-800 text-sm"
                  />
                </div>
              </div>

              {/* Size & Weight */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-charcoal-700">Size Category *</label>
                  <select
                    value={sizeCategory}
                    onChange={(e) => setSizeCategory(e.target.value as PetSize)}
                    className="w-full px-4 py-2.5 rounded-xl border border-cream-300 focus:outline-none focus:ring-2 focus:ring-forest-800 text-sm bg-white"
                  >
                    <option value="SMALL">Small (Under 10 kg)</option>
                    <option value="MEDIUM">Medium (10 - 25 kg)</option>
                    <option value="LARGE">Large (25+ kg)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-charcoal-700">Weight (kg) *</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={weightKg}
                    onChange={(e) => setWeightKg(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-cream-300 focus:outline-none focus:ring-2 focus:ring-forest-800 text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-charcoal-700">Gender *</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as "MALE" | "FEMALE")}
                    className="w-full px-4 py-2.5 rounded-xl border border-cream-300 focus:outline-none focus:ring-2 focus:ring-forest-800 text-sm bg-white"
                  >
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                  </select>
                </div>
              </div>

              {/* Coat & Temperament */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-charcoal-700">Coat Type</label>
                  <input
                    type="text"
                    value={coatType}
                    onChange={(e) => setCoatType(e.target.value)}
                    placeholder="e.g. Silky double coat, short fur, curly poodle coat"
                    className="w-full px-4 py-2.5 rounded-xl border border-cream-300 focus:outline-none focus:ring-2 focus:ring-forest-800 text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-charcoal-700">Temperament</label>
                  <input
                    type="text"
                    value={temperament}
                    onChange={(e) => setTemperament(e.target.value)}
                    placeholder="e.g. Friendly, nervous with dryers, loves treats"
                    className="w-full px-4 py-2.5 rounded-xl border border-cream-300 focus:outline-none focus:ring-2 focus:ring-forest-800 text-sm"
                  />
                </div>
              </div>

              {/* Sensitive Handling & Health */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-charcoal-700">
                  Known Allergies & Skin Sensitivities
                </label>
                <input
                  type="text"
                  value={allergies}
                  onChange={(e) => setAllergies(e.target.value)}
                  placeholder="e.g. Sensitive to scented washes, chicken allergy, dry skin"
                  className="w-full px-4 py-2.5 rounded-xl border border-cream-300 focus:outline-none focus:ring-2 focus:ring-forest-800 text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-charcoal-700">
                  Special Handling Instructions
                </label>
                <textarea
                  rows={2}
                  value={handlingNotes}
                  onChange={(e) => setHandlingNotes(e.target.value)}
                  placeholder="e.g. Sensitive around back paws, prefer towel drying before low-noise blow-dryer..."
                  className="w-full px-4 py-2.5 rounded-xl border border-cream-300 focus:outline-none focus:ring-2 focus:ring-forest-800 text-sm"
                ></textarea>
              </div>

              {/* Vaccination Status */}
              <div className="p-4 rounded-2xl bg-cream-50 border border-cream-200 space-y-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-forest-800" />
                  <span className="text-sm font-bold text-forest-950">
                    Vaccination Declaration
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <label className="flex items-center gap-2 p-2.5 rounded-xl border border-cream-300 bg-white cursor-pointer">
                    <input
                      type="radio"
                      name="vaccine"
                      checked={vaccinationStatus === "UP_TO_DATE"}
                      onChange={() => setVaccinationStatus("UP_TO_DATE")}
                    />
                    <span>Up to Date (Rabies + 7-in-1)</span>
                  </label>
                  <label className="flex items-center gap-2 p-2.5 rounded-xl border border-cream-300 bg-white cursor-pointer">
                    <input
                      type="radio"
                      name="vaccine"
                      checked={vaccinationStatus === "NOT_DECLARED"}
                      onChange={() => setVaccinationStatus("NOT_DECLARED")}
                    />
                    <span>Bringing Card to Studio</span>
                  </label>
                  <label className="flex items-center gap-2 p-2.5 rounded-xl border border-cream-300 bg-white cursor-pointer">
                    <input
                      type="radio"
                      name="vaccine"
                      checked={vaccinationStatus === "EXPIRED"}
                      onChange={() => setVaccinationStatus("EXPIRED")}
                    />
                    <span>Due for Booster</span>
                  </label>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <Link
                  href="/account/pets"
                  className="px-6 py-3 rounded-xl border border-cream-300 text-charcoal-700 text-sm font-medium hover:bg-cream-50"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  className="px-8 py-3 rounded-xl bg-forest-900 hover:bg-forest-800 text-white font-semibold text-sm shadow-soft transition-colors flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Pet Profile</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
