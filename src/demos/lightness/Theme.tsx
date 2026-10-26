import { useState } from 'react';
import { Slider } from '../../ui/Slider';
import { Tweak } from '../shell';
import { css, lightnessFor, rgb, wcag, WHITE, type Lch } from './maths';
import { Screen } from './Screen';
import s from './lightness.module.scss';

// The greys carry the accent's hue at this chroma: enough to belong, too little to name.
const TINT = 0.008;

type Pair = { name: string; text: Lch; ground: Lch; needs: number };

/**
 * A whole theme from three inputs, after Linear's 2024 rebuild: the base's lightness, the accent's
 * hue and how much contrast. Every role is solved for its contrast against what it sits on, so a high
 * contrast theme is the same rule with a higher target.
 */
function theme(base: number, hue: number, contrast: number) {
  const dark = base < 0.5;
  const k = contrast / 100;
  const toward = dark ? 'light' : 'dark';
  const ground: Lch = { l: base, c: TINT, h: hue };
  const surface: Lch = { l: dark ? base + 0.05 : Math.min(1, base + 0.04), c: TINT * 0.5, h: hue };
  const accentSoft: Lch = dark ? { l: surface.l + 0.08, c: 0.05, h: hue } : { l: 0.95, c: 0.03, h: hue };
  const solve = (needs: number, c: number, on: Lch = surface): Lch => ({ l: lightnessFor(needs, rgb(on), hue, c, toward), c, h: hue });
  const ink = solve(12 + 6 * k, TINT * 1.5);
  // Muted text sits on the surface and on the selection: it takes whichever lightness passes on both.
  const [onSurface, onSelection] = [surface, accentSoft].map((on) => solve(4.6 + 3 * k, TINT * 1.5, on));
  const muted = (dark ? onSurface.l > onSelection.l : onSurface.l < onSelection.l) ? onSurface : onSelection;
  const line = solve(1.2 + 0.6 * k, TINT);
  // White on the fill in both themes, so the fill is solved against white, not the surface. On a dark
  // ground a darker fill would sink into it, so there the label only just passes.
  const accent: Lch = { l: lightnessFor(dark ? 4.6 : 4.6 + 2.4 * k, WHITE, hue, 0.2, 'dark'), c: 0.2, h: hue };
  const pairs: Pair[] = [
    { name: 'Ink', text: ink, ground: surface, needs: 4.5 },
    { name: 'Muted', text: muted, ground: surface, needs: 4.5 },
    { name: 'Muted on the selection', text: muted, ground: accentSoft, needs: 4.5 },
    { name: 'Label on accent', text: { l: 1, c: 0, h: 0 }, ground: accent, needs: 4.5 },
    { name: 'Accent on surface', text: accent, ground: surface, needs: 3 },
  ];
  return {
    palette: {
      ground: css(ground),
      surface: css(surface),
      line: css(line),
      ink: css(ink),
      muted: css(muted),
      accent: css(accent),
      onAccent: 'oklch(1 0 0)',
      accentSoft: css(accentSoft),
    },
    pairs: pairs.map((p) => ({ ...p, ratio: wcag(rgb(p.text), rgb(p.ground)) })),
  };
}

/** Three dials, one theme: every surface, text and accent derived, and checked, from them. */
export function LightnessTheme() {
  const [base, setBase] = useState(96);
  const [hue, setHue] = useState(256);
  const [contrast, setContrast] = useState(30);
  const t = theme(base / 100, hue, contrast);
  const failing = t.pairs.filter((p) => p.ratio < p.needs);
  const ink = t.pairs[0].ratio;
  return (
    <Tweak
      height={0}
      readout={
        <code className={s.readout} data-fails={failing.length ? '' : undefined}>
          {failing.length
            ? `${failing.length} of ${t.pairs.length} pairs fail: ${failing.map((p) => p.name.toLowerCase()).join(', ')}`
            : `all ${t.pairs.length} pairs pass · ink ${ink.toFixed(1)}:1`}
        </code>
      }
      stage={<Screen palette={t.palette} />}
      controls={
        <>
          <Slider label="Base" value={base} onValueChange={setBase} min={6} max={98} unit="%" />
          <Slider label="Accent" value={hue} onValueChange={setHue} max={359} unit="°" />
          <Slider label="Contrast" value={contrast} onValueChange={setContrast} />
        </>
      }
    />
  );
}
