import { apiFetch } from "@/lib/api-client";

type AboutData = Record<string, unknown>;

export default async function AboutData() {
  let data: AboutData | null = null;

  try {
    const res = await apiFetch("/portfolio", { next: { revalidate: 3600 } });
    if (res.ok) {
      data = await res.json();
      console.log("[about/page] fetched data:", JSON.stringify(data, null, 2));
    }
  } catch {
    // silently skip — page renders without API data
  }

  if (!data) return null;

  return (
    <div className="mt-8 space-y-4">
      {Object.entries(data).map(([key, value]) => (
        <div key={key}>
          <span className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            {key}
          </span>
          <p className="text-zinc-800 dark:text-zinc-200 mt-1">
            {typeof value === "object"
              ? JSON.stringify(value, null, 2)
              : String(value)}
          </p>
        </div>
      ))}
    </div>
  );
}
