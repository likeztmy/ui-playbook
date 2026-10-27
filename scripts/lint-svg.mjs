// Icons come from Lucide (src/ui/icons.tsx), not hand-drawn paths. This
// fails on any inline <svg> in src/ outside the files listed below, which
// draw diagrams rather than icons.
import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = new URL('../', import.meta.url).pathname;
const DIAGRAMS = new Set([
  // Spec annotations (arcs, dimensions) and print crosshairs on the lab hero.
  'src/components/hero/Redline.astro',
  // Hand-drawn note arrows in the lab's Field guide direction.
  'src/components/directions/Heads.astro',
  'src/pages/lab/directions.astro',
  // A pen stroke drawn on the Toolbar/Tooltip canvas: content, not an icon.
  'src/demos/canvas.tsx',
  // A colour-vision filter, not an icon: it draws nothing.
  'src/demos/lightness/Vision.tsx',
  // A street map behind the sheet demos: content, not an icon.
  'src/demos/sheet/Map.tsx',
]);

function* files(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* files(p);
    else if (/\.(tsx|astro|mdx)$/.test(e.name)) yield p;
  }
}

const hits = [];
for (const file of files(join(ROOT, 'src'))) {
  const rel = relative(ROOT, file);
  if (DIAGRAMS.has(rel)) continue;
  readFileSync(file, 'utf8')
    .split('\n')
    .forEach((line, i) => line.includes('<svg') && hits.push(`${rel}:${i + 1}`));
}

if (hits.length) {
  console.error('Inline <svg> found. Use a Lucide icon from src/ui/icons.tsx, or list a diagram file in scripts/lint-svg.mjs:');
  for (const h of hits) console.error(`  ${h}`);
  process.exit(1);
}
