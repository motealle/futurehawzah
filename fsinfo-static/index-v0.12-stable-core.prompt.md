# FSInfo v0.12 Stable Core — Reproduction / Continuation Prompt

## Entry
`index-v0.12-stable-core.html`

## Product principle
v0.12 intentionally returns to the **v0.9 UX baseline** and carries forward only a small set of stable improvements.

Do not re-import the complexity of v0.10/v0.11 wholesale.

## Why v0.9 is the baseline
The target experience is:
- clear panel hierarchy
- sensible content volume
- readable typewriter narration
- predictable Book Core
- fewer competing states
- lower cognitive and interaction complexity

## Content authority
The book/report «نقشه کلان‌روندهای آینده حوزه‌های علمیه» is authoritative.
Do not independently validate or enrich it unless explicitly requested.

## Data architecture
Use:
- `v0.12/book-index.js`
- `v0.12/sections/MT01.js` … `MT14.js`

The split payload fixes the empty/oversized book-data problem while preserving the v0.9 Book Core experience.

## Main modules
- `content-service.js` — v0.9-style book depth/search API over split data
- `book-tools.js` — Book Core + Decision Desk + contextual Book open
- `gesture-controller.js` — smooth pointer/touch orbit and bounded inertia
- `viewport-controller.js` — reserves complementary galaxy space around major panels
- `shell-controller.js` — dynamic mobile viewport + user-triggered Fullscreen
- `font-module.js` — Vazirmatn/Sahel choice
- `app.js` — v0.9 renderer/presentation with corrected sequencing

## Touch orbit rule
The user's touch feedback explicitly requires **reversed touch orbit direction** relative to v0.11.

For touch:
- horizontal drag uses negative yaw direction
- vertical drag uses negative pitch direction
- inertia preserves the same direction
- friction is short and bounded

Mouse remains conventional.

## Presentation sequencing
Keep the v0.9 narration amount and visual style.

Required order:
1. camera arrives
2. narration types
3. narration completes
4. short pause
5. trend tags/moons reveal rapidly one by one
6. takeaway appears
7. autoplay may advance

Trend tags and trend moons must not start appearing before narration completes.

Click/tap on narration during typing:
- complete current text immediately
- use a short fade
- do not advance the presentation

## Mobile layout
- use viewport-fit=cover
- use dynamic viewport height
- provide a visible Fullscreen button on mobile
- Fullscreen is user-triggered because browsers require a gesture
- if browser Fullscreen API is unavailable, use a visual pseudo-fullscreen fallback
- presentation remains a bottom sheet
- galaxy projection uses the region above the sheet

## Book Core
Preserve v0.9 behavior and proportions:
- one sentence
- opening paragraph
- arbitrary percentage
- full section
- search

Do not force the v0.11 long-text full-screen reader behavior in this version.

## Contextual Book access
Book may be opened from:
- main Book button
- Object Info
- Guided Presentation
- mobile quick dock
- physical KeyK

If a trend is selected, Book Core opens the parent macrotrend section, preserving the v0.9 reading model.

## Shortcuts
Use KeyboardEvent.code:
- KeyK → Book
- KeyD → Decision
- KeyH → Theater
- Slash → Book Search

## Version rule
Preserve v0.1–v0.11 unchanged.
Do not modify public `/fsinfo/index.html` without explicit approval.
