# FSInfo v0.13 Quality Consolidation — Reproduction / Continuation Prompt

## Entry
`index-v0.13-quality-consolidation.html`

## Intent
This is a stabilization/release-candidate pass, not a feature expansion.
Use v0.9 as the perceived UX baseline and v0.12 as the stable mobile interaction baseline.

## Immutable dependencies
v0.13 intentionally reuses the immutable v0.12 content layer:
- `v0.12/book-index.js`
- `v0.12/sections/MT01.js` … `MT14.js`
- `v0.12/content-service.js`
- `v0.12/font-module.js`
- `v0.12/book-tools.js`

Do not copy or rewrite the book payload unless the source book itself changes.

## Versioned v0.13 modules
- `v0.13/app.js` — v0.9-derived renderer/presentation; timing constants centralized
- `v0.13/gesture-controller.js` — v0.12 touch feel with stable inertia pointer metadata
- `v0.13/viewport-controller.js` — complementary galaxy space + resize/orientation/fullscreen reset
- `v0.13/shell-controller.js` — user-triggered fullscreen + WebKit/fallback state synchronization
- `v0.13/styles.css` — v0.12/v0.9 proportions + dynamic viewport/safe-area hardening

## Non-negotiable UX contracts
1. Previous version files remain unchanged.
2. Book Core keeps v0.9 reading modes, proportions and content volume.
3. Touch orbit direction is reversed; mouse direction remains conventional.
4. Inertia uses the same direction as the gesture that created it.
5. Presentation order is: camera settle → typewriter narration → complete → short pause → tags/moons one-by-one.
6. `textComplete === true` is the only gate that permits tag/moon reveal.
7. Tapping narration completes text; it must not advance the scene.
8. Mobile presentation stays a bottom sheet and the galaxy uses the free region above it.
9. Fullscreen remains explicitly user-triggered. Never fake automatic browser fullscreen.
10. No radial menu, automatic trend narration, heavy framework or new persistent state in this release.

## Presentation timing contract
All timing constants live in `PRESENTATION_TIMING` in `v0.13/app.js`.
Default values preserve v0.12/v0.9 feel:
- camera settle: 850ms
- typewriter: 2 chars / 24ms
- post-narration pause: 320ms
- trend cadence: 330ms
- post-tags hold: 3200ms

Future tuning should change these constants only, not the state machine.

## Source-of-truth
The report/book is authoritative. Do not invent or externally enrich the book content in this track.

## Public release rule
Do not modify `index.html` or publish to public `/fsinfo/` without explicit owner approval.

## Safe continuation
Before any feature addition, complete physical iPhone/Android/tablet QA for v0.13. If a new feature adds another competing presentation state, defer it until the stable-core QA is complete.
