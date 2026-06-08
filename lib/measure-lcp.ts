export function measureLCP(
  onResult: (value: number, element: Element | null) => void,
) {
  if (typeof window === "undefined") return;
  if (!("PerformanceObserver" in window)) return;

  let lastEntry: LargestContentfulPaint | null = null;

  const observer = new PerformanceObserver((entryList) => {
    const entries = entryList.getEntries();
    lastEntry = entries[entries.length - 1] as LargestContentfulPaint;
  });

  observer.observe({ type: "largest-contentful-paint", buffered: true });

  const finalise = () => {
    observer.disconnect();
    if (lastEntry) {
      onResult(lastEntry.startTime, lastEntry.element ?? null);
    }
  };

  ["click", "keydown", "scroll"].forEach((event) =>
    window.addEventListener(event, finalise, { once: true, capture: true }),
  );
}
