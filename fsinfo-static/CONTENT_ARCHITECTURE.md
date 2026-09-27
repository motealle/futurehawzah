# FSInfo — Content Depth Architecture

Updated: 2026-09-27

## Goal

Make the report content callable at multiple depths without duplicating or corrupting the source.

The interface should be able to answer the same user intent at different reading depths:
- glance
- executive summary
- analytical summary
- detailed report text
- book footnotes/references when useful
- full book/report context

## Core rule

One canonical content record per macrotrend / trend. UI requests a **depth**, not a different rewritten dataset.

Recommended depth model:

### L0 — Label
- node title
- ID
- icon / color
- 3–8 words

### L1 — One-line takeaway
- 1 sentence
- 15–30 words
- presentation / tooltip

### L2 — Executive brief
- 80–150 words
- what is changing?
- why it matters?
- relevance to حوزه
- uncertainty note

### L3 — Analytical brief
- 300–700 words
- drivers
- manifestations
- implications
- subtrends
- risks / opportunities
- source-backed claims

### L4 — Book references
- statistics already present in the book
- the book's citations / footnotes
- report page / section
- source links already cited by the book when available
- no secondary verification workflow

### L5 — Full report context
- complete section text or large source-context chunks
- used only on explicit request
- preserves original report organization and terminology

## Suggested static no-build file model

The project does not need a server or build step.

Suggested structure:

```
fsinfo/
  index-v0.x.html
  data/
    manifest.json
    core.json
    macro/
      MT01.json
      MT02.json
      ...
      MT14.json
    references/
      MT01-references.json
      ...
    source/
      report-index.json
      report-chunks/
        section-001.json
        ...
```

All are plain JSON files uploaded directly to the host.

## Content record schema

Example:

```json
{
  "id": "MT03",
  "title": "هوش مصنوعی و داده‌محوری",
  "source_section": 3,
  "source_page_hint": 51,
  "summary": {
    "L1": "...",
    "L2": "...",
    "L3": "..."
  },
  "decision": {
    "why_it_matters": "...",
    "horizon": "mid",
    "uncertainty": "medium",
    "controllability": "medium",
    "relevance_domains": ["آموزش","پژوهش","تبلیغ","حکمرانی"]
  },
  "trends": [...],
  "reference_refs": ["R-MT03-01"],
  "source_chunk_refs": ["SRC-03-01","SRC-03-02"]
}
```

## Runtime API contract

UI code should call:

```js
content.get(id, { depth: "L2" })
content.getReferences(id)
content.getSource(id, { chunk: 0 })
content.search(query, { depth: "L3" })
```

The renderer should never know where the content is stored.

## Progressive disclosure UX

A single content drawer should expose:
- خلاصه
- تحلیل
- تفصیل
- متن/ارجاعات کتاب

The user can move deeper without leaving the current node.

Recommended control:
- slider / segmented control: `خلاصه ← تحلیل ← تفصیل ← منبع`
- remember last depth per user session
- mobile defaults to L1/L2
- desktop decision mode defaults to L2/L3

## Content origin

Use a deliberately small origin model:
- `book_content`
- `fsinfo_summary`
- `user_assessment`

The report is trusted as the authoritative source. FSInfo does not re-verify it in the current phase.

## Search / retrieval

For no-build static release:
- client-side index over titles, summaries and keywords
- lazy-load full section/reference JSON only when requested

Later, if a server/search backend is added, the same content schema should remain.

## Authoring rule

Do not hand-maintain the same paragraph in multiple HTML versions.
Content belongs in data records; versions should consume it.

This is the main migration needed before content depth grows significantly.


## Trust policy

The report/book is the evidence base.

FSInfo's responsibility is:
- faithful extraction
- clear summarization
- multi-depth retrieval
- preserving the report's own citations where useful

FSInfo's responsibility is **not**:
- independent verification
- evidence scoring
- citation auditing
- external source reconciliation

Those can be optional future modules if explicitly requested later.
