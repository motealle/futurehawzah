# FSInfo v0.8 Decision Lens — Reproduction / Continuation Prompt

## Artifact
`index-v0.8-decision-lens.html`

Assets:
- `v0.8/styles.css`
- `v0.8/content-data.js`
- `v0.8/content-service.js`
- `v0.8/decision-tools.js`
- `v0.8/app.js`

## Why this version exists

v0.8 is the first deliberate move away from a growing single-file monolith.
It keeps the no-build static requirement while separating:
- presentation/rendering
- canonical content
- content retrieval
- decision-support UI/state

Do not collapse these files back into one unless explicitly requested.

## Product modes inherited
- Explore
- Futures-studies intro
- Guided Presentation
- Theater / reduced motion
- mobile presentation shell

## New modules

### Knowledge Depth
Shortcut: `K`

For selected macrotrend/trend:
- L1: one-line takeaway
- L2: executive explanation
- L3: source-derived detail excerpt
- Source: section/page/provenance metadata

Use `FSINFO_CONTENT` only. Rendering code must not read long-form data directly.

### Decision Lens
Shortcut: `D`

Includes:
- حوزه Impact Map
- Preparedness input
- Compare Two

Initial impact-domain mappings are `decision_analysis`, not report evidence.

Preparedness is `user_assessment`, stored separately in localStorage.

## Content API contract

```js
FSINFO_CONTENT.get(id,{depth:"L2"})
FSINFO_CONTENT.getRecord(id)
FSINFO_CONTENT.getEvidence(id)
FSINFO_CONTENT.getDomains(id)
FSINFO_CONTENT.search(query)
```

Future L4/L5 content must be added behind this API without changing renderer contracts.

## Content authority

The book/report is the trusted authoritative source for this phase.

Do not:
- independently verify the book
- add evidence-strength scoring
- add external research enrichment by default
- create citation QA workflows

Keep only three practical content origins:
- book_content
- fsinfo_summary
- user_assessment

## Decision-support rule

The product structures discussion. It must not decide or auto-rank organizational choices.

Preparedness/priority judgments belong to the user/workshop unless explicitly sourced.

## Deferred features

Do not add yet unless research/usage justifies them:
- What-if Lens
- live Signal Watchlist
- full Workshop Mode
- Decision Brief export
- full L5 report ingestion
- thematic tours
- audio narration

## Continuation

For v0.9:
- preserve all v0.8 files
- create a new version + prompt sidecar
- prefer extending modules over adding app-level globals
- validate v0.8 in real desktop/mobile browsers first
- strongest next candidates: deeper book-content retrieval, source chunks, simpler domain mapping, and real meeting usability.
