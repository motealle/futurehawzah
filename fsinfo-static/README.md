# FSInfo Static Rescue

This folder is the **no-build** delivery track for FSInfo.

## Goal

Provide a deploy-ready interactive infographic that can be uploaded directly to the web host without installing or running:

- Node.js
- npm
- Vite
- TypeScript
- React build tooling

## Current artifact

`index.html` is self-contained and includes:

- the 14 macrotrend clusters and extracted trends
- native SVG rendering
- pan / zoom
- draggable nodes
- lightweight node and relation editing
- localStorage save
- JSON import / export
- SVG export
- prototype cross-impact relations marked as research-incomplete

## Deployment target

Public URL:

`https://modiremelli.ir/fsinfo/`

For manual deployment, upload the final static rescue artifact as:

`/fsinfo/index.html`

The current folder name `fsinfo-static` is a repository-side staging location only. Do not expose it as the final public URL.

## Research limitation

The current cross-impact relations are incomplete/prototype-level. The Word report remains the content source of truth; evidence/statistics/citations still require source-backed extraction and QA.

## Safety of baseline

The existing merged React/Vite implementation under `modiremelli.ir/fsinfo/` must remain untouched while this static version is developed and verified.
