# FSInfo — Progress

Updated: 2026-09-23

## Overall: 56%

| Stream | Progress | Status |
|---|---:|---|
| Source conversion / taxonomy | 35% | Markdown + headings extracted; relation/evidence QA remains the main research gap |
| Visual architecture | 67% | future/editorial direction, RTL typography, node/edge language and v0.2 responsive pass are in place |
| Interactive editor | 70% | node editor, relation editor, reconnect, local save, JSON import/export, SVG/PNG export, local snapshots and ELK work |
| Persistence / collaboration | 15% | local revision snapshots exist; server persistence, publish flow and multi-user editing remain |
| Build / delivery | 85% | v0.2 package rebuilt from latest source head; local typecheck/build/hash/HTTP/390/1440 verification passed |

## Current milestone
**M1.5 — Editable graph + relation evidence + local versioning**

### Verified package
- runtime/source commit: `44078a6f8ab0d08e56ae0ba9f23134d5057f695f`
- `npm ci`: passed after restoring Windows `ComSpec`
- TypeScript check: passed
- Vite production build: passed
- production files: 26
- staging dist → `02-built-upload` SHA-256 comparison: 0 differences
- HTTP index/JS/CSS: 200
- 390×844: document width = viewport width, no horizontal overflow
- 1440×1000: document width = viewport width, no horizontal overflow
- production bundle contains relation editor/evidence state, JSON import/export, SVG export and local revision snapshots
- production sourcemaps remain disabled

## Delivery
- editable source: `C:\tp\rc\FSInfo\01-unbuilt`
- upload-ready static output: `C:\tp\rc\FSInfo\02-built-upload`
- QA evidence: `01-unbuilt\docs\qa-evidence`
- upload only the **contents** of `02-built-upload` to the host directory serving `/fsinfo/`

## Next
1. Complete source-backed cross-impact relation extraction and evidence metadata.
2. Commit source conversion artifacts into the articles repository branch.
3. Add manual bend-point/routing controls and richer edge bundling.
4. Implement server persistence, named versions and publish-selected-version flow.
5. Add realtime multi-user editing/presence/conflict handling.
6. Complete tablet/4K export validation.
7. Perform public host deployment and endpoint verification.

## CI note
The local package is verified. Repository CI has been moved to the established `sites` self-hosted runner labels; runner-session reconciliation is still pending before a fresh runner-backed build can be claimed.


## Live deployment recovery
- Public diagnosis: `https://modiremelli.ir/fsinfo/` returned HTTP 404 after the manual upload.
- FSInfo is now integrated into the main `modiremelli.ir` build output at `dist/fsinfo/`.
- Production deploy workflow was switched to `ubuntu-latest` with explicit `lftp` installation so the release no longer depends on the unavailable self-hosted runner.
- Public verification for `/fsinfo/` is part of the deployment gate.
