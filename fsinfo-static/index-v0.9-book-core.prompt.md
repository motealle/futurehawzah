# FSInfo v0.9 Book Core — Reproduction / Continuation Prompt

## Artifact
- `index-v0.9-book-core.html`
- assets under `v0.9/`

## Absolute source rule
The book/report «نقشه کلان‌روندهای آینده حوزه‌های علمیه» is the authoritative source.

Do not independently fact-check it in this phase.
Do not enrich with external research by default.
Do not replace the report's framing with generic model knowledge.
Preserve terminology, emphasis, sequence and intellectual spirit.

## Product goal
Make the book navigable from a single sentence to the full text of each macrotrend section while keeping the interactive galaxy.

## Modules
- `book-data.js`: extracted book sections + graph taxonomy
- `content-service.js`: depth/search API
- `book-tools.js`: book reader + decision desk
- `app.js`: galaxy, presentation, camera
- `styles.css`: visual shell

## Book depth
All levels are views of the same book text:
- one sentence
- opening paragraph
- arbitrary percentage of section
- full section

No external evidence layer is required.

## Decision Desk
May contain only:
- user preparedness
- user notes
- comparison of book sections

User assessment must stay separate from book content.

## Preserve
- Explore
- guided presentation
- theater mode
- reduced motion
- mobile shell
- previous versions

## Continuation
Future versions should deepen book retrieval, navigation and decision usability before adding external research, evidence scoring or complex workflow systems.
