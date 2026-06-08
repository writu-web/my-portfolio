import { isTimeoutError } from "@/lib/api-client";

// ─────────────────────────────────────────────────────────────────────────────
// WHAT IS A UNIT TEST?
// A unit test checks one small piece of code in isolation.
// isTimeoutError() is a pure function — it takes input and returns output.
// Pure functions are the easiest things to test.
//
// STRUCTURE OF EVERY TEST:
//   1. ARRANGE  — set up the data you need
//   2. ACT      — call the function you are testing
//   3. ASSERT   — check that the result is what you expected
// ─────────────────────────────────────────────────────────────────────────────

// describe() groups related tests under one label.
// Think of it as a folder. Its label appears in the test output.
describe("isTimeoutError", () => {

  // ── HAPPY PATH TESTS (cases where it should return true) ──────────────────

  it("returns true when the error name is AbortError", () => {
    // ARRANGE
    // AbortController sets error.name = "AbortError" when it times out.
    // We simulate that here manually.
    const error = new Error("The operation was aborted");
    error.name = "AbortError";

    // ACT + ASSERT combined (common pattern for simple tests)
    // expect() wraps the value you want to check.
    // .toBe() checks strict equality — same as ===
    expect(isTimeoutError(error)).toBe(true);
  });

  // ── SAD PATH TESTS (cases where it should return false) ───────────────────

  it("returns false for a regular Error", () => {
    // ARRANGE — a normal error has name = "Error" by default
    const error = new Error("Network error");

    // ASSERT
    expect(isTimeoutError(error)).toBe(false);
  });

  it("returns false for a TypeError", () => {
    const error = new TypeError("Failed to fetch");
    expect(isTimeoutError(error)).toBe(false);
  });

  // ── EDGE CASES (unusual inputs the function might receive) ────────────────
  // These are important — real code receives unexpected inputs all the time.

  it("returns false when given a string", () => {
    expect(isTimeoutError("timeout")).toBe(false);
  });

  it("returns false when given null", () => {
    expect(isTimeoutError(null)).toBe(false);
  });

  it("returns false when given undefined", () => {
    expect(isTimeoutError(undefined)).toBe(false);
  });

  it("returns false when given a number", () => {
    expect(isTimeoutError(408)).toBe(false);
  });

  it("returns false when given a plain object", () => {
    expect(isTimeoutError({ name: "AbortError" })).toBe(false);
    // this is a plain object, NOT an instance of Error
    // the function checks instanceof Error first, so this returns false
  });
});
