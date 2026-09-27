# FSInfo — Decision Support Design

Updated: 2026-09-27

## Product shift

FSInfo should support three different jobs without mixing them:

1. **Learn** — understand trends and macrotrends.
2. **Explore** — inspect the system and relationships.
3. **Decide** — help حوزه leaders discuss priorities, readiness and options.

The “Decide” mode must not pretend to make decisions. It should structure attention, implications and user judgment using the trusted book as its knowledge base.

## Decision lens per macrotrend

Each macrotrend can expose a decision card with:

- why this matters for حوزه
- affected domains
- likely time horizon
- uncertainty
- potential impact
- degree of حوزه influence / controllability
- current preparedness
- early signals to watch
- dependencies / linked macrotrends
- risks of inaction
- possible response families

## Recommended scales

Avoid fake precision.

Use 3–5 qualitative bands:
- horizon: now / 3–5 years / 5–10 years / 10+ years
- impact: limited / material / structural
- uncertainty: low / medium / high
- influence: low / medium / high
- preparedness: weak / partial / strong

Every user-entered evaluative value should remain visibly separate from the book content.

For the current phase, the book itself is the trusted source and does not require secondary validation.

## High-value interactions

### 1. Priority Matrix
Plot selected macrotrends by:
- impact
- urgency

Optional alternate axes:
- impact × preparedness gap
- uncertainty × controllability

User chooses axes; system does not declare a winner.

### 2. حوزه Impact Map
Select a حوزه domain:
- آموزش
- پژوهش
- تبلیغ
- فرهنگی/اجتماعی
- منابع انسانی
- حکمرانی
- فناوری/زیرساخت

Then highlight macrotrends that touch that domain.

### 3. What-if Lens
User selects 2–4 macrotrends and asks:
“What if these accelerate together?”

System surfaces:
- intersections already supported by the book
- known linked subtrends
- clearly labeled user hypotheses where applicable

Do not invent unsupported causal claims.

### 4. Preparedness Gap
For each macrotrend:
- importance
- current readiness
- gap

Readiness values should be entered by authorized users or workshop participants, not invented by the system.

### 5. Signal Watchlist
Each macrotrend can have:
- observable indicator
- source
- update cadence
- threshold / change to notice

This turns a static map into a monitoring framework.

### 6. Decision Workshop Mode
Facilitator selects macrotrends and participants record:
- concern
- opportunity
- current action
- owner
- next review date

This is a workspace, not an automated recommendation engine.

### 7. Compare Two
Side-by-side compare:
- trend definition
- implications
- relevant book content
- horizon
- حوزه domains
- current initiatives
- unknowns

### 8. Decision Brief Export
Generate a printable / shareable brief for selected macrotrends:
- 1-page executive summary
- implications
- relevant book content
- open questions
- action items entered by the user

## Decision-content clarity

Keep only the distinctions that are operationally useful:
- book/report content
- FSInfo summary
- user/workshop assessment

The product should not burden users with evidence-strength or source-validation mechanics in the current phase.

## Suggested mode architecture

```
CONTENT CORE
  ↓
Learn Mode
Explore Mode
Decide Mode
  ├─ Priority Matrix
  ├─ Impact Map
  ├─ Compare
  ├─ What-if Lens
  ├─ Preparedness Gap
  ├─ Signal Watchlist
  └─ Decision Brief
```

All decision tools read from shared content records and store user assessments separately.

## Storage boundary

Research data:
- immutable / source-controlled

Decision annotations:
- separate local JSON/localStorage initially
- later optional authenticated backend

Never write workshop judgments back into source content.
