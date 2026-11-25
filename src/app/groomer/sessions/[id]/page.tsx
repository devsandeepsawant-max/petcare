"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import globalStore from "@/lib/data/store";
import { Appointment, GroomingSession } from "@/lib/types";
import { formatTime, formatDate } from "@/lib/utils";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Camera,
  AlertTriangle,
  Scissors,
  Save,
} from "lucide-react";

export default function GroomingSessionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const appointmentId = params?.id as string;

  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [session, setSession] = useState<GroomingSession | null>(null);

  // Form states
  const [coatNotes, setCoatNotes] = useState("");
  const [behaviorNotes, setBehaviorNotes] = useState("");
  const [vetFlag, setVetFlag] = useState(false);
  const [vetReason, setVetReason] = useState("");
  const [preGroomPhoto, setPreGroomPhoto] = useState(
    "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=400"
  );
  const [postGroomPhoto, setPostGroomPhoto] = useState(
    "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=400"
  );
  const [stage, setStage] = useState<"PRE_GROOM" | "IN_PROGRESS" | "POST_GROOM">(
    "PRE_GROOM"
  );
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const apt = globalStore.getAppointmentById(appointmentId);
    if (apt) {
      setAppointment(apt);
      let sess = globalStore.getSessionByAppointmentId(appointmentId);
      if (!sess) {
        sess = {
          id: `sess-${Date.now()}`,
          appointment_id: apt.id,
          groomer_id: apt.groomer_id || "d0000000-0000-0000-0000-000000000001",
          pet_id: apt.pet_id,
          status: "SCHEDULED",
          vet_referral_flag: false,
        };
        globalStore.saveSession(sess);
      }
      setSession(sess);
      setCoatNotes(sess.coat_condition_notes || "");
      setBehaviorNotes(sess.behavior_notes || "");
      setVetFlag(sess.vet_referral_flag);
      setVetReason(sess.vet_referral_reason || "");

      if (apt.status === "COMPLETED") setStage("POST_GROOM");
      else if (apt.status === "IN_PROGRESS") setStage("IN_PROGRESS");
      else setStage("PRE_GROOM");
    }
  }, [appointmentId]);

  if (!appointment || !session) {
    return (
      <div className="p-8 text-center text-xs text-charcoal-500">
        Loading grooming session...
      </div>
    );
  }

  const handleSaveProgress = () => {
    const updated: GroomingSession = {
      ...session,
      coat_condition_notes: coatNotes,
      behavior_notes: behaviorNotes,
      vet_referral_flag: vetFlag,
      vet_referral_reason: vetReason || undefined,
      pre_groom_photo_url: preGroomPhoto,
      post_groom_photo_url: postGroomPhoto,
    };
    globalStore.saveSession(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleStartGrooming = () => {
    globalStore.updateAppointmentStatus(appointment.id, "IN_PROGRESS");
    setStage("IN_PROGRESS");
    handleSaveProgress();
  };

  const handleCompleteGrooming = () => {
    globalStore.updateAppointmentStatus(appointment.id, "COMPLETED");
    setStage("POST_GROOM");
    handleSaveProgress();
    alert("Grooming session marked as completed! Notification dispatched.");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link
        href="/groomer"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal-500 hover:text-forest-900"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Today's Schedule</span>
      </Link>

      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-cream-200 shadow-soft space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs font-bold bg-cream-200 px-2.5 py-1 rounded">
            {appointment.reference_code}
          </span>
          <span
            className={`text-xs font-bold px-2.5 py-1 rounded-full ${
              appointment.status === "COMPLETED"
                ? "bg-purple-100 text-purple-800"
                : appointment.status === "IN_PROGRESS"
                ? "bg-indigo-100 text-indigo-800"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            {appointment.status}
          </span>
        </div>

        <div className="flex items-start gap-4">
          <img
            src={
              appointment.pet?.photo_url ||
              "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=200"
            }
            alt={appointment.pet?.name}
            className="w-16 h-16 rounded-2xl object-cover"
          />
          <div>
            <h1 className="text-2xl font-serif font-bold text-forest-950">
              Grooming: {appointment.pet?.name} ({appointment.pet?.breed})
            </h1>
            <div className="text-xs text-charcoal-600">
              Service: <strong>{appointment.service?.name}</strong> • Size:{" "}
              {appointment.pet_size}
            </div>
            <div className="text-xs text-charcoal-500 mt-1">
              Pet Parent: {appointment.customer?.full_name} (
              {appointment.customer?.phone})
            </div>
          </div>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs border border-emerald-200">
          Session notes updated successfully.
        </div>
      )}

      {/* Workflow Tabs: Pre-Groom, In-Progress, Post-Groom */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-cream-200 shadow-soft space-y-6">
        {/* 1. BEFORE GROOMING: Health & Coat Assessment */}
        <div className="space-y-4">
          <h2 className="text-lg font-serif font-bold text-forest-950 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-forest-800" />
            <span>1. Pre-Groom Check & Skin/Coat Observations</span>
          </h2>

          <div className="space-y-1 text-xs">
            <label className="font-semibold text-charcoal-700">
              Visible Coat, Skin & Matting Observations
            </label>
            <textarea
              rows={3}
              value={coatNotes}
              onChange={(e) => setCoatNotes(e.target.value)}
              placeholder="Record coat condition, presence of ticks/fleas, knotting behind ears, or skin dryness..."
              className="w-full px-3 py-2 rounded-xl border border-cream-300"
            ></textarea>
          </div>

          <div className="p-4 rounded-xl bg-cream-50 space-y-2 text-xs">
            <div className="font-bold text-forest-950">
              Confirmed Customer Instructions:
            </div>
            <div className="text-charcoal-600">
              {appointment.special_instructions || "No custom style requested."}
            </div>
          </div>
        </div>

        {/* 2. DURING GROOMING: Behavior & Vet Referral Flag */}
        <div className="space-y-4 pt-4 border-t border-cream-200">
          <h2 className="text-lg font-serif font-bold text-forest-950 flex items-center gap-2">
            <Scissors className="w-5 h-5 text-forest-800" />
            <span>2. During Grooming & Temperament Notes</span>
          </h2>

          <div className="space-y-1 text-xs">
            <label className="font-semibold text-charcoal-700">
              Pet Temperament & Reaction to Bath/Blowout
            </label>
            <textarea
              rows={2}
              value={behaviorNotes}
              onChange={(e) => setBehaviorNotes(e.target.value)}
              placeholder="e.g. Very relaxed with towel dry, slightly sensitive when clipping nails on front left paw..."
              className="w-full px-3 py-2 rounded-xl border border-cream-300"
            ></textarea>
          </div>

          {/* Vet referral safety flag */}
          <div className="p-4 rounded-xl border border-amber-300 bg-amber-50/70 space-y-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={vetFlag}
                onChange={(e) => setVetFlag(e.target.checked)}
                className="text-amber-600 focus:ring-amber-500 rounded"
              />
              <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-700" />
                Flag Health Concern for Veterinary Referral (Non-Medical)
              </span>
            </label>

            {vetFlag && (
              <div className="space-y-1 text-xs">
                <label className="font-semibold text-amber-900">
                  Observation for Owner/Vet Referral:
                </label>
                <input
                  type="text"
                  value={vetReason}
                  onChange={(e) => setVetReason(e.target.value)}
                  placeholder="e.g. Mild redness in left ear canal, advise veterinary check."
                  className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white"
                />
              </div>
            )}
          </div>
        </div>

        {/* 3. PHOTOS & COMPLETION */}
        <div className="space-y-4 pt-4 border-t border-cream-200">
          <h2 className="text-lg font-serif font-bold text-forest-950 flex items-center gap-2">
            <Camera className="w-5 h-5 text-forest-800" />
            <span>3. Before & After Photographs</span>
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1 text-xs">
              <span className="font-semibold text-charcoal-700">
                Pre-Groom Photo
              </span>
              <img
                src={preGroomPhoto}
                alt="Pre groom"
                className="w-full h-32 object-cover rounded-xl border border-cream-200"
              />
            </div>
            <div className="space-y-1 text-xs">
              <span className="font-semibold text-charcoal-700">
                After Groom Finish
              </span>
              <img
                src={postGroomPhoto}
                alt="Post groom"
                className="w-full h-32 object-cover rounded-xl border border-cream-200"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-cream-200 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={handleSaveProgress}
            className="px-5 py-2.5 rounded-xl border border-cream-300 text-charcoal-700 font-semibold text-xs flex items-center gap-1.5 hover:bg-cream-50"
          >
            <Save className="w-4 h-4" />
            <span>Save Progress Notes</span>
          </button>

          <div className="flex items-center gap-2">
            {appointment.status !== "IN_PROGRESS" &&
              appointment.status !== "COMPLETED" && (
                <button
                  onClick={handleStartGrooming}
                  className="px-5 py-2.5 rounded-xl bg-forest-900 text-white font-semibold text-xs shadow-soft"
                >
                  Start Session
                </button>
              )}

            {appointment.status !== "COMPLETED" && (
              <button
                onClick={handleCompleteGrooming}
                className="px-6 py-2.5 rounded-xl bg-coral-500 hover:bg-coral-600 text-white font-semibold text-xs shadow-soft"
              >
                Mark Grooming Completed
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

