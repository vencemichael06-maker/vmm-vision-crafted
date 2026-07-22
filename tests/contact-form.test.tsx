import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ContactSection } from "@/sections/ContactSection";

vi.mock("@/lib/vmm/useGsap", () => ({ useGsap: () => undefined }));

async function fillValidInquiry(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText("NAME"), "Ana Reyes");
  await user.type(screen.getByLabelText("EMAIL"), "ana@example.com");
  await user.selectOptions(screen.getByLabelText("PROJECT TYPE"), "Website");
  await user.selectOptions(screen.getByLabelText("BUDGET"), "PHP 50k-100k");
  await user.type(screen.getByLabelText("MESSAGE"), "We need a responsive company website.");
}

describe("contact form states", () => {
  afterEach(() => vi.restoreAllMocks());

  it("announces validation errors and focuses the first invalid field", async () => {
    const user = userEvent.setup();
    render(<ContactSection />);

    await user.click(screen.getByRole("button", { name: "SEND MESSAGE" }));

    expect(await screen.findByText("Enter your name.")).toBeVisible();
    expect(screen.getByLabelText("NAME")).toHaveFocus();
  });

  it("shows confirmed success only after the endpoint responds successfully", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ referenceId: "VMM-2026-001" }), {
        status: 200,
        headers: { "content-type": "application/json" },
      }),
    );
    const user = userEvent.setup();
    render(<ContactSection />);
    await fillValidInquiry(user);

    await user.click(screen.getByRole("button", { name: "SEND MESSAGE" }));

    expect(await screen.findByRole("status")).toHaveTextContent("Inquiry confirmed");
    expect(screen.getByText("VMM-2026-001")).toBeVisible();
  });

  it("retains values and offers retry and direct fallbacks after failure", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(null, { status: 503 }));
    const user = userEvent.setup();
    render(<ContactSection />);
    await fillValidInquiry(user);

    await user.click(screen.getByRole("button", { name: "SEND MESSAGE" }));

    await waitFor(() => expect(screen.getByRole("alert")).toBeVisible());
    expect(screen.getByLabelText("NAME")).toHaveValue("Ana Reyes");
    expect(screen.getByRole("button", { name: "Retry submission" })).toBeEnabled();
    expect(screen.getByRole("link", { name: "Email fallback" })).toHaveAttribute(
      "href",
      expect.stringContaining("mailto:"),
    );
    expect(screen.getByRole("link", { name: "WhatsApp fallback" })).toHaveAttribute(
      "href",
      expect.stringContaining("wa.me"),
    );
  });
});
