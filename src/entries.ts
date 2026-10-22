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
    summary: 'Runs an action now. A filled pill that answers the press: quick down, soft back.',
    details: 5,
    keywords: ['primary', 'secondary', 'ghost', 'hover', 'focus ring', 'action'],
  },
  {
    slug: 'menu',
    kind: 'component',
    title: 'Menu',
    summary: 'Actions or choices that open from a trigger: pull-down, context menu, or choice.',
    details: 9,
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
    slug: 'dialog',
    kind: 'component',
    title: 'Dialog',
    summary: 'Stops everything for a decision or a short job. Rarely the right call.',
    details: 4,
    keywords: ['modal', 'alert', 'confirm', 'alert dialog', 'sheet', 'popup', 'delete'],
  },
  {
    slug: 'input',
    kind: 'component',
    title: 'Input',
    summary: 'A labelled field for typed text. Checked when you leave it, not while you type.',
    details: 5,
    keywords: ['text field', 'textarea', 'form', 'label', 'placeholder', 'validation', 'error', 'search'],
  },
  {
    slug: 'select',
    kind: 'component',
    title: 'Select',
    summary: 'Picks one value from a short list. Opens over its trigger, marks the current value with a check.',
    details: 4,
    keywords: ['dropdown', 'pop-up button', 'picker', 'options', 'form', 'choice'],
  },
  {
    slug: 'checkbox',
    kind: 'component',
    title: 'Checkbox',
    summary: 'On, off or mixed, sent with the form. The whole row is the target.',
    details: 4,
    keywords: ['check box', 'tick', 'mixed', 'indeterminate', 'select all', 'form', 'option'],
  },
  {
    slug: 'switch',
    kind: 'component',
    title: 'Switch',
    summary: 'A setting that takes effect the moment it flips. Label names the setting, never the state.',
    details: 4,
    keywords: ['toggle', 'on off', 'setting', 'preference', 'knob'],
  },
  {
    slug: 'tabs',
    kind: 'component',
    title: 'Tabs',
    summary: 'Views of one thing, one row. An ink bar slides under the current tab; nothing else moves.',
    details: 4,
    keywords: ['tab', 'tab bar', 'sections', 'views', 'underline', 'indicator', 'segmented'],
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
