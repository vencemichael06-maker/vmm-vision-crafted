# VMM Expanded Real Projects Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand the production portfolio from four to seven truthful projects with optimized supplied artwork and an accessible inline “View more projects” disclosure.

**Architecture:** Keep `src/lib/vmm/projects.ts` as the sole content and asset-reference source. `WorkSection` derives a four-project curated slice or the complete filtered collection and exposes one native disclosure button. Existing project-detail routing consumes the expanded model without a new route or framework change.

**Tech Stack:** React 19, TypeScript, TanStack Router, Tailwind CSS 4, GSAP, Vitest/Testing Library, Playwright, Pillow for build-time image conversion only.

## Global Constraints

- Work from production baseline `b1a739cb350f05df37dd35a07ec84dbc93d362a7`.
- Preserve hero, hand sequence, navigation, contact, social safe states, routes, DNS, and all unrelated sections.
- Do not add dependencies or change `bun.lock`.
- Do not commit raw source folders, private tracker rows, customer records, credentials, or confidential Voice AI metadata.
- Client, date, and delivery status for Voice AI Agent remain omitted.
- Keep Caballero and IG Sabroso external URLs unchanged.
- Use internal detail routes for Gmail Support, Trigger-Based Email, Voice AI, WiseAssistant, and Google Sheets Order Tracker.
- All new continuous motion uses transform and opacity and becomes static under reduced motion.
- Every interactive target is at least 44×44 CSS pixels and visibly focusable.
- Use failing tests before production-code changes.

---

### Task 1: Expand the Truthful Project Data Contract

**Files:**
- Modify: `tests/refinement-contract.test.tsx`
- Modify: `src/lib/vmm/projects.ts`

**Interfaces:**
- Consumes: existing `Project`, `ProjectStatus`, `ProjectCta`, `projects`, `getProject`, and `categoryFilters`.
- Produces: seven ordered `Project` records and optional `client` / `delivered` metadata used by detail pages.

- [ ] **Step 1: Replace the four-project contract with a failing seven-project contract**

```ts
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
  expect(tracker?.statusNote).not.toMatch(/case study/i);

  const voice = getProject("voice-ai-agent");
  expect(voice?.client).toBeUndefined();
  expect(voice?.delivered).toBeUndefined();
  expect(voice?.status).toBe("Confidential");
});
```

- [ ] **Step 2: Run the focused test and verify the expected failure**

Run:

```powershell
npx vitest run tests/refinement-contract.test.tsx
```

Expected: FAIL because only four projects exist and the delivered/confidential metadata is absent.

- [ ] **Step 3: Extend the model and add the three supplied projects**

Use these exact type additions:

```ts
export type ProjectStatus = "Completed" | "Ongoing" | "Beta" | "Delivered" | "Confidential";

export type Project = {
  // existing fields
  client?: string;
  delivered?: string;
};
```

Use these exact new records:

```ts
{
  slug: "gmail-customer-support-ai-agent",
  index: "05",
  category: "AI & Automation",
  title: "24/7 Gmail Customer Support AI Agent",
  subtitle: "Knowledge-based Gmail support workflow for HeldHonest.com.",
  status: "Delivered",
  client: "HeldHonest.com",
  delivered: "Nov 7, 2025",
  cta: { kind: "case-study", label: "View project" },
  role: "Automation design + implementation",
  year: "2025",
  stack: ["n8n", "Gmail", "Knowledge Base"],
  summary: "Built a knowledge-based customer support workflow for continuous Gmail inquiry handling, response consistency, context-aware routing, and human escalation when required.",
}
```

```ts
{
  slug: "trigger-based-email-marketing",
  index: "06",
  category: "AI & Automation",
  title: "Trigger-Based Outbound Email Marketing & Customer Service",
  subtitle: "Lifecycle email automation for HelloBloomKids.com.",
  status: "Delivered",
  client: "HelloBloomKids.com",
  delivered: "Jan 9, 2026",
  cta: { kind: "case-study", label: "View project" },
  role: "Automation design + implementation",
  year: "2026",
  stack: ["n8n", "Email Automation"],
  summary: "Implemented trigger-based outbound marketing and customer-service workflows for personalized follow-ups, response handling, and lifecycle-based customer communication.",
}
```

```ts
{
  slug: "voice-ai-agent",
  index: "07",
  category: "AI & Automation",
  title: "Voice AI Agent",
  subtitle: "Appointment-booking voice workflow with calendar actions.",
  status: "Confidential",
  cta: { kind: "case-study", label: "View project" },
  role: "Voice automation design + implementation",
  year: "Confidential",
  stack: ["Webhook", "OpenAI", "Google Calendar"],
  summary: "A voice-request workflow that coordinates helper and calendar agents to retrieve, book, update, or cancel appointments before returning a relevant response.",
}
```

Rename the tracker slug to `google-sheets-order-tracker`, title to `Google Sheets Order Tracker Automation`, status to `Delivered`, client to `HeldHonest.com`, delivery date to `Nov 7, 2025`, stack to `["Google Sheets", "Apps Script"]`, and replace all case-study wording with the supplied operational description.

- [ ] **Step 4: Run the focused test and verify green**

Run:

```powershell
npx vitest run tests/refinement-contract.test.tsx
```

Expected: all tests in the file PASS.

- [ ] **Step 5: Commit the content contract**

```powershell
git add -- tests/refinement-contract.test.tsx src/lib/vmm/projects.ts
git commit -m "feat: expand truthful project content"
```

---

### Task 2: Build the Optimized Project Artwork Set

**Files:**
- Modify: `tests/project-assets.test.ts`
- Modify: `src/lib/vmm/projects.ts`
- Create: `public/assets/vmm/projects/caballero-digital-solutions-portfolio-v2.webp`
- Create: `public/assets/vmm/projects/ig-sabroso-portfolio-v2.webp`
- Create: `public/assets/vmm/projects/gmail-support-agent.webp`
- Create: `public/assets/vmm/projects/gmail-support-response.webp`
- Create: `public/assets/vmm/projects/trigger-email-automation.webp`
- Create: `public/assets/vmm/projects/voice-ai-agent.webp`
- Create: `public/assets/vmm/projects/wiseassistant-dashboard.webp`
- Create: `public/assets/vmm/projects/wiseassistant-activity.webp`
- Create: `public/assets/vmm/projects/wiseassistant-reminders.webp`
- Create: `public/assets/vmm/projects/wiseassistant-ask-wise.webp`

**Interfaces:**
- Consumes: raw user-supplied JPG/PNG files outside the repository.
- Produces: privacy-safe WebP artwork paths referenced only from `projects.ts`.

- [ ] **Step 1: Write the failing asset and gallery test**

```ts
const expectedThumbnails = new Map([
  ["wiseassistant", "/assets/vmm/projects/wiseassistant-portfolio.webp"],
  ["caballero-digital-solutions", "/assets/vmm/projects/caballero-digital-solutions-portfolio-v2.webp"],
  ["ig-sabroso-construction", "/assets/vmm/projects/ig-sabroso-portfolio-v2.webp"],
  ["google-sheets-order-tracker", "/assets/vmm/projects/google-sheet-order-tracker-portfolio.webp"],
  ["gmail-customer-support-ai-agent", "/assets/vmm/projects/gmail-support-agent.webp"],
  ["trigger-based-email-marketing", "/assets/vmm/projects/trigger-email-automation.webp"],
  ["voice-ai-agent", "/assets/vmm/projects/voice-ai-agent.webp"],
]);

it("maps all seven projects to checked-in WebP artwork", () => {
  expect(projects).toHaveLength(7);
  for (const project of projects) {
    const expected = expectedThumbnails.get(project.slug);
    expect(project.thumbnail).toEqual({ desktop: expected, mobile: expected });
    expect(existsSync(path.join(process.cwd(), "public", expected!.slice(1)))).toBe(true);
    for (const image of project.gallery) {
      expect(image.src).toMatch(/\.webp$/);
      expect(existsSync(path.join(process.cwd(), "public", image.src.slice(1)))).toBe(true);
    }
  }
});
```

- [ ] **Step 2: Run the asset test and verify red**

Run:

```powershell
npx vitest run tests/project-assets.test.ts
```

Expected: FAIL because the new asset paths and files do not exist.

- [ ] **Step 3: Convert the supplied authentic images to WebP**

Use Pillow from an inline, non-committed conversion command. Apply EXIF orientation, preserve aspect ratio, resize only when the long edge exceeds 1920px, and save at WebP quality 86.

Source mapping:

- `thumbnail-caballerodigitalsolutions.jpg` → `caballero-digital-solutions-portfolio-v2.webp`
- `thumbnail-igsabroso.jpg` → `ig-sabroso-portfolio-v2.webp`
- `24-7 Gmail Customer Support AI Agent/Thumbnail .png` → `gmail-support-agent.webp`
- `24-7 Gmail Customer Support AI Agent/Email inquiry test & the AI Knowledged based response.jpg` → `gmail-support-response.webp`
- `thumbnail-Voice AI Agent.jpg` → `voice-ai-agent.webp`
- WiseAssistant `(3).png`, `(5).png`, `(8).png`, `(9).png` → the four named WiseAssistant gallery files.

Do not convert or publish `Google Sheet Order Tracker.jpg`.

- [ ] **Step 4: Create the truthful Trigger-Based Email editorial thumbnail**

Generate a 1600×1000 flat image using only:

```text
06
TRIGGER-BASED OUTBOUND EMAIL
MARKETING & CUSTOMER SERVICE
HELLOBLOOMKIDS.COM
DELIVERED 09 JAN 2026
N8N / EMAIL AUTOMATION
```

Use white, black, and `#FF2A1A`; Roboto Condensed Bold if available, otherwise a bundled sans-serif. No workflow nodes, dashboards, metrics, logos, people, or decorative claims.

- [ ] **Step 5: Update `projectAssets` and gallery arrays**

Reference every new image only through `projectAssets`. Give each gallery item a concise caption describing the visible evidence. Keep the sanitized tracker image as its only gallery item.

- [ ] **Step 6: Run the asset and content tests**

Run:

```powershell
npx vitest run tests/project-assets.test.ts tests/refinement-contract.test.tsx
```

Expected: both files PASS and every referenced WebP exists.

- [ ] **Step 7: Commit the optimized artwork slice**

```powershell
git add -- tests/project-assets.test.ts src/lib/vmm/projects.ts public/assets/vmm/projects
git commit -m "feat: add authentic project artwork"
```

---

### Task 3: Add the Accessible Inline Project Disclosure

**Files:**
- Create: `tests/work-section.test.tsx`
- Modify: `src/sections/WorkSection.tsx`
- Modify: `src/styles.css`

**Interfaces:**
- Consumes: ordered `projects`, `categoryFilters`, and `ProjectCategory`.
- Produces: default four-row view, seven-row expanded view, and full category results.

- [ ] **Step 1: Write failing interaction tests**

Mock GSAP and TanStack `Link` while preserving real button interactions:

```tsx
vi.mock("@/lib/vmm/useGsap", () => ({ useGsap: () => undefined }));
vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, to, params, ...props }: React.ComponentProps<"a"> & {
    to: string;
    params?: { slug: string };
  }) => (
    <a href={params ? `/work/${params.slug}` : to} {...props}>
      {children}
    </a>
  ),
}));
```

Test these behaviors:

```tsx
it("shows four curated projects before expansion", () => {
  render(<WorkSection />);
  expect(screen.getAllByTestId("work-project")).toHaveLength(4);
  expect(screen.getByRole("button", { name: /view more projects/i })).toHaveAttribute(
    "aria-expanded",
    "false",
  );
});

it("reveals and collapses all seven projects", async () => {
  const user = userEvent.setup();
  render(<WorkSection />);
  const disclosure = screen.getByRole("button", { name: /view more projects/i });
  await user.click(disclosure);
  expect(screen.getAllByTestId("work-project")).toHaveLength(7);
  expect(disclosure).toHaveAttribute("aria-expanded", "true");
  expect(disclosure).toHaveAccessibleName(/show fewer projects/i);
  await user.click(disclosure);
  expect(screen.getAllByTestId("work-project")).toHaveLength(4);
});

it("shows every matching automation project when filtered", async () => {
  const user = userEvent.setup();
  render(<WorkSection />);
  await user.click(screen.getByRole("button", { name: /AI & Automation/i }));
  expect(screen.getAllByTestId("work-project")).toHaveLength(4);
  expect(screen.queryByRole("button", { name: /view more projects/i })).not.toBeInTheDocument();
});
```

- [ ] **Step 2: Run the new tests and verify red**

Run:

```powershell
npx vitest run tests/work-section.test.tsx
```

Expected: FAIL because all projects currently render and no disclosure exists.

- [ ] **Step 3: Implement the minimal disclosure state**

Add:

```ts
const CURATED_PROJECT_COUNT = 4;
const [expanded, setExpanded] = useState(false);

const matchingProjects = useMemo(
  () => (filter === "All" ? projects : projects.filter((project) => project.category === filter)),
  [filter],
);

const visibleProjects =
  filter === "All" && !expanded
    ? matchingProjects.slice(0, CURATED_PROJECT_COUNT)
    : matchingProjects;
```

Add `data-testid="work-project"` to each rendered list item. After the ordered list, render a native button only for `filter === "All"`:

```tsx
<button
  type="button"
  aria-expanded={expanded}
  aria-controls="additional-projects"
  onClick={() => setExpanded((current) => !current)}
  className="vmm-work-disclosure"
>
  <span>{expanded ? "Show fewer projects" : "View more projects"}</span>
  <span aria-hidden>{expanded ? "−" : `${projects.length - CURATED_PROJECT_COUNT} more +`}</span>
</button>
```

Give the list `id="additional-projects"` and update the intro to “Seven proof-backed projects across websites, mobile product design, and automation.”

- [ ] **Step 4: Add focused editorial styles**

Define `.vmm-work-disclosure` as a square full-width rule/button with:

- `min-height: 56px`
- black text and borders
- red hover/focus accent
- `:focus-visible` outline using the existing focus color
- two-end alignment
- no border radius, shadow, gradient, or fixed positioning

Under `prefers-reduced-motion: no-preference`, animate newly mounted rows only through the existing opacity/translate GSAP entrance. Do not add a height animation.

- [ ] **Step 5: Run the focused interaction suite**

Run:

```powershell
npx vitest run tests/work-section.test.tsx tests/refinement-contract.test.tsx
```

Expected: all tests PASS.

- [ ] **Step 6: Commit the disclosure slice**

```powershell
git add -- tests/work-section.test.tsx src/sections/WorkSection.tsx src/styles.css
git commit -m "feat: reveal additional projects inline"
```

---

### Task 4: Refine Detail Metadata and Responsive Coverage

**Files:**
- Modify: `src/routes/work.$slug.tsx`
- Modify: `tests/responsive.spec.ts`
- Modify: `tests/a11y.spec.ts`

**Interfaces:**
- Consumes: optional `Project.client` and `Project.delivered`.
- Produces: omission-safe detail metadata and browser-level disclosure coverage.

- [ ] **Step 1: Add failing responsive assertions**

In each representative viewport test:

```ts
const rows = page.locator("#work [data-testid='work-project']");
await expect(rows).toHaveCount(4);
const disclosure = page.getByRole("button", { name: /view more projects/i });
await expect(disclosure).toHaveAttribute("aria-expanded", "false");
await disclosure.click();
await expect(rows).toHaveCount(7);
await expect(disclosure).toHaveAttribute("aria-expanded", "true");
expect(
  await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  ),
).toBe(0);
```

Add a direct navigation check for `/work/voice-ai-agent` that requires the project heading and rejects visible “Client” and “Delivered” labels.

- [ ] **Step 2: Run representative browser tests and verify red**

Run:

```powershell
npx playwright test tests/responsive.spec.ts --grep "414x896|768x1024|1440x900"
```

Expected: FAIL because the disclosure and new detail route are absent.

- [ ] **Step 3: Render optional client and delivery metadata**

Build the metadata cells as:

```tsx
const metadata = [
  { label: "Role", value: p.role },
  { label: "Delivered", value: p.delivered },
  { label: "Client", value: p.client },
  { label: "Category", value: p.category },
  { label: "Stack", value: p.stack.join(", ") },
].filter((item): item is { label: string; value: string } => Boolean(item.value));
```

Render `metadata.map(...)` in the existing definition list. Update generic “Case study” page titles and not-found copy to “Project”.

- [ ] **Step 4: Extend accessibility coverage**

After expanding Work, run axe and assert no serious or critical violations. Keyboard-tab to the disclosure, activate it with Enter, and verify the focused element remains the disclosure.

- [ ] **Step 5: Run browser and accessibility checks**

Run:

```powershell
npx playwright test tests/responsive.spec.ts --grep "414x896|768x1024|1440x900"
npm run test:a11y
```

Expected: representative responsive checks and all accessibility tests PASS.

- [ ] **Step 6: Commit browser/detail coverage**

```powershell
git add -- src/routes/work.`$slug.tsx tests/responsive.spec.ts tests/a11y.spec.ts
git commit -m "test: verify expanded project experience"
```

---

### Task 5: Full Verification and Production Release

**Files:**
- Modify only if a failing test proves a defect in the focused project implementation.
- Generate QA screenshots outside `public/`.

**Interfaces:**
- Consumes: the complete feature branch.
- Produces: a verified GitHub `main` commit and synchronized Lovable production release.

- [ ] **Step 1: Run the complete clean validation workflow**

```powershell
npm run lint
npm run build
npm test
npm run test:a11y
npm run test:e2e
git diff --check
```

Expected: every command exits 0; no touched-file lint errors; all unit, accessibility, and responsive tests pass.

- [ ] **Step 2: Verify native viewports in the in-app Browser**

Check 375×812, 390×844, 414×896, 768×1024, 1024×1366, 1366×768, 1440×900, and 1920×1080. At each viewport verify four default rows, seven expanded rows, correct filtering, no horizontal overflow, loaded artwork, visible focus, and unchanged section transitions.

- [ ] **Step 3: Verify project routes**

Open every internal route, verify gallery images load, confirm the tracker is delivered work, confirm Voice AI omits client/date, and ensure Caballero/IG external links remain correct.

- [ ] **Step 4: Run release hygiene checks**

```powershell
git status --short
git diff origin/main...HEAD --check
git diff origin/main...HEAD --stat
git ls-files | rg "Google Sheet Order Tracker\.jpg|Thumbnail \.png|\.env$"
rg -n --hidden --glob "!node_modules/**" "(BEGIN .*PRIVATE KEY|sk-[A-Za-z0-9_-]+|password\\s*=|api[_-]?key\\s*=)" src public tests docs
```

Expected: no raw private screenshot, original source PNG, secret-bearing `.env`, credential, token, or unrelated file is included.

- [ ] **Step 5: Perform verification-before-completion review**

Read fresh output for every required command and compare browser screenshots before claiming completion or releasing.

- [ ] **Step 6: Push and integrate without rewriting history**

Push `codex/add-expanded-projects`, fetch `origin/main`, merge current `origin/main` if it advanced, rerun the fast verification gate, and push the verified commit to `main` with a normal non-force push.

- [ ] **Step 7: Synchronize and publish Lovable**

Confirm project `dbfb05cf-3981-4ab4-afb3-5541f3f66aba` reports the exact GitHub `main` SHA, publish it, and verify both production URLs return HTTP 200 and serve the same new asset bundle.

- [ ] **Step 8: Verify live production**

Use the in-app Browser at 414×896 and 1440×900 to verify the disclosure, seven projects, filtering, detail routes, zero overflow, no console errors, and unchanged hero/hand/contact behavior.

## Plan Self-Review

- Every approved project and metadata rule is mapped to Task 1.
- Every supplied image and privacy exclusion is mapped to Task 2.
- Inline disclosure, filtering, keyboard behavior, and reduced motion are mapped to Tasks 3–4.
- Detail-route omission behavior is mapped to Task 4.
- Complete testing and authorized production release are mapped to Task 5.
- No framework, dependency, contact, social, DNS, hero, hand, or unrelated-section change is included.

