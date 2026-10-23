# Nothing shifts

The rule is not "never move". The browser's own definition of a bad shift (Layout Instability API, behind CLS) leaves out any shift within 500 ms of a tap, click or keypress: a change that follows the user's action is expected. Only the unasked move is the bug. Each case is a place where something moves without being asked.

## Cases

| # | Section | Mechanism | One variable | Source |
| --- | --- | --- | --- | --- |
| 0 | Scene (top) | Unexpected shift → wrong target | New mail arrives while the pointer is on a row: inserted on top at once, or held behind a "2 new" pill that takes no space until clicked | web.dev CLS (hadRecentInput, 500 ms; the cancel/confirm misclick example) |
| 1 | Bold that pushes | Width depends on weight | A selected filter set bold: neighbours pushed, or width reserved by a hidden bold copy | CSS-Tricks, "Bold on hover… without the layout shift" |
| 2 | The scroll bar you never see | Classic scroll bars take ~15px; Mac and phones overlay theirs, so developers miss it | A filtered list that stops overflowing: content jumps sideways, or `scrollbar-gutter: stable` | MDN scrollbar-gutter (no effect on overlay bars) |
| 3 | The browser holds your place | Scroll anchoring | An image above the reading point loads late: `overflow-anchor: none`, or the default | Chrome scroll anchoring; MDN overflow-anchor (Baseline Sep 2026) |
| 4 | The font that arrives late | Fallback and web font have different metrics | Swap from fallback to Geist: plain fallback, or one with `size-adjust` / ascent / descent overrides | web.dev css-size-adjust |
| 5 | Measure it | Layout Instability API | Each frame shows its own live shift score (Chromium only; hidden elsewhere) | web.dev CLS |

Linked, not repeated: tabular digits (Slider, Card), Button keeping its width while loading, Tabs not bolding.
