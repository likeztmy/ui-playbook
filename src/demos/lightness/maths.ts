// The colour maths behind the demos: OKLCH to sRGB (Ottosson 2020), WCAG 2 contrast, APCA 0.0.98G-4g
// contrast, and Machado et al. 2009 colour-vision simulation. Small on purpose: what the page claims,
// the demos compute, rather than quoting numbers worked out elsewhere.

export type Rgb = [number, number, number];
export type Lch = { l: number; c: number; h: number };

const toLinear = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const toGamma = (c: number) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);

/** Linear sRGB, unclipped: a channel outside 0–1 means the colour is out of gamut. */
function linearFromOklch({ l, c, h }: Lch): Rgb {
  const a = c * Math.cos((h * Math.PI) / 180);
  const b = c * Math.sin((h * Math.PI) / 180);
  const l_ = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m_ = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s_ = (l - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_,
    -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_,
    -0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_,
  ];
}

const inGamut = (rgb: Rgb) => rgb.every((v) => v >= -1e-4 && v <= 1 + 1e-4);

/** The most chroma sRGB can show at this lightness and hue. */
export function maxChroma(l: number, h: number) {
  let lo = 0;
  let hi = 0.4;
  for (let i = 0; i < 18; i++) {
    const mid = (lo + hi) / 2;
    if (inGamut(linearFromOklch({ l, c: mid, h }))) lo = mid;
    else hi = mid;
  }
  return lo;
}

/** In gamut the way CSS maps it: same lightness and hue, chroma cut until it fits. */
export const fit = (x: Lch): Lch => ({ ...x, c: Math.min(x.c, maxChroma(x.l, x.h)) });

export function rgb(x: Lch): Rgb {
  const [r, g, b] = linearFromOklch(fit(x)).map((v) => toGamma(Math.min(1, Math.max(0, v))));
  return [r, g, b];
}

export const css = (x: Lch, alpha?: number) => {
  const f = fit(x);
  return `oklch(${(f.l * 100).toFixed(1)}% ${f.c.toFixed(3)} ${f.h.toFixed(1)}${alpha === undefined ? '' : ` / ${alpha}`})`;
};

export function rgbFromHsl(h: number, s: number, l: number): Rgb {
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
  return [f(0), f(8), f(4)];
}

export function oklchFromRgb(c: Rgb): Lch {
  const [r, g, b] = c.map(toLinear);
  const l_ = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m_ = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s_ = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_;
  const A = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_;
  const B = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_;
  return { l: L, c: Math.hypot(A, B), h: ((Math.atan2(B, A) * 180) / Math.PI + 360) % 360 };
}

const luminance = (c: Rgb) => {
  const [r, g, b] = c.map(toLinear);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

/** WCAG 2 contrast ratio, 1–21. */
export function wcag(a: Rgb, b: Rgb) {
  const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}

/** APCA Lc for text on a background, unsigned: 0 to about 106. */
export function apca(text: Rgb, bg: Rgb) {
  const y = ([r, g, b]: Rgb) => 0.2126729 * r ** 2.4 + 0.7151522 * g ** 2.4 + 0.072175 * b ** 2.4;
  const clamp = (v: number) => (v > 0.022 ? v : v + (0.022 - v) ** 1.414);
  const t = clamp(y(text));
  const g = clamp(y(bg));
  const sapc = g > t ? (g ** 0.56 - t ** 0.57) * 1.14 : (g ** 0.65 - t ** 0.62) * 1.14;
  if (Math.abs(sapc) < 0.1) return 0;
  return Math.abs((Math.abs(sapc) - 0.027) * 100);
}

export type Vision = 'typical' | 'deuteranopia' | 'protanopia';

// Machado, Oliveira & Fernandes 2009, severity 1, applied to linear RGB. The same rows drive the SVG
// filter, so what the page shows and what it measures agree.
export const VISION: Record<Exclude<Vision, 'typical'>, number[][]> = {
  deuteranopia: [
    [0.367322, 0.860646, -0.227968],
    [0.280085, 0.672501, 0.047413],
    [-0.01182, 0.04294, 0.968881],
  ],
  protanopia: [
    [0.152286, 1.052583, -0.204868],
    [0.114503, 0.786281, 0.099216],
    [-0.003882, -0.048116, 1.051998],
  ],
};

export function seenWith(c: Rgb, vision: Vision): Rgb {
  if (vision === 'typical') return c;
  const m = VISION[vision];
  const lin = c.map(toLinear);
  const [r, g, b] = m.map((row) => toGamma(Math.min(1, Math.max(0, row[0] * lin[0] + row[1] * lin[1] + row[2] * lin[2]))));
  return [r, g, b];
}

/** Distance in OKLab. 0.02 is about the smallest difference anyone can see (CSS Color 4, §14.2.1). */
export function deltaE(a: Rgb, b: Rgb) {
  const p = oklchFromRgb(a);
  const q = oklchFromRgb(b);
  const ab = (x: Lch) => [x.c * Math.cos((x.h * Math.PI) / 180), x.c * Math.sin((x.h * Math.PI) / 180)];
  const [pa, pb] = ab(p);
  const [qa, qb] = ab(q);
  return Math.hypot(p.l - q.l, pa - qa, pb - qb);
}

/** The lightness, along one hue and chroma, that first reaches `target` against `ground`. */
export function lightnessFor(target: number, ground: Rgb, hue: number, chroma: number, toward: 'dark' | 'light') {
  let lo = toward === 'dark' ? 0 : oklchFromRgb(ground).l;
  let hi = toward === 'dark' ? oklchFromRgb(ground).l : 1;
  for (let i = 0; i < 20; i++) {
    const mid = (lo + hi) / 2;
    const ok = wcag(rgb({ l: mid, c: chroma, h: hue }), ground) >= target;
    // Toward dark, a lower lightness has more contrast; keep the highest that passes.
    if (toward === 'dark') ok ? (lo = mid) : (hi = mid);
    else ok ? (hi = mid) : (lo = mid);
  }
  return toward === 'dark' ? lo : hi;
}

export const WHITE: Rgb = [1, 1, 1];
