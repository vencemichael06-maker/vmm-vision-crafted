import { expect, test } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const viewports = [
  { width: 375, height: 812 },
  { width: 390, height: 844 },
  { width: 414, height: 896 },
  { width: 430, height: 932 },
  { width: 768, height: 1024 },
  { width: 820, height: 1180 },
  { width: 1024, height: 1366 },
  { width: 1280, height: 720 },
  { width: 1366, height: 768 },
  { width: 1440, height: 900 },
  { width: 1536, height: 864 },
  { width: 1920, height: 1080 },
] as const;

const screenshotDirectory =
  process.env.VMM_QA_SCREENSHOT_DIR || path.resolve("test-results", "responsive-screenshots");

async function renderedLineCount(page: import("@playwright/test").Page, selector: string) {
  return page.locator(selector).evaluate((element) => {
    const tops = new Set<number>();
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const text = walker.currentNode.textContent ?? "";
      for (let index = 0; index < text.length; index += 1) {
        if (!text[index].trim()) continue;
        const range = document.createRange();
        range.setStart(walker.currentNode, index);
        range.setEnd(walker.currentNode, index + 1);
        const rect = range.getBoundingClientRect();
        if (rect.width > 0) tops.add(Math.round(rect.top));
      }
    }
    return tops.size;
  });
}

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
    const mobile = viewport.width < 768;
    expect(await renderedLineCount(page, "#home h1")).toBe(mobile ? 3 : 2);

    await page.screenshot({
      path: path.join(screenshotDirectory, `vmm-${viewport.width}x${viewport.height}-hero.png`),
    });

    await page.evaluate(() => document.getElementById("work")?.scrollIntoView());
    const projectThumbnails = page.locator("#work [data-project-thumbnail]");
    await expect(projectThumbnails).toHaveCount(4);
    await expect
      .poll(
        () =>
          projectThumbnails.evaluateAll((images) =>
            images.every((image) => {
              const thumbnail = image as HTMLImageElement;
              return (
                thumbnail.complete && thumbnail.naturalWidth > 0 && thumbnail.currentSrc !== ""
              );
            }),
          ),
        { timeout: 15_000 },
      )
      .toBe(true);

    const thumbnailUrls = await projectThumbnails.evaluateAll((images) =>
      images.map((image) => (image as HTMLImageElement).currentSrc),
    );
    expect(thumbnailUrls).toHaveLength(4);
    expect(thumbnailUrls.every((src) => new URL(src).pathname.endsWith("-portfolio.webp"))).toBe(
      true,
    );

    const workContract = await page.locator("#work").evaluate((work, viewportWidth) => {
      const rows = [...work.querySelectorAll<HTMLElement>("[data-work-row]")];
      const firstLink = rows[0]?.querySelector<HTMLElement>(":scope > a");
      const media = firstLink?.children[0] as HTMLElement | undefined;
      const copy = firstLink?.children[1] as HTMLElement | undefined;
      const mediaBounds = media?.getBoundingClientRect();
      const copyBounds = copy?.getBoundingClientRect();
      const linkStyle = firstLink ? getComputedStyle(firstLink) : null;
      const columns = linkStyle?.gridTemplateColumns.split(" ").filter(Boolean) ?? [];

      return {
        rowCount: rows.length,
        linksPerRow: rows.map((row) => row.querySelectorAll(":scope > a").length),
        nestedInteractiveCount: work.querySelectorAll(
          "[data-work-row] > a a, [data-work-row] > a button, [data-work-row] > a input, [data-work-row] > a select, [data-work-row] > a textarea",
        ).length,
        responsiveSources: work.querySelectorAll('picture source[media="(max-width: 767px)"]')
          .length,
        columnCount: columns.length,
        columnRatio:
          columns.length === 2
            ? Number.parseFloat(columns[0]) / Number.parseFloat(columns[1])
            : null,
        gap: linkStyle ? Number.parseFloat(linkStyle.columnGap) : null,
        imageFirst: Boolean(
          mediaBounds &&
          copyBounds &&
          (viewportWidth === 375
            ? mediaBounds.top < copyBounds.top
            : mediaBounds.left < copyBounds.left),
        ),
      };
    }, viewport.width);

    expect(workContract.rowCount).toBe(4);
    expect(workContract.linksPerRow).toEqual([1, 1, 1, 1]);
    expect(workContract.nestedInteractiveCount).toBe(0);
    expect(workContract.responsiveSources).toBe(4);
    expect(workContract.imageFirst).toBe(true);
    if (viewport.width === 375) {
      expect(workContract.columnCount).toBe(1);
    } else {
      expect(workContract.columnCount).toBe(2);
      if (viewport.width < 768) {
        expect(workContract.columnRatio).toBeCloseTo(0.95 / 1.05, 1);
        expect(workContract.gap).toBeGreaterThanOrEqual(12);
        expect(workContract.gap).toBeLessThanOrEqual(16);
      } else if (viewport.width < 1200) {
        expect(workContract.columnRatio).toBeCloseTo(5 / 6, 1);
      } else {
        expect(workContract.columnRatio).toBeCloseTo(7 / 5, 1);
      }
    }

    const projectRows = page.locator("#work [data-work-row]");
    for (let index = 0; index < (await projectRows.count()); index += 1) {
      const row = projectRows.nth(index);
      await row.scrollIntoViewIfNeeded();
      await expect
        .poll(() => row.evaluate((element) => Number.parseFloat(getComputedStyle(element).opacity)))
        .toBeGreaterThan(0.99);
    }
    await page.evaluate(() => document.getElementById("work")?.scrollIntoView());
    await page.locator("#work").screenshot({
      path: path.join(screenshotDirectory, `vmm-${viewport.width}x${viewport.height}-work.png`),
    });

    await page.evaluate(() => {
      const about = document.getElementById("about");
      if (!about) throw new Error("About section missing");
      window.scrollTo(0, about.offsetTop + 1);
    });
    if (mobile) {
      await expect(page.locator('[data-section-number="002"]')).toBeInViewport();
    }
    expect(await renderedLineCount(page, "#about h2")).toBe(3);

    if (mobile) {
      const hand = page.getByTestId("about-hand").locator(".hand-reveal-media");
      await page.evaluate(() => {
        const about = document.getElementById("about");
        if (!about) throw new Error("About section missing");
        const scrollable = about.offsetHeight - window.innerHeight;
        window.scrollTo(0, about.offsetTop + scrollable * 0.5);
      });
      await expect
        .poll(async () => Number(await hand.getAttribute("data-current-frame")), { timeout: 15_000 })
        .toBeGreaterThanOrEqual(45);
      const ctaBounds = await page.getByTestId("about-cta").boundingBox();
      expect(ctaBounds).not.toBeNull();
      expect(ctaBounds!.x).toBeGreaterThanOrEqual(0);
      expect(ctaBounds!.y).toBeGreaterThanOrEqual(0);
      expect(ctaBounds!.x + ctaBounds!.width).toBeLessThanOrEqual(viewport.width);
      expect(ctaBounds!.y + ctaBounds!.height).toBeLessThanOrEqual(viewport.height);
      expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBe(0);
    }

    await page.evaluate(() => document.getElementById("services")?.scrollIntoView());
    await page.waitForTimeout(850);
    expect.soft(await renderedLineCount(page, "#services-title")).toBeLessThanOrEqual(mobile ? 4 : 3);
    await page.screenshot({
      path: path.join(screenshotDirectory, `vmm-${viewport.width}x${viewport.height}-services.png`),
    });

    await page.evaluate(() => document.getElementById("process")?.scrollIntoView());
    await page.waitForTimeout(850);
    expect.soft(await renderedLineCount(page, "#process-title")).toBeLessThanOrEqual(
      viewport.width >= 1200 ? 2 : 3,
    );
    for (const label of ["Discovery", "Strategy", "Design", "Develop", "Launch & Support"]) {
      await expect(page.getByRole("heading", { name: label, exact: true })).toBeVisible();
    }
    await page.screenshot({
      path: path.join(screenshotDirectory, `vmm-${viewport.width}x${viewport.height}-process.png`),
    });

    await page.evaluate(() => document.getElementById("contact")?.scrollIntoView());
    await page.waitForTimeout(850);
    await expect(page.getByRole("heading", { name: "LET'S BUILD SOMETHING GREAT." })).toBeVisible();
    expect.soft(await renderedLineCount(page, "#contact-title")).toBeLessThanOrEqual(mobile ? 4 : 3);
    await page.screenshot({
      path: path.join(
        screenshotDirectory,
        `vmm-${viewport.width}x${viewport.height}-contact-heading.png`,
      ),
    });
    await page.locator("#contact form").scrollIntoViewIfNeeded();
    for (const label of ["NAME", "EMAIL", "PROJECT TYPE", "BUDGET", "MESSAGE"]) {
      await expect(page.getByLabel(label, { exact: true })).toBeVisible();
    }
    await expect(page.getByRole("button", { name: "SEND MESSAGE" })).toBeVisible();
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

test("hand opens on Page 002, closes into Page 003, and restores while reversing", async ({
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
    window.scrollTo(0, about.offsetTop);
  });
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
  await expect
    .poll(async () => Number(await hand.getAttribute("data-current-frame")), { timeout: 15_000 })
    .toBeLessThanOrEqual(2);

  await page.evaluate(() => {
    const about = document.getElementById("about");
    if (!about) throw new Error("About section missing");
    const scrollable = about.offsetHeight - window.innerHeight;
    window.scrollTo(0, about.offsetTop + scrollable * 0.5);
  });
  await expect
    .poll(async () => Number(await hand.getAttribute("data-current-frame")), { timeout: 15_000 })
    .toBeGreaterThanOrEqual(45);

  await page.evaluate(() => {
    const about = document.getElementById("about");
    if (!about) throw new Error("About section missing");
    window.scrollTo(0, about.offsetTop + about.offsetHeight - window.innerHeight);
  });
  await expect
    .poll(async () => Number(await hand.getAttribute("data-current-frame")), { timeout: 15_000 })
    .toBeLessThanOrEqual(2);

  await page.evaluate(() => {
    const about = document.getElementById("about");
    if (!about) throw new Error("About section missing");
    const scrollable = about.offsetHeight - window.innerHeight;
    window.scrollTo(0, about.offsetTop + scrollable * 0.5);
  });
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

test("hand timeline remeasures after mobile, tablet, and desktop viewport changes", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.setViewportSize({ width: 414, height: 896 });
  await page.goto("/");
  await page.locator(".vmm-hpg--done").waitFor();
  const hand = page.locator(".hand-reveal-media");

  for (const viewport of [
    { width: 414, height: 896 },
    { width: 820, height: 1180 },
    { width: 1440, height: 900 },
  ]) {
    await page.setViewportSize(viewport);
    await page.evaluate(() => {
      const about = document.getElementById("about");
      if (!about) throw new Error("About section missing");
      const scrollable = about.offsetHeight - window.innerHeight;
      window.scrollTo(0, about.offsetTop + scrollable * 0.5);
    });
    await expect
      .poll(async () => Number(await hand.getAttribute("data-current-frame")), { timeout: 15_000 })
      .toBeGreaterThanOrEqual(45);
  }

  await page.evaluate(() => {
    const about = document.getElementById("about");
    if (!about) throw new Error("About section missing");
    window.scrollTo(0, about.offsetTop + about.offsetHeight - window.innerHeight);
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
