# FSInfo Static — Modular Architecture

Updated: 2026-09-26

## Version policy

Every experimental release is additive.

- Never replace or delete a previous version file.
- `index.html` remains the v0.1 baseline.
- New experiments are added as new files such as `index-v0.2-modular.html`.
- A version becomes the public `/fsinfo/index.html` only after explicit approval.

## Core rule

The graph core owns:
- source data
- node/edge state
- selection
- drag/pan/zoom
- rendering
- import/export
- local persistence

Feature modules may alter presentation and interaction, but should not directly rewrite graph data unless they are explicitly classified as an **action**.

## Feature types

### toggle
Purely reversible on/off behavior. Suitable for checkboxes.

Examples:
- semantic zoom
- focus mode
- cluster collapse/expand
- relation filter
- hover emphasis
- minimap
- floating info card

### action
Changes geometry/state. Not suitable for a simple persistent checkbox.

Examples:
- auto-layout
- collision relaxation
- normalize node sizes

Rule: actions must support snapshot -> preview/apply -> restore.

### strategy
Mutually exclusive rendering algorithms.

Examples:
- smart curved edges
- bundled edges
- direct/orthogonal edges

Rule: use a selector, not independent checkboxes.

### theme
Visual token packs.

Examples:
- light
- dark HUD
- future editorial theme

Rule: themes change CSS variables only and must not alter graph data.

## First four test modules in v0.2

1. Semantic Zoom
2. Focus Mode
3. Cluster Collapse / Expand
4. Relation Filter

All four are true reversible toggle modules.

## Theme system

Light and Dark themes use CSS variables. Dark mode is intended to be high-contrast, restrained and HUD-like rather than a literal copy of any external product.

## Icon system

Macrotrend data already has an optional `icon` field reserved.

The icon module implemented in v0.4:
- is independently switchable
- allows per-cluster replacement from a built-in vector icon library
- renders only on macro nodes
- never participates in layout correctness
- gracefully falls back to no icon

## Modules from the original 15 proposals

| Item | Modular form |
|---|---|
| Auto-layout | action; preview/apply/restore |
| Per-cluster layout | strategy/action |
| Semantic zoom | toggle |
| Focus mode | toggle |
| Collapse/expand | toggle |
| Lighting/glow | toggle or theme intensity |
| Smart curved edges | strategy |
| Edge bundling | strategy; conflicts with smart-edge strategy |
| Hover emphasis | toggle |
| Search | toggle/UI module |
| Minimap | toggle |
| Relation filter | toggle |
| Floating info card | toggle |
| Presentation mode | mode toggle |
| Premium visual theme | theme selector |

## Anti-chaos rules

1. No module-specific global variables outside the config namespace.
2. Every module gets one registry entry and one state owner.
3. Visual-only modules may not mutate nodes/edges.
4. Geometry-changing features must create a restorable snapshot.
5. Mutually exclusive rendering features are strategies, not checkboxes.
6. No module may depend on another silently; dependencies/conflicts must be declared.
7. A feature is removed if it cannot be explained by a small, reversible contract.
8. Keep the no-build requirement: plain HTML/CSS/JS/SVG only for the rescue track.


## Second reversible module batch — v0.3

5. Hover Intelligence — toggle
6. Search / Locate — UI toggle
7. Mini Map — toggle
8. Floating Info Card — toggle

These modules remain presentation/navigation-only and do not mutate graph geometry or research data.

Search may temporarily expand a collapsed cluster to reveal a selected result; the collapse state remains part of UI configuration, not graph data.


## Geometry action implemented in v0.4

The overlap fix is intentionally an **action**, not a checkbox.

Contract:
1. snapshot current geometry
2. build weighted radial targets from cluster density
3. run padded axis-aligned collision relaxation
4. preview result
5. user chooses Apply or Restore

The solver may mutate only node geometry (`x/y/w/h`). It must not change labels, relations, evidence, verification state or research data.

The default first-run geometry also passes through the same solver so a fresh v0.4 page starts from a non-overlapping layout.

## Infographic layer implemented in v0.4

`infographicLayers` is visual-only:
- macro orbit
- outer orbit
- cluster petals
- radial spokes
- core rings

It can be disabled without changing node or edge data.

## Icon architecture implemented in v0.4

`macroIcons` is visual-only. Each macro node stores an icon key; the renderer resolves that key against the built-in SVG icon library. Icon choice is editable in the node inspector and icon rendering can be disabled globally.


## Version sidecar contract

Each version has two sibling artifacts:
- executable HTML
- `.prompt.md` reproduction/continuation sidecar

The sidecar must document:
- version intent
- invariant behavior
- module boundaries
- source-of-truth rules
- known limitations
- safe continuation path

Do not create a future version without its sidecar.

## Presentation shell module

For v0.7+, presentation chrome is treated as a reversible UI module.

Responsibilities:
- panel visibility
- theater mode
- mobile bottom sheet
- fullscreen/de-clutter state
- progress/controls

It must not mutate:
- graph research data
- camera spatial identity
- node geometry
- evidence/verification data

Theater mode and reduced-motion are UI configuration, not graph state.


## Content service boundary

From the next content-heavy version onward, visualization code should not own long-form report text.

Introduce a content adapter:

```js
content.get(id, { depth })
content.getEvidence(id)
content.getSource(id, options)
content.search(query, options)
```

The renderer consumes content through this interface regardless of whether the backing store is:
- embedded JS
- static JSON
- later server/API

This protects the UI from data migration.

## Content origin model

Keep content origin simple.

Use only:
- `book_content` — content taken or closely derived from the trusted report
- `fsinfo_summary` — concise presentation/decision-oriented restatement created inside FSInfo
- `user_assessment` — values entered by users/workshops

Do not add external evidence/provenance complexity by default.

The report is assumed to be the authoritative evidence base for the current phase.

## Decision annotation boundary

Decision/workshop values are a separate state domain from research content.

Book content:
- source-controlled
- immutable at runtime
- treated as authoritative for FSInfo

Decision annotations:
- local/session JSON initially
- optional backend later
- never written back into book content


## v0.8 modular bundle boundary

v0.8 is the first version that intentionally stops growing the single-file monolith.

### Files
- `index-v0.8-decision-lens.html` — shell / DOM only
- `v0.8/styles.css` — presentation and module styles
- `v0.8/content-data.js` — canonical static research/content records
- `v0.8/content-service.js` — retrieval abstraction
- `v0.8/decision-tools.js` — decision UI + user assessment state
- `v0.8/app.js` — galaxy renderer, presentation and camera

### Dependency direction

```
content-data
   ↓
content-service
   ↓
decision-tools
   ↓
app / renderer integration
```

Renderer code must not own long-form content.

Decision tools may read research content but write only user assessment state.

### Current content depths
- L1 concise takeaway
- L2 executive explanation
- L3 report-derived detail
- SOURCE section/page/book context

L4/L5 remain behind the content-service contract and should not require renderer changes.

### Current decision state
Preparedness is stored under:
`fsinfo-v0.8-preparedness`

It is a user assessment and must never be written back into `content-data.js`.


## Evidence simplification rule

FSInfo is not an evidence-auditing product in the current phase.

Do not introduce:
- evidence-strength scores
- source verification workflows
- secondary-source checking
- citation confidence systems
- external research joins

unless explicitly requested in a later phase.

The architecture should optimize for faithful access to the book at multiple depths, not for re-validating the book.


## v0.9 Book Core architecture

v0.9 simplifies the content model around the trusted book.

### Module boundaries

```
book-data.js
    ↓
content-service.js
    ↓
book-tools.js
    ↓
app.js integration
```

### Book data
Contains:
- 14 macrotrend taxonomy records
- trend labels
- complete extracted section text
- opening paragraph
- first sentence
- report section/page hints

### Content service
Exposes the same book content at variable depth:
- sentence
- opening
- percentage
- full

The renderer never decides how to slice book text.

### Book tools
Own:
- book drawer
- search
- depth controls
- user preparedness
- user notes
- book-based comparison

### State boundary

Book content:
- immutable
- trusted
- source-controlled

User decision state:
- localStorage
- separate from book
- never written into book-data

### No evidence layer

Do not add secondary verification, evidence scores or external research dependencies to v0.9.


## v0.10 interaction architecture

The responsive interaction layer is intentionally split from rendering.

Dependency shape:

```
book-data
   ↓
content-service
   ↓
book-tools
       
viewport-controller → app renderer
gesture-controller  → app camera
font-module         → DOM + canvas typography
```

### Viewport controller
Owns the screen-space rectangle available to the galaxy.
It may inspect panel geometry but may not mutate camera or content state.

### Gesture controller
Owns pointer/touch gesture recognition:
- orbit drag
- pinch zoom
- bounded inertia
- horizontal panel swipe

It emits interaction deltas; it does not own the galaxy model.

### Context rule
Selection depth:
- depth 1 = macrotrend
- depth 2 = subtrend

At depth 2:
- content selection is the child trend
- orbit pivot remains the parent macrotrend
- back action returns to depth 1

### Typography module
Font choice is presentation state only.
It must be selectable independently of content and graph state.

### Presentation attention rule
Narration and child-node reveal are separate phases.
Child nodes may not progressively appear while the main narration is still being typed.


## v0.11 split-book architecture

v0.11 removes the giant book payload.

```
book-index.js
sections/MT01.js ... MT14.js
        ↓
content-service.js
        ↓
book-tools.js / app.js
```

This avoids large single-file transport failures and keeps section text independently replaceable.

### Presentation state rule

Presentation now has two reading depths:
- macro narration
- trend narration

Trend narration reuses the same panel instead of creating a second competing panel.

### Mobile Book reader rule

Book layout is content-length aware:
- short content → bottom sheet
- long content → full-screen reading mode

This is a view decision only and does not alter content state.

### Planet material rule

Planet material is delegated to `planet-material.js`.
It may change visual shading only; it may not alter graph geometry or node semantics.


## v0.12 stable-core architecture

v0.12 intentionally reduces state complexity.

```
book-index + 14 sections
        ↓
content-service
        ↓
book-tools
       
viewport-controller → v0.9-derived renderer
gesture-controller  → camera
shell-controller    → mobile viewport/fullscreen
font-module         → typography
```

### Consolidation rule
When later versions conflict with the clarity/stability of v0.9, prefer the v0.9 interaction model and re-introduce only isolated improvements.

### Presentation gate
`textComplete === true` is the single gate for starting child trend reveal.
This prevents simultaneous reading and visual enumeration.

### Gesture rule
Touch and mouse directions are allowed to differ:
- touch follows the reversed direction requested by user testing
- mouse retains conventional desktop behavior

### Fullscreen rule
Browser fullscreen must be user-triggered.
The shell controller uses the Fullscreen API where available and a visual fallback otherwise.

### Book rule
v0.12 keeps the v0.9 reading-depth experience even though the underlying data transport is split into 14 section files.


## v0.13 quality-consolidation architecture

v0.13 deliberately versions only the volatile presentation/interaction edge:

```
immutable v0.12 book payload
  ├─ book-index + 14 section files
  ├─ content-service
  ├─ book-tools
  └─ font-module
          ↓
v0.13 interaction surface
  ├─ viewport-controller
  ├─ gesture-controller
  ├─ shell-controller
  ├─ app renderer/presentation
  └─ styles
```

### Why shared immutable content
Copying ~multi-megabyte book payloads per UX iteration has no user value and increases drift risk. A later version may depend on an earlier version's content payload only when that payload is explicitly immutable and the dependency is documented in the sidecar.

### Timing rule
Presentation pacing values are configuration constants, while the state machine remains unchanged. Tuning speed must not introduce a second reveal path.

### Mobile shell rule
Fullscreen is still user-triggered. Dynamic viewport handling may improve visible-screen use but must never claim to hide browser chrome without a permitted user gesture.

### Scope rule
Stabilization releases may remove planned features from scope when they increase gesture/state complexity without solving a validated user problem.
