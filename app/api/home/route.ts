import { NextResponse } from "next/server";
import { apiFetch, isTimeoutError } from "@/lib/api-client";

export async function GET() {
  try {
    const res = await apiFetch("/home");

    if (!res.ok) {
      return NextResponse.json(
        { error: `Failed to fetch home data: ${res.status}` },
        { status: res.status },
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching home data:", error);
    const timedOut = isTimeoutError(error);
    return NextResponse.json(
      { error: timedOut ? "Request timeout" : "Failed to fetch home data" },
      { status: timedOut ? 504 : 500 },
    );
  }
}
