# VMM Expanded Real Projects Design

**Status:** Approved for implementation
**Date:** 2026-07-23
**Production baseline:** `b1a739cb350f05df37dd35a07ec84dbc93d362a7`

## Goal

Expand the existing Work section from four to seven truthful projects while preserving the released VMM composition, responsive behavior, animation systems, navigation, accessibility, contact flow, and project-detail routes.

The initial homepage view remains curated to four projects. An inline disclosure reveals the three additional projects without navigating away from the page.

## Project Content Contract

`src/lib/vmm/projects.ts` remains the only source of truth for all project names, descriptions, client labels, delivery dates, statuses, technologies, links, and gallery references.

The seven projects are:

1. WiseAssistant
2. Caballero Digital Solutions
3. IG Sabroso Construction
4. Google Sheets Order Tracker Automation
5. 24/7 Gmail Customer Support AI Agent
6. Trigger-Based Outbound Email Marketing & Customer Service
7. Voice AI Agent

### Supplied real-project details

- **24/7 Gmail Customer Support AI Agent — HeldHonest.com**
  - Delivered Nov 7, 2025
  - n8n, Gmail, Knowledge Base
  - Knowledge-based inquiry handling, consistent responses, context-aware routing, and human escalation.
- **Google Sheets Order Tracker Automation — HeldHonest.com**
  - Delivered Nov 7, 2025
  - Google Sheets, Apps Script
  - Automated order tracking, logistics status monitoring, delayed-order detection, exception visibility, and structured operational reporting.
  - It is a delivered real project, not a case study.
- **Trigger-Based Outbound Email Marketing & Customer Service — HelloBloomKids.com**
  - Delivered Jan 9, 2026
  - n8n, Email Automation
  - Trigger-based outbound marketing and customer-service workflows for personalized follow-ups, response handling, and lifecycle communication.
- **Voice AI Agent**
  - Client, delivery date, and delivery status are confidential and omitted.
  - Only capabilities visible in the supplied artwork may be stated: webhook intake, AI-assisted request handling, Google Calendar lookup, booking, updating, cancelling, and response delivery.

No missing client, URL, delivery date, metric, status, or technical claim may be invented.

## Work-Section Interaction

### Default state

- Show the first four projects in their existing order.
- Place a square editorial button immediately after the list:
  - Label: `View more projects`
  - Supporting count: `3 more`
  - Minimum target: 44×44 CSS pixels
  - `aria-expanded="false"`
  - `aria-controls` references the additional-project list region.

### Expanded state

- Reveal projects 5–7 inline in the same ordered list and row design.
- Change the control label to `Show fewer projects`.
- Set `aria-expanded="true"`.
- Move focus nowhere automatically; the user remains on the disclosure control.
- Announce the visible project count through the existing polite live region.
- Use a restrained opacity/translate entrance only when reduced motion is not requested.

### Filtering

- Category counts always reflect all seven projects.
- Selecting `All` respects the current expanded/collapsed state.
- Selecting a specific category shows every matching project, including additional projects, so filtering never conceals a valid result.
- The disclosure control appears only in the `All` filter.
- Returning to `All` restores the prior expanded/collapsed choice.

## Visual Direction

- Preserve the existing black, white, and `#FF2A1A` editorial system.
- Reuse the existing horizontal Work row composition, typography, numbering, hover treatment, and focus ring.
- Number projects continuously from `01` through `07`.
- The disclosure is a full-width editorial rule/button, not a rounded card or floating pill.
- Desktop and tablet keep the evidence-left/copy-right rows.
- Mobile retains the released responsive row behavior and zero-overflow contract.

## Artwork and Galleries

All production images are optimized WebP files stored under `public/assets/vmm/projects/`. Raw source folders and original high-resolution files are not committed.

### Required thumbnails

- Caballero Digital Solutions: supplied `thumbnail-caballerodigitalsolutions.jpg`
- IG Sabroso Construction: supplied `thumbnail-igsabroso.jpg`
- Voice AI Agent: supplied `thumbnail-Voice AI Agent.jpg`
- Gmail Support Agent: supplied `24-7 Gmail Customer Support AI Agent/Thumbnail .png`
- Trigger-Based Email: a VMM editorial thumbnail containing only the supplied title, client, delivery date, and technology labels
- WiseAssistant: retain the approved primary thumbnail and add selected supplied product screens to its gallery
- Google Sheets Order Tracker: retain privacy-safe sanitized artwork; do not publish the source screenshot containing customer or shipment data

### Supporting gallery images

- Gmail Support Agent may use the supplied inquiry/knowledge-response evidence image.
- WiseAssistant may use a representative subset of the supplied screens, optimized and ordered to avoid redundant views.
- Caballero, IG Sabroso, and Voice AI use their supplied source image as thumbnail and gallery evidence.
- Trigger-Based Email uses only its editorial thumbnail until genuine workflow evidence is supplied.

Decorative row thumbnails retain empty alternative text because the surrounding full-row link already has a complete accessible name. Project-detail gallery images use concise evidence-based alternative text or captions.

## Project Detail Routes

- Preserve `/work/$slug`.
- Every internal project entry has a working detail route.
- Existing external website CTAs for Caballero and IG Sabroso remain unchanged.
- Projects without a verified public URL use the internal detail route.
- Detail pages show only available metadata; confidential or absent fields are omitted rather than rendered as empty labels.
- The “Other projects” navigation automatically includes the expanded project collection.

## Accessibility and Motion

- Preserve one semantic heading hierarchy and one full-row interactive target per project.
- The disclosure is a native button with visible focus, `aria-expanded`, and `aria-controls`.
- No nested buttons or links are introduced inside project rows.
- Filtering and disclosure remain keyboard operable.
- Reduced motion removes disclosure entrance animation without hiding content.
- New artwork does not change the existing hero glitch, hand sequence, menu dialog, contact form, or scroll behavior.
- WCAG 2.2 AA contrast and 44×44 target requirements remain in force.

## Testing

Implementation begins with failing tests that prove:

1. Seven canonical projects exist with exact truthful names and metadata.
2. Google Sheets Order Tracker is not labeled as a case study.
3. Confidential Voice AI metadata is absent.
4. The default Work view renders four rows and a collapsed disclosure.
5. Activating the disclosure renders seven rows and updates its accessible state.
6. A category filter exposes every matching project regardless of disclosure state.
7. All referenced production images exist and load.
8. Every internal project has a working detail route.
9. Mobile, tablet, and desktop retain zero horizontal overflow.
10. Keyboard, focus, reduced-motion, accessibility, lint, build, unit, and responsive suites remain green.

## Release

After fresh verification, commit the focused implementation, push the feature branch, integrate it into GitHub `main` without rewriting history, synchronize the connected Lovable project, publish it, and verify both:

- `https://vmm-vision-crafted.lovable.app`
- `https://www.vmmcreatives.site`

Facebook, LinkedIn, contact endpoint, DNS, custom-domain settings, and all unrelated sections remain unchanged.
