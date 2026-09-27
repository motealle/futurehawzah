# FSInfo v0.11 Adaptive Orbit — QA Tuned

## Entry
`index-v0.11-adaptive-orbit.html`

## Modules
- four book section chunks
- book-data assembler
- content service
- viewport controller
- gesture controller
- font module
- book/context tools
- renderer/presentation app
- responsive styles

## Why v0.11
v0.10 exposed an important packaging issue: a monolithic generated book-data file was too large for reliable repository writing. v0.11 fixes this by splitting the authoritative report content into four safe static chunks.

## Interaction contract
- major panels and galaxy share screen space
- mobile panels are bottom sheets and leave roughly half the viewport for the galaxy
- Object Info also participates in safe-space calculation on mobile
- viewport interpolation happens once per animation frame, not once per projected node
- touch/mouse orbit has short bounded inertia
- pinch zoom works on touch
- focused macrotrend remains the orbit pivot
- subtrend is depth 2 with breadcrumb and back-to-macro action
- presentation finishes narration before revealing child moons
- presentation/intro cards support horizontal swipe
- K/D/H/Slash use physical KeyboardEvent.code
- Book entry is contextual to the selected/current presentation node
- mobile defaults to Sahel, wider screens to Vazirmatn; user override persists
- long Persian text is justified

## Content authority
The book/report is authoritative. Do not independently verify or enrich it by default.
Missing subtrend-specific prose must fall back to the parent section rather than being invented.

## Version discipline
Preserve v0.1–v0.10 and do not change public /fsinfo/index.html without explicit approval.
