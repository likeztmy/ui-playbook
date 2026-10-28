// Measures one page's first screen the way the walk does, for pages outside the eval: a reference.
//
//   node eval/look.mjs <url>     e.g. node eval/look.mjs https://ui-playbook.suspense.site/lab/track
import { chromium } from '@playwright/test';
import { look } from './walks/look.mjs';

const url = process.argv[2];
if (!url) throw new Error('usage: node eval/look.mjs <url>');
const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 }, colorScheme: 'light' });
await page.goto(url);
await page.waitForTimeout(1500);
const { hues, ...rest } = await look(page);
console.log(`${url}: ${JSON.stringify(rest)}`);
await browser.close();
