import { NextResponse } from "next/server";
import { apiFetch, isTimeoutError } from "@/lib/api-client";

export async function GET() {
  try {
    const res = await apiFetch("/portfolio");

    if (!res.ok) {
      return NextResponse.json(
        { error: `Failed to fetch portfolio data: ${res.status}` },
        { status: res.status },
      );
    }

    const data = await res.json();
    console.log("[about/route] fetched data:", JSON.stringify(data, null, 2));
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching portfolio data:", error);
    const timedOut = isTimeoutError(error);
    return NextResponse.json(
      { error: timedOut ? "Request timeout" : "Failed to fetch portfolio data" },
      { status: timedOut ? 504 : 500 },
    );
  }
}
