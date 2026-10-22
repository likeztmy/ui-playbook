// @ts-check
import { readFileSync } from 'node:fs';
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';

// Pre-bundle every Base UI entry up front. Otherwise the dev server finds a
// new one (say @base-ui/react/select) the first time a page imports it,
// re-optimizes, and every page already open fails to hydrate with
// "504 Outdated Optimize Dep".
const baseUi = JSON.parse(readFileSync(new URL('./node_modules/@base-ui/react/package.json', import.meta.url), 'utf8'));
const baseUiEntries = Object.keys(baseUi.exports ?? {})
  .filter((k) => /^\.\/[a-z-]+$/.test(k))
  .map((k) => `@base-ui/react/${k.slice(2)}`);

export default defineConfig({
  site: 'https://ui-playbook.suspense.site',
  integrations: [react(), mdx()],
  vite: {
    optimizeDeps: {
      include: [...baseUiEntries, 'lucide-react'],
    },
  },
});
