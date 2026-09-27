# FSInfo v0.11 Reading Presentation — Reproduction / Continuation Prompt

## Entry
`index-v0.11-reading-presentation.html`

## Product goal
Refine reading and presentation quality without expanding into a new feature family.

## Authoritative content
The book/report «نقشه کلان‌روندهای آینده حوزه‌های علمیه» is the authoritative source.
Do not add external validation/research by default.
Do not invent missing subtrend prose.

## Data architecture
Do not use one giant book data file.
Use:
- `v0.11/book-index.js`
- `v0.11/sections/MT01.js` … `MT14.js`

The content service merges index metadata with the split section payloads.

## Interaction contracts

### Mobile Book reader
- short content: bottom sheet
- long content: full-screen reader
- switch based on actual rendered text size/paragraph count
- preserve close/back/search/depth controls

### Presentation narration
- macro narration finishes before trend moons begin to reveal
- tapping/clicking the narration while it is typing completes it immediately
- completion uses a quick fade, not a jump to the next scene

### Trend chips
- become clickable only after their reveal
- clicking a trend reuses the narration area for that trend
- trend text comes from the book-derived trend block when available
- breadcrumb/back returns to macro narration
- selected trend remains visually focused while orbit pivot stays on parent macrotrend

### Optional ارائه روندها
- checkbox appears after حرکت کمتر
- when enabled:
  macro narration → moons reveal → trend narration 1..N → next macrotrend
- missing exact trend blocks are not invented

### Camera
- use a very subtle bounded dolly-in during the macro presentation
- disabled by reduced-motion
- must not interfere with reading composition

### Planet material
Use only lightweight Canvas gradients, limb shading and a small band cue.
No image textures, WebGL shaders or post-processing.

## Deferred
The radial context menu for right-click / long-press is intentionally deferred to v0.12 for isolated gesture-conflict/accessibility QA.

## Preserve
- v0.1–v0.10 unchanged
- public /fsinfo/index.html unchanged until explicit approval
- viewport, gesture, font, content and book modules remain separate
