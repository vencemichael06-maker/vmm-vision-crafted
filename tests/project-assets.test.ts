import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { projects } from "@/lib/vmm/projects";

const expectedAssets = new Map([
  ["wiseassistant", "/assets/vmm/projects/wiseassistant-portfolio.webp"],
  [
    "caballero-digital-solutions",
    "/assets/vmm/projects/caballero-digital-solutions-portfolio.webp",
  ],
  ["ig-sabroso-construction", "/assets/vmm/projects/ig-sabroso-portfolio.webp"],
  [
    "google-sheet-order-tracker",
    "/assets/vmm/projects/google-sheet-order-tracker-portfolio.webp",
  ],
]);

describe("real-project portfolio assets", () => {
  it("maps all four canonical projects to checked-in WebP artwork", () => {
    expect(projects).toHaveLength(4);
    for (const project of projects) {
      const expected = expectedAssets.get(project.slug);
      expect(project.thumbnail).toEqual({ desktop: expected, mobile: expected });
      expect(existsSync(path.join(process.cwd(), "public", expected!.slice(1)))).toBe(true);
    }
  });
});
