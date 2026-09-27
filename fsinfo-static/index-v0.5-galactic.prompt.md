# FSInfo v0.5 Galactic — Reproduction / Continuation Prompt

## Artifact
`index-v0.5-galactic.html`

## Goal
Reproduce the offline single-file 3D “galaxy” exploration version of FSInfo.

## Critical technical choice
Do NOT use Three.js, CDN, ES modules, npm, or a build step.
Use the custom Canvas 2D pseudo-3D projection engine so the HTML can run directly from disk.

## Scene model
- central luminous core: “حوزه آینده”
- 14 macrotrends as orbital galaxy clusters
- 78 trend nodes distributed around their macrotrend
- stars and nebula layers
- hierarchy links
- prototype cross-impact links
- depth-aware projection and scale
- screen-space label deconfliction
- canvas-drawn macrotrend symbols

## Interaction
- drag rotates
- wheel zooms
- hover shows info
- click focuses
- double-click empty area returns overview
- toggles for labels, edges, cross-links, stars, nebulae, icons, rotation
- PNG export

## Research constraint
Cross-impact links are prototype/non-final unless source-backed. Never imply research validation that does not exist.

## Continuation
Preserve the spatial identity of each macrotrend. New presentation or teaching features should layer over Explore mode rather than replace it.
