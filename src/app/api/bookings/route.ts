import { NextRequest, NextResponse } from "next/server";
import globalStore from "@/lib/data/store";
import { generateBookingReference } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      customerId,
      petId,
      serviceId,
      groomerId,
      scheduledDate,
      startTime,
      endTime,
      petSize,
      basePrice,
      addonsTotal,
      totalAmount,
      specialInstructions,
      items,
      paymentMethod,
    } = body;

    if (!customerId || !petId || !serviceId || !scheduledDate || !startTime || !endTime) {
      return NextResponse.json(
        { error: "Missing required booking fields." },
        { status: 400 }
      );
    }

    const referenceCode = generateBookingReference();

    const appointment = globalStore.createAppointment({
      reference_code: referenceCode,
      customer_id: customerId,
      pet_id: petId,
      groomer_id: groomerId || "d0000000-0000-0000-0000-000000000001",
      service_id: serviceId,
      scheduled_date: scheduledDate,
      start_time: startTime,
      end_time: endTime,
      status: "CONFIRMED",
      pet_size: petSize,
      base_price: basePrice,
      addons_total: addonsTotal || 0,
      total_amount: totalAmount,
      deposit_amount: 0,
      special_instructions: specialInstructions,
      items: items || [],
      is_demo: true,
    });

    // Record initial payment record
    if (paymentMethod) {
      globalStore.recordPayment({
        appointment_id: appointment.id,
        amount: totalAmount,
        payment_method: paymentMethod,
        payment_status: paymentMethod === "CASH" ? "PENDING" : "COMPLETED",
        transaction_ref: `${paymentMethod}-${Date.now()}`,
        is_deposit: false,
        is_demo: true,
      });
    }

    return NextResponse.json({
      success: true,
      appointment,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to create booking." },
      { status: 409 }
    );
  }
}
