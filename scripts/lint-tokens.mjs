// Every var(--name) in our styles must be a token, or a custom property the
// same codebase defines. A token renamed or removed upstream fails here
// instead of silently falling back to nothing.

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const files = [];
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(scss|css|tsx|astro)$/.test(name) && !p.endsWith('tokens.css')) files.push(p);
  }
};
walk('src');

const defined = new Set();
const define = (text) => {
  for (const m of text.matchAll(/(--[a-z0-9-]+)\s*:/gi)) defined.add(m[1]);
  // Set from script: style={{ '--x': … }} or setProperty('--x', …).
  for (const m of text.matchAll(/['"](--[a-z0-9-]+)['"]/gi)) defined.add(m[1]);
};
define(readFileSync('src/styles/tokens.css', 'utf8'));
const sources = files.map((f) => [f, readFileSync(f, 'utf8')]);
sources.forEach(([, t]) => define(t));

// Set at runtime: by Base UI on its parts, and by Shiki on highlighted code.
const RUNTIME = /^--(anchor|available|transform-origin|active-tab|popup|positioner|collapsible|accordion|slider|toast|drawer|shiki)/;

let bad = 0;
for (const [f, t] of sources) {
  t.split('\n').forEach((line, i) => {
    for (const m of line.matchAll(/var\((--[a-z0-9-]+)/gi)) {
      if (!defined.has(m[1]) && !RUNTIME.test(m[1])) {
        console.error(`${f}:${i + 1}  ${m[1]} is not a token`);
        bad++;
      }
    }
  });
}
if (bad) process.exit(1);
