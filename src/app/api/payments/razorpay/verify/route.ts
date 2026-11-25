import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    const secret = process.env.RAZORPAY_KEY_SECRET;

    // In demo mode without secret, verify safely
    if (!secret) {
      return NextResponse.json({
        verified: true,
        isDemo: true,
        paymentId: razorpay_payment_id || `pay_demo_${Date.now()}`,
      });
    }

    // Server-side cryptographic signature check
    const generatedSignature = crypto
      .createHmac("sha256", secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const isAuthentic = generatedSignature === razorpay_signature;

    if (!isAuthentic) {
      return NextResponse.json(
        { verified: false, error: "Invalid payment signature." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      verified: true,
      paymentId: razorpay_payment_id,
    });
  } catch (err: any) {
    return NextResponse.json(
      { verified: false, error: err.message },
      { status: 500 }
    );
  }
}

