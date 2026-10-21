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
    summary: 'Triggers an action. A verb, in sentence case.',
    details: 3,
    keywords: ['primary', 'secondary', 'ghost', 'hover', 'focus ring', 'action'],
  },
  {
    slug: 'menu',
    kind: 'component',
    title: 'Menu',
    summary: 'A list of actions that opens from a trigger.',
    details: 3,
    keywords: ['dropdown', 'context menu', 'popover', 'shortcut', 'popup'],
  },
  {
    slug: 'toolbar',
    kind: 'component',
    title: 'Toolbar',
    summary: 'A floating panel of tools, concentric with everything inside it.',
    details: 2,
    keywords: ['panel', 'palette', 'tools', 'toggle', 'inset'],
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
