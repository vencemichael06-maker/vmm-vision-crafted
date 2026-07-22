import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { categoryFilters, projects } from "@/lib/vmm/projects";
import { contactConfig } from "@/lib/vmm/contact-config";
import { ContactSection } from "@/sections/ContactSection";

vi.mock("@/lib/vmm/useGsap", () => ({ useGsap: () => undefined }));

describe("VMM refinement content contract", () => {
  it("exposes exactly four truthful projects and no empty filter", () => {
    expect(projects.map((project) => project.title)).toEqual([
      "WiseAssistant",
      "Caballero Digital Solutions",
      "IG Sabroso Construction",
      "Google Sheet Order Tracker Automation",
    ]);
    expect(categoryFilters).toEqual(["All", "Websites", "Mobile Product", "AI & Automation"]);
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
