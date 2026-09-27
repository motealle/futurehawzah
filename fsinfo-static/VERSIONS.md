# FSInfo Static — Versions

## v0.1 baseline
File: `index.html`

Status:
- preserved
- no-build
- single file
- pan/zoom
- drag nodes
- lightweight editing
- localStorage
- JSON import/export
- SVG export

## v0.2 modular experiment
File: `index-v0.2-modular.html`

Adds without replacing v0.1:
- central feature registry
- four reversible modules:
  - Semantic Zoom
  - Focus Mode
  - Cluster Collapse / Expand
  - Relation Filter
- Light/Dark theme switch
- HUD-style controls
- separate config persistence
- reserved per-macro icon field for a future icon module

The public deployment target remains `/fsinfo/`, but neither experimental file should replace the public entry point until explicitly approved.


## v0.3 modular discovery
File: `index-v0.3-modular.html`

Adds without replacing v0.2:
- Hover Intelligence
- Search / Locate
- Mini Map
- Floating Info Card
- the feature registry now exposes 8 reversible modules out of the 15-item roadmap
- keyboard shortcut `/` focuses search
- search can expand a collapsed cluster and center the matching node
- mini-map tracks the visible viewport and can recenter the graph
- floating info card follows hover or current selection

Validation:
- JavaScript syntax compilation check: passed
- expected module IDs present: 8/8

Previous version files remain preserved.


## v0.4 infographic / collision-free
File: `index-v0.4-infographic.html`

Adds without replacing v0.3:
- larger internal canvas for dense information design
- deterministic weighted radial layout targets
- collision solver with padded bounding-box separation
- first-load collision-free layout
- explicit Layout Engine with Preview / Apply / Restore
- overlap counter in HUD
- boundary-aware edge anchors instead of center-to-center lines
- optional infographic background layers: orbital rings, cluster petals, core rings and radial spokes
- vector macrotrend icon library
- per-macro icon selector in the inspector
- global icon module toggle
- macrotrend identifiers integrated into the visual hierarchy

Validation:
- JavaScript syntax compilation check: passed
- stress simulation with worst-case trend node dimensions: 54 initial overlaps -> 0 final overlaps
- previous version files remain preserved

The public `/fsinfo/index.html` is still unchanged until explicit approval.


## v0.5 galactic / offline 3D
File: `index-v0.5-galactic.html`

This replaces the failed uncommitted Three.js experiment with a repository-backed implementation that keeps all earlier files untouched.

Key design change:
- no Three.js
- no CDN
- no ES-module imports
- no npm/build step
- custom Canvas 3D projection engine in a single HTML file

Includes:
- 3D galactic camera orbit / zoom
- animated macrotrend galaxy
- 14 macrotrends + 78 trends
- star field and nebula layers
- hierarchy and cross-impact links
- screen-space label collision suppression
- macrotrend vector-like canvas symbols
- hover info and click-to-focus
- layer toggles
- PNG export

Validation:
- JavaScript syntax compilation check: passed
- external runtime dependency check: none
- previous v0.1-v0.4 files remain preserved


## v0.6 guided galaxy / learning-first presentation
File: `index-v0.6-guided-galaxy.html`

Adds without replacing v0.5:
- Explore mode + Guided Presentation mode
- 14-step macrotrend learning tour
- eased focus / zoom camera choreography
- progressive child-trend reveal
- concise narration grounded in the source report
- optional typewriter effect
- Previous / Next / Pause / Exit / Overview
- autoplay toggle
- 14-step clickable progress rail
- final recap scene
- keyboard controls
- user interaction pauses the presentation
- camera/UI snapshot restore when presentation exits

Validation:
- JavaScript syntax compilation check: passed
- 14/14 guided content entries present
- no external runtime dependency
- v0.1 through v0.5 remain preserved

The public `/fsinfo/index.html` remains unchanged until explicit approval.


## Prompt / handoff sidecars

Each current version now has a sibling reproduction/continuation prompt:
- v0.1 → `index.prompt.md`
- v0.2 → `index-v0.2-modular.prompt.md`
- v0.3 → `index-v0.3-modular.prompt.md`
- v0.4 → `index-v0.4-infographic.prompt.md`
- v0.5 → `index-v0.5-galactic.prompt.md`
- v0.6 → `index-v0.6-guided-galaxy.prompt.md`

Future rule: version HTML + prompt sidecar are created together.


## v0.7 learning theater / mobile-first teaching
File: `index-v0.7-learning-theater.html`
Prompt sidecar: `index-v0.7-learning-theater.prompt.md`

Adds without replacing v0.6:
- 4-scene futures-studies introduction
- UI Theater Mode + `H` shortcut
- restore affordance when UI is hidden
- source/evidence drawer per macrotrend
- report section/page hint
- mobile bottom-sheet presentation layout
- reduced-motion support
- touch-friendly controls
- recaps after macrotrends 4, 8 and 12
- editorial-vs-source content distinction

Validation:
- JavaScript syntax compilation check: passed
- no external runtime dependency
- v0.1 through v0.6 remain preserved

Public `/fsinfo/index.html` remains unchanged until explicit approval.


## v0.8 decision lens / modular content foundation
Entry file: `index-v0.8-decision-lens.html`
Prompt sidecar: `index-v0.8-decision-lens.prompt.md`

Static module bundle:
- `v0.8/styles.css`
- `v0.8/content-data.js`
- `v0.8/content-service.js`
- `v0.8/decision-tools.js`
- `v0.8/app.js`

Adds without replacing v0.7:
- first multi-file no-build modular bundle
- canonical content records for 14 macrotrends
- Knowledge Depth drawer (`K`)
- L1 takeaway / L2 executive / L3 source-derived detail / source metadata
- حوزه Impact Map
- Preparedness user assessment stored separately in localStorage
- Compare Two macrotrends
- provenance separation: source / editorial / decision analysis / user assessment
- existing v0.7 Learn / Explore / Guided Presentation preserved

Validation:
- all four JavaScript files pass syntax compilation
- 14 canonical macrotrend records present
- no external runtime dependency
- v0.1 through v0.7 remain preserved

Public `/fsinfo/index.html` remains unchanged until explicit approval.


## v0.9 Book Core / faithful multi-depth book navigation
Entry: `index-v0.9-book-core.html`
Prompt sidecar: `index-v0.9-book-core.prompt.md`

Assets:
- `v0.9/styles.css`
- `v0.9/book-data.js`
- `v0.9/content-service.js`
- `v0.9/book-tools.js`
- `v0.9/app.js`
- `v0.9/README.txt`

Core change:
The report/book is now the direct content engine. All 14 macrotrend sections are bundled and can be read from a single sentence through the full section text.

Adds:
- Book Core reader (`K`)
- full-text search (`/`)
- arbitrary section-depth slider
- full section reading
- simplified Decision Desk (`D`)
- preparedness + managerial notes stored separately from book content
- book-based compare-two view

Validation:
- JavaScript syntax: passed
- 14 sections: present
- no external runtime dependency
- prior versions preserved

ZIP artifact:
`artifact/fsinfo-v0.9-book-core/fsinfo-v0.9-book-core.zip`

Public `/fsinfo/index.html` remains unchanged until explicit approval.


## v0.10 adaptive orbit / responsive reading
Entry: `index-v0.10-adaptive-orbit.html`
Prompt: `index-v0.10-adaptive-orbit.prompt.md`

Modules:
- `v0.10/book-data.js`
- `v0.10/content-service.js`
- `v0.10/viewport-controller.js`
- `v0.10/gesture-controller.js`
- `v0.10/font-module.js`
- `v0.10/book-tools.js`
- `v0.10/app.js`
- `v0.10/styles.css`

Adds:
- adaptive galaxy viewport that yields space to active panels
- mobile/tablet bottom-sheet and side-panel layouts
- touch orbit, pinch zoom and bounded inertial release
- contextual orbit around selected macrotrend
- narration-first / moons-second presentation timing
- swipeable presentation cards
- subtrend depth and book-context navigation
- contextual book icon/actions
- Persian-layout-independent physical shortcuts
- Sahel / Vazirmatn selection
- justified Persian long-form reading
- book content reconstructed directly from the authoritative report

Validation:
- all JS modules syntax-check successfully
- 14 macrotrend sections present
- previous versions preserved
- public index unchanged


## v0.11 reading presentation / split-book polish
Entry: `index-v0.11-reading-presentation.html`
Prompt: `index-v0.11-reading-presentation.prompt.md`

Modules:
- `v0.11/book-index.js`
- `v0.11/sections/MT01.js` … `MT14.js`
- `v0.11/content-service.js`
- `v0.11/viewport-controller.js`
- `v0.11/gesture-controller.js`
- `v0.11/font-module.js`
- `v0.11/book-tools.js`
- `v0.11/planet-material.js`
- `v0.11/app.js`
- `v0.11/styles.css`

Adds:
- split authoritative book payload
- long-text full-screen mobile Book reader
- short-text mobile bottom sheet
- tap-to-finish narration
- clickable trend chips with book-derived trend narration
- optional trend-by-trend presentation sequence
- subtle camera dolly-in
- lightweight improved planet material

Deferred:
- radial context menu to v0.12

Validation:
- JavaScript syntax checks passed for core v0.11 modules
- previous versions preserved
- public index unchanged


## v0.12 Stable Core / v0.9 experience restoration
Entry: `index-v0.12-stable-core.html`
Prompt: `index-v0.12-stable-core.prompt.md`

Modules:
- `v0.12/book-index.js`
- `v0.12/sections/MT01.js` … `MT14.js`
- `v0.12/content-service.js`
- `v0.12/book-tools.js`
- `v0.12/gesture-controller.js`
- `v0.12/viewport-controller.js`
- `v0.12/shell-controller.js`
- `v0.12/font-module.js`
- `v0.12/app.js`
- `v0.12/styles.css`

Strategy:
Start from v0.9's strongest perceived UX and selectively carry stable mobile improvements.

Adds/fixes:
- complete split book payload
- reversed smooth touch orbit + restrained inertia
- parent-macro pivot for selected trends
- mobile Fullscreen control
- dynamic safe viewport
- v0.9 typewriter restored
- trends reveal only after narration completion
- fast post-narration tag cadence
- tap-to-complete narration
- contextual Book affordances
- Persian-layout-independent shortcuts
- Sahel/Vazirmatn font support

Validation:
- all core JS syntax checks passed
- 14/14 section payloads present and non-empty
- public index unchanged
- physical-device QA still pending


## v0.13 Quality Consolidation / release candidate
Entry: `index-v0.13-quality-consolidation.html`
Prompt: `index-v0.13-quality-consolidation.prompt.md`

Strategy:
- preserve the v0.9 Book Core/presentation feel
- preserve the v0.12 reversed smooth touch orbit
- freeze feature scope and reduce regression surface
- reuse the immutable v0.12 book payload instead of duplicating it

Versioned runtime modules:
- `v0.13/app.js`
- `v0.13/gesture-controller.js`
- `v0.13/viewport-controller.js`
- `v0.13/shell-controller.js`
- `v0.13/styles.css`

Stability improvements:
- centralized presentation timing contract
- explicit inertia pointer-type continuity
- canvas resizing follows the visual viewport
- viewport reset on orientation/fullscreen changes
- stronger native/WebKit/pseudo-fullscreen state synchronization
- safe-area hardening without changing v0.9 Book proportions

Deferred on purpose:
- radial context menu
- automatic trend-by-trend narration
- v0.11 forced full-screen long Book reader
- any new 3D/runtime dependency

Public `index.html` remains unchanged.


## v0.14 Coherent Core
Entry: `index-v0.14-coherent-core.html`
Prompt: `index-v0.14-coherent-core.prompt.md`

Owner-confirmed scope:
- v0.9 tag reveal cadence (850ms), gated until narration completion
- justified presentation text
- optional one-level trend presentation after macrotrend presentation
- exact book-derived trend narration for all 78 trends
- complementary galaxy viewport around major panels
- mobile single-major-sheet rule
- horizontal swipe for presentation/intro

Live root remains v0.9 unless explicitly promoted.
