import { NextRequest, NextResponse } from "next/server";
import { apiFetch, isTimeoutError } from "@/lib/api-client";

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: NextRequest) {
  try {
    const formData: ContactFormData = await request.json();

    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.message
    ) {
      return NextResponse.json(
        { error: "Missing required fields: name, email, message" },
        { status: 400 },
      );
    }

    if (!isValidEmail(formData.email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 },
      );
    }

    const res = await apiFetch("/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      const backendError = await res.json().catch(() => null);
      console.error("Backend rejected contact form:", res.status, backendError);
      const error =
        backendError?.error ??
        backendError?.message ??
        `Failed to submit contact form: ${res.status}`;
      return NextResponse.json({ error }, { status: res.status });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error processing contact form:", error);
    const timedOut = isTimeoutError(error);
    return NextResponse.json(
      { error: timedOut ? "Request timeout" : "Failed to process contact form" },
      { status: timedOut ? 504 : 500 },
    );
  }
}
