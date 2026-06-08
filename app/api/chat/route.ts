import { apiFetch } from "@/lib/api-client";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const message = body.message;

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid message" },
        { status: 400 },
      );
    }

    const res = await apiFetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: message }),
    });
    if (!res.ok) {
      const errorBody = await res.json();
      const errorMessage =
        errorBody?.error?.message ?? "Failed to get response from BE";
      return NextResponse.json({ error: errorMessage }, { status: res.status });
    }

    const data = await res.json();
    console.log("Backend response:", JSON.stringify(data, null, 2));

    const answer = data?.answer ?? "Sorry, I could not respond.";
    return NextResponse.json({ answer });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
