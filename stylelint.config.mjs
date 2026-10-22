// Mechanical rules from Precision's README: every value comes from a token.
// Judgement calls live in CODING_STANDARDS.md instead.
export default {
  customSyntax: 'postcss-scss',
  ignoreFiles: ['src/styles/tokens.css', 'dist/**'],
  rules: {
    // Colours come from tokens (var(--ink), color-mix over tokens).
    'color-no-hex': true,
    // Named colours too; mask stops use black/transparent as alpha, not colour.
    'color-named': ['never', { ignoreProperties: ['mask-image', '/^mask/'] }],
    // Layers come from z-* tokens; 0/1 order siblings inside one local context.
    'declaration-property-value-allowed-list': {
      // A layer token, or one step above one (a pinned header over its row).
      'z-index': ['/^var\\(--z-/', '/^calc\\(var\\(--z-[a-z]+\\) \\+ 1\\)$/', '0', '1', '-1'],
    },
    'declaration-property-value-disallowed-list': {
      // Name what transitions; `all` animates layout and colour you didn't mean.
      transition: ['/\\ball\\b/'],
      'transition-property': ['all'],
    },
  },
};
