import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const auditViewports = [
  { name: "mobile", width: 390, height: 844 },
  { name: "desktop", width: 1440, height: 900 },
] as const;

for (const viewport of auditViewports) {
  test(`WCAG 2.2 AA automated audit — ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("/");
    await page.locator("main").waitFor();

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();

    expect(results.violations).toEqual([]);
  });
}

test("WCAG 2.2 AA automated audit — navigation dialog", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.locator(".vmm-hpg--done").waitFor();
  await page.getByRole("button", { name: "Open menu" }).click();
  await page.getByRole("dialog", { name: "Site navigation" }).waitFor();

  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();

  expect(results.violations).toEqual([]);
});

test("WCAG 2.2 AA automated audit — expanded projects", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/#work");
  await page.locator(".vmm-hpg--done").waitFor();
  const disclosure = page.locator(".vmm-work-disclosure");
  await disclosure.focus();
  await page.keyboard.press("Enter");
  await expect(disclosure).toHaveAttribute("aria-expanded", "true");
  await expect(disclosure).toBeFocused();
  await expect(page.locator("#work [data-testid='work-project']")).toHaveCount(7);

  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();

  expect(results.violations).toEqual([]);
});
