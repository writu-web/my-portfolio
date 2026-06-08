import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import Nav from "@/app/components/Nav";

// ─────────────────────────────────────────────────────────────────────────────
// WHY DO WE MOCK next/navigation?
//
// Nav uses usePathname() to know which link is active.
// usePathname() reads the real browser URL — but there is no real browser
// in tests, only a simulated DOM (jsdom). If we don't mock it, the import
// crashes with "invariant expected app router to be mounted".
//
// vi.mock() replaces the entire module with a fake version for this test file.
// ─────────────────────────────────────────────────────────────────────────────
vi.mock("next/navigation", () => ({
  usePathname: vi.fn(), // vi.fn() creates a fake function we can control
}));

// We import AFTER mocking so we get the mocked version
import { usePathname } from "next/navigation";

// ─────────────────────────────────────────────────────────────────────────────
// WHY DO WE MOCK next/link?
//
// Next.js <Link> depends on the router context which doesn't exist in tests.
// We replace it with a plain <a> tag — same HTML output, no router needed.
// ─────────────────────────────────────────────────────────────────────────────
vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

// beforeEach runs before EVERY it() block in this file.
// We reset the mock so each test starts with a clean slate.
beforeEach(() => {
  vi.clearAllMocks();
});

describe("Nav", () => {

  // ── RENDERING TESTS ────────────────────────────────────────────────────────
  // These tests check that the right elements appear in the DOM.

  it("renders the Portfolio brand link", () => {
    // mockReturnValue() tells the fake usePathname to return "/" this time
    vi.mocked(usePathname).mockReturnValue("/");

    render(<Nav />);

    // screen.getByText() finds an element by its visible text.
    // If the element is not found, the test fails with a clear message.
    expect(screen.getByText("Portfolio")).toBeInTheDocument();
  });

  it("renders all navigation links", () => {
    vi.mocked(usePathname).mockReturnValue("/");

    render(<Nav />);

    // Check all 4 links exist
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("About")).toBeInTheDocument();
    expect(screen.getByText("Contact")).toBeInTheDocument();
    expect(screen.getByText("Chatbot")).toBeInTheDocument();
  });

  it("renders the nav with correct aria-label for accessibility", () => {
    vi.mocked(usePathname).mockReturnValue("/");

    render(<Nav />);

    // getByRole() finds elements by their ARIA role.
    // { name: "..." } checks the accessible name (aria-label value).
    expect(screen.getByRole("navigation", { name: "Main navigation" })).toBeInTheDocument();
  });

  // ── ACTIVE LINK TESTS ──────────────────────────────────────────────────────
  // These tests check that the correct link is highlighted for each page.

  it("marks the Home link as active when on the home page", () => {
    vi.mocked(usePathname).mockReturnValue("/");

    render(<Nav />);

    const homeLink = screen.getByText("Home");
    // aria-current="page" is what screen readers use to announce the current page
    expect(homeLink).toHaveAttribute("aria-current", "page");
  });

  it("marks the About link as active when on the about page", () => {
    vi.mocked(usePathname).mockReturnValue("/about");

    render(<Nav />);

    expect(screen.getByText("About")).toHaveAttribute("aria-current", "page");
  });

  it("marks the Contact link as active when on the contact page", () => {
    vi.mocked(usePathname).mockReturnValue("/contact");

    render(<Nav />);

    expect(screen.getByText("Contact")).toHaveAttribute("aria-current", "page");
  });

  // ── INACTIVE LINK TESTS ────────────────────────────────────────────────────
  // When About is active, Home/Contact/Chatbot should NOT be marked active.

  it("does not mark other links as active when About is the current page", () => {
    vi.mocked(usePathname).mockReturnValue("/about");

    render(<Nav />);

    // not.toHaveAttribute() — the opposite of toHaveAttribute()
    expect(screen.getByText("Home")).not.toHaveAttribute("aria-current");
    expect(screen.getByText("Contact")).not.toHaveAttribute("aria-current");
    expect(screen.getByText("Chatbot")).not.toHaveAttribute("aria-current");
  });

  it("does not mark any link as active on an unknown route", () => {
    vi.mocked(usePathname).mockReturnValue("/unknown-page");

    render(<Nav />);

    expect(screen.getByText("Home")).not.toHaveAttribute("aria-current");
    expect(screen.getByText("About")).not.toHaveAttribute("aria-current");
    expect(screen.getByText("Contact")).not.toHaveAttribute("aria-current");
    expect(screen.getByText("Chatbot")).not.toHaveAttribute("aria-current");
  });

  // ── LINK HREF TESTS ────────────────────────────────────────────────────────

  it("each link points to the correct href", () => {
    vi.mocked(usePathname).mockReturnValue("/");

    render(<Nav />);

    // getAllByRole("link") returns ALL anchor elements on the page
    // We find specific ones by their text using { name: "..." }
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "About" })).toHaveAttribute("href", "/about");
    expect(screen.getByRole("link", { name: "Contact" })).toHaveAttribute("href", "/contact");
    expect(screen.getByRole("link", { name: "Chatbot" })).toHaveAttribute("href", "/chatbot");
  });
});
