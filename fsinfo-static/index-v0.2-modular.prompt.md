# FSInfo v0.2 Modular — Reproduction / Continuation Prompt

## Artifact
`index-v0.2-modular.html`

## Goal
Reproduce a no-build, single-file modular infographic derived from v0.1 without replacing it.

## Core architecture
Graph data and UI configuration must remain separate.

Feature registry exposes reversible toggles:
1. Semantic Zoom
2. Focus Mode
3. Cluster Collapse / Expand
4. Relation Filter

Theme is a separate subsystem:
- Light
- Dark HUD / editorial sci-fi

## Rules
- Visual-only modules cannot mutate research data.
- UI state is persisted separately from graph state.
- Preserve v0.1.
- RTL / Vazirmatn-first.
- No external dependency required for runtime.
- Word report is source of truth; do not invent evidence.

## Design language
Clean HUD, high contrast, professional violet/cyan accents, restrained sci-fi aesthetic, not a literal copy of any external product.

## Continuation
Add future features through the module registry. Geometry-changing features must not be simple checkboxes; treat them as actions with snapshot / preview / apply / restore.
