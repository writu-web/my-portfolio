import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import ContactForm from "@/app/contact/ContactForm";

// ─────────────────────────────────────────────────────────────────────────────
// WHY DO WE MOCK fetch?
//
// ContactForm calls fetch('/api/contact') when submitted.
// In tests there is no real server running, so fetch would fail.
// We replace global.fetch with a fake function we control.
//
// vi.fn() creates a fake function. We then tell it what to return
// for each test using .mockResolvedValueOnce() (for async functions).
// ─────────────────────────────────────────────────────────────────────────────

// ── HELPER: fills all form fields ────────────────────────────────────────────
// We use this in multiple tests so we extract it to avoid repetition.
// userEvent simulates real user behaviour (fires focus, input, blur events).
// user.type() types one character at a time, just like a real keyboard.
async function fillForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText("Name"), "John Doe");
  await user.type(screen.getByLabelText("Email"), "john@example.com");
  await user.type(screen.getByLabelText("Phone"), "9876543210");
  await user.type(screen.getByLabelText("Message"), "Hello there!");
}

// ── HELPER: creates a fake successful fetch response ─────────────────────────
function mockFetchSuccess() {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    }),
  );
}

// ── HELPER: creates a fake failed fetch response ──────────────────────────────
function mockFetchError(errorMessage = "Server error") {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: errorMessage }),
    }),
  );
}

// Reset mocks after every test so one test does not affect another
afterEach(() => {
  vi.restoreAllMocks();
});

describe("ContactForm", () => {

  // ── RENDERING TESTS ─────────────────────────────────────────────────────────
  // Check that all the expected elements exist in the DOM when the form renders.

  it("renders all form fields with labels", () => {
    render(<ContactForm />);

    // getByLabelText() finds an input by its associated <label> text.
    // This also verifies that htmlFor on the label matches id on the input —
    // which is what makes the form accessible to screen readers.
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Phone")).toBeInTheDocument();
    expect(screen.getByLabelText("Message")).toBeInTheDocument();
  });

  it("renders the Send button", () => {
    render(<ContactForm />);

    // getByRole() finds elements by their ARIA role.
    // A <button type="submit"> has the role "button".
    expect(screen.getByRole("button", { name: "Send" })).toBeInTheDocument();
  });

  it("renders all inputs as empty initially", () => {
    render(<ContactForm />);

    // toHaveValue() checks what value is currently in an input field.
    expect(screen.getByLabelText("Name")).toHaveValue("");
    expect(screen.getByLabelText("Email")).toHaveValue("");
    expect(screen.getByLabelText("Phone")).toHaveValue("");
    expect(screen.getByLabelText("Message")).toHaveValue("");
  });

  it("phone input has type tel", () => {
    render(<ContactForm />);

    // toHaveAttribute() checks an HTML attribute value.
    // type="tel" shows the phone dial pad on mobile keyboards.
    expect(screen.getByLabelText("Phone")).toHaveAttribute("type", "tel");
  });

  // ── TYPING TESTS ────────────────────────────────────────────────────────────
  // Check that the inputs update when the user types.

  it("updates the Name field when user types", async () => {
    // userEvent.setup() creates a user session that tracks pointer/keyboard state
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.type(screen.getByLabelText("Name"), "Jane Smith");

    // After typing, the input should show what was typed
    expect(screen.getByLabelText("Name")).toHaveValue("Jane Smith");
  });

  it("updates the Email field when user types", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.type(screen.getByLabelText("Email"), "jane@example.com");

    expect(screen.getByLabelText("Email")).toHaveValue("jane@example.com");
  });

  it("updates the Message field when user types", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.type(screen.getByLabelText("Message"), "Hello world");

    expect(screen.getByLabelText("Message")).toHaveValue("Hello world");
  });

  // ── SUBMISSION TESTS ────────────────────────────────────────────────────────

  it("disables the Send button while the form is submitting", async () => {
    // Make fetch never resolve — simulates a slow network
    vi.stubGlobal("fetch", vi.fn().mockImplementation(() => new Promise(() => {})));

    const user = userEvent.setup();
    render(<ContactForm />);

    await fillForm(user);
    await user.click(screen.getByRole("button", { name: "Send" }));

    // At this point fetch is still pending — button should be disabled
    // toBeDisabled() checks the disabled HTML attribute
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("shows Sending... text on the button while submitting", async () => {
    vi.stubGlobal("fetch", vi.fn().mockImplementation(() => new Promise(() => {})));

    const user = userEvent.setup();
    render(<ContactForm />);

    await fillForm(user);
    await user.click(screen.getByRole("button", { name: "Send" }));

    expect(screen.getByRole("button")).toHaveTextContent("Sending...");
  });

  it("calls fetch with correct data when form is submitted", async () => {
    mockFetchSuccess();

    const user = userEvent.setup();
    render(<ContactForm />);

    await fillForm(user);
    await user.click(screen.getByRole("button", { name: "Send" }));

    // waitFor() keeps checking until the assertion passes or times out.
    // We need it because the fetch + state update is async.
    await waitFor(() => {
      // Check fetch was called once
      expect(fetch).toHaveBeenCalledTimes(1);

      // Check fetch was called with the correct arguments
      expect(fetch).toHaveBeenCalledWith("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "John Doe",
          email: "john@example.com",
          phone: "9876543210",
          message: "Hello there!",
        }),
      });
    });
  });

  // ── SUCCESS STATE TESTS ─────────────────────────────────────────────────────

  it("shows success message after successful submission", async () => {
    mockFetchSuccess();

    const user = userEvent.setup();
    render(<ContactForm />);

    await fillForm(user);
    await user.click(screen.getByRole("button", { name: "Send" }));

    // findByText() is like getByText() but waits for the element to appear.
    // Use this whenever the element appears AFTER an async operation.
    expect(await screen.findByText("Message sent successfully!")).toBeInTheDocument();
  });

  it("clears the form fields after successful submission", async () => {
    mockFetchSuccess();

    const user = userEvent.setup();
    render(<ContactForm />);

    await fillForm(user);
    await user.click(screen.getByRole("button", { name: "Send" }));

    // After success the form should reset to empty
    await waitFor(() => {
      expect(screen.getByLabelText("Name")).toHaveValue("");
      expect(screen.getByLabelText("Email")).toHaveValue("");
      expect(screen.getByLabelText("Phone")).toHaveValue("");
      expect(screen.getByLabelText("Message")).toHaveValue("");
    });
  });

  it("re-enables the Send button after successful submission", async () => {
    mockFetchSuccess();

    const user = userEvent.setup();
    render(<ContactForm />);

    await fillForm(user);
    await user.click(screen.getByRole("button", { name: "Send" }));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Send" })).not.toBeDisabled();
    });
  });

  // ── ERROR STATE TESTS ───────────────────────────────────────────────────────

  it("shows error message when the server returns an error", async () => {
    mockFetchError("Failed to send message");

    const user = userEvent.setup();
    render(<ContactForm />);

    await fillForm(user);
    await user.click(screen.getByRole("button", { name: "Send" }));

    expect(await screen.findByText("Failed to send message")).toBeInTheDocument();
  });

  it("shows a generic error message when fetch itself throws (network failure)", async () => {
    // Simulate a total network failure — fetch rejects
    vi.stubGlobal("fetch", vi.fn().mockRejectedValueOnce(new Error("Network error")));

    const user = userEvent.setup();
    render(<ContactForm />);

    await fillForm(user);
    await user.click(screen.getByRole("button", { name: "Send" }));

    expect(await screen.findByText("Network error")).toBeInTheDocument();
  });

  it("re-enables the Send button after a failed submission", async () => {
    mockFetchError();

    const user = userEvent.setup();
    render(<ContactForm />);

    await fillForm(user);
    await user.click(screen.getByRole("button", { name: "Send" }));

    await waitFor(() => {
      expect(screen.getByRole("button")).not.toBeDisabled();
    });
  });

  it("does not show success message when submission fails", async () => {
    mockFetchError();

    const user = userEvent.setup();
    render(<ContactForm />);

    await fillForm(user);
    await user.click(screen.getByRole("button", { name: "Send" }));

    await waitFor(() => {
      // queryByText() returns null instead of throwing if element is not found
      // Use this when you want to assert something is NOT in the document
      expect(screen.queryByText("Message sent successfully!")).not.toBeInTheDocument();
    });
  });
});
