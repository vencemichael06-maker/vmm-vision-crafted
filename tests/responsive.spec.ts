import { expect, test } from "@playwright/test";
import { mkdir, readdir } from "node:fs/promises";
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
const stateSequenceDirectory =
  process.env.VMM_QA_STATE_SEQUENCE_DIR ||
  path.resolve(
    "output",
    "qa",
    "VMM_Reference_First_Real_Projects_Implementation_2026-07-22",
    "state-sequence",
  );
const stateSequenceNames = [
  "00-first.png",
  "01-hero-initialized.png",
  "02-transition-001-to-002.png",
  "03-page-002-closed.png",
  "04-page-002-25-percent.png",
  "05-page-002-50-percent.png",
  "06-page-002-75-percent.png",
  "07-page-002-open.png",
  "08-page-002-reverse-75-percent.png",
  "09-page-002-reverse-50-percent.png",
  "10-page-002-reverse-25-percent.png",
  "11-page-002-reverse-closed.png",
  "12-transition-002-to-003.png",
  "13-nav-closed.png",
  "14-nav-open.png",
  "15-contact.png",
] as const;

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

async function setAboutTimeline(page: import("@playwright/test").Page, timelineProgress: number) {
  await page.evaluate((progress) => {
    const about = document.getElementById("about");
    if (!about) throw new Error("About section missing");
    const scrollable = about.offsetHeight - window.innerHeight;
    window.scrollTo(0, about.offsetTop + scrollable * progress);
  }, timelineProgress);

  const handProgress =
    timelineProgress < 0.35
      ? timelineProgress / 0.35
      : timelineProgress > 0.65
        ? (1 - timelineProgress) / 0.35
        : 1;
  const expectedFrame = Math.round(Math.min(Math.max(handProgress, 0), 1) * 47);
  await expect
    .poll(
      async () =>
        Math.abs(
          Number(await page.locator(".hand-reveal-media").getAttribute("data-current-frame")) -
            expectedFrame,
        ),
      { timeout: 15_000 },
    )
    .toBeLessThanOrEqual(2);
}

async function captureStateSequence(
  page: import("@playwright/test").Page,
  viewport: (typeof viewports)[number],
) {
  const viewportDirectory = path.join(
    stateSequenceDirectory,
    `${viewport.width}x${viewport.height}`,
  );
  const capture = (name: (typeof stateSequenceNames)[number]) =>
    page.screenshot({ path: path.join(viewportDirectory, name) });

  await page.evaluate(() => {
    const about = document.getElementById("about");
    if (!about) throw new Error("About section missing");
    window.scrollTo(0, Math.max(about.offsetTop - window.innerHeight * 0.2, 0));
  });
  await capture("02-transition-001-to-002.png");

  const forwardStates = [
    [0, "03-page-002-closed.png"],
    [0.0875, "04-page-002-25-percent.png"],
    [0.175, "05-page-002-50-percent.png"],
    [0.2625, "06-page-002-75-percent.png"],
    [0.35, "07-page-002-open.png"],
  ] as const;
  for (const [progress, name] of forwardStates) {
    await setAboutTimeline(page, progress);
    await capture(name);
  }

  const reverseStates = [
    [0.2625, "08-page-002-reverse-75-percent.png"],
    [0.175, "09-page-002-reverse-50-percent.png"],
    [0.0875, "10-page-002-reverse-25-percent.png"],
    [0, "11-page-002-reverse-closed.png"],
  ] as const;
  for (const [progress, name] of reverseStates) {
    await setAboutTimeline(page, progress);
    await capture(name);
  }

  await setAboutTimeline(page, 1);
  await page.evaluate(() => {
    const about = document.getElementById("about");
    if (!about) throw new Error("About section missing");
    window.scrollTo(0, about.offsetTop + about.offsetHeight - window.innerHeight * 0.35);
  });
  await expect
    .poll(async () =>
      Number(await page.locator(".hand-reveal-media").getAttribute("data-current-frame")),
    )
    .toBeLessThanOrEqual(2);
  await capture("12-transition-002-to-003.png");

  await page.evaluate(() => window.scrollTo(0, 0));
  await capture("13-nav-closed.png");
  await page.getByRole("button", { name: "Open menu" }).click();
  await expect(page.getByRole("dialog", { name: "Site navigation" })).toBeVisible();
  await capture("14-nav-open.png");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog", { name: "Site navigation" })).toBeHidden();

  await page.evaluate(() => document.getElementById("contact")?.scrollIntoView());
  await expect(page.getByRole("heading", { name: "LET'S BUILD SOMETHING GREAT." })).toBeVisible();
  await capture("15-contact.png");
}

test.beforeAll(async () => {
  await mkdir(screenshotDirectory, { recursive: true });
  await mkdir(stateSequenceDirectory, { recursive: true });
});

for (const viewport of viewports) {
  test(`${viewport.width}x${viewport.height} responsive contract`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.setViewportSize(viewport);
    await page.goto("/");
    await page.locator("main").waitFor();
    const viewportStateDirectory = path.join(
      stateSequenceDirectory,
      `${viewport.width}x${viewport.height}`,
    );
    await mkdir(viewportStateDirectory, { recursive: true });
    await page.screenshot({ path: path.join(viewportStateDirectory, "00-first.png") });
    await page.locator(".vmm-hpg--done").waitFor();
    await page.screenshot({ path: path.join(viewportStateDirectory, "01-hero-initialized.png") });

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

    await captureStateSequence(page, viewport);

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
    expect(
      thumbnailUrls.every((src) => {
        const pathname = new URL(src).pathname;
        return pathname.startsWith("/assets/vmm/projects/") && pathname.endsWith(".webp");
      }),
    ).toBe(true);

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

    const disclosure = page.locator(".vmm-work-disclosure");
    await expect(disclosure).toHaveAttribute("aria-expanded", "false");
    await disclosure.click();
    await expect(projectRows).toHaveCount(7);
    await expect(disclosure).toHaveAttribute("aria-expanded", "true");
    await expect(disclosure).toHaveAccessibleName(/show fewer projects/i);
    await expect
      .poll(() =>
        page
          .locator("#work [data-project-thumbnail]")
          .evaluateAll((images) =>
            images.every(
              (image) =>
                (image as HTMLImageElement).complete &&
                (image as HTMLImageElement).naturalWidth > 0,
            ),
          ),
      )
      .toBe(true);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      ),
    ).toBeLessThanOrEqual(0);

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
        .poll(async () => Number(await hand.getAttribute("data-current-frame")), {
          timeout: 15_000,
        })
        .toBeGreaterThanOrEqual(45);
      const ctaBounds = await page.getByTestId("about-cta").boundingBox();
      expect(ctaBounds).not.toBeNull();
      expect(ctaBounds!.x).toBeGreaterThanOrEqual(0);
      expect(ctaBounds!.y).toBeGreaterThanOrEqual(0);
      expect(ctaBounds!.x + ctaBounds!.width).toBeLessThanOrEqual(viewport.width);
      expect(ctaBounds!.y + ctaBounds!.height).toBeLessThanOrEqual(viewport.height);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth),
      ).toBe(0);
    }

    await page.evaluate(() => document.getElementById("services")?.scrollIntoView());
    await page.waitForTimeout(850);
    expect
      .soft(await renderedLineCount(page, "#services-title"))
      .toBeLessThanOrEqual(mobile ? 4 : 3);
    await page.screenshot({
      path: path.join(screenshotDirectory, `vmm-${viewport.width}x${viewport.height}-services.png`),
    });

    await page.evaluate(() => document.getElementById("process")?.scrollIntoView());
    await page.waitForTimeout(850);
    expect
      .soft(await renderedLineCount(page, "#process-title"))
      .toBeLessThanOrEqual(viewport.width >= 1200 ? 2 : 3);
    for (const label of ["Discovery", "Strategy", "Design", "Develop", "Launch & Support"]) {
      await expect(page.getByRole("heading", { name: label, exact: true })).toBeVisible();
    }
    await page.screenshot({
      path: path.join(screenshotDirectory, `vmm-${viewport.width}x${viewport.height}-process.png`),
    });

    await page.evaluate(() => document.getElementById("contact")?.scrollIntoView());
    await page.waitForTimeout(850);
    await expect(page.getByRole("heading", { name: "LET'S BUILD SOMETHING GREAT." })).toBeVisible();
    expect
      .soft(await renderedLineCount(page, "#contact-title"))
      .toBeLessThanOrEqual(mobile ? 4 : 3);
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

test("durable state sequence evidence covers all native viewports", async () => {
  for (const viewport of viewports) {
    const viewportDirectory = path.join(
      stateSequenceDirectory,
      `${viewport.width}x${viewport.height}`,
    );
    await mkdir(viewportDirectory, { recursive: true });
    const files = (await readdir(viewportDirectory)).filter((file) => file.endsWith(".png")).sort();
    expect(files).toEqual([...stateSequenceNames].sort());
  }
});

test("keyboard order, visible focus, and navigation focus trap are preserved", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.locator(".vmm-hpg--done").waitFor();

  const keyboardOrder = [
    page.getByRole("link", { name: "Skip to main content" }),
    page.getByRole("banner").getByRole("link", { name: "Home", exact: true }),
    page.getByRole("link", { name: "HOME", exact: true }),
    page.getByRole("link", { name: "ABOUT", exact: true }),
    page.getByRole("link", { name: "WORK", exact: true }),
    page.getByRole("link", { name: "SERVICES", exact: true }),
    page.getByRole("link", { name: "CONTACT", exact: true }),
    page.getByRole("link", { name: "LET'S TALK", exact: true }),
    page.getByRole("button", { name: "Open menu" }),
  ];
  for (const target of keyboardOrder) {
    await page.keyboard.press("Tab");
    await expect(target).toBeFocused();
  }

  const focusedOutline = await keyboardOrder.at(-1)!.evaluate((element) => {
    const style = getComputedStyle(element);
    return { style: style.outlineStyle, width: Number.parseFloat(style.outlineWidth) };
  });
  expect(focusedOutline.style).toBe("solid");
  expect(focusedOutline.width).toBeGreaterThanOrEqual(2);

  await page.keyboard.press("Enter");
  const dialog = page.getByRole("dialog", { name: "Site navigation" });
  const firstMenuLink = dialog.getByRole("link", { name: "Home", exact: true });
  const closeButton = dialog.getByRole("button", { name: "Close menu" });
  const lastMenuLink = dialog.getByRole("link", { name: "Contact", exact: true });
  await expect(dialog).toBeVisible();
  await expect(firstMenuLink).toBeFocused();

  await page.keyboard.press("Shift+Tab");
  await expect(closeButton).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(lastMenuLink).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(closeButton).toBeFocused();

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(page.getByRole("button", { name: "Open menu" })).toBeFocused();
});

test("hash navigation, browser history, and accessible dialog", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.locator(".vmm-hpg--done").waitFor();

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

test("hand completes two forward and reverse cycles at mobile, tablet, and desktop", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.setViewportSize({ width: 414, height: 896 });
  await page.goto("/");
  await page.locator(".vmm-hpg--done").waitFor();
  const hand = page.locator(".hand-reveal-media");
  const cycle = [
    [0, 0],
    [0.175, 24],
    [0.35, 47],
    [0.65, 47],
    [0.825, 24],
    [1, 0],
    [0.825, 24],
    [0.65, 47],
    [0.35, 47],
    [0.175, 24],
    [0, 0],
  ] as const;

  for (const viewport of [
    { width: 414, height: 896 },
    { width: 820, height: 1180 },
    { width: 1440, height: 900 },
  ]) {
    await page.setViewportSize(viewport);
    for (let repetition = 0; repetition < 2; repetition += 1) {
      for (const [progress, expectedFrame] of cycle) {
        await setAboutTimeline(page, progress);
        await expect
          .poll(
            async () =>
              Math.abs(Number(await hand.getAttribute("data-current-frame")) - expectedFrame),
            { timeout: 15_000 },
          )
          .toBeLessThanOrEqual(2);
      }
    }
  }
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

test("project detail metadata is truthful and confidential fields stay omitted", async ({
  page,
}) => {
  await page.goto("/work/voice-ai-agent");
  await expect(page).toHaveTitle("Voice AI Agent — VMM Project");
  await expect(page.getByRole("heading", { name: "Voice AI Agent" })).toBeVisible();
  await expect(page.getByText("Client", { exact: true })).toHaveCount(0);
  await expect(page.getByText("Delivered", { exact: true })).toHaveCount(0);

  await page.goto("/work/gmail-customer-support-ai-agent");
  await expect(page.getByText("Client", { exact: true })).toBeVisible();
  await expect(page.getByText("HeldHonest.com", { exact: true })).toBeVisible();
  await expect(page.getByText("Delivered", { exact: true })).toBeVisible();
  await expect(page.getByText("Nov 7, 2025", { exact: true })).toBeVisible();
});

test("contact endpoint confirms success and exposes a retryable failure", async ({ page }) => {
  await page.route("**/api/contact", async (route) => {
    await route.fulfill({ status: 503, body: "Unavailable" });
  });
  await page.goto("/#contact");
  await page.locator(".vmm-hpg--done").waitFor();
  await page.getByRole("button", { name: "SEND MESSAGE" }).click();
  await expect(page.getByLabel("NAME")).toBeFocused();
  await page.getByLabel("NAME").fill("Ana Reyes");
  await page.getByLabel("EMAIL").fill("ana@example.com");
  await page.getByLabel("PROJECT TYPE").selectOption("Website");
  await page.getByLabel("BUDGET").selectOption("PHP 50k-100k");
  await page.getByLabel("MESSAGE", { exact: true }).fill("We need a responsive company website.");
  await page.getByRole("button", { name: "SEND MESSAGE" }).click();
  await expect(page.getByRole("alert")).toBeVisible();
  await expect(page.getByRole("button", { name: "Retry submission" })).toBeEnabled();
  await expect(page.getByRole("status")).toHaveCount(0);
  const form = page.locator("#contact form");
  await expect(form.getByRole("textbox", { name: "NAME" })).toHaveValue("Ana Reyes");
  await expect(form.getByRole("textbox", { name: "EMAIL" })).toHaveValue("ana@example.com");
  await expect(form.getByRole("combobox", { name: "PROJECT TYPE" })).toHaveValue("Website");
  await expect(form.getByRole("combobox", { name: "BUDGET" })).toHaveValue("PHP 50k-100k");
  await expect(form.getByRole("textbox", { name: "MESSAGE", exact: true })).toHaveValue(
    "We need a responsive company website.",
  );

  const fallbackBody = encodeURIComponent(
    [
      "Name: Ana Reyes",
      "Email: ana@example.com",
      "Project type: Website",
      "Budget: PHP 50k-100k",
      "",
      "We need a responsive company website.",
    ].join("\n"),
  );
  await expect(page.getByRole("link", { name: "Email fallback" })).toHaveAttribute(
    "href",
    `mailto:hello@vmmcreatives.site?subject=New%20project%20inquiry&body=${fallbackBody}`,
  );
  await expect(page.getByRole("link", { name: "WhatsApp fallback" })).toHaveAttribute(
    "href",
    `https://wa.me/639067451651?text=${fallbackBody}`,
  );

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
