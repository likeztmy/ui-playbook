// @ts-check
// Code blocks, in prose and on the look pages. Shiki writes each token in both themes as a
// variable, and global.scss picks one by the page's theme.
//
// Every token holds 4.5:1 on `surface-sunken`, in every palette, as text has to. Probed against
// each palette's sunken surface (light #efeff1 #f2eee6 #ecf0f2 #efefea, dark #0a0b0c #0d0c0b
// #090b0c #0b0b0a); the lowest of each theme, on its darkest or lightest ground:
// - light, github-light-high-contrast: #4b535d 6.74:1, every other token 6.96:1 or more. Its
//   comments (#66707b, 4.35:1) take the palette's `ink-muted` instead, 5.55:1 or more.
// - dark, github-dark-default: comments #8b949e 6.35:1, every other token 7.75:1 or more.
// github-light, used before, fell to 3.04:1 (#e36209) and github-dark's comments to 4.09:1.

/** @type {{ light: 'github-light-high-contrast', dark: 'github-dark-default' }} */
export const codeThemes = { light: 'github-light-high-contrast', dark: 'github-dark-default' };

const replacements = { [codeThemes.light]: { '#66707b': 'var(--ink-muted)' } };

const LANGS = /** @type {Record<string, string>} */ ({
  css: 'CSS',
  html: 'HTML',
  js: 'JavaScript',
  jsx: 'JSX',
  ts: 'TypeScript',
  tsx: 'TSX',
  json: 'JSON',
  sh: 'Shell',
  bash: 'Shell',
});

/**
 * Swaps the failing comment colour before Shiki colours the tokens. And a code block scrolls
 * sideways on its own, so Shiki makes it a Tab stop: this names it, as a pane is named, by its
 * language unless the page gave it a name of its own.
 * @type {NonNullable<import('astro').ShikiConfig['transformers']>[number]}
 */
const legible = {
  preprocess(_code, options) {
    options.colorReplacements = { ...options.colorReplacements, ...replacements };
  },
  pre(node) {
    node.properties.role ??= 'region';
    const lang = this.options.lang;
    node.properties['aria-label'] ??= `${LANGS[lang] ?? lang.toUpperCase()} code`;
  },
};

export const codeTransformers = [legible];
