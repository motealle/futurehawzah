# FSInfo — Build & Deploy

## Local delivery target

The packaging script creates exactly these two deliverables under:

`C:\tp\rc\FSInfo\`

- `01-unbuilt\` — editable project source.
- `02-built-upload\` — production static output.

## Which folder goes to the host?

Upload **the contents of `02-built-upload\`** to the web-server directory mapped to:

`https://modiremelli.ir/fsinfo/`

Do **not** upload `01-unbuilt`, `node_modules`, repository metadata, or development files as public content.

## Build command

From `modiremelli.ir\fsinfo`:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\package-local.ps1
```

The script performs:
1. `npm install`
2. TypeScript check
3. Vite production build
4. clean copy of source into `01-unbuilt`
5. copy of `dist` into `02-built-upload`

## Current limitation

Server-side persistence and realtime multi-user editing are planned P1 work. The current prototype persists editor changes locally in the browser and can export layout JSON.
