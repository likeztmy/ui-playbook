// The Skill's build-moment map: what an agent is doing, the rule that applies at that moment, and
// the pages behind it. SKILL.md's body is what agents read (the eval showed they rarely open a
// reference), so each rule is stated here in full; the page holds the numbers, kinds and reasons.
// Each rule restates its page; when a page's rule changes, change its line here.

/** @type {{ when: string, rule: string, pages: string[] }[]} */
export const MOMENTS = [
  {
    when: 'splitting a screen into sections',
    rule: 'Hold each section by its heading and the space around it, all on one left edge. A section’s actions go on its heading row. Lines split repeated rows, one step lighter than the group’s edge. A box holds one unit of a set, or the one region that differs from the rest: never a box per section, never a box inside a box, no header or footer bands.',
    pages: ['principle-the-lightest-boundary-that-holds', 'principle-space-groups-by-ratio'],
  },
  {
    when: 'showing a few figures together',
    rule: 'Figures read together sit in one row on one surface, a line between them. A tile each only when each is a unit of its own: its own chart, its own link.',
    pages: ['principle-the-lightest-boundary-that-holds', 'component-card'],
  },
  {
    when: 'spacing and aligning',
    rule: 'A gap separates only when it’s clearly bigger than the gaps around it: move space, don’t add it. Things of one kind share one left edge (labels one, values another), and only what belongs to the item above is indented.',
    pages: ['principle-space-groups-by-ratio'],
  },
  {
    when: 'writing a label, title, button or message',
    rule: 'Every line names a thing, an action or a state, with the word that differs first. A button’s verb names its result (Delete project), never OK or Yes. No eyebrows, taglines or section subtitles; no please, sorry or we.',
    pages: ['principle-every-line-does-a-job', 'component-button'],
  },
  {
    when: 'confirming an action',
    rule: 'A common action that can be undone runs at once and offers Undo in a toast; asking first trains people to click through. Only an uncommon action that can’t be undone gets an alert dialog: a title that is the question with its object, a sentence of what is lost, Cancel and the verb. Focus starts on Cancel; Esc cancels; a click outside does nothing; the verb is the one fill, in danger red.',
    pages: ['component-dialog', 'component-toast'],
  },
  {
    when: 'validating a form',
    rule: 'Check a field when it’s left, not while it’s typed; once it shows an error, clear it on the keystroke that fixes it. Leaving an empty field is exploring, not a mistake: “required” waits for submit. The error sits at its field, tied to it (aria-describedby, aria-invalid), and says what’s needed.',
    pages: ['principle-error-timing', 'component-input'],
  },
  {
    when: 'something takes time',
    rule: 'Show nothing for the first 300 ms, then keep any spinner at least 500 ms. Show the work (a skeleton, progress) for a slow wait, and the result before the server answers for an action that rarely fails and is cheap to undo (a payment still waits).',
    pages: ['principle-how-waiting-feels'],
  },
  {
    when: 'animating',
    rule: 'Nothing moves unless it was asked to: no layout shift under the pointer. What repeats is brief (around 120 ms) and never blocks the next press. An animation turns from where it is the moment it’s interrupted.',
    pages: ['principle-nothing-shifts', 'principle-attention-wears-off-waiting-doesnt', 'principle-never-too-busy-to-listen'],
  },
  {
    when: 'choosing colour',
    rule: 'Grey carries the screen; colour is kept for what someone has to notice, and each colour says one thing. Choose a colour’s lightness for its job first, then its hue. When the brief gives no brand colour, don’t invent a brand: keep the surfaces neutral, take one accent from a common palette (a platform’s system colours), and define it once as a variable so the real one drops in.',
    pages: ['principle-grey-until-it-matters', 'principle-colour-means-one-thing', 'principle-lightness-first'],
  },
  {
    when: 'adding a shadow or nesting rounded corners',
    rule: 'A shadow is for what covers, floats or is picked up, and its offset says how high. Inner radius = outer radius − inset − border.',
    pages: ['principle-a-shadow-says-how-high', 'principle-concentric-radius'],
  },
  {
    when: 'offering a choice',
    rule: 'A switch for a setting that takes effect at once, labelled with the setting, never its state. Two to five options stay in sight: radios when the choice waits for the form, a segmented control when it switches a view at once. A select for a short list; past about fifteen, a combobox so people can type. Actions go in a menu.',
    pages: ['component-switch', 'component-radio', 'component-segmented-control', 'component-select', 'component-combobox'],
  },
  {
    when: 'building a list or table',
    rule: 'Lines between rows, not stripes; numbers line up on the right. The column that says who or what a row is stays filled in every row and state.',
    pages: ['component-table', 'principle-who-before-what'],
  },
  {
    when: 'building menus and hover',
    rule: 'The pointer is always on its way somewhere: judge it by where it’s heading, so a submenu survives the diagonal across its neighbours.',
    pages: ['principle-hover-forgives', 'component-menu'],
  },
  {
    when: 'adding keyboard shortcuts',
    rule: 'Teach a shortcut on the path people already take: show every key at once when the hand reaches for the keyboard, not only in a tooltip.',
    pages: ['principle-the-faster-way', 'component-tooltip'],
  },
];
