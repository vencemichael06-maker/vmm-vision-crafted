import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { categoryFilters, getProject, projects } from "@/lib/vmm/projects";
import { contactConfig } from "@/lib/vmm/contact-config";
import { ContactSection } from "@/sections/ContactSection";

vi.mock("@/lib/vmm/useGsap", () => ({ useGsap: () => undefined }));

describe("VMM refinement content contract", () => {
  it("exposes seven truthful projects and no empty filter", () => {
    expect(projects.map((project) => project.title)).toEqual([
      "WiseAssistant",
      "Caballero Digital Solutions",
      "IG Sabroso Construction",
      "Google Sheets Order Tracker Automation",
      "24/7 Gmail Customer Support AI Agent",
      "Trigger-Based Outbound Email Marketing & Customer Service",
      "Voice AI Agent",
    ]);
    expect(categoryFilters).toEqual(["All", "Websites", "Mobile Product", "AI & Automation"]);
  });

  it("records delivered automation work without inventing confidential metadata", () => {
    const tracker = getProject("google-sheets-order-tracker");
    expect(tracker).toMatchObject({
      client: "HeldHonest.com",
      delivered: "Nov 7, 2025",
      status: "Delivered",
    });
    expect(tracker?.statusNote).toBeUndefined();

    const voice = getProject("voice-ai-agent");
    expect(voice?.client).toBeUndefined();
    expect(voice?.delivered).toBeUndefined();
    expect(voice?.status).toBe("Confidential");
  });

  it("renders the complete inquiry form with provisional PHP ranges", () => {
    render(<ContactSection />);

    expect(screen.getByRole("heading", { name: "LET'S BUILD SOMETHING GREAT." })).toBeVisible();
    expect(screen.getByLabelText("NAME")).toHaveAttribute("autocomplete", "name");
    expect(screen.getByLabelText("EMAIL")).toHaveAttribute("autocomplete", "email");
    expect(screen.getByLabelText("BUDGET")).toHaveTextContent("Under PHP 25k");
    expect(screen.getByRole("button", { name: "SEND MESSAGE" })).toBeEnabled();
  });

  it("uses the approved production contact email", () => {
    expect(contactConfig.email).toBe("hello@vmmcreatives.site");
  });
});
