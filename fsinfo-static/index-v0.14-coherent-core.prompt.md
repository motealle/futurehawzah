# FSInfo v0.14 Coherent Core — Continuation Contract

## Entry
`index-v0.14-coherent-core.html`

## Scope
This release implements only the owner-confirmed core after-v0.9 requests.

- v0.9 trend tag cadence: 850ms
- tag reveal starts only after narration completes
- justified Persian presentation copy
- optional one-level trend presentation: macro → trends
- exact book-derived narration for all 78 trends
- galaxy uses complementary free viewport around major panels
- mobile shows one major bottom sheet at a time
- horizontal swipe for presentation/intro
- Book/Decision pauses and replaces Presentation instead of stacking over it

## Golden baseline
v0.9 is the UX Golden Master for Book proportions, narration amount/typewriter feel, visual hierarchy and low state complexity.

## Timing
- camera settle 850ms
- typewriter 2 chars / 24ms
- post narration pause 320ms
- tag cadence 850ms
- post tags hold 3800ms
- trend narration hold 2200ms

## Immutable dependency
Use v0.12 book-index + 14 section payloads + font module. Do not copy/rewrite the book payload.

## Non-goals
No radial menu, forced full-screen long Book reader, planet material/dolly polish, new decision dashboard, extra presentation depth or heavy runtime.

## Release gate
After owner testing this version receives fixes only. Any new feature becomes a new numbered version.
