# FSInfo v0.4 Infographic — Reproduction / Continuation Prompt

## Artifact
`index-v0.4-infographic.html`

## Goal
Create the strongest 2D information-design version: readable, collision-free, editable, infographic-like.

## Preserve
All earlier files remain unchanged.

## Required capabilities
- larger internal canvas
- weighted radial layout based on cluster density
- padded collision solver
- first-load non-overlapping geometry
- Layout Engine: Preview / Apply / Restore
- overlap counter
- boundary-aware edge anchors
- infographic background layers: orbit, petals, spokes, core rings
- vector macrotrend icon library
- per-macro icon selector
- global icon toggle
- macrotrend IDs in visual hierarchy

## Architecture
Auto-layout is an ACTION, not a checkbox.
Contract:
snapshot → build targets → collision relaxation → preview → apply or restore.

Icon and infographic layers are visual-only modules and may not affect graph correctness.

## Visual standard
Prioritize optical spacing, hierarchy, typography, edge clarity, and print-like infographic composition over feature count.

## Constraints
Single HTML, no build, Persian RTL, source-grounded content.
