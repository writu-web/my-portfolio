"use client";
import { useEffect } from "react";
import { measureLCP } from "@/lib/measure-lcp";

export default function LCPMonitor() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;

    measureLCP((value, element) => {
      const rating =
        value <= 2500 ? "Good ✓" : value <= 4000 ? "Needs improvement ⚠" : "Poor ✗";

      console.log(`LCP: ${value.toFixed(0)}ms — ${rating}`);
      console.log("LCP element:", element);
    });
  }, []);

  return null;
}
