// What the words people use for a look mean, for the Skill: each turned into changes an agent can
// make and check, from pages that already argue them. Plan: docs/plans/2026-11-01-looks-and-vague-words.md.
// Matched in English and Chinese, since that's how people ask; the rule is written once.

/** @type {{ asked: string, means: string, pages: string[] }[]} */
export const WORDS = [
  {
    asked: 'nicer, better looking (好看、漂亮)',
    means:
      'Check the floors and the moments first: one left edge per kind of thing, gaps by ratio, text at 4.5:1, one icon set. Most of “not nice” is one of these, and fixing it beats restyling.',
    pages: ['principle-space-groups-by-ratio', 'principle-the-lightest-boundary-that-holds', 'principle-lightness-first', 'component-icon'],
  },
  {
    asked: 'premium, classy, refined (高级、有质感、精致)',
    means:
      'Fewer things, each saying more: grey surfaces and one accent; hierarchy from weight and space, not more sizes or colours; no gradient, glow, emoji or ornament; boundaries one step lighter, or gone. It names the whole look, so build two or three directions on the same content and let them pick.',
    pages: ['principle-grey-until-it-matters', 'principle-every-line-does-a-job', 'principle-the-lightest-boundary-that-holds'],
  },
  {
    asked: 'smoother, snappier (丝滑、流畅、顺滑)',
    means:
      'Answer at once and never make them wait for an animation: what repeats is about 120 ms and takes the next press; an animation turns from where it is; nothing shifts under the pointer; the result shows before the server answers when the action rarely fails and undoes cheaply.',
    pages: [
      'principle-attention-wears-off-waiting-doesnt',
      'principle-never-too-busy-to-listen',
      'principle-nothing-shifts',
      'principle-how-waiting-feels',
    ],
  },
  {
    asked: 'cleaner, simpler (简洁、干净、清爽)',
    means: 'Take away before restyling: lines that do no job, a box per section, a second accent. Group by space first, then a line, a box last.',
    pages: ['principle-every-line-does-a-job', 'principle-the-lightest-boundary-that-holds'],
  },
  {
    asked: 'livelier, younger (活泼、年轻、有活力)',
    means:
      'The consumer system: colour may enter the content, larger targets and radius, a spring on what is picked up and thrown. Art only when the brief supplies it.',
    pages: ['system-consumer-app', 'principle-colour-means-one-thing', 'principle-never-too-busy-to-listen'],
  },
  {
    asked: 'more professional, serious (专业、稳重)',
    means: 'The work-tool system: 14 px text, 32 px controls, denser rows, grey surfaces, one accent, numbers on the right.',
    pages: ['system-work-tool', 'component-table'],
  },
];
