# How waiting feels

The obvious rule is "show a spinner while it loads". The page teaches what that misses: a wait is judged by how it feels, and how it feels can be changed without making anything faster, sometimes by showing less.

## Cases

| # | Section | Mechanism | One variable | Source (verified) |
| --- | --- | --- | --- | --- |
| 0 | Scene | A spinner shown for a fast request flashes, and the flash reads as slowness | When the spinner appears: at once, or only after `delay-loading` (300 ms), and then for at least a moment | NN/g skeleton screens: under 1 s, a spinner or skeleton "can feel like flashing content" |
| 1 | The end counts most | Peak-and-end: a stall near the end feels far longer than the same stall at the start | Where a 1 s stall falls in a 5.5 s bar: near the end, or at the start | Harrison et al., UIST 2007: users strongly averse to pauses towards the end; accelerating towards the end "highly favored" |
| 2 | A bar that moves backwards feels faster | Induced motion: ribbing that moves against the fill makes the bar seem quicker | A solid bar, or one whose stripes drift backwards | Harrison, Yeo, Hudson, CHI 2010: perceived duration 11% shorter |
| 3 | Show the work | Labor illusion: visible effort makes the same wait feel worth it | A spinner, or the list of sources being checked, for the same wait | Buell & Norton, Management Science 2011 (flight search); it amplifies the result's quality, good or bad |
| 4 | Skeleton for a page, spinner for a part | A skeleton previews the layout and holds its space | A centred spinner, or a skeleton shaped like what arrives | NN/g skeleton screens |
| 5 | Don't wait at all | Optimistic update: show the result now, roll back on failure | Starring a file: spinner until the server answers, or starred at once | react.dev `useOptimistic` |

A short section lays out NN/g's three limits (0.1 s, 1 s, 10 s) and what each wants: nothing, a quiet sign, a progress bar with a way to cancel.

Links out: Button (loading keeps its width, `delay-loading`), Nothing shifts (a skeleton holds its space), Toast (Undo after an optimistic action).
