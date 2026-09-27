# FSInfo Static — Handoff

Updated: 2026-09-26

## Purpose

FSInfo is a future-oriented interactive infographic for the report «نقشه کلان‌روندهای آینده حوزه‌های علمیه».

The project is currently in a **no-build static rescue / exploration track**. Each experimental version is preserved as a separate file; previous versions must never be overwritten or deleted.

## Repository

- repository: `motealle/sites`
- working branch: `feature/fsinfo-static`
- staging path: `modiremelli.ir/fsinfo-static/`
- intended public destination after approval: `https://modiremelli.ir/fsinfo/`

The merged React/Vite implementation under `modiremelli.ir/fsinfo/` remains a separate historical baseline and must not be modified as part of this static track unless explicitly requested.

## Version policy

Every new experiment is additive.

Current files:
- `index.html` — v0.1 static baseline
- `index-v0.2-modular.html` — modular controls / light-dark
- `index-v0.3-modular.html` — discovery modules
- `index-v0.4-infographic.html` — collision-free 2D infographic
- `index-v0.5-galactic.html` — offline single-file galactic 3D experiment

A new version must be added as a new file. It becomes the public `/fsinfo/index.html` only after explicit approval.

## Current best experimental directions

### v0.4
Strongest current direction for:
- information density
- editability
- readable taxonomy
- infographic-style overview
- deterministic collision-free layout

### v0.5
Strongest current direction for:
- emotional impact
- exploratory navigation
- spatial memory
- presentation / exhibition feel
- cinematic storytelling potential

v0.5 is intentionally implemented with a custom Canvas 3D projection engine:
- no npm
- no build
- no external runtime dependency
- no CDN

## Content authority policy

The Word report is the **primary and trusted authoritative source** for this project.

For the current product phase:
- do not perform secondary evidence verification
- do not re-check the report's citations/statistics against external sources
- do not add a parallel evidence-validation workflow
- do not treat source verification as a product requirement
- the report's own research/evidence process is assumed complete for FSInfo

Our job is to represent, summarize, navigate and operationalize the book/report faithfully.

Current graph data contains:
- 14 macrotrends
- extracted trend headings
- prototype cross-impact relations

The only current caution:
- do not invent content that is not in the report
- cross-impact relations added by FSInfo itself remain prototype unless they are explicitly present in the report

## New product direction: learning-first

The next phase should optimize for **comprehension, guided learning, clarity, retention and narrative flow**, not only visual spectacle.

The graph should support two complementary modes:

1. **Explore mode**
   - user freely rotates / zooms / inspects the galaxy
   - current v0.5 behavior

2. **Guided Presentation mode**
   - system presents macrotrends one-by-one
   - camera moves smoothly to each macrotrend
   - the selected macrotrend becomes the visual focus
   - its child trends are revealed in a controlled sequence
   - short explanatory copy can appear with restrained typewriter/reveal effects
   - the sequence advances manually or automatically
   - the user can pause, go back, skip, or exit at any time

## v0.6 proposed experiment

File target:
`index-v0.6-guided-galaxy.html`

Primary experiment:
**Guided Presentation / Learning Path**

Requirements:
- preserve v0.5 unchanged
- remain single-file and no-build
- presentation mode must be a reversible module
- entering presentation mode must snapshot camera/UI state
- exiting must restore the previous exploration state
- camera animation must use easing and low angular velocity to avoid disorientation
- default progression must be slow and interruptible
- content reveal must prioritize readability over animation
- typewriter effect is allowed only for short explanatory sentences, never long paragraphs
- macrotrend and trend labels should remain stable long enough to read
- manual Previous / Next / Pause controls are mandatory
- progress indicator should show current macrotrend position (e.g. 3 / 14)
- presentation copy must be source-derived or explicitly marked as editorial interpretation

## Educational design principles for v0.6+

1. One visual question per scene.
2. One primary focal point at a time.
3. Use motion only to guide attention.
4. Prefer progressive disclosure over showing all text at once.
5. Keep labels stationary while being read.
6. Use spatial consistency: a macrotrend should remain in the same galaxy region across modes.
7. Use repetition of visual grammar to improve memory.
8. Never use typewriter effects for essential dense content.
9. Distinguish source-derived content from interpretive narration.
10. Always provide user control over pacing.

## v0.6 implementation status

Implemented file:
`index-v0.6-guided-galaxy.html`

Implemented:
- Explore mode preserved from v0.5
- reversible Guided Presentation mode
- camera/UI snapshot and restore on enter/exit
- 14-step macrotrend tour
- calm eased focus/zoom motion
- progressive child-trend reveal
- concise source-derived narration for all 14 macrotrends
- optional restrained typewriter effect
- Previous / Next / Pause / Exit / Overview controls
- autoplay toggle
- typewriter toggle
- 14-step clickable progress rail
- final recap / overview scene
- keyboard controls: Space, Arrow keys, Esc, Home
- manual pointer/wheel interaction pauses presentation
- no npm/build/CDN/external runtime dependency

Validation completed:
- JavaScript syntax compilation check: passed
- 14 presentation content entries detected
- presentation controller and recap scene detected
- no external runtime dependency detected

## Immediate next step

Visually QA v0.6 in real browsers and refine:
- camera pacing
- text pacing
- mobile panel size
- label deconfliction during transitions
- source-derived narration wording
- final recap composition

Do not replace public `/fsinfo/index.html` until explicit approval.


## Prompt sidecar policy

Every HTML version must have a sibling prompt/handoff file that allows another capable model to:
- understand the version's purpose
- reproduce it
- continue it without breaking its design contract
- distinguish research data from UI/visual behavior
- preserve previous versions

Current sidecars:
- `index.prompt.md`
- `index-v0.2-modular.prompt.md`
- `index-v0.3-modular.prompt.md`
- `index-v0.4-infographic.prompt.md`
- `index-v0.5-galactic.prompt.md`
- `index-v0.6-guided-galaxy.prompt.md`

Rule for all future releases:
**creating the HTML and its prompt sidecar is one atomic versioning task.**
A version is not considered complete until both exist.

## v0.7 implementation status

Implemented:
- `index-v0.7-learning-theater.html`
- `index-v0.7-learning-theater.prompt.md`

Adds without replacing v0.6:
- UI Theater Mode with button + `H` shortcut
- always-visible restore affordance in theater mode
- 4-card futures-studies introduction before the guided tour
- explicit distinction between editorial teaching framing and report-derived narration
- source/evidence drawer for each macrotrend
- internal report table-of-contents page hint
- mobile bottom-sheet presentation shell
- safe-area padding and 44px primary mobile controls
- reduced-motion mode with `prefers-reduced-motion` support
- typewriter + auto-rotation disabled when reduced motion is enabled
- learning recap after steps 4, 8 and 12
- optional recap skipping
- prior Explore + Guided Presentation functionality preserved

Validation:
- JavaScript syntax compilation passed
- no external runtime dependency
- intro, theater mode, reduced motion, source drawer, mobile shell and 3 recaps detected

Next focus:
- real-browser visual QA
- tune mobile portrait/landscape composition
- research QA for cross-impact links
- improve source/evidence depth
- test presentation pacing with actual learners


## Strategic direction after v0.7

The next product leap is not visual polish alone. FSInfo should become a **multi-depth learning + exploration + decision-support system**.

Three product jobs must remain distinct:
1. Learn — understand trends and macrotrends.
2. Explore — inspect relationships and navigate the future map.
3. Decide — structure attention, preparedness discussion and policy/workshop thinking for حوزه decision-makers.

New supporting documents:
- `CONTENT_ARCHITECTURE.md`
- `DECISION_SUPPORT.md`

Key architectural decision:
Content depth must be separated from visualization versions. The same canonical content record should be retrievable from label-level summary through full report context.

Recommended next technical migration:
- keep no-build deployment
- move growing content out of version HTML files into plain JSON data packs
- lazy-load detailed content/evidence on demand
- keep research/source data separate from user decision annotations

Decision-support modules must structure judgment, not make decisions.

Keep distinctions lightweight:
- **book/report content** — trusted primary content
- **FSInfo editorial summary** — shorter restatement of the book
- **user/workshop assessment** — values entered by decision-makers

Do not create extra evidence-verification layers unless the user explicitly asks for them later.


## v0.8 implementation scope

Selected:
- modular no-build multi-file bundle
- multi-depth Knowledge Drawer (L1–L3 now; L4/L5 contract reserved)
- حوزه Impact Map
- Compare Two
- user-entered Preparedness assessment

Deferred for now:
- What-if Lens
- Signal Watchlist
- full Workshop Mode
- Decision Brief export
- full L5 report ingestion
- thematic tours
- audio narration

Reasoning:
v0.8 should validate whether richer source access + a small set of decision tools materially improve real decision conversations before adding monitoring, workflow or synthesis complexity.


## v0.8 implementation status

Implemented:
- `index-v0.8-decision-lens.html`
- `index-v0.8-decision-lens.prompt.md`
- modular assets under `v0.8/`

Delivered selected scope:
- modular bundle split
- multi-depth Knowledge Drawer
- حوزه Impact Map
- Compare Two
- Preparedness input

The high-complexity / lower-immediate-value features identified in scope triage remain deferred.

Validation completed:
- JavaScript syntax compilation passed for content data, content service, decision tools and app
- 14 canonical records detected
- no external runtime dependency

Next:
- real-browser QA
- improve usability of decision tools
- expand book-content depth from summary to full section retrieval
- keep the book as the single trusted content source
- avoid external evidence/research workflows unless explicitly reintroduced later


## Simplification decision — 2026-09-27

Evidence-validation work is intentionally out of scope.

FSInfo should not spend effort on:
- external verification of the book
- evidence-strength scoring
- citation QA beyond preserving the book's own references
- external research enrichment by default
- provenance taxonomies more complex than needed for product clarity

Preferred simple content distinction:
1. `book_content`
2. `fsinfo_summary`
3. `user_assessment`

If a future phase explicitly requests external research or evidence auditing, add it then as a separate optional module rather than burdening the core architecture now.


## Independent handoff directive — v0.9 / Book-faithful core

This handoff is designed to stand independently of chat history.

### Absolute content rule

FSInfo must proceed with **full commitment to the book/report’s content, terminology, framing, sequence and intellectual spirit**.

The report «نقشه کلان‌روندهای آینده حوزه‌های علمیه» is the authoritative knowledge base.

For the current phase:
- do not independently fact-check the report
- do not enrich it with external research by default
- do not rewrite the worldview of the report into generic futures-studies language
- do not invent implications that the report does not support
- preserve the report’s own distinctions, emphases and vocabulary
- summaries must be compression of the report, not replacement by model knowledge

### v0.9 target

Create an additive version:
- `index-v0.9-book-core.html`
- sibling prompt sidecar `index-v0.9-book-core.prompt.md`
- modular assets under `v0.9/`
- downloadable ZIP distribution

### v0.9 product goal

Make the **book itself navigable at multiple depths** while preserving the strongest interaction patterns from the galaxy/presentation track.

Core experience:
1. Galaxy overview
2. Select macrotrend
3. Read at adjustable depth
4. Move from summary to the book’s own detailed text
5. Keep decision annotations separate from book content
6. Preserve mobile usability and theater presentation

### Content depth rule

Depth is a view over the same book content:
- `L0` title
- `L1` one-sentence compression
- `L2` short book-faithful summary
- `L3` opening/detail excerpt from the actual section
- `L4` larger section chunks
- `L5` full section text

The content service must expose depth without the renderer knowing storage details.

### Architecture rule

Keep v0.9 clean and modular:
- shell HTML
- styles
- book data / section chunks
- content service
- galaxy/presentation app
- optional decision annotations module

Do not re-grow a monolithic HTML file.

### Decision-support rule

Decision tools may help users organize attention, but:
- the book is the source of substantive content
- user assessments remain clearly separate
- no evidence scoring or secondary verification
- no automatic organizational recommendation/ranking

### Version discipline

- preserve v0.1 through v0.8
- do not overwrite the public `/fsinfo/index.html`
- do not deploy publicly without explicit approval
- create/update prompt sidecar with the version


## v0.9 implementation status

Implemented:
- `index-v0.9-book-core.html`
- `index-v0.9-book-core.prompt.md`
- modular assets under `v0.9/`
- packaged ZIP on artifact branch `artifact/fsinfo-v0.9-book-core`

Delivered:
- full text of all 14 macrotrend sections extracted from the trusted book/report
- book-faithful guided presentation intros derived from each section opening
- Book Core drawer with:
  - one sentence
  - opening paragraph
  - arbitrary percentage of the section
  - full section text
- full-text search across the 14 book sections
- Decision Desk limited to:
  - user preparedness
  - user notes
  - book-based side-by-side comparison
- no evidence scoring / no secondary verification / no external research layer
- Explore / Guided Presentation / Theater / Reduced Motion / mobile shell preserved
- no npm/build/CDN/external runtime dependency

Validation completed:
- 14/14 book sections included
- total extracted section content: ~682k characters before JSON escaping
- JavaScript syntax checks passed for data, content service, book tools and app
- binary ZIP package created as a separate artifact branch

Artifact:
- branch: `artifact/fsinfo-v0.9-book-core`
- file: `fsinfo-v0.9-book-core.zip`

Next priority:
- visual/browser QA
- mobile reading ergonomics for long book sections
- richer in-book navigation (headings/subtopics) without adding external research complexity
- decision usability testing with real حوزه managers


## v0.10 independent implementation directive — Adaptive Orbit

Target:
- `index-v0.10-adaptive-orbit.html`
- `index-v0.10-adaptive-orbit.prompt.md`
- modular assets under `v0.10/`

### Primary UX problem

Panels and galaxy currently compete for the same pixels. On mobile/tablet, opening a panel can cover the focused cluster. Touch orbit is also too abrupt and insufficiently inertial.

### v0.10 mandatory interaction contract

1. **Adaptive galaxy viewport**
   - galaxy projection uses the free/visible region, not the full screen
   - when a side panel opens, galaxy recenters into the complementary region
   - on mobile bottom sheets, galaxy uses the area above the sheet
   - transitions between viewport regions are eased

2. **Touch/mouse orbit with bounded inertia**
   - drag/orbit works smoothly with pointer/touch
   - release keeps a small amount of angular momentum
   - momentum decays quickly and never drifts far from the user’s chosen framing
   - when a macrotrend is focused, orbit pivots around that macrotrend

3. **Presentation sequencing**
   - presentation text completes first
   - only after text completion do child trend moons reveal
   - child moons reveal faster, sequentially
   - attention must not be split between typing and node appearance

4. **Mobile wizard swipe**
   - horizontal swipe on presentation/intro cards navigates previous/next
   - vertical scrolling remains available
   - buttons still work

5. **Subtrend depth**
   - selecting a child trend enters depth 2
   - info panel clearly shows breadcrumb: macrotrend → subtrend
   - content panel shows the book context related to that subtrend when available
   - one-tap “back to macrotrend” returns to depth 1
   - galaxy orbit remains centered on the parent macrotrend

6. **Context-aware Book panel**
   - shortcut `K` always opens book content for current context:
     - selected node
     - current presentation macrotrend
     - selected subtrend
   - Book button is available inside presentation and Object Info
   - a consistent simple book icon is the affordance everywhere

7. **Keyboard-layout-independent shortcuts**
   - use `KeyboardEvent.code`, not Persian/Latin character value
   - physical K/D/H/Slash keys work even when keyboard language is Persian

8. **Typography**
   - support user-selectable Vazirmatn / Sahel
   - default mobile font: Sahel
   - default desktop/tablet font: Vazirmatn
   - load Sahel from an Iran-oriented LibreFont/ParsPack CDN with public CDN fallback
   - keep system fallback if network font loading fails
   - long explanatory text is justified

9. **Discoverability**
   - existing features must remain discoverable without reading documentation
   - contextual buttons are preferred over adding more permanent panels
   - shortcuts may be shown in tooltips/labels but must not be the only entry point

### Content rule

The book/report remains the authoritative content source. Subtrend detail must be extracted from the relevant book section where possible. Do not invent a subtrend explanation merely to fill a panel.

### Architecture rule

Do not add these concerns directly into one large app file.
Separate at least:
- responsive viewport/layout controller
- gesture/orbit controller
- content/context navigation
- book tools
- renderer/presentation

Preserve v0.1–v0.9 unchanged.


## v0.10 implementation status

Implemented:
- `index-v0.10-adaptive-orbit.html`
- `index-v0.10-adaptive-orbit.prompt.md`
- modular assets under `v0.10/`

Delivered:
- adaptive free-space galaxy viewport
- mouse/touch orbit with restrained inertia
- pinch zoom
- macro-centered orbit when a macrotrend/subtrend is selected
- text-first presentation sequencing
- faster sequential moon reveal after narration completes
- swipe navigation for presentation and intro cards
- depth-2 subtrend navigation with breadcrumb/back
- contextual Book entry points in Presentation and Object Info
- K/D/H/Slash physical-key shortcuts using `KeyboardEvent.code`
- selectable Vazirmatn / Sahel font module
- Sahel mobile default, Vazirmatn desktop/tablet default
- Iran-oriented LibreFont/ParsPack Sahel CDN plus public fallback
- justified Persian reading text
- quick-action dock for feature discoverability

Book data:
- all 14 main report sections were extracted directly from the authoritative source document into v0.10
- subtrend-specific context extraction succeeded automatically for most child trends
- where an exact independent child block is not found, the UI explicitly falls back to the parent book section rather than inventing prose

Static validation:
- all v0.10 JavaScript modules pass syntax compilation
- 14/14 macrotrend book records created
- no public deployment performed

Next QA:
- real touch-device orbit feel
- mobile Safari/Chrome panel geometry
- tablet landscape free-space composition
- review subtrend block boundaries in the few fallback cases
- network behavior of remote fonts with system fallback


## v0.11 planning directive — Reading & Presentation Polish

This directive is independent of chat history.

### New requests triage

Implement now when low-risk / high-value:
1. Adaptive mobile Book reader:
   - short text → bottom sheet
   - long text → full-screen reader
2. Presentation narration skip:
   - tapping/clicking narration while typing completes it immediately with a fast fade
3. Trend-chip drill-in:
   - clicking a revealed trend chip reuses the narration area for that trend's book-faithful context
   - clear breadcrumb/back-to-macro affordance
4. Optional `ارائه روندها`:
   - placed after `حرکت کمتر`
   - when enabled, after macro narration finishes, trend items are presented sequentially before advancing to the next macrotrend
5. Very subtle presentation dolly-in:
   - slow bounded camera approach toward the active macrotrend
   - stops before it changes reading composition
6. Lightweight planet-material polish:
   - Canvas-only gradients/highlight/banding
   - no textures, shaders, WebGL or heavy post-processing

Defer one iteration:
7. Radial context menu on right-click / long-press.
   - valuable, but interaction conflict with touch orbit/long-press, edge placement, accessibility and cancel behavior need isolated QA
   - design as a separate module, not inside gesture/app core

### Defect found during review

The current v0.10 repository copy of `v0.10/book-data.js` is empty even though book data was generated during implementation. This is a blocking packaging/runtime defect.

v0.11 must fix this structurally rather than creating another giant data file:
- small `book-index.js`
- 14 independent section files under `v0.11/sections/`
- content service reads the same API over split section files
- no single >1MB source file

### v0.11 architecture

Keep separate:
- book index / section chunks
- content service
- responsive viewport
- gesture/orbit
- typography
- book tools
- lightweight planet material
- app/presentation state

Do not add the radial context menu until the above is stable.


## v0.11 implementation status

Implemented:
- `index-v0.11-reading-presentation.html`
- `index-v0.11-reading-presentation.prompt.md`
- split section payloads under `v0.11/sections/`

Delivered:
- fixed the large/empty book payload problem by splitting the book into index + 14 section files
- adaptive mobile Book reader: bottom sheet for short text, full-screen for long text
- tap/click narration to complete typing with a fast fade
- trend chips open book-derived trend context in the same narration area
- explicit back-to-macrotrend control
- optional `ارائه روندها` sequence
- subtle bounded dolly-in
- lightweight Canvas planet material polish

Deferred:
- radial context menu on right-click / long-press remains planned for v0.12 due gesture/accessibility conflict risk

Static validation:
- v0.11 app/book/content/material modules compile successfully
- all 14 section files are stored separately
- no public deployment performed

Important:
Real browser/touch QA is still required before calling interaction behavior final.


## v0.12 independent directive — v9 Quality Baseline / Stable Mobile Orbit

This directive is independent of chat history.

### Governing version rule
Previous versions are immutable. v0.12 must be additive and must not edit v0.1–v0.11.

### Product reset principle
The strongest perceived UX baseline is v0.9 Book Core.
v0.12 should **start conceptually from v0.9**, then selectively carry only the improvements that are proven useful and low-risk.

Do not inherit v0.11 complexity wholesale.

### Why v0.9 is the baseline
v0.9 had:
- a clear hierarchy
- a stable presentation panel
- sensible content volume
- readable typewriter behavior
- predictable Book Core controls
- fewer competing modes/states
- lower interaction coupling

### v0.12 selected improvements
1. Keep v0.9 presentation content size and Book Core reading model.
2. Fix the v0.9 empty book payload by using split index + 14 section files.
3. Bring only the smooth pointer/touch orbit from the later track.
4. Reverse **touch** orbit direction relative to v0.11 feedback.
5. Keep restrained inertial release.
6. Make mobile use the full dynamic viewport and provide a user-triggered Fullscreen control.
7. Keep presentation typewriter effect.
8. Child trend tags may begin revealing **only after narration is fully complete**.
9. Clicking/tapping the narration during typing may complete it immediately with a quick fade, without advancing.
10. Keep the presentation panel height/content proportions close to v0.9.
11. Keep Book Core proportions and depth controls close to v0.9; do not force the v0.11 adaptive full-screen reader behavior.
12. Physical-key shortcuts use KeyboardEvent.code.
13. Contextual Book entry may be exposed in Object Info / Presentation without adding another persistent panel.
14. Mobile presentation must reserve visible galaxy space above the sheet.

### Explicit non-goals for v0.12
- no radial context menu
- no automatic trend-by-trend narration mode
- no new decision dashboard
- no new evidence/provenance machinery
- no heavy planet material system
- no additional presentation states beyond what is needed for stable macro narration + delayed tags

### QA philosophy
Prefer fewer well-tested states over more features.
The v0.12 implementation should be understandable as:
**v0.9 + corrected book data + stable mobile orbit + responsive shell fixes**.


## v0.12 implementation status

Implemented:
- `index-v0.12-stable-core.html`
- `index-v0.12-stable-core.prompt.md`
- modular assets under `v0.12/`

Design decision:
v0.12 is a deliberate **v0.9 experience restoration**, not an incremental continuation of v0.11.

Delivered:
- v0.9 Book Core proportions/content-depth model restored
- split book payload: index + 14 non-empty section files
- smooth pointer/touch orbit
- touch orbit direction reversed relative to v0.11 feedback
- bounded inertial release retained
- trend selection orbits around its parent macrotrend
- dynamic mobile viewport sizing
- user-triggered mobile Fullscreen action with visual fallback
- galaxy-safe projection area around presentation/book/decision panels
- v0.9 typewriter speed/effect restored
- narration completion now gates trend moon/tag reveal
- trend reveal cadence set to ~330ms after narration
- tap/click narration completes current typing with a quick fade
- contextual Book buttons in Object Info / Presentation / mobile quick dock
- physical-key shortcuts via KeyboardEvent.code
- Vazirmatn/Sahel font module with fallbacks
- no radial menu / no trend-auto-narration complexity carried into this consolidation version

Static QA completed:
- all v0.12 JS modules compile successfully
- HTML references 22 v0.12 scripts/assets
- all 14 book section files are non-empty
- static checks confirm touch reversal, narration gating, quick-complete, safe viewport and fullscreen controller
- public index remains unchanged

Limit:
No physical-device browser runner was available in this environment, so real Safari/Chrome touch feel is not claimed as verified.


## v0.13 implementation record — Quality Consolidation RC

This pass follows the owner feedback that v0.9 produced the strongest overall experience while v0.11 produced the best mobile touch feel but accumulated too much complexity.

Decision:
- do not build a new experience
- do not import all v0.11 features
- use v0.12 stable-core as the technical baseline
- version only the modules that materially affect interaction/presentation
- reuse the authoritative v0.12 book payload unchanged

Implemented:
- additive `index-v0.13-quality-consolidation.html`
- five isolated v0.13 runtime/style modules
- presentation timing constants centralized with unchanged defaults
- reversed touch orbit preserved; inertia metadata hardened
- visual-viewport canvas sizing + orientation/fullscreen reset
- WebKit/native/pseudo fullscreen state synchronization
- v0.9 Book Core behavior/proportions retained
- no radial menu / automatic trend narration / forced long-read fullscreen

Cost/benefit and risk decisions are recorded in `QUALITY_CONSOLIDATION_V013.md`.

Release discipline:
- public `index.html` remains unchanged
- v0.1–v0.12 remain rollback-safe
- physical-device QA is still required before any public promotion
