"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import globalStore from "@/lib/data/store";
import {
  Pet,
  PetSize,
  Service,
  ServiceAddon,
  Groomer,
  Appointment,
} from "@/lib/types";
import { formatCurrency, formatDate, formatTime } from "@/lib/utils";
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Scissors,
  Sparkles,
  ShieldCheck,
  CreditCard,
  Banknote,
  QrCode,
  User,
} from "lucide-react";

export default function BookingWizard() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const services = globalStore.getServices();
  const groomers = globalStore.getGroomers();
  const session = globalStore.getSession();
  const customer =
    globalStore.getCustomerByUserId(session.userId) ||
    globalStore.getCustomers()[0];
  const pets = globalStore.getPetsByCustomerId(customer.id);

  // Wizard state (Steps 1 to 10)
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1: Service
  const initialSlug = searchParams.get("service") || services[0].slug;
  const [selectedService, setSelectedService] = useState<Service>(
    services.find((s) => s.slug === initialSlug) || services[0]
  );

  // Step 2: Pet
  const [selectedPet, setSelectedPet] = useState<Pet>(pets[0] || null);

  // Step 3: Add-ons
  const [selectedAddons, setSelectedAddons] = useState<ServiceAddon[]>([]);

  // Step 4: Price calculation (automatic)
  const petSize: PetSize = selectedPet?.size_category || "SMALL";
  const tierPrice =
    selectedService.pricing.find((p) => p.pet_size === petSize) ||
    selectedService.pricing[0];
  const basePrice = tierPrice.base_price;
  const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);
  const totalAmount = basePrice + addonsTotal;
  const totalDuration =
    tierPrice.estimated_duration_mins +
    selectedAddons.reduce((sum, a) => sum + a.duration_mins, 0);

  // Step 5: Date
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(tomorrow);

  // Step 6: Time Slot & Groomer
  const [selectedGroomer, setSelectedGroomer] = useState<Groomer>(groomers[0]);
  const [availableSlots, setAvailableSlots] = useState<
    { time: string; available: boolean; reason?: string }[]
  >([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Step 7: Special Instructions
  const [instructions, setInstructions] = useState("");

  // Step 8 & 9: Payment mode & Confirmation
  const [paymentMethod, setPaymentMethod] = useState<"CASH" | "UPI" | "RAZORPAY">(
    "UPI"
  );
  const [bookingError, setBookingError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Step 10: Confirmation reference
  const [confirmedBooking, setConfirmedBooking] = useState<Appointment | null>(
    null
  );

  // Fetch slot availability when date, groomer, or duration changes
  useEffect(() => {
    async function fetchSlots() {
      setLoadingSlots(true);
      try {
        const res = await fetch(
          `/api/availability?date=${selectedDate}&groomerId=${selectedGroomer.id}&duration=${totalDuration}`
        );
        const data = await res.json();
        setAvailableSlots(data.slots || []);
        // Pre-select first available slot if current not available
        const firstAvail = data.slots?.find(
          (s: any) => s.available
        )?.time;
        if (firstAvail) setSelectedSlot(firstAvail);
      } catch (err) {
        console.error("Failed to load slots:", err);
      } finally {
        setLoadingSlots(false);
      }
    }
    fetchSlots();
  }, [selectedDate, selectedGroomer.id, totalDuration]);

  const toggleAddon = (addon: ServiceAddon) => {
    if (selectedAddons.some((a) => a.id === addon.id)) {
      setSelectedAddons(selectedAddons.filter((a) => a.id !== addon.id));
    } else {
      setSelectedAddons([...selectedAddons, addon]);
    }
  };

  const calculateEndTime = (start: string, duration: number) => {
    const [h, m] = start.split(":").map(Number);
    const endMinutes = h * 60 + m + duration;
    const endH = Math.floor(endMinutes / 60);
    const endM = (endMinutes % 60).toString().padStart(2, "0");
    return `${endH.toString().padStart(2, "0")}:${endM}`;
  };

  const handleConfirmBooking = async () => {
    setIsSubmitting(true);
    setBookingError("");

    if (!selectedSlot) {
      setBookingError("Please select a time slot.");
      setIsSubmitting(false);
      return;
    }

    const endTime = calculateEndTime(selectedSlot, totalDuration);

    try {
      const items = [
        {
          id: `item-${Date.now()}-1`,
          appointment_id: "",
          item_type: "SERVICE",
          item_id: selectedService.id,
          name: `${selectedService.name} (${petSize})`,
          unit_price: basePrice,
          duration_mins: tierPrice.estimated_duration_mins,
        },
        ...selectedAddons.map((a, idx) => ({
          id: `item-${Date.now()}-${idx + 2}`,
          appointment_id: "",
          item_type: "ADDON",
          item_id: a.id,
          name: a.name,
          unit_price: a.price,
          duration_mins: a.duration_mins,
        })),
      ];

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: customer.id,
          petId: selectedPet.id,
          serviceId: selectedService.id,
          groomerId: selectedGroomer.id,
          scheduledDate: selectedDate,
          startTime: selectedSlot,
          endTime: endTime,
          petSize: petSize,
          basePrice: basePrice,
          addonsTotal: addonsTotal,
          totalAmount: totalAmount,
          specialInstructions: instructions,
          paymentMethod: paymentMethod,
          items: items,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to confirm appointment");
      }

      setConfirmedBooking(data.appointment);
      setCurrentStep(10);
    } catch (err: any) {
      setBookingError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Step Progress Tracker */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-cream-200 shadow-sm">
        <div className="flex items-center justify-between text-xs font-semibold text-charcoal-500 mb-3">
          <span>
            {currentStep < 10
              ? `Step ${currentStep} of 9`
              : "Booking Completed"}
          </span>
          <span className="text-forest-900 font-bold">
            {currentStep === 1 && "Choose Service"}
            {currentStep === 2 && "Choose Pet Profile"}
            {currentStep === 3 && "Optional Add-ons"}
            {currentStep === 4 && "Estimated Price"}
            {currentStep === 5 && "Select Date & Stylist"}
            {currentStep === 6 && "Select Available Time Slot"}
            {currentStep === 7 && "Special Instructions"}
            {currentStep === 8 && "Review Details"}
            {currentStep === 9 && "Select Payment & Confirm"}
            {currentStep === 10 && "Appointment Confirmed"}
          </span>
        </div>
        <div className="w-full bg-cream-200 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-coral-500 h-full transition-all duration-300"
            style={{ width: `${(Math.min(currentStep, 9) / 9) * 100}%` }}
          ></div>
        </div>
      </div>

      {bookingError && (
        <div className="p-4 rounded-2xl bg-red-50 text-red-700 border border-red-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{bookingError}</span>
        </div>
      )}

      {/* STEP 1: SELECT SERVICE */}
      {currentStep === 1 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-200 shadow-soft space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-serif font-bold text-forest-950">
              Step 1: Choose Grooming Service
            </h2>
            <p className="text-xs text-charcoal-500">
              Select the primary package for your dog’s appointment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map((service) => {
              const active = selectedService.id === service.id;
              const minPrice = Math.min(
                ...service.pricing.map((p) => p.base_price)
              );
              return (
                <div
                  key={service.id}
                  onClick={() => setSelectedService(service)}
                  className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                    active
                      ? "border-forest-900 bg-forest-50/50 shadow-soft"
                      : "border-cream-200 hover:border-cream-300 bg-white"
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <h3 className="font-bold text-base text-forest-950">
                        {service.name}
                      </h3>
                      {active && (
                        <CheckCircle2 className="w-5 h-5 text-forest-900 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-charcoal-600 line-clamp-2">
                      {service.short_description}
                    </p>
                  </div>

                  <div className="pt-4 mt-2 border-t border-cream-200 flex items-center justify-between text-xs">
                    <span className="text-charcoal-500">
                      Duration: ~{service.base_duration_mins} mins
                    </span>
                    <span className="font-bold text-forest-900 text-sm">
                      from {formatCurrency(minPrice)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-6 py-3 rounded-xl bg-forest-900 hover:bg-forest-800 text-white font-semibold text-xs flex items-center gap-2 shadow-soft"
            >
              <span>Next: Select Pet</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: SELECT PET */}
      {currentStep === 2 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-200 shadow-soft space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-serif font-bold text-forest-950">
              Step 2: Select Your Dog Profile
            </h2>
            <p className="text-xs text-charcoal-500">
              Pricing automatically adjusts based on your pet's registered size category.
            </p>
          </div>

          {pets.length === 0 ? (
            <div className="text-center py-6 space-y-3 bg-cream-50 rounded-2xl border border-cream-200">
              <p className="text-xs text-charcoal-600">
                You haven't registered any pets yet.
              </p>
              <Link
                href="/account/pets/new"
                className="inline-block px-4 py-2 rounded-xl bg-forest-900 text-white text-xs font-semibold"
              >
                + Register Pet Profile
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {pets.map((pet) => {
                const active = selectedPet?.id === pet.id;
                return (
                  <div
                    key={pet.id}
                    onClick={() => setSelectedPet(pet)}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-4 ${
                      active
                        ? "border-forest-900 bg-forest-50/50 shadow-soft"
                        : "border-cream-200 hover:border-cream-300 bg-white"
                    }`}
                  >
                    <img
                      src={
                        pet.photo_url ||
                        "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=200"
                      }
                      alt={pet.name}
                      className="w-16 h-16 rounded-xl object-cover shrink-0"
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-forest-950 text-base">
                          {pet.name}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cream-200 text-charcoal-700">
                          {pet.size_category}
                        </span>
                      </div>
                      <div className="text-xs text-charcoal-600">
                        {pet.breed} • {pet.weight_kg} kg
                      </div>
                      <div className="text-[11px] text-emerald-700 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Vaccines {pet.vaccination_status}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="pt-4 flex items-center justify-between">
            <button
              onClick={() => setCurrentStep(1)}
              className="px-5 py-2.5 rounded-xl border border-cream-300 text-charcoal-700 font-semibold text-xs flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              disabled={!selectedPet}
              onClick={() => setCurrentStep(3)}
              className="px-6 py-3 rounded-xl bg-forest-900 hover:bg-forest-800 disabled:opacity-50 text-white font-semibold text-xs flex items-center gap-2 shadow-soft"
            >
              <span>Next: Select Add-ons</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: SELECT ADD-ONS */}
      {currentStep === 3 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-200 shadow-soft space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-serif font-bold text-forest-950">
              Step 3: Optional Spa Add-ons
            </h2>
            <p className="text-xs text-charcoal-500">
              Enhance your dog's grooming session with specialized treatments.
            </p>
          </div>

          <div className="space-y-3">
            {selectedService.addons.map((addon) => {
              const isChecked = selectedAddons.some((a) => a.id === addon.id);
              return (
                <div
                  key={addon.id}
                  onClick={() => toggleAddon(addon)}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-4 ${
                    isChecked
                      ? "border-forest-900 bg-forest-50/50"
                      : "border-cream-200 hover:border-cream-300 bg-white"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-coral-500 shrink-0" />
                      <span className="font-bold text-sm text-forest-950">
                        {addon.name}
                      </span>
                    </div>
                    <p className="text-xs text-charcoal-600">{addon.description}</p>
                    <span className="text-[11px] text-charcoal-400">
                      Duration: +{addon.duration_mins} mins
                    </span>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="font-bold text-forest-900 text-sm">
                      +{formatCurrency(addon.price)}
                    </div>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        isChecked
                          ? "bg-forest-900 text-white"
                          : "bg-cream-200 text-charcoal-600"
                      }`}
                    >
                      {isChecked ? "Added" : "Add"}
                    </span>
                  </div>
                </div>
              );
            })}

            {selectedService.addons.length === 0 && (
              <div className="text-center py-6 text-xs text-charcoal-500">
                No extra add-ons required for this service.
              </div>
            )}
          </div>

          <div className="pt-4 flex items-center justify-between">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-5 py-2.5 rounded-xl border border-cream-300 text-charcoal-700 font-semibold text-xs flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => setCurrentStep(4)}
              className="px-6 py-3 rounded-xl bg-forest-900 hover:bg-forest-800 text-white font-semibold text-xs flex items-center gap-2 shadow-soft"
            >
              <span>Next: Review Estimated Price</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: CALCULATE ESTIMATED PRICE */}
      {currentStep === 4 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-200 shadow-soft space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-serif font-bold text-forest-950">
              Step 4: Estimated Price Breakdown
            </h2>
            <p className="text-xs text-charcoal-500">
              Calculated based on {selectedPet?.name}'s size ({petSize}) and selected options.
            </p>
          </div>

          <div className="bg-cream-50 p-6 rounded-2xl border border-cream-200 space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-charcoal-700 font-medium">
                {selectedService.name} ({petSize} Category)
              </span>
              <span className="font-bold text-forest-950">
                {formatCurrency(basePrice)}
              </span>
            </div>

            {selectedAddons.map((addon) => (
              <div
                key={addon.id}
                className="flex items-center justify-between text-xs text-charcoal-600 pl-3 border-l-2 border-cream-300"
              >
                <span>+ {addon.name}</span>
                <span className="font-semibold text-forest-900">
                  +{formatCurrency(addon.price)}
                </span>
              </div>
            ))}

            <div className="pt-3 border-t border-cream-300 flex items-center justify-between">
              <div>
                <div className="text-xs text-charcoal-500">Estimated Total</div>
                <div className="text-2xl font-serif font-bold text-forest-900">
                  {formatCurrency(totalAmount)}
                </div>
              </div>
              <div className="text-right text-xs text-charcoal-500">
                Estimated Duration: <strong>~{totalDuration} minutes</strong>
              </div>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between">
            <button
              onClick={() => setCurrentStep(3)}
              className="px-5 py-2.5 rounded-xl border border-cream-300 text-charcoal-700 font-semibold text-xs flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => setCurrentStep(5)}
              className="px-6 py-3 rounded-xl bg-forest-900 hover:bg-forest-800 text-white font-semibold text-xs flex items-center gap-2 shadow-soft"
            >
              <span>Next: Select Date & Stylist</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: SELECT DATE & GROOMER */}
      {currentStep === 5 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-200 shadow-soft space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-serif font-bold text-forest-950">
              Step 5: Pick Date & Preferred Groomer
            </h2>
            <p className="text-xs text-charcoal-500">
              Choose your preferred appointment day.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-charcoal-700">
                Appointment Date *
              </label>
              <input
                type="date"
                min={new Date().toISOString().split("T")[0]}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-cream-300 text-sm font-medium focus:ring-2 focus:ring-forest-800"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-charcoal-700">
                Assigned Groomer
              </label>
              <div className="space-y-2">
                {groomers.map((g) => {
                  const active = selectedGroomer.id === g.id;
                  return (
                    <div
                      key={g.id}
                      onClick={() => setSelectedGroomer(g)}
                      className={`p-3 rounded-xl border-2 transition-all cursor-pointer flex items-center gap-3 ${
                        active
                          ? "border-forest-900 bg-forest-50"
                          : "border-cream-200 bg-white"
                      }`}
                    >
                      <img
                        src={g.avatar_url}
                        alt={g.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="text-xs">
                        <div className="font-bold text-forest-950">{g.name}</div>
                        <div className="text-charcoal-500">
                          {g.experience_years} yrs exp • {g.specialties[0]}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between">
            <button
              onClick={() => setCurrentStep(4)}
              className="px-5 py-2.5 rounded-xl border border-cream-300 text-charcoal-700 font-semibold text-xs flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => setCurrentStep(6)}
              className="px-6 py-3 rounded-xl bg-forest-900 hover:bg-forest-800 text-white font-semibold text-xs flex items-center gap-2 shadow-soft"
            >
              <span>Next: View Available Slots</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 6: SELECT AVAILABLE TIME SLOTS */}
      {currentStep === 6 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-200 shadow-soft space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-serif font-bold text-forest-950">
              Step 6: Available Time Slots
            </h2>
            <p className="text-xs text-charcoal-500">
              Showing slots on <strong>{formatDate(selectedDate)}</strong> with{" "}
              <strong>{selectedGroomer.name}</strong> ({totalDuration} mins).
            </p>
          </div>

          {loadingSlots ? (
            <div className="py-12 text-center text-xs text-charcoal-500">
              Checking real-time calendar availability...
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {availableSlots.map((slot) => {
                const isSelected = selectedSlot === slot.time;
                return (
                  <button
                    key={slot.time}
                    type="button"
                    disabled={!slot.available}
                    onClick={() => setSelectedSlot(slot.time)}
                    className={`py-3 px-2 rounded-xl text-xs font-semibold border-2 transition-all flex flex-col items-center justify-center gap-1 ${
                      !slot.available
                        ? "bg-cream-100 text-charcoal-300 border-cream-200 cursor-not-allowed opacity-50"
                        : isSelected
                        ? "bg-forest-900 text-white border-forest-900 shadow-soft"
                        : "bg-white text-forest-950 border-cream-200 hover:border-forest-700"
                    }`}
                  >
                    <span>{formatTime(slot.time)}</span>
                    {!slot.available && (
                      <span className="text-[10px] text-red-500">Booked</span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          <div className="pt-4 flex items-center justify-between">
            <button
              onClick={() => setCurrentStep(5)}
              className="px-5 py-2.5 rounded-xl border border-cream-300 text-charcoal-700 font-semibold text-xs flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              disabled={!selectedSlot}
              onClick={() => setCurrentStep(7)}
              className="px-6 py-3 rounded-xl bg-forest-900 hover:bg-forest-800 disabled:opacity-50 text-white font-semibold text-xs flex items-center gap-2 shadow-soft"
            >
              <span>Next: Additional Instructions</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 7: ADDITIONAL INSTRUCTIONS */}
      {currentStep === 7 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-200 shadow-soft space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-serif font-bold text-forest-950">
              Step 7: Special Instructions
            </h2>
            <p className="text-xs text-charcoal-500">
              Any specific styling cuts (e.g. teddy bear face) or behavioral preferences.
            </p>
          </div>

          <div className="space-y-2">
            <textarea
              rows={4}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. Please leave tail fluffy, extra gentle around ears, puppy prefers chicken treats..."
              className="w-full px-4 py-3 rounded-xl border border-cream-300 text-sm focus:ring-2 focus:ring-forest-800"
            ></textarea>
          </div>

          <div className="pt-4 flex items-center justify-between">
            <button
              onClick={() => setCurrentStep(6)}
              className="px-5 py-2.5 rounded-xl border border-cream-300 text-charcoal-700 font-semibold text-xs flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => setCurrentStep(8)}
              className="px-6 py-3 rounded-xl bg-forest-900 hover:bg-forest-800 text-white font-semibold text-xs flex items-center gap-2 shadow-soft"
            >
              <span>Next: Review Booking</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 8: REVIEW BOOKING */}
      {currentStep === 8 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-200 shadow-soft space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-serif font-bold text-forest-950">
              Step 8: Review Booking Summary
            </h2>
            <p className="text-xs text-charcoal-500">
              Please double check all appointment parameters before proceeding to confirmation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-cream-50 space-y-1">
              <span className="text-charcoal-400 font-semibold uppercase">Pet</span>
              <div className="font-bold text-forest-950 text-sm">
                {selectedPet.name} ({selectedPet.breed})
              </div>
              <div className="text-charcoal-600">Size: {petSize}</div>
            </div>

            <div className="p-4 rounded-xl bg-cream-50 space-y-1">
              <span className="text-charcoal-400 font-semibold uppercase">Service</span>
              <div className="font-bold text-forest-950 text-sm">
                {selectedService.name}
              </div>
              <div className="text-charcoal-600">
                Duration: ~{totalDuration} mins
              </div>
            </div>

            <div className="p-4 rounded-xl bg-cream-50 space-y-1">
              <span className="text-charcoal-400 font-semibold uppercase">Date & Time</span>
              <div className="font-bold text-forest-950 text-sm">
                {formatDate(selectedDate)}
              </div>
              <div className="text-charcoal-600">
                {formatTime(selectedSlot)} –{" "}
                {formatTime(calculateEndTime(selectedSlot, totalDuration))}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-cream-50 space-y-1">
              <span className="text-charcoal-400 font-semibold uppercase">Stylist</span>
              <div className="font-bold text-forest-950 text-sm">
                {selectedGroomer.name}
              </div>
              <div className="text-charcoal-600">Bangalore Studio</div>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-cream-200 flex items-center justify-between">
            <span className="font-bold text-sm text-forest-950">
              Total Amount Due
            </span>
            <span className="text-xl font-bold font-serif text-forest-900">
              {formatCurrency(totalAmount)}
            </span>
          </div>

          <div className="pt-4 flex items-center justify-between">
            <button
              onClick={() => setCurrentStep(7)}
              className="px-5 py-2.5 rounded-xl border border-cream-300 text-charcoal-700 font-semibold text-xs flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => setCurrentStep(9)}
              className="px-6 py-3 rounded-xl bg-coral-500 hover:bg-coral-600 text-white font-semibold text-xs flex items-center gap-2 shadow-soft"
            >
              <span>Next: Payment & Confirmation</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 9: CONFIRM BOOKING & PAYMENT */}
      {currentStep === 9 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-200 shadow-soft space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-serif font-bold text-forest-950">
              Step 9: Payment Mode & Final Confirmation
            </h2>
            <p className="text-xs text-charcoal-500">
              Choose your preferred payment method.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <label
              onClick={() => setPaymentMethod("UPI")}
              className={`p-4 rounded-xl border-2 cursor-pointer flex flex-col items-center justify-center gap-2 text-center ${
                paymentMethod === "UPI"
                  ? "border-forest-900 bg-forest-50"
                  : "border-cream-200"
              }`}
            >
              <QrCode className="w-6 h-6 text-forest-800" />
              <span className="font-bold text-xs text-forest-950">Pay via UPI</span>
              <span className="text-[10px] text-charcoal-500">
                GPay, PhonePe, Paytm
              </span>
            </label>

            <label
              onClick={() => setPaymentMethod("RAZORPAY")}
              className={`p-4 rounded-xl border-2 cursor-pointer flex flex-col items-center justify-center gap-2 text-center ${
                paymentMethod === "RAZORPAY"
                  ? "border-forest-900 bg-forest-50"
                  : "border-cream-200"
              }`}
            >
              <CreditCard className="w-6 h-6 text-forest-800" />
              <span className="font-bold text-xs text-forest-950">Card / NetBanking</span>
              <span className="text-[10px] text-charcoal-500">
                Razorpay (Demo/Test Mode)
              </span>
            </label>

            <label
              onClick={() => setPaymentMethod("CASH")}
              className={`p-4 rounded-xl border-2 cursor-pointer flex flex-col items-center justify-center gap-2 text-center ${
                paymentMethod === "CASH"
                  ? "border-forest-900 bg-forest-50"
                  : "border-cream-200"
              }`}
            >
              <Banknote className="w-6 h-6 text-forest-800" />
              <span className="font-bold text-xs text-forest-950">Pay at Studio</span>
              <span className="text-[10px] text-charcoal-500">
                Cash on Pick-up
              </span>
            </label>
          </div>

          <div className="p-4 rounded-xl bg-cream-100 text-xs text-charcoal-600 space-y-1">
            <strong>Cancellation Policy:</strong> Free rescheduling or cancellation
            up to 24 hours prior to appointment.
          </div>

          <div className="pt-4 flex items-center justify-between">
            <button
              onClick={() => setCurrentStep(8)}
              className="px-5 py-2.5 rounded-xl border border-cream-300 text-charcoal-700 font-semibold text-xs flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              disabled={isSubmitting}
              onClick={handleConfirmBooking}
              className="px-8 py-3.5 rounded-xl bg-coral-500 hover:bg-coral-600 disabled:opacity-50 text-white font-bold text-sm flex items-center gap-2 shadow-soft hover:shadow-hover transition-all"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>{isSubmitting ? "Locking Slot..." : "Confirm & Book Now"}</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 10: CONFIRMATION REFERENCE SCREEN */}
      {currentStep === 10 && confirmedBooking && (
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-cream-200 shadow-soft text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs uppercase tracking-wider font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Appointment Successfully Reserved
            </span>
            <h2 className="text-3xl font-serif font-bold text-forest-950">
              We Can't Wait to See {selectedPet.name}!
            </h2>
            <p className="text-xs text-charcoal-500 max-w-md mx-auto">
              Your appointment slot is locked. An SMS and email notification will be
              dispatched prior to the session.
            </p>
          </div>

          {/* Reference Card */}
          <div className="bg-cream-50 p-6 rounded-2xl border border-cream-200 max-w-md mx-auto space-y-3 text-left">
            <div className="flex items-center justify-between border-b border-cream-200 pb-3">
              <span className="text-xs text-charcoal-500 font-semibold">
                Booking Reference
              </span>
              <span className="font-mono text-base font-bold text-forest-950">
                {confirmedBooking.reference_code}
              </span>
            </div>

            <div className="text-xs space-y-1.5 text-charcoal-700">
              <div>
                <strong>Date:</strong> {formatDate(confirmedBooking.scheduled_date)}
              </div>
              <div>
                <strong>Time:</strong> {formatTime(confirmedBooking.start_time)} –{" "}
                {formatTime(confirmedBooking.end_time)}
              </div>
              <div>
                <strong>Service:</strong> {selectedService.name}
              </div>
              <div>
                <strong>Stylist:</strong> {selectedGroomer.name}
              </div>
              <div>
                <strong>Amount:</strong> {formatCurrency(confirmedBooking.total_amount)} (
                {paymentMethod})
              </div>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/account/bookings"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-forest-900 text-white font-semibold text-xs shadow-soft"
            >
              View in My Bookings
            </Link>
            <Link
              href="/"
              className="w-full sm:w-auto px-6 py-3 rounded-xl border border-cream-300 text-charcoal-700 font-semibold text-xs hover:bg-cream-50"
            >
              Return to Homepage
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
