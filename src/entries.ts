// Everything the home page lists. Order is the gallery order: components by
// how often they're used, then principles.

export type Entry = {
  slug: string;
  kind: 'component' | 'principle';
  title: string;
  summary: string;
  details: number;
  keywords: string[];
};

export const entries: Entry[] = [
  {
    slug: 'button',
    kind: 'component',
    title: 'Button',
    summary: 'Runs an action now. Weight, not colour, picks the variant.',
    details: 4,
    keywords: ['primary', 'secondary', 'ghost', 'hover', 'focus ring', 'action'],
  },
  {
    slug: 'menu',
    kind: 'component',
    title: 'Menu',
    summary: 'Actions or choices that open from a trigger: pull-down, context menu, or choice.',
    details: 8,
    keywords: ['dropdown', 'pull-down', 'context menu', 'right-click', 'sort', 'choice', 'shortcut', 'popup'],
  },
  {
    slug: 'toolbar',
    kind: 'component',
    title: 'Toolbar',
    summary: 'A floating panel of tools, concentric with everything inside it.',
    details: 3,
    keywords: ['panel', 'palette', 'tools', 'toggle', 'inset'],
  },
  {
    slug: 'tooltip',
    kind: 'component',
    title: 'Tooltip',
    summary: 'Names an icon-only control and its shortcut. One line, never clickable.',
    details: 2,
    keywords: ['hint', 'label', 'hover', 'shortcut', 'icon button', 'title'],
  },
  {
    slug: 'concentric-radius',
    kind: 'principle',
    title: 'Concentric radius',
    summary: 'Inner radius = outer radius − inset. Nested corners share one centre.',
    details: 2,
    keywords: ['border radius', 'corners', 'nesting', 'padding', 'inset'],
  },
];

export const href = (e: Entry) => `/${e.kind === 'component' ? 'components' : 'principles'}/${e.slug}`;
