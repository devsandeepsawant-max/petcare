import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import globalStore from "@/lib/data/store";
import { Plus, ShieldCheck, Heart, ArrowLeft } from "lucide-react";

export default function PetsListPage() {
  const session = globalStore.getSession();
  const customer = globalStore.getCustomerByUserId(session.userId) || globalStore.getCustomers()[0];
  const pets = globalStore.getPetsByCustomerId(customer.id);

  return (
    <>
      <Navbar />

      <main className="flex-1 py-10 lg:py-14 bg-cream-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Link
                href="/account"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal-500 hover:text-forest-900"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Overview</span>
              </Link>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-forest-950">
                My Dog Profiles ({pets.length})
              </h1>
            </div>

            <Link
              href="/account/pets/new"
              className="px-5 py-2.5 rounded-xl bg-forest-900 hover:bg-forest-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-soft transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Pet</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pets.map((pet) => (
              <div
                key={pet.id}
                className="bg-white rounded-3xl p-6 border border-cream-200 shadow-soft space-y-4 hover:shadow-hover transition-all"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={pet.photo_url || "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=300"}
                    alt={pet.name}
                    className="w-24 h-24 rounded-2xl object-cover shrink-0"
                  />
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold font-serif text-forest-950">
                        {pet.name}
                      </h2>
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-forest-100 text-forest-800">
                        {pet.size_category} Size
                      </span>
                    </div>
                    <div className="text-xs text-charcoal-600 font-medium">
                      {pet.breed} • {pet.weight_kg} kg • {pet.gender}
                    </div>
                    <div className="text-xs text-charcoal-500">
                      Coat: {pet.coat_type}
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-cream-50 text-xs text-charcoal-700 space-y-1">
                  <div>
                    <strong className="text-forest-900">Temperament:</strong> {pet.temperament}
                  </div>
                  <div>
                    <strong className="text-forest-900">Handling Notes:</strong>{" "}
                    {pet.special_handling_notes || "None declared"}
                  </div>
                  {pet.allergies && (
                    <div className="text-coral-700">
                      <strong>Allergies:</strong> {pet.allergies}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-cream-200">
                  <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4" />
                    Vaccination {pet.vaccination_status}
                  </span>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/booking?petId=${pet.id}`}
                      className="text-xs px-3 py-1.5 rounded-lg bg-coral-500 text-white font-medium hover:bg-coral-600"
                    >
                      Book Grooming
                    </Link>
                    <Link
                      href={`/account/pets/${pet.id}`}
                      className="text-xs px-3 py-1.5 rounded-lg border border-cream-300 text-charcoal-700 hover:bg-cream-100"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
