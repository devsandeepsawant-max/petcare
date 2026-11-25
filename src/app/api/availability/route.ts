import { NextRequest, NextResponse } from "next/server";
import globalStore from "@/lib/data/store";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date") || new Date().toISOString().split("T")[0];
  const groomerId = searchParams.get("groomerId") || "";
  const durationMins = parseInt(searchParams.get("duration") || "60", 10);

  const settings = globalStore.getSettings();
  const startHour = parseInt(settings.opening_time.split(":")[0], 10); // 9
  const endHour = parseInt(settings.closing_time.split(":")[0], 10); // 19

  // Existing appointments for this date
  const appointments = globalStore.getAppointments({ date });

  // Generate slots every 30 mins
  const slots: { time: string; available: boolean; reason?: string }[] = [];

  for (let h = startHour; h < endHour; h++) {
    for (const m of ["00", "30"]) {
      // Check if slot + duration exceeds closing time
      const slotStartMins = h * 60 + parseInt(m, 10);
      const slotEndMins = slotStartMins + durationMins;

      if (slotEndMins > endHour * 60) {
        continue;
      }

      const timeString = `${h.toString().padStart(2, "0")}:${m}`;
      const endH = Math.floor(slotEndMins / 60);
      const endM = (slotEndMins % 60).toString().padStart(2, "0");
      const endTimeString = `${endH.toString().padStart(2, "0")}:${endM}`;

      // Check collision
      const isBooked = appointments.some((apt) => {
        if (apt.status === "CANCELLED") return false;
        if (groomerId && apt.groomer_id && apt.groomer_id !== groomerId) {
          return false;
        }
        // Overlap test
        return timeString < apt.end_time && endTimeString > apt.start_time;
      });

      slots.push({
        time: timeString,
        available: !isBooked,
        reason: isBooked ? "Already booked" : undefined,
      });
    }
  }

  return NextResponse.json({
    date,
    durationMins,
    slots,
  });
}
