# FSInfo v0.7 Learning Theater — Reproduction / Continuation Prompt

## Artifact
`index-v0.7-learning-theater.html`

## Purpose
Continue the FSInfo no-build static track by turning v0.6 into a clearer teaching product for futures studies and a seminary audience.

## Preserve
- Never overwrite v0.1–v0.6.
- Keep v0.7 single-file and no-build.
- No npm, CDN, ES modules, or external runtime dependency.
- Word report remains the research source of truth.
- Prototype cross-impact links remain non-final unless source-backed.

## Product modes
1. Explore mode — free galaxy navigation.
2. Futures-studies Intro — 4 compact educational cards before the tour.
3. Guided Presentation — 14 source-grounded macrotrend scenes.
4. Learning Recaps — optional recap after steps 4, 8, and 12.
5. Theater Mode — hide nonessential chrome without changing camera or graph state.

## Intro contract
The intro is editorial teaching content, not a quotation from the report. It must explain:
- trend
- macrotrend
- why trends matter in futures studies
- trend is not deterministic prediction
- how to read the map

Clearly label this distinction.

## Guided presentation
Retain:
- eased camera focus
- progressive trend reveal
- short source-derived narration
- takeaway
- previous/next/pause/overview/exit
- autoplay
- optional typewriter
- progress dots
- final recap
- snapshot/restore on exit

Add:
- source/evidence drawer
- internal report page hint from the report table of contents
- explicit note that presentation text is a concise paraphrase and full report is required for citation

## Theater module
- button + keyboard shortcut H
- hides title/HUD/info/legend/hint
- never mutates graph/camera/presentation data
- small always-visible restore affordance
- may remain active across Explore and Presentation

## Mobile contract
Do not shrink desktop UI.
At <=900px:
- presentation becomes a bottom sheet
- safe-area padding
- galaxy remains visible above it
- 44px minimum primary touch controls
- desktop info/legend hidden
- title removed while presenting
- portrait and landscape should remain usable

## Motion comfort
- respect prefers-reduced-motion
- manual “حرکت کمتر” toggle
- disable typewriter and auto-rotation when reduced motion is active
- use shorter/faster non-cinematic interpolation

## Educational design
- one question per macrotrend scene
- one primary visual focus
- stable text while reading
- progressive disclosure
- recaps reduce cognitive load
- source-derived content vs editorial framing must be visually distinguishable

## Data integrity
Do not invent:
- trend names
- statistics
- evidence
- causal links
- source validation

## Continuation path
For v0.8, preserve this file and create a new HTML + sibling prompt sidecar. Highest-value next work:
- real-browser visual QA
- stronger evidence cards
- research QA of cross-impact relations
- optional thematic learning paths
- compare-two-macrotrends scene
- refined mobile gestures and orientation handling
