import { expect, test } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const viewports = [
  { width: 375, height: 812 },
  { width: 390, height: 844 },
  { width: 414, height: 896 },
  { width: 768, height: 1024 },
  { width: 1024, height: 1366 },
  { width: 1366, height: 768 },
  { width: 1440, height: 900 },
  { width: 1920, height: 1080 },
] as const;

const screenshotDirectory =
  process.env.VMM_QA_SCREENSHOT_DIR || path.resolve("test-results", "responsive-screenshots");

test.beforeAll(async () => {
  await mkdir(screenshotDirectory, { recursive: true });
});

for (const viewport of viewports) {
  test(`${viewport.width}x${viewport.height} responsive contract`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("/");
    await page.locator("main").waitFor();
    await page.locator(".vmm-hpg--done").waitFor();

    const layout = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      heroPeople: document.querySelectorAll('[data-testid="hero-person"]').length,
      handSequences: document.querySelectorAll(".hand-reveal-media").length,
    }));

    expect(layout.overflow).toBeLessThanOrEqual(0);
    expect(layout.heroPeople).toBe(1);
    expect(layout.handSequences).toBe(1);
    await expect(page.getByRole("heading", { name: "VENCE MICHAEL MONTERO." })).toBeVisible();
    await expect(page.getByRole("link", { name: /view my work/i })).toBeVisible();

    await page.screenshot({
      path: path.join(screenshotDirectory, `vmm-${viewport.width}x${viewport.height}-hero.png`),
    });

    await page.evaluate(() => document.getElementById("services")?.scrollIntoView());
    await page.waitForTimeout(850);
    await page.screenshot({
      path: path.join(screenshotDirectory, `vmm-${viewport.width}x${viewport.height}-services.png`),
    });

    await page.evaluate(() => document.getElementById("contact")?.scrollIntoView());
    await page.waitForTimeout(850);
    await expect(page.getByRole("heading", { name: "LET'S BUILD SOMETHING GREAT." })).toBeVisible();
    await page.screenshot({
      path: path.join(
        screenshotDirectory,
        `vmm-${viewport.width}x${viewport.height}-contact-heading.png`,
      ),
    });
    await expect(page.getByLabel("NAME")).toBeVisible();
    await expect(page.getByLabel("MESSAGE", { exact: true })).toBeVisible();

    await page.getByLabel("MESSAGE", { exact: true }).scrollIntoViewIfNeeded();
    await page.screenshot({
      path: path.join(
        screenshotDirectory,
        `vmm-${viewport.width}x${viewport.height}-contact-form.png`,
      ),
    });
  });
}

test("hash navigation, browser history, and accessible dialog", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");

  await page.getByRole("link", { name: "WORK", exact: true }).click();
  await expect(page).toHaveURL(/#work$/);
  await page.getByRole("link", { name: "CONTACT", exact: true }).click();
  await expect(page).toHaveURL(/#contact$/);
  await page.goBack();
  await expect(page).toHaveURL(/#work$/);
  await page.goForward();
  await expect(page).toHaveURL(/#contact$/);

  await page.getByRole("button", { name: "Open menu" }).click();
  const dialog = page.getByRole("dialog", { name: "Site navigation" });
  await expect(dialog).toBeVisible();
  await expect(page.getByRole("link", { name: "Home", exact: true })).toBeFocused();
  await expect(page.locator('[data-social-profile="facebook"]')).toHaveAccessibleName(
    "Facebook profile unavailable",
  );
  await expect(page.locator('[data-social-profile="facebook"]')).toBeDisabled();
  await expect(page.locator('[data-social-profile="linkedin"]')).toHaveAccessibleName(
    "LinkedIn profile unavailable",
  );
  await expect(page.locator('[data-social-profile="linkedin"]')).toBeDisabled();
  await expect(page.locator("body")).toHaveAttribute("data-scroll-locked", "1");
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(page.getByRole("button", { name: "Open menu" })).toBeFocused();

  await page.goto("/#contact");
  await expect(page.getByRole("heading", { name: "LET'S BUILD SOMETHING GREAT." })).toBeVisible();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
});

test("hand sequence reaches both endpoints when scrolling forward and reverse", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.locator(".vmm-hpg--done").waitFor();

  const hand = page.locator(".hand-reveal-media");
  await page.evaluate(() => {
    const about = document.getElementById("about");
    if (!about) throw new Error("About section missing");
    window.scrollTo(0, about.offsetTop + about.offsetHeight - window.innerHeight);
  });
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
  await expect
    .poll(async () => Number(await hand.getAttribute("data-current-frame")), { timeout: 15_000 })
    .toBeGreaterThanOrEqual(45);

  await page.evaluate(() => {
    const about = document.getElementById("about");
    if (!about) throw new Error("About section missing");
    window.scrollTo(0, about.offsetTop);
  });
  await expect
    .poll(async () => Number(await hand.getAttribute("data-current-frame")), { timeout: 15_000 })
    .toBeLessThanOrEqual(2);
});

test("reduced motion uses final static hand art", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.locator("#about").scrollIntoViewIfNeeded();
  await expect(page.locator(".hand-reveal-media")).toHaveAttribute("data-reduced-motion", "true");
  await expect(page.locator(".hand-reveal-poster")).toHaveAttribute(
    "src",
    "/assets/vmm/about/hand-open-transparent.png",
  );
  await expect(page.locator(".hand-reveal-canvas")).toHaveCount(0);
});

test("contact endpoint confirms success and exposes a retryable failure", async ({ page }) => {
  await page.route("**/api/contact", async (route) => {
    await route.fulfill({ status: 503, body: "Unavailable" });
  });
  await page.goto("/#contact");
  await page.locator(".vmm-hpg--done").waitFor();
  await page.getByLabel("NAME").fill("Ana Reyes");
  await page.getByLabel("EMAIL").fill("ana@example.com");
  await page.getByLabel("PROJECT TYPE").selectOption("Website");
  await page.getByLabel("BUDGET").selectOption("PHP 50k-100k");
  await page.getByLabel("MESSAGE", { exact: true }).fill("We need a responsive company website.");
  await page.getByRole("button", { name: "SEND MESSAGE" }).click();
  await expect(page.getByRole("alert")).toBeVisible();
  await expect(page.getByRole("button", { name: "Retry submission" })).toBeEnabled();

  await page.unroute("**/api/contact");
  await page.route("**/api/contact", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ referenceId: "VMM-E2E-001" }),
    });
  });
  await page.getByRole("button", { name: "Retry submission" }).click();
  await expect(page.getByRole("status")).toContainText("Inquiry confirmed");
  await expect(page.getByText("VMM-E2E-001")).toBeVisible();
});
