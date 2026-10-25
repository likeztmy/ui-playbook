# Coding standards

For reviewing a diff. Mechanical rules (token-only colours and layers, no
`transition: all`, Lucide instead of inline SVG, types) are enforced by
`pnpm check`; this file holds the judgement calls it can't make.

The playbook is evidence for its own rules: a component that breaks a rule
its page teaches undercuts every page. Review each change as a **witness**
for those rules.

## Components

- **Practises its page.** Read the component's MDX page (and Precision's README, the source for the rules) beside the diff. Every rule the page states, the component obeys: concentric radii, equal insets, one accent, the stated durations and easings, focus only on `:focus-visible`.
- **Checked against the reference products.** A new or reworked component is compared with how macOS, Linear and Raycast solve the same thing. A deliberate deviation is named in the page or the commit message.
- **Wrappers forward everything.** A component wrapping another passes its rest props and `ref` through to the element. Base UI's `render` composition and `Tip` merge event handlers and a ref into the child; a wrapper that drops them breaks hover silently.
- **State changes are transitionable.** Hover and press fade through `opacity` or a colour, never by swapping a `background-image` gradient, which snaps. Enter is `duration-instant`, leave is `duration-fast`.
- **Icon-only controls are named twice, identically.** An `aria-label` and a `Tip` with the same words.

## Demos and pages

- **Pages cover every case, not just the best one.** A component page opens with *When to use* (and what to use instead) and *Kinds* or *Variants*: every option the component exposes (icons, shortcuts, sizes, states, how it opens) appears in a live example with when to use it and when not. A rule that holds in one variant and not another says which. Ground the guidance in the reference products' own docs (Apple HIG and the like), and name deliberate deviations.
- **One island per live demo.** A demo whose children are interactive is a single exported component; children passed into an island render as static HTML.
- **Before is a real mistake.** A comparison's "before" reproduces something shipping products actually do, via `src/demos/mistakes.module.scss`, and its note says what goes wrong.
- **Claims are tested.** Each behaviour a page states (a delay, a kept width, a keyboard path) has a test in `tests/interactions.spec.ts`.
- **Copy.** English, sentence case, verbs on buttons and menu items, a tooltip's name equal to the control's `aria-label`.

## Composite UI (In practice examples, rows, panels)

- **Every combination is drawn before it's done.** A part whose look depends on several states at once (a mail row: unread, starred, hover, focus, selected, menu open) gets a state matrix in `src/pages/lab/` that renders each combination held still, as `/lab/mail-states` does. Review the matrix zoomed in, light and dark; one state at a time hides the clashes between them, like a star shown twice when a starred row is hovered.
- **Layout is checked after every step, not only at rest.** An interaction test for a composite surface calls `layoutProblems` (`tests/helpers.ts`) after each action: panes still fill their parent, nothing overlaps text, no icon twice in one row. Prove a new check red on the bug it's for before trusting it green.
- **Floating layers stay out of layout.** A toast viewport, popup or pill rendered inside a grid or flex container sits in its own absolutely positioned layer marked `data-overlay`, never as a direct child that takes a track.
- **Focus-only reveals use `:focus-visible`.** Actions shown on hover also show for keyboard focus, through `:has(:focus-visible)`, not `:focus-within`, which a mouse click leaves behind.
- **A fresh pair of eyes on the screenshots.** Before shipping a new example, capture every state in both themes and at 375 wide, and have them reviewed by someone (or an agent) who wasn't told the design intent, against the reference products.
