# FSInfo v0.10 Adaptive Orbit — Reproduction / Continuation Prompt

## Artifact
`index-v0.10-adaptive-orbit.html`

Assets:
- `v0.10/styles.css`
- `v0.10/book-data.js`
- `v0.10/content-service.js`
- `v0.10/viewport-controller.js`
- `v0.10/gesture-controller.js`
- `v0.10/font-module.js`
- `v0.10/book-tools.js`
- `v0.10/app.js`

## Product intent

This version fixes the interaction/layout problems of the galaxy on mobile, tablet and desktop while staying faithful to the book.

## Non-negotiable UX contracts

### Adaptive free-space rendering
The galaxy must render in the visible area that remains after a major panel opens.
Do not let presentation/book/decision panels cover the focused cluster.

### Orbit
Pointer/touch drag orbits smoothly around current focus.
Release has restrained inertia with fast friction decay.
Selecting a subtrend keeps the parent macrotrend as orbit pivot.

### Presentation attention order
1. camera settles
2. text completes
3. child moons reveal quickly one by one
4. takeaway / next

Never reveal child moons while the main narration is still typing.

### Subtrend depth
A trend node is depth 2.
Show breadcrumb and a back-to-macro action.
Book panel should show the trend-related passage extracted from the book when a matching block exists.

### Book context
K is contextual.
It must open the Book panel for the current selected node/presentation macrotrend.
Book buttons also appear in Object Info and Presentation.

### Shortcuts
Use `KeyboardEvent.code`:
- KeyK
- KeyD
- KeyH
- Slash

This makes shortcuts work with Persian keyboard layout.

### Fonts
User can choose:
- Vazirmatn
- Sahel

Default:
- mobile: Sahel
- desktop/tablet: Vazirmatn

Sahel is loaded from LibreFont/ParsPack Iran-oriented CDN with jsDelivr fallback.
Vazirmatn uses its public CDN.
No font binaries are bundled.

### Mobile
Presentation/book/decision are bottom sheets.
Horizontal swipe changes presentation/intro cards.
Vertical scrolling must continue to work.

## Content authority

The book/report is authoritative. Subtrend explanations must come from the relevant book section when extractable. Do not invent missing subtrend prose.

## Architecture

Keep modules separate:
- viewport controller
- gesture controller
- font module
- content service
- book tools
- renderer/presentation app

Do not collapse back into a monolithic HTML file.

## Version discipline

Preserve v0.1–v0.9.
Do not change public `/fsinfo/index.html` without explicit approval.
