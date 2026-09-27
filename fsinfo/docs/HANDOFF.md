# FSInfo — Handoff

## Source
The Word document is the source of truth. The supplied infographic image is a visual reference only.

## Stack
- React + TypeScript + Vite
- React Flow / XYFlow for editable graph surface
- ELK.js for auto layout
- D3 reserved for advanced path/bundling layers
- GSAP for motion language
- html-to-image for PNG/SVG export

## Implemented in prototype v0.2
- 14 macrotrends and extracted trend headings
- radial default placement
- node dragging and node property inspector
- relation inspector for label/color/width/type/animation/evidence/verified state
- animated dashed/glow cross-impact edges
- edge reconnect support
- browser localStorage quick-save
- local revision history for latest 10 snapshots
- JSON import and export
- PNG export
- SVG export
- ELK auto arrange

## Not yet complete
- source-backed full cross-impact graph
- server-side save and publish-selected-version flow
- concurrent editing / presence
- manual edge bend-point editing
- research QA of statistics and inferred relations

## Delivery folders on workstation
- unbuilt/source: `C:\tp\rc\FSInfo\01-unbuilt`
- built/upload-ready: `C:\tp\rc\FSInfo\02-built-upload`

Upload **only the contents of 02-built-upload** into the host directory mapped to `modiremelli.ir/fsinfo/`.
