const API_BASE_URL = process.env.API_BASE_URL ?? "http://localhost:5000/api";
const TIMEOUT_MS = 5000;

type CacheOptions = {
  next?: { revalidate?: number | false; tags?: string[] };
};

export async function apiFetch(
  path: string,
  init?: RequestInit & CacheOptions,
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeoutId);
  }
}

export function isTimeoutError(error: unknown): boolean {
  return error instanceof Error && error.name === "AbortError";
}
