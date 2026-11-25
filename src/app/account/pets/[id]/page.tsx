"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import globalStore from "@/lib/data/store";
import { Pet, PetSize } from "@/lib/types";
import { ArrowLeft, Save, Trash2 } from "lucide-react";

export default function EditPetPage() {
  const params = useParams();
  const router = useRouter();
  const petId = params?.id as string;

  const [pet, setPet] = useState<Pet | null>(null);
  const [name, setName] = useState("");
  const [breed, setBreed] = useState("");
  const [sizeCategory, setSizeCategory] = useState<PetSize>("SMALL");
  const [weightKg, setWeightKg] = useState("5");
  const [coatType, setCoatType] = useState("");
  const [allergies, setAllergies] = useState("");
  const [temperament, setTemperament] = useState("");
  const [handlingNotes, setHandlingNotes] = useState("");

  useEffect(() => {
    const p = globalStore.getPetById(petId);
    if (p) {
      setPet(p);
      setName(p.name);
      setBreed(p.breed);
      setSizeCategory(p.size_category);
      setWeightKg(p.weight_kg.toString());
      setCoatType(p.coat_type);
      setAllergies(p.allergies || "");
      setTemperament(p.temperament);
      setHandlingNotes(p.special_handling_notes || "");
    }
  }, [petId]);

  if (!pet) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm">
        Loading pet profile...
      </div>
    );
  }

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: Pet = {
      ...pet,
      name,
      breed,
      size_category: sizeCategory,
      weight_kg: parseFloat(weightKg) || pet.weight_kg,
      coat_type: coatType,
      allergies: allergies || undefined,
      temperament,
      special_handling_notes: handlingNotes || undefined,
    };
    globalStore.savePet(updated);
    router.push("/account/pets");
  };

  return (
    <>
      <Navbar />

      <main className="flex-1 py-10 lg:py-14 bg-cream-100">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <Link
            href="/account/pets"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal-500 hover:text-forest-900"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Pets</span>
          </Link>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-200 shadow-soft space-y-6">
            <h1 className="text-2xl font-serif font-bold text-forest-950">
              Edit Pet: {pet.name}
            </h1>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-charcoal-700">Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-charcoal-700">Breed</label>
                  <input
                    type="text"
                    required
                    value={breed}
                    onChange={(e) => setBreed(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-charcoal-700">Size</label>
                  <select
                    value={sizeCategory}
                    onChange={(e) => setSizeCategory(e.target.value as PetSize)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 text-sm bg-white"
                  >
                    <option value="SMALL">Small (&lt;10 kg)</option>
                    <option value="MEDIUM">Medium (10-25 kg)</option>
                    <option value="LARGE">Large (25+ kg)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-charcoal-700">Weight (kg)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={weightKg}
                    onChange={(e) => setWeightKg(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-charcoal-700">Allergies</label>
                <input
                  type="text"
                  value={allergies}
                  onChange={(e) => setAllergies(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-charcoal-700">Handling Notes</label>
                <textarea
                  rows={3}
                  value={handlingNotes}
                  onChange={(e) => setHandlingNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 text-sm"
                ></textarea>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <Link
                  href="/account/pets"
                  className="px-5 py-2.5 rounded-xl border border-cream-300 text-xs font-semibold text-charcoal-700"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-forest-900 text-white text-xs font-semibold flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Update Profile</span>
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
