// A look: a whole set of values for the playbook's own variables, so swapping looks changes values,
// never code. What a product publishes is used as published, with its source; what it doesn't is
// the playbook's, marked so. Plan: docs/plans/2026-11-01-looks-and-vague-words.md.
import precision from '../tokens/precision.json';

/** The variables a look sets: the ones the components read. */
export const NAMES = [
  'bg',
  'surface',
  'surface-raised',
  'surface-sunken',
  'line',
  'line-strong',
  'ink',
  'ink-muted',
  'ink-disabled',
  'fill-hover',
  'fill-active',
  'fill-control',
  'fill-control-hover',
  'accent',
  'accent-hover',
  'on-accent',
  'accent-soft',
  'accent-text',
  'danger',
  'danger-soft',
  'on-danger',
  'success',
  'success-soft',
  'warning',
  'warning-soft',
  'scrim',
  'focus-ring',
  'radius-sm',
  'radius-md',
  'radius-lg',
  'radius-control',
  'shadow-sm',
  'shadow-md',
  'control-md',
  'duration-fast',
  'ease-out',
  'font-sans',
  'text-sm',
  'text-md',
  'text-lg',
  'text-xl',
  'leading-md',
  'weight-body',
  'weight-strong',
  'line-width',
  'row-height',
  'space-stack',
  'space-card',
  'space-gap',
] as const;
export type Name = (typeof NAMES)[number];

export type Source = { label: string; href: string };
/** One variable's value in each theme; `from` is the product's page, or nothing for the playbook's. */
export type Value = { light: string; dark: string; from?: Source; note?: string };

export type Look = {
  id: string;
  name: string;
  font: { name: string; licence: string; from: Source };
  values: Partial<Record<Name, Value>>;
};

type Token = { name: string; value?: unknown; light?: string; dark?: string };
const groups = precision as unknown as Record<string, { tokens?: Token[]; palettes?: Palette[] }>;
type Palette = { id: string; name: string; values: Record<string, { light: string; dark: string }> };

// Type, edges and spacing the components read beside the colour tokens: the work-tool system's.
const SIZES: Record<string, string> = {
  'text-sm': '12px',
  'text-md': '14px',
  'text-lg': '16px',
  'text-xl': '28px',
  'leading-md': '20px',
  'weight-body': '400',
  'weight-strong': '600',
  'line-width': '1px',
  'row-height': '40px',
  'space-stack': '12px',
  'space-card': '16px',
  'space-gap': '16px',
};

const all = new Map<string, Token>();
for (const g of Object.values(groups)) for (const t of g.tokens ?? []) all.set(t.name, t);

// `{accent-text}` names another token.
const resolve = (t: Token, theme: 'light' | 'dark'): string => {
  const v = (t[theme] ?? t.value) as string | { light: string; dark: string };
  const s = typeof v === 'string' ? v : v[theme];
  const alias = s.match(/^\{(.+)\}$/);
  return alias ? resolve(all.get(alias[1])!, theme) : s;
};

export const PALETTES = groups.color.palettes!;

/** The playbook's own values, in one of its palettes. */
export function playbook(palette = 'blue'): Record<Name, Value> {
  const over = PALETTES.find((p) => p.id === palette)?.values ?? {};
  const sans = (precision as unknown as { type: { families: { sans: string } } }).type.families.sans;
  return Object.fromEntries(
    NAMES.map((n) => {
      if (n === 'font-sans') return [n, { light: sans, dark: sans }];
      if (SIZES[n]) return [n, { light: SIZES[n], dark: SIZES[n] }];
      if (over[n]) return [n, over[n]];
      const t = all.get(n)!;
      return [n, { light: resolve(t, 'light'), dark: resolve(t, 'dark') }];
    }),
  ) as Record<Name, Value>;
}

/** Every variable of a look, the product's where it publishes one, else the playbook's. */
export function valuesOf(look: Look): [Name, Value][] {
  const base = playbook();
  return NAMES.map((n) => [n, look.values[n] ?? base[n]]);
}

/** The `:root` blocks to paste: light, then dark for a dark theme and the system's dark setting. */
export function rootBlock(look: Look): string {
  const v = valuesOf(look);
  const decl = (theme: 'light' | 'dark', indent: string) => v.map(([n, x]) => `${indent}--${n}: ${x[theme]};`).join('\n');
  const darkOnly = v.filter(([, x]) => x.dark !== x.light);
  const dark = (indent: string) => darkOnly.map(([n, x]) => `${indent}--${n}: ${x.dark};`).join('\n');
  return `:root {\n${decl('light', '  ')}\n}\n\n@media (prefers-color-scheme: dark) {\n  :root:not([data-theme='light']) {\n${dark('    ')}\n  }\n}\n\n:root[data-theme='dark'] {\n${dark('  ')}\n}`;
}
