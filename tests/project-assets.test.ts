import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { projects } from "@/lib/vmm/projects";

const expectedAssets = new Map([
  ["wiseassistant", "/assets/vmm/projects/wiseassistant-portfolio.webp"],
  [
    "caballero-digital-solutions",
    "/assets/vmm/projects/caballero-digital-solutions-portfolio-v2.webp",
  ],
  ["ig-sabroso-construction", "/assets/vmm/projects/ig-sabroso-portfolio-v2.webp"],
  ["google-sheets-order-tracker", "/assets/vmm/projects/google-sheet-order-tracker-portfolio.webp"],
  ["gmail-customer-support-ai-agent", "/assets/vmm/projects/gmail-support-agent.webp"],
  ["trigger-based-email-marketing", "/assets/vmm/projects/trigger-email-automation.webp"],
  ["voice-ai-agent", "/assets/vmm/projects/voice-ai-agent.webp"],
]);

describe("real-project portfolio assets", () => {
  it("maps all seven projects and galleries to checked-in WebP artwork", () => {
    expect(projects).toHaveLength(7);
    for (const project of projects) {
      const expected = expectedAssets.get(project.slug);
      expect(project.thumbnail).toEqual({ desktop: expected, mobile: expected });
      expect(existsSync(path.join(process.cwd(), "public", expected!.slice(1)))).toBe(true);
      for (const image of project.gallery) {
        expect(image.src).toMatch(/\.webp$/);
        expect(existsSync(path.join(process.cwd(), "public", image.src.slice(1)))).toBe(true);
      }
    }
  });
});
