# FSInfo Static — Backlog

Updated: 2026-09-26

Priority key:
- **P0** = next / required
- **P1** = high-value after P0
- **P2** = useful polish
- **P3** = later / experimental

## P0 — v0.6 Guided Learning / Presentation — IMPLEMENTED, PENDING VISUAL QA

### P0.1 Guided Presentation module ✅
Create `index-v0.6-guided-galaxy.html` without modifying v0.5.

Acceptance:
- toggleable Presentation mode
- snapshot / restore previous camera and UI state
- manual start / exit

### P0.2 14-step macrotrend tour ✅
Present all 14 macrotrends one-by-one.

Acceptance:
- clear current step `n / 14`
- Next / Previous / Pause
- optional autoplay
- direct jump to any macrotrend

### P0.3 Calm cinematic camera choreography ✅
Camera should move smoothly to each macrotrend without disorienting the viewer.

Acceptance:
- eased interpolation
- bounded rotation speed
- no sudden jumps
- motion pauses before text reveal
- user input interrupts autoplay safely

### P0.4 Progressive child-trend reveal ✅
After focusing a macrotrend, reveal its trends in a readable order rather than all at once.

Acceptance:
- one trend or small group at a time
- stable labels
- visual emphasis for current trend
- previously shown items remain visually subordinate

### P0.5 Educational narration layer ✅
Add a narration / explanation panel per macrotrend.

Acceptance:
- short heading
- one concise explanatory paragraph or 2–3 short statements
- source-derived text where available
- unsupported claims are not invented
- editorial interpretation must be labeled

### P0.6 Restrained typewriter / text reveal effect ✅
Use typewriter or line-reveal animation only where it improves attention.

Acceptance:
- can be disabled
- skips instantly on click
- short text only
- no slow character-by-character animation for long Persian paragraphs

### P0.7 Presentation progress / orientation ✅
Viewer should always know where they are.

Acceptance:
- `3 / 14`
- macrotrend name
- progress rail or dots
- optional “overview” button

## P1 — comprehension quality

### P1.1 Learning objectives
For each macrotrend, support an optional one-line “what to notice” statement.

### P1.2 Relation explanation
When a cross-impact relation is shown, explain the relation in a small readable card rather than only drawing a line.

### P1.3 Compare mode
Allow a presentation scene to compare two macrotrends side by side.

### P1.4 Layered reading levels
Support:
- headline
- short explanation
- source/evidence drawer

### P1.5 Key takeaway
End each macrotrend scene with one short takeaway before moving to the next.

### P1.6 Recap scene
After all 14 macrotrends, return to the full galaxy and highlight the complete system with a short recap.

## P1 — visual / infographic quality

### P1.7 Galaxy cluster identity
Give each macrotrend a stronger visual identity using:
- color
- icon
- orbit motif
- subtle shape language

### P1.8 Label hierarchy
Improve typography hierarchy for:
- core
- macrotrend
- trend
- narration
- metadata

### P1.9 Depth cues
Improve 3D readability with:
- atmospheric fading
- consistent scale by depth
- subtle occlusion handling
- restrained glow

### P1.10 Label deconfliction
Improve screen-space label collision handling during camera motion.

### P1.11 Focus halo
During presentation, give the active cluster a calm halo / vignette while de-emphasizing unrelated clusters.

## P2 — navigation / control

### P2.1 Timeline scrubber
Allow scrubbing through the 14-step presentation.

### P2.2 Presentation speed
Options:
- slow
- normal
- fast

### P2.3 Keyboard controls
- Space: pause/resume
- Left/Right: previous/next
- Esc: exit presentation
- Home: overview

### P2.4 Fullscreen presentation
Add native fullscreen entry/exit.

### P2.5 Speaker mode
Optional presenter controls with reduced audience UI.

## P2 — content / research

### P2.6 Source-backed explanation extraction
Extract short explanatory text per macrotrend from the Word report.

### P2.7 Evidence cards
Attach page/source/evidence metadata where available.

### P2.8 Cross-impact QA
Replace prototype cross-links with source-backed relations.

### P2.9 Terminology QA
Verify labels and wording against the source document.

## P3 — later experiments

### P3.1 Cinematic intro
Short non-blocking introduction from overview to core.

### P3.2 Audio narration
Optional, only if a clean source-backed script exists.

### P3.3 Guided thematic paths
Alternative tours such as:
- technology path
- governance path
- society / culture path
- knowledge / religion path

### P3.4 Quiz / reflection moments
Optional learning checks after selected sections.

### P3.5 Recording / export
Export a presentation path as frames or a video-like sequence only if it can be implemented without destabilizing the no-build track.

## Explicitly deferred

Do not prioritize before v0.6 learning-flow validation:
- backend
- authentication
- realtime multi-user editing
- complex authoring CMS
- server versioning
- heavy 3D frameworks
- dependency-heavy build tooling


## v0.6 QA backlog — next

### QA.1 Desktop browser pass
Test current Chrome/Edge/Firefox behavior for presentation start, pause, next/previous, exit and restore.

### QA.2 Mobile readability
Tune panel height, trend chips and title/narration typography for narrow screens.

### QA.3 Camera pacing
Review all 14 transitions and tune any scene that feels too fast, too close or disorienting.

### QA.4 Narration pacing
Review typewriter/reveal speed against Persian reading comfort.

### QA.5 Source wording review
Compare the 14 short narration blocks against the Word report and tighten wording without adding unsupported claims.

### QA.6 Recap polish
Improve the final overview scene after the 14th macrotrend.


## P0 — v0.7 Learning Theater — IMPLEMENTED, PENDING VISUAL QA

### P0.1 UI Theater Mode ✅
Hide all nonessential panels while keeping the galaxy/presentation visible.

Acceptance:
- dedicated visible button
- keyboard shortcut: `H`
- pressing `H` again restores panels
- a tiny always-visible restore/exit affordance remains
- presentation state and camera state do not change

### P0.2 Futures-studies introduction ✅
Add a short intro before step 1.

Must explain, in plain Persian:
- روند چیست؟
- کلان‌روند چیست؟
- چرا روندها در آینده‌پژوهی مهم‌اند؟
- روند با پیش‌بینی قطعی فرق دارد.
- این نقشه چگونه خوانده شود؟

Acceptance:
- 3–5 compact scenes/cards maximum
- source/discipline framing is clearly separated from report-derived claims
- learner can skip the intro

### P0.3 Mobile-first presentation shell ✅
Create a dedicated mobile layout rather than shrinking desktop UI.

Acceptance:
- presentation text becomes a bottom sheet
- safe-area aware
- minimum 44px touch targets
- no critical text behind browser chrome
- galaxy remains visible above the sheet
- landscape and portrait supported

### P0.4 Reduced motion / motion comfort ✅
Acceptance:
- respect `prefers-reduced-motion`
- manual reduced-motion toggle
- shorter linear transitions when enabled
- typewriter disabled in reduced-motion mode

### P0.5 Evidence / source drawer ✅
Acceptance:
- each macrotrend can expose source context
- source-derived narration is visibly labeled
- editorial teaching text is labeled separately
- no unsupported facts added

### P0.6 Presentation declutter ✅
During Guided Presentation:
- hide legend/info panels by default
- show only title, narrative, progress, essential controls
- optional “details” button reveals advanced UI

### P0.7 Learning recap ✅
After every 3–4 macrotrends, optionally show a 1-screen recap before continuing.

Acceptance:
- no quiz required
- 2–3 short takeaways
- skip button


## v0.7 QA backlog — next

### QA7.1 Real browser pass
Validate Chrome / Edge / Firefox:
- intro
- theater mode
- guided tour
- recap
- exit/restore
- PNG export

### QA7.2 Mobile portrait
Check:
- bottom sheet height
- touch targets
- galaxy visibility
- long Persian trend chips
- browser safe areas

### QA7.3 Mobile landscape
Ensure the bottom sheet does not dominate the scene and controls remain reachable.

### QA7.4 Motion comfort
Compare normal vs reduced-motion mode for dizziness, pacing and clarity.

### QA7.5 Teaching review
Review the four futures-studies intro cards for clarity and disciplinary accuracy.

### QA7.6 Seminary audience review
Check whether each macrotrend scene makes its relevance to حوزه understandable without adding unsupported claims.

### QA7.7 Evidence depth
Decide whether v0.8 should expose:
- source excerpt
- page/section
- footnote references
- validation status


## P0 — Content depth foundation

### P0.C1 Canonical multi-depth content model
Create one canonical record per macrotrend/trend with L0–L5 depth levels.

Acceptance:
- L0 label
- L1 one-line takeaway
- L2 executive brief
- L3 analytical brief
- L4 evidence pack
- L5 full report context
- provenance tag on every content block

### P0.C2 Static data packs
Move detailed content out of version HTML into plain JSON packs without introducing a build step.

Acceptance:
- `data/manifest.json`
- one macrotrend file per MT
- evidence references
- report chunk references
- lazy loading

### P0.C3 Progressive content drawer
One UI control lets users move:
`خلاصه → تحلیل → تفصیل → منبع`

Acceptance:
- stays on current node
- mobile-friendly
- source provenance visible
- no duplicate hand-maintained prose

## P1 — Decision support for حوزه leaders

### P1.D1 حوزه Impact Map
Filter/highlight macrotrends by حوزه domain:
- آموزش
- پژوهش
- تبلیغ
- فرهنگی/اجتماعی
- منابع انسانی
- حکمرانی
- فناوری/زیرساخت

### P1.D2 Priority Matrix
User-selectable axes:
- impact × urgency
- impact × preparedness gap
- uncertainty × controllability

Do not auto-rank political/organizational choices; display user/expert inputs transparently.

### P1.D3 Preparedness Gap
Store separate user/workshop assessments of current readiness.

### P1.D4 Compare Two
Side-by-side macrotrend comparison with evidence and unknowns.

### P1.D5 What-if Lens
Explore intersections of 2–4 selected macrotrends while separating source-backed links from hypotheses.

### P1.D6 Signal Watchlist
Attach observable indicators and monitoring sources to macrotrends.

### P1.D7 Decision Workshop Mode
Capture:
- concern
- opportunity
- existing response
- owner
- next review date

### P1.D8 Decision Brief Export
Generate concise executive brief from selected trends + user-entered decisions/actions.

## P1 — Engagement / visual value

### P1.V1 Contextual micro-animations
Use animation only to explain structure, cause attention shifts, or reveal a relationship.

### P1.V2 Interactive “why this matters” moments
Each macrotrend gets a short optional relevance card for حوزه.

### P1.V3 Story paths
Offer thematic guided paths:
- فناوری
- جامعه
- دانش و دین
- حکمرانی
- زیست و سلامت

### P1.V4 Cross-trend reveal
When a relation is selected, dim the galaxy and visually explain only the two connected clusters plus supporting evidence.

### P1.V5 Executive dashboard scene
A calm high-level overview of:
- high-impact areas
- evidence gaps
- monitored signals
- preparedness inputs

All assessment values must show their source/date/author.


## v0.8 scope triage — 2026-09-27

### Selected for implementation now

These items have high value relative to implementation cost and reinforce the modular architecture.

#### V8.1 Modular bundle split — P0 ✅
Refactor the new version into a no-build multi-file bundle:
- `index.html`
- `styles.css`
- canonical content data
- content service module
- decision tools module
- galaxy/presentation app module

Goal: stop feature growth from turning a single HTML into an unmaintainable monolith.

#### V8.2 Multi-depth Knowledge Drawer — P0 ✅
For the selected macrotrend, expose:
- L1 takeaway
- L2 executive explanation
- L3 source-derived detail/excerpt
- source/page/provenance metadata

Keep the content-service API ready for deeper L4/L5 content later.

#### V8.3 حوزه Impact Map — P0 ✅
Filter/highlight macrotrends by حوزه domain:
- آموزش
- پژوهش
- تبلیغ
- فرهنگی/اجتماعی
- منابع انسانی
- حکمرانی
- فناوری/زیرساخت

Initial mappings are explicitly tagged as `decision_analysis` / editorial analytical mapping, not report evidence.

#### V8.4 Compare Two — P0 ✅
Compare any two macrotrends side by side using:
- takeaway
- executive explanation
- حوزه domains
- trend count
- report page/section
- user-entered preparedness

#### V8.5 Preparedness input — P0 ✅
Allow users to record their own readiness assessment per macrotrend:
- نامشخص
- ضعیف
- نسبی
- قوی

Store separately in localStorage. Never write this value into source/research content.

### Deferred because effort/risk is high relative to immediate value

#### DEFER.1 What-if Lens
Reason:
- valuable conceptually, but current cross-impact relations are not research-complete
- a polished implementation risks presenting speculative causal synthesis as evidence

Revisit after cross-impact research QA.

#### DEFER.2 Signal Watchlist
Reason:
- becomes valuable only with curated indicators, update sources and ongoing maintenance
- static placeholders would add UI without real decision value

Revisit when monitoring data/source workflow exists.

#### DEFER.3 Full Decision Workshop Mode
Reason:
- meaningful version needs session structure, ownership, action records, export and ideally authenticated/shared storage
- a local-only form would add substantial complexity before the core decision lens is validated

Revisit after Preparedness and Compare are tested in real meetings.

#### DEFER.4 Decision Brief Export
Reason:
- depends on stable decision inputs and workshop data
- premature export would freeze an immature schema

Revisit after decision card schema stabilizes.

#### DEFER.5 Full L5 report ingestion
Reason:
- high migration and QA cost
- immediate UX value is lower than proving L1–L3 + provenance first

The content service will be designed to add L4/L5 without renderer changes.

#### DEFER.6 Thematic story paths
Reason:
- relatively easy but overlaps with existing guided presentation
- lower marginal value than content depth and decision support

Revisit after v0.8.

#### DEFER.7 Audio narration
Reason:
- production/accessibility/controls add complexity
- current visual/text presentation already supports learning

Revisit only if user testing shows clear need.


## v0.8 QA backlog — next

### QA8.1 Module load / direct-file test
Confirm the relative script/style bundle works:
- via direct local file open
- via normal HTTP hosting

### QA8.2 Knowledge depth review
Review L1/L2/L3 wording and provenance labels for all 14 macrotrends.

### QA8.3 حوزه domain mapping review
Have حوزه subject-matter reviewers revise the initial `decision_analysis` domain mappings.

### QA8.4 Preparedness workshop test
Use the four-state readiness control in a real or simulated management meeting.

### QA8.5 Compare usefulness
Check whether Compare Two surfaces enough information for an executive discussion without overwhelming the user.

### QA8.6 Mobile utility panels
Test Knowledge and Decision bottom sheets alongside Guided Presentation on portrait and landscape.

### QA8.7 Content service migration
If v0.8 validates well, move L3/L4/L5 into lazy-loaded static files while preserving the current `FSINFO_CONTENT` API.


## Content-source simplification — 2026-09-27

The book/report is the trusted and sufficient knowledge base for the current phase.

### Removed from active concern
- secondary evidence verification
- evidence-strength scoring
- citation QA beyond preserving the book's own citations
- external research enrichment
- independent source reconciliation

### Reframed
- “Evidence pack” → “Book references / source context”
- “Source verification” → “faithful extraction from the book”
- “Provenance” → simple origin labels only when useful:
  - book content
  - FSInfo summary
  - user assessment

### Backlog priority
Prioritize:
1. deeper book-content retrieval
2. better educational presentation
3. decision usefulness
4. interaction quality
5. mobile usability

Do not spend current implementation effort on re-validating the book.


## v0.9 Book Core — IMPLEMENTED, PENDING BROWSER QA

### V9.1 Full book section ingestion ✅
All 14 macrotrend sections are available from the trusted book.

### V9.2 Variable reading depth ✅
User can read:
- one sentence
- opening paragraph
- arbitrary percentage
- complete section

### V9.3 Full-book search ✅
Search within bundled macrotrend section content.

### V9.4 Simplified decision desk ✅
Only:
- user preparedness
- user notes
- book-based comparison

No evidence scoring or external research enrichment.

### V9.5 Modular package + ZIP ✅
Version files remain modular and a downloadable package is built separately.

## v0.9 QA backlog

### QA9.1 Browser runtime
Test direct local open and hosted HTTP on Chrome / Edge / Firefox.

### QA9.2 Long-text ergonomics
Improve:
- paragraph spacing
- scroll position memory
- jump to subtopic
- reading progress

### QA9.3 Mobile long-form reading
Validate the book drawer as a mobile bottom sheet for full section reading.

### QA9.4 Book subtopic indexing
Extract internal subheadings/subtrends from each section to create a chapter navigator.

### QA9.5 Decision meeting test
Evaluate whether Preparedness + Notes + Compare Two is sufficient for a real management discussion before adding more decision features.


## P0 — v0.10 Adaptive Orbit / Responsive Reading

### V10.1 Adaptive free-space viewport ✅
- measure active major panels
- compute galaxy-safe rectangle
- smoothly recenter projection into remaining space
- desktop: complementary side region
- mobile/tablet portrait: region above bottom sheet

### V10.2 Gesture + inertia controller ✅
- Pointer Events
- touch-action discipline
- angular velocity sampling
- friction decay
- low maximum momentum
- focus-centered orbit

### V10.3 Presentation attention phases ✅
- phase A: camera settles
- phase B: text completes
- phase C: child moons reveal rapidly
- phase D: takeaway / next

### V10.4 Swipeable presentation cards ✅
- horizontal swipe previous/next
- ignore swipes starting on controls/form elements
- preserve vertical panel scroll

### V10.5 Subtrend navigation depth ✅
- macro → trend breadcrumb
- trend-specific book context if source section supports it
- back-to-macro action
- orbit around parent macro

### V10.6 Contextual Book affordance ✅
Book icon/button in:
- Object Info
- Presentation
- selected subtrend state
- quick actions

### V10.7 Physical-key shortcuts ✅
Use `event.code`:
- KeyK → Book
- KeyD → Decision
- KeyH → Theater
- Slash → Book search

### V10.8 Font module ✅
- Vazirmatn
- Sahel
- responsive default
- user override persisted
- Iran-oriented Sahel CDN + fallback CDN
- no bundled/shared font files

### V10.9 Persian reading polish ✅
- justified long-form text
- improved paragraph spacing
- stable line-height
- mobile reading width

### V10.10 Feature discoverability ✅
- small contextual quick actions
- visible book icon standard
- no hidden shortcut-only critical feature

## v0.10 QA targets
- iPhone-like portrait 390×844
- Android portrait ~412×915
- tablet portrait ~768×1024
- tablet landscape ~1024×768
- desktop 1366×768
- desktop 1920×1080
- touch orbit
- mouse orbit
- presentation + Book panel transitions
- subtrend enter/back
- Persian keyboard shortcuts


## v0.10 QA / polish backlog

### QA10.1 Real iOS Safari touch test
Tune inertia/friction and pinch behavior on physical iPhone/iPad.

### QA10.2 Android Chrome touch test
Check pointer capture, bottom-sheet scrolling and accidental orbit gestures.

### QA10.3 Tablet responsive composition
Test portrait and landscape transitions between bottom-sheet and side-panel layouts.

### QA10.4 Subtrend extraction review
Review automatically extracted child-trend blocks.
Current automatic extraction does not invent missing text; some children fall back to the parent section.

### QA10.5 Font network fallback
Test ParsPack LibreFont route, jsDelivr fallback and system-font behavior when offline.

### QA10.6 Panel/galaxy spacing optics
Tune exact free-space margins after real screenshots on 390px, 768px, 1024px, 1366px and 1920px widths.


## P0 — v0.11 Reading & Presentation Polish

### V11.0 Split book payload / fix v0.10 data defect ✅
Priority: BLOCKER
- replace giant book-data payload with book index + 14 section files
- preserve content-service API
- package must contain real section data

### V11.1 Adaptive mobile Book reader ✅
Complexity: low
Value: high
- if rendered content is short: bottom sheet
- if long: full-screen mobile reader
- use content length/paragraph count, not only mode name
- preserve back/close controls and safe-area

### V11.2 Tap narration to finish ✅
Complexity: low
Value: high
- while typewriter is running, tap/click narration
- cancel typewriter
- reveal full text with fast fade
- do not advance scene

### V11.3 Click trend chip → trend narration ✅
Complexity: low-medium
Value: high
- only after macro narration is complete
- show trend breadcrumb
- type book-faithful trend context in the same narration area
- back button restores macro narration
- focus corresponding moon

### V11.4 Toggle: ارائه روندها ✅
Complexity: medium
Value: high
- checkbox appears after `حرکت کمتر`
- OFF: current macro-level presentation
- ON: macro narration → reveal trends → narrate trend 1..N → next macro
- user can interrupt/manual-next at any time
- unavailable exact trend context must not be invented

### V11.5 Subtle dolly-in ✅
Complexity: low
Value: medium-high
- active macrotrend slowly approaches during presentation
- bounded to a small distance range
- pause/interaction freezes it
- reduced-motion disables it

### V11.6 Lightweight planet material polish ✅
Complexity: low
Value: medium
- multi-stop radial shading
- subtle limb darkening
- tiny ring/banding/noise cue
- no image textures
- no per-frame expensive procedural noise

## P1 — v0.12 Radial Context Menu

### V12.1 Planet radial menu
Complexity: medium
Value: high
Trigger:
- desktop right-click
- touch long-press

Candidate actions:
- ارائه از اینجا
- باز کردن کتاب از اینجا
- تمرکز روی این خوشه
- بازگشت به کلان‌روند (when in subtrend)

Risks to solve before implementation:
- long-press vs orbit gesture conflict
- accidental activation while scrolling
- screen-edge positioning
- keyboard/accessibility fallback
- cancel semantics
- touch haptics are not assumed

Implement as a standalone `context-menu.js` module.


## v0.11 QA backlog

### QA11.1 Presentation state transitions
Test:
- macro typing → quick complete
- moon reveal
- manual trend chip
- auto trend sequence
- back to macro
- next macro

### QA11.2 Mobile Book thresholds
Tune the long-read threshold on:
- 390×844
- 412×915
- 768×1024

Current rule:
- full-screen if text > 1500 chars OR > 7 paragraphs
- otherwise bottom sheet

### QA11.3 Trend text fallback
Review any trend whose exact heading block is not found.
Do not invent replacement prose.

### QA11.4 Dolly comfort
Verify that the 36 → 32 camera distance shift is perceptible but not distracting.

### QA11.5 Material performance
Check frame rate on mid-range mobile devices.
If needed, reduce decorative band strokes before changing the rendering model.

### QA11.6 Radial menu design spike
Do not implement until gesture conflicts are explicitly tested.


## P0 — v0.12 Stable Quality Consolidation

### V12.0 v9 baseline reset ✅
- rebuild from v0.9 UX, not v0.11
- preserve v0.9 content volume and panel proportions
- add only selected stable improvements

### V12.1 Split authoritative book payload ✅
- book index + 14 section files
- preserve v0.9 content-depth API
- remove dependency on empty v0.9 book-data.js

### V12.2 Reversed mobile orbit ✅
- reuse smooth pointer/touch gesture controller
- reverse yaw/pitch response for touch input
- preserve bounded inertia
- mouse interaction remains conventional

### V12.3 Mobile full-viewport shell ✅
- viewport-fit=cover
- 100dvh / visualViewport-safe sizing
- safe-area padding
- visible user-triggered Fullscreen button
- graceful fallback if Fullscreen API is unavailable

### V12.4 Presentation sequencing ✅
- keep v0.9 narration/typewriter
- narration completion gates child-tag reveal
- tag cadence remains fast after text completion
- tap narration to finish with short fade
- no trend-by-trend auto narration in v0.12

### V12.5 Galaxy-safe presentation area ✅
- mobile presentation stays as bottom sheet
- galaxy projection uses complementary space above the sheet
- no focused macrotrend hidden behind panel

### V12.6 Contextual Book affordance ✅
- small consistent Book button in Object Info and Presentation
- opens current macrotrend/subtrend context
- no new permanent panel

### V12.7 Keyboard layout independence ✅
- KeyK / KeyD / KeyH / Slash via KeyboardEvent.code

### V12.8 Typography stability ✅
- keep long Persian text justified
- retain Vazirmatn-first fallback
- optional Sahel/Vazirmatn selector only if isolated from core interaction

## v0.12 QA gates
A version is not release-quality unless:
- all JS modules syntax-check
- every referenced asset exists
- all 14 section payloads are present and non-empty
- presentation state machine has no typewriter/tag overlap
- touch orbit uses reversed direction
- mobile sheet leaves a non-zero galaxy-safe region
- fullscreen action has fallback behavior
- previous versions remain unchanged


## v0.12 post-build QA backlog

### QA12.1 Physical iPhone test
Check:
- reversed orbit direction
- inertia decay
- Fullscreen entry/exit
- safe-area top/bottom
- presentation sheet + galaxy framing

### QA12.2 Android Chrome test
Check:
- pointer capture
- pinch zoom
- Fullscreen navigationUI behavior
- dynamic viewport when address bar collapses/expands

### QA12.3 Presentation timing feel
Confirm:
- typewriter retains v0.9 feel
- no trend tag/moon appears before narration completes
- 330ms tag cadence feels right
- quick-complete fade is discoverable but unobtrusive

### QA12.4 Tablet composition
Portrait + landscape:
- presentation
- Book Core
- Decision Desk
- galaxy safe region

### QA12.5 Font CDN behavior
Verify Sahel/Vazirmatn loading in Iran-facing network conditions; system fallback must remain usable.

### QA12.6 Keep scope frozen
Do not add radial menu or automatic trend narration until v0.12 is manually validated.


## P0 — v0.13 Quality Consolidation RC — IMPLEMENTED, PHYSICAL-DEVICE QA PENDING

### V13.1 Stable inheritance ✅
- v0.9 Book Core proportions/content-depth behavior preserved
- v0.12 split book payload reused without duplication
- no prior version file modified

### V13.2 Interaction contract hardening ✅
- reversed touch yaw/pitch preserved
- conventional mouse direction preserved
- inertia keeps originating pointer type independently of drag lifecycle

### V13.3 Presentation timing contract ✅
- camera/typewriter/post-text/tag/hold timings centralized
- `textComplete` remains the only reveal gate
- default values preserve the established v0.12 feel

### V13.4 Mobile viewport/fullscreen hardening ✅
- canvas follows `visualViewport` height
- resize/orientation/fullscreen events reset viewport geometry
- native + WebKit + pseudo-fullscreen state synchronized
- safe-area horizontal padding hardened

### V13.5 Scope freeze ✅
Deferred because benefit/risk is currently unfavorable:
- radial context menu
- automatic trend narration
- new 3D frameworks
- forced v0.11 long-read fullscreen behavior

## v0.13 QA gates
- [x] JavaScript parse checks
- [x] 14 section references retained
- [x] previous versions/public index untouched by implementation design
- [x] touch reversal static contract
- [x] narration reveal gate static contract
- [ ] physical iPhone Safari
- [ ] physical Android Chrome
- [ ] tablet portrait/landscape
- [ ] owner pacing/reading acceptance


## Structured release train — after-v0.9 reset

### P0 — v0.14 Coherent Core ✅ implementation
- [x] v0.9 tag cadence = 850ms
- [x] narration-complete gate before tag reveal
- [x] justified Persian presentation
- [x] optional one deeper level: macro → trend
- [x] exact book context coverage: 78/78 trends
- [x] complementary galaxy viewport
- [x] mobile single major sheet
- [x] Book/Decision pauses active presentation instead of stacking
- [x] horizontal presentation/intro swipe
- [x] previous versions untouched
- [x] new /t/14 snapshot contract

### v0.14 acceptance gates
- [ ] owner accepts Book proportions
- [ ] owner accepts presentation text/effect
- [ ] owner accepts 850ms tag rhythm
- [ ] owner accepts trend-depth sequence
- [ ] owner confirms focused galaxy is never hidden by major panels
- [ ] physical iPhone Safari
- [ ] Android Chrome
- [ ] tablet portrait/landscape
- [ ] desktop composition

### v0.15 — stabilization only
No new features. Fix/tune only issues found in v0.14 acceptance:
- orbit feel
- panel geometry
- swipe threshold
- text/tag pacing
- browser/fullscreen behavior

### v0.16 — context-depth refinement after acceptance
- trend-level Book navigation and breadcrumbs
- review all 78 trend excerpt lengths
- manual one-level trend navigation refinement

### Frozen
- radial context menu
- forced full-screen Book reader
- more presentation depths
- new decision dashboard
- planet-material/dolly polish
- heavy 3D framework/runtime change
