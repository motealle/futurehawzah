# FSInfo v0.6 Guided Galaxy — Reproduction / Continuation Prompt

## Artifact
`index-v0.6-guided-galaxy.html`

## Product goal
Transform v0.5 from a beautiful exploration space into a learning-first interactive presentation while preserving Explore mode.

## Technical constraints
- single HTML
- no build
- no npm
- no CDN
- no external runtime dependency
- custom Canvas pseudo-3D engine inherited from v0.5
- RTL Persian / Vazirmatn-first

## Modes
### Explore
Free rotation, zoom, hover, click focus, layer toggles.

### Guided Presentation
A reversible 14-step tour:
- snapshot camera/UI on entry
- restore on exit
- eased low-velocity camera movement
- one macrotrend at a time
- unrelated clusters dimmed
- child trends progressively revealed
- concise narration grounded in the Word report
- optional restrained typewriter
- Previous / Next / Pause / Exit / Overview
- autoplay toggle
- typewriter toggle
- clickable 14-step progress rail
- final recap scene
- keyboard: Space, Arrow keys, Esc, Home
- mouse/wheel interaction pauses autoplay

## Educational principles
1. One focal question per scene.
2. Motion guides attention; it must not compete with reading.
3. Labels remain stable long enough to read.
4. Progressive disclosure beats information dumping.
5. Typewriter is only for short text and must be skippable/disableable.
6. Source-derived narration and editorial interpretation must be distinguishable.
7. The learner controls pace.

## Source grounding
The Word report «نقشه کلان‌روندهای آینده حوزه‌های علمیه» is authoritative. Narration should be concise paraphrase of supported source text. Do not invent facts, statistics, or causal claims.

## Known limitations / next direction
- mobile presentation needs dedicated QA
- panel clutter can obscure the galaxy
- a short futures-studies introduction should precede the 14 macrotrends
- hide/show-all-UI control is desirable
- source/evidence drawer and relationship explanations are not complete
- cross-impact research QA remains pending

## Continuation
For v0.7, keep v0.6 unchanged and create a new additive file. Focus on teaching clarity, UI decluttering, mobile-first presentation, source transparency, and stronger future-studies framing.
