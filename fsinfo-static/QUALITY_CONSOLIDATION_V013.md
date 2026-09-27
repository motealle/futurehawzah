# FSInfo v0.13 — Quality Consolidation Plan

Updated: 2026-09-27

## Decision frame
Goal: maximize practical UX gain while minimizing regression risk to the v0.9-derived stable path.

| Candidate action | User value | Complexity | Regression risk | Decision |
|---|---|---|---|---|
| Preserve v0.9 Book Core proportions/content depth | Very high | Low | Low | Implement |
| Preserve/reuse split v0.12 authoritative book payload | Very high | Low | Very low | Implement |
| Reverse touch orbit while keeping mouse conventional | Very high | Low | Low | Implement/preserve |
| Keep restrained inertia and make pointer type explicit | High | Low | Low | Implement |
| Gate tags/moons on completed narration | Very high | Low | Low | Implement/preserve |
| Centralize presentation timing constants | High | Low | Very low | Implement |
| Harden dynamic viewport on browser chrome/orientation/fullscreen changes | High | Low–medium | Low | Implement |
| Harden native/WebKit/pseudo fullscreen state sync | High | Low | Low | Implement |
| Restore v0.11 full-screen long Book reader | Low for current feedback | Low–medium | Medium | Reject for v0.13; conflicts with v0.9 preference |
| Automatic trend-by-trend narration | Mixed | Medium | High cognitive/state risk | Defer |
| Radial long-press context menu | Medium | Medium | High gesture-conflict risk | Defer |
| New 3D framework / CDN runtime dependency | Low marginal value | High | High | Reject |
| Rewrite/copy book payload into another version | No UX gain | High repo/data cost | Medium | Reject |
| Change public `index.html` | High blast radius | Low | High | Do not do without explicit approval |

## Implemented scope
v0.13 versions only the interaction/presentation surface and reuses immutable content modules. This keeps the blast radius small and makes rollback trivial: open v0.12.

## QA gates
Static gates:
- all v0.13 JavaScript parses successfully
- touch sign contract remains negative for both yaw/pitch
- `textComplete` gate exists before reveal calculation
- timing constants replace scattered reveal/typewriter magic values
- fullscreen has native + WebKit + pseudo fallback paths
- viewport resets on resize/orientation/fullscreen
- entry references all 14 non-empty v0.12 section payloads
- public `index.html` and all v0.1–v0.12 files remain unchanged

Manual gates still required before public promotion:
- iPhone Safari physical touch feel
- Android Chrome physical touch/pinch/fullscreen
- tablet portrait/landscape composition
- presentation pacing with Persian reading
- Book Core long-reading comfort

## Rollback
No data migration is introduced. v0.12 stays intact and is the immediate rollback target.
