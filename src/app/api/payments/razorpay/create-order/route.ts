import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { amount, currency = "INR", receipt } = await req.json();

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // If Razorpay credentials are not provided, gracefully use Demo / Sandbox mode
    if (!keyId || !keySecret) {
      return NextResponse.json({
        isDemo: true,
        orderId: `order_demo_${Date.now()}`,
        amount: amount * 100,
        currency,
        keyId: "rzp_test_demoMode",
        message:
          "Razorpay test credentials not configured in environment. Seamless demo mode active.",
      });
    }

    // Call live Razorpay API when keys are configured
    const authHeader = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: `Basic ${authHeader}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100),
        currency,
        receipt: receipt || `rcpt_${Date.now()}`,
      }),
    });

    const order = await response.json();
    return NextResponse.json({
      isDemo: false,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || keyId,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to initiate payment." },
      { status: 500 }
    );
  }
}

