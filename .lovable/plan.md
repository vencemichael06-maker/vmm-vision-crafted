
# VMM Creatives — Production Rebuild Plan

## Scope

Treat the new **`VMM_Creatives_Lovable_Upload_Essentials.zip`** as the sole source of truth, replacing all prior asset/design decisions. This is a **visual + motion frontend rebuild** — no backend, no auth, no DB. Contact form will validate + show a success state client-side only (I will *not* wire Resend / Supabase Edge Functions unless you ask).

## What changes vs. what's in the project now

| Area | Current | New (from handoff) |
|---|---|---|
| Display font | Archivo Black | **Roboto Condensed 700–900** (self-hosted `@fontsource`) |
| Body font | Inter | Inter (kept, self-hosted) |
| Accent red | `#ED2028` | `#FF2A1A` |
| Paper bg | off-white custom | `#F7F7F5` (paper) / `#FBFBFA` (overlay) |
| Hero person | still bust PNG | approved transparent WebP + **desktop glitch MP4 reference** + **mobile overlay WebM** |
| About hand | video already wired | swap in approved `about_hand_logo_reveal_silent` webm/mp4 with scroll-scrubbed control |
| Work | empty state | real 5 approved project entries (IVO Cars, WiseAssistant, Caballero, IG Sabroso Website, IG Sabroso Concept Guide) — text-only cards using the mobile/desktop compositions; **no fabricated cover images**, will use ink/red editorial covers with real labels until you supply project media |
| Services | red panel exists | full "Design. Develop. Deliver Impact." red banner + 4-service grid + 4-step process rail per reference |
| Contact | form exists | rebuild to match reference — details column left, form card floating over red panel right, "Book a Call" secondary CTA |
| Mobile | partially done | rebuild each page's mobile composition to match the supplied long-form mobile references (independent layouts, not stacked desktop) |
| Nav | current | fixed header: wordmark · centered nav with active red dot · `LET'S TALK` pill · hamburger → full-screen overlay |

## Deliverables

1. **Tokens & fonts** — new `src/styles.css` tokens from `design-tokens.json`; `@fontsource/roboto-condensed` + `@fontsource/inter` self-hosted.
2. **Assets** — upload via `lovable-assets` from `/mnt/user-uploads/`:
   - `hero_person_transparent_1264x2048.webp`
   - `hero_desktop_glitch_reference_1920x1080_h264.mp4` + poster
   - `hero_mobile_overlay_transparent_720x1520_vp9.webm` + mp4 fallback + poster
   - `about_hand_logo_reveal_silent_1086x1448_h264.mp4` + `_768x1024_vp9.webm` + poster
3. **Shared layout** — `SiteHeader`, full-screen `NavigationOverlay`, vertical side rails, `SectionMarker` (001–005), scroll indicator, active section tracking.
4. **5 pages**, each with a dedicated desktop and mobile composition matching the approved references:
   - `/` — Home hero (glitch video plays once per session; transparent person layer + red field)
   - `/about` — hand/logo reveal scroll-scrubbed; stats; expertise bars; mobile adds an "Available for freelance" red block per the reference
   - `/work` — filter tabs (All/Websites/Web Apps/Branding/Mobile Apps/More) + 5 real project rows (desktop = numbered thumbnail + right white card + red arrow tile; mobile = full-width featured card stack)
   - `/services` — red banner + 4 service cards + 4-step process rail; bottom-right red arrow tile
   - `/contact` — details column + form card floating over red panel; "Book a Call" strip below
5. **Motion** — GSAP + ScrollTrigger; hero glitch (RGB split + horizontal clip reveals, ≤3.4s, one-shot); scroll-scrubbed hand video; section reveals; orb parallax; respects `prefers-reduced-motion`.
6. **Responsive QA** — verified at 375, 390, 414, 430, 768, 1024, 1440, 1920 px via Playwright.

## Explicit non-goals

- No project-detail route rebuild this pass — the reference pack has no detail-page comps. I'll leave the existing `/work/$slug` in place.
- No CMS, no email delivery, no auth. Contact form shows an inline success state only.
- No fabricated project cover imagery. Work cards will use editorial ink/red covers with the approved labels until you supply real project media. I'll flag exactly which media slots need real images at the end.

## Technical notes

- Tailwind v4 tokens map to CSS custom properties (`--vmm-paper`, `--vmm-ink`, `--vmm-accent`, etc.); shadcn semantic tokens updated too so any reused primitives stay themed.
- Videos: `<video muted playsInline preload="metadata">`, no autoplay loop; glitch plays via `sessionStorage` gate; hand reveal driven by ScrollTrigger scrub with `video.currentTime = progress * duration`.
- Full-width canvas preserved — no outer wrapper caps page width; only inner content columns use max-widths.
- Hero desktop MP4 is used only as timing reference during dev; production hero is real HTML/CSS + transparent person layer + CSS/GSAP glitch.

## Estimated build order

1. Foundation (tokens, fonts, asset upload) — 1 batch
2. Shared layout (header/overlay/rails/markers) — 1 batch
3. Home rebuild (desktop + mobile + glitch) — 1 batch
4. About rebuild (scroll-scrub hand + mobile) — 1 batch
5. Work rebuild (data + desktop rows + mobile stack) — 1 batch
6. Services rebuild — 1 batch
7. Contact rebuild — 1 batch
8. QA sweep across 8 widths — 1 batch

Reply **approve** to execute, or tell me what to change (e.g. "skip contact backend wiring — already correct", "supply real project images before Work", "keep Archivo Black").
