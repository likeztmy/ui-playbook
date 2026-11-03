// Contrast of a look's text and edge colours, worked out from its values: each role against every
// surface, and against accent-soft and its own soft fill laid on each, the soft fill also on a selected
// row's accent-soft (a badge in a chosen row), in WCAG 2.2's ratio.
// color-mix() and alpha are composited as the browser does (checked against Chrome's canvas).
import type { Name, Value } from './look';

type RGBA = [number, number, number, number];
type Values = Partial<Record<Name, Value>>;
type Theme = 'light' | 'dark';

const lin = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const gam = (c: number) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);

const toOklab = ([r, g, b]: number[]) => {
  const [R, G, B] = [r, g, b].map(lin);
  const l = Math.cbrt(0.4122214708 * R + 0.5363325363 * G + 0.0514459929 * B);
  const m = Math.cbrt(0.2119034982 * R + 0.6806995451 * G + 0.1073969566 * B);
  const s = Math.cbrt(0.0883024619 * R + 0.2817188376 * G + 0.6299787005 * B);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
};

const fromOklab = ([L, a, b]: number[]) => {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ].map((c) => Math.min(1, Math.max(0, gam(c))));
};

/** A colour as the looks write them: hex, rgb(), or a color-mix() of those, `transparent` included. */
function parse(value: string): RGBA {
  const v = value.trim();
  if (v === 'transparent') return [0, 0, 0, 0];
  let m = v.match(/^#([0-9a-f]+)$/i);
  if (m) {
    const h = m[1].length <= 4 ? [...m[1]].map((c) => c + c).join('') : m[1];
    const n = (i: number) => parseInt(h.slice(i, i + 2), 16) / 255;
    return [n(0), n(2), n(4), h.length === 8 ? n(6) : 1];
  }
  m = v.match(/^rgba?\(([^)]+)\)$/);
  if (m) {
    const p = m[1].split(/[\s,/]+/).filter(Boolean);
    const a = p[3] === undefined ? 1 : p[3].endsWith('%') ? parseFloat(p[3]) / 100 : parseFloat(p[3]);
    return [+p[0] / 255, +p[1] / 255, +p[2] / 255, a];
  }
  m = v.match(/^color-mix\(in (oklab|srgb),\s*(.+)\)$/);
  if (!m) throw new Error(`Not a colour the contrast check reads: ${v}`);
  const space = m[1];
  const [[c1, q1], [c2, q2]] = m[2].split(/,(?![^(]*\))/).map((part) => {
    const x = part.trim().match(/^(.*?)(?:\s+([\d.]+)%)?$/)!;
    return [parse(x[1]), x[2] === undefined ? null : +x[2] / 100] as const;
  });
  let p1 = q1 ?? (q2 === null ? 0.5 : 1 - q2);
  let p2 = q2 ?? 1 - p1;
  const sum = p1 + p2;
  [p1, p2] = [p1 / sum, p2 / sum];
  const alpha = c1[3] * p1 + c2[3] * p2;
  const into = (c: RGBA) => (space === 'oklab' ? toOklab(c) : c.slice(0, 3)).map((x) => x * c[3]);
  const [x1, x2] = [into(c1), into(c2)];
  const mixed = alpha === 0 ? [0, 0, 0] : x1.map((x, i) => (x * p1 + x2[i] * p2) / alpha);
  const rgb = space === 'oklab' ? fromOklab(mixed) : mixed;
  return [rgb[0], rgb[1], rgb[2], alpha * Math.min(1, sum)];
}

const over = (top: RGBA, under: RGBA): RGBA => {
  const a = top[3];
  return [0, 1, 2].map((i) => top[i] * a + under[i] * (1 - a)).concat(1) as RGBA;
};
const luminance = (c: RGBA) => 0.2126 * lin(c[0]) + 0.7152 * lin(c[1]) + 0.0722 * lin(c[2]);
const ratio = (a: RGBA, b: RGBA) => {
  const [x, y] = [luminance(a), luminance(b)];
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
};

const SURFACES = ['bg', 'surface', 'surface-raised', 'surface-sunken'] as const;
const SOFT: Partial<Record<Name, Name>> = {
  danger: 'danger-soft',
  success: 'success-soft',
  warning: 'warning-soft',
  info: 'info-soft',
};

/** What each checked role is read against, and the ratio it needs. */
const ROLES: Partial<Record<Name, { need: number; on: (v: Values, t: Theme) => RGBA[] }>> = {};
const grounds = (v: Values, t: Theme, fills: Name[] = []) => {
  const bg = parse(v.bg![t]);
  const surfaces = SURFACES.map((s) => over(parse(v[s]![t]), bg));
  return [...surfaces, ...fills.flatMap((f) => surfaces.map((s) => over(parse(v[f]![t]), s)))];
};
// A status colour's own soft fill, laid on a selected row: its soft over accent-soft over each surface.
const chosen = (v: Values, t: Theme, soft: Name) =>
  grounds(v, t, ['accent-soft'])
    .slice(SURFACES.length)
    .map((g) => over(parse(v[soft]![t]), g));
for (const n of ['ink', 'ink-muted', 'accent-text', 'danger', 'success', 'warning', 'info'] as const) {
  const soft = SOFT[n];
  ROLES[n] = {
    need: 4.5,
    on: (v, t) => [...grounds(v, t, ['accent-soft', ...(soft ? [soft] : [])]), ...(soft ? chosen(v, t, soft) : [])],
  };
}
ROLES['on-accent'] = { need: 4.5, on: (v, t) => [parse(v.accent![t]), parse(v['accent-hover']![t])] };
ROLES['on-danger'] = { need: 4.5, on: (v, t) => [parse(v.danger![t])] };
ROLES['line-strong'] = { need: 3, on: (v, t) => grounds(v, t) };
ROLES['focus-ring'] = { need: 3, on: (v, t) => grounds(v, t) };

// A focus ring is a box-shadow list; its last colour is the ring people see.
const ink = (n: Name, value: string) => parse(n === 'focus-ring' ? value.match(/#[0-9a-f]{3,8}/gi)!.at(-1)! : value);

/** The lowest ratio of a role in one theme, or nothing for a role the check doesn't cover. */
export function lowest(values: Values, n: Name, theme: Theme): number | undefined {
  const role = ROLES[n];
  if (!role) return undefined;
  const fg = ink(n, values[n]![theme]);
  return Math.min(...role.on(values, theme).map((g) => ratio(over(fg, g), g)));
}

/** The note's words: "lowest 4.7:1 light, 7.4:1 dark", to one decimal; a ratio under its floor is cut, never
 * rounded up to it. */
export function lowestNote(values: Values, n: Name): string | undefined {
  const need = ROLES[n]?.need;
  if (!need) return undefined;
  const show = (x: number) => (x < need ? Math.floor(x * 10) / 10 : Math.round(x * 10) / 10).toFixed(1);
  const [l, d] = (['light', 'dark'] as const).map((t) => lowest(values, n, t)!);
  return `lowest ${show(l)}:1 light, ${show(d)}:1 dark`;
}
