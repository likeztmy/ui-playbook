// The Range control's choices, in days. Every chart shows the last `span` days to 2 Nov.
export const SPANS = [7, 14, 30] as const;
export type Span = (typeof SPANS)[number];

/** The date of day i of the last `span` days. */
export const dayLabel = (i: number, span: number) =>
  new Date(2026, 10, 2 - (span - 1 - i)).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
