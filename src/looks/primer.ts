// GitHub's Primer, from its published token package (@primer/primitives 11.10.0, built CSS).
import type { Look, Source } from './look';

const pkg = 'https://unpkg.com/@primer/primitives@11.10.0/dist/css';
const theme: Source = { label: 'Primer themes', href: `${pkg}/functional/themes/light.css` };
const radius: Source = { label: 'Primer radius', href: `${pkg}/functional/size/radius.css` };
const size: Source = { label: 'Primer size', href: `${pkg}/functional/size/size.css` };
const motion: Source = { label: 'Primer motion', href: `${pkg}/base/motion/motion.css` };
const type: Source = { label: 'Primer typography', href: `${pkg}/functional/typography/typography.css` };
const baseType: Source = { label: 'Primer base typography', href: `${pkg}/base/typography/typography.css` };
const border: Source = { label: 'Primer border', href: `${pkg}/functional/size/border.css` };
const same = (v: string, from: Source, note: string) => ({ light: v, dark: v, from, note });

const sans =
  '"Mona Sans VF", -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"';

export const primer: Look = {
  id: 'primer',
  name: 'After Primer',
  font: {
    name: 'Mona Sans',
    licence: 'SIL Open Font License 1.1: free to embed on the web. Without it loaded, the stack falls back to the system font.',
    from: { label: 'github/mona-sans', href: 'https://github.com/github/mona-sans' },
  },
  values: {
    bg: { light: '#f6f8fa', dark: '#010409', from: theme, note: 'bgColor-inset' },
    surface: { light: '#ffffff', dark: '#0d1117', from: theme, note: 'bgColor-default' },
    'surface-raised': { light: '#ffffff', dark: '#010409', from: theme, note: 'overlay-bgColor' },
    'surface-sunken': { light: '#f6f8fa', dark: '#151b23', from: theme, note: 'bgColor-muted' },
    line: { light: '#d1d9e0b3', dark: '#3d444db3', from: theme, note: 'borderColor-muted' },
    'line-strong': {
      light: '#818b98',
      dark: '#656c76',
      from: theme,
      note: 'borderColor-emphasis. Primer’s own field border is borderColor-default, about 1.4:1 on white; a field’s edge needs 3:1.',
    },
    ink: { light: '#1f2328', dark: '#f0f6fc', from: theme, note: 'fgColor-default' },
    'ink-muted': { light: '#59636e', dark: '#9198a1', from: theme, note: 'fgColor-muted' },
    'ink-disabled': { light: '#818b98', dark: '#656c76', from: theme, note: 'fgColor-disabled' },
    'fill-hover': { light: '#818b981a', dark: '#656c7633', from: theme, note: 'control-transparent-bgColor-hover' },
    'fill-active': { light: '#818b9826', dark: '#656c7640', from: theme, note: 'control-transparent-bgColor-active' },
    'fill-control': { light: '#f6f8fa', dark: '#212830', from: theme, note: 'control-bgColor-rest' },
    'fill-control-hover': { light: '#eff2f5', dark: '#262c36', from: theme, note: 'control-bgColor-hover' },
    'control-edge': {
      light: '#d1d9e0',
      dark: '#3d444d',
      from: theme,
      note: 'button-default-borderColor-rest: GitHub edges its default button, whose fill is the page’s own #f6f8fa',
    },
    accent: {
      light: '#0969da',
      dark: '#1f6feb',
      from: theme,
      note: 'bgColor-accent-emphasis. Primer’s primary button is green (button-primary-bgColor-rest, #1f883d); blue marks focus, selection and links.',
    },
    'accent-hover': {
      light: 'color-mix(in oklab, #0969da, #000 12%)',
      dark: 'color-mix(in oklab, #1f6feb, #000 12%)',
      note: 'Primer publishes no hover for its blue; the accent a step darker',
    },
    'on-accent': { light: '#ffffff', dark: '#ffffff', from: theme, note: 'fgColor-onEmphasis' },
    'accent-soft': { light: '#ddf4ff', dark: '#388bfd1a', from: theme, note: 'bgColor-accent-muted' },
    'accent-text': { light: '#0969da', dark: '#4493f8', from: theme, note: 'fgColor-accent' },
    danger: {
      light: '#d1242f',
      dark: '#fb6358',
      from: theme,
      note: 'fgColor-danger; on dark a step lighter (from #f85149), so a badge holds on a selected row',
    },
    'danger-soft': { light: '#ffebe9', dark: '#f851491a', from: theme, note: 'bgColor-danger-muted' },
    success: {
      light: '#197e36',
      dark: '#3fb950',
      from: theme,
      note: 'fgColor-success; on light a hair darker (from #1a7f37), so it holds on bgColor-accent-muted',
    },
    'success-soft': { light: '#dafbe1', dark: '#2ea04326', from: theme, note: 'bgColor-success-muted' },
    warning: {
      light: '#966300',
      dark: '#d29922',
      from: theme,
      note: 'fgColor-attention; on light a step darker (from #9a6700), so it holds on bgColor-accent-muted',
    },
    'warning-soft': { light: '#fff8c5', dark: '#bb800926', from: theme, note: 'bgColor-attention-muted' },
    info: {
      light: '#0969da',
      dark: '#4da0ff',
      from: theme,
      note: 'fgColor-accent; on dark display-blue-fgColor, so a badge holds on a selected row',
    },
    scrim: { light: '#c8d1da66', dark: '#21283066', from: theme, note: 'overlay-backdrop-bgColor' },
    'focus-ring': {
      light: '0 0 0 2px #ffffff, 0 0 0 4px #0969da',
      dark: '0 0 0 2px #0d1117, 0 0 0 4px #1f6feb',
      from: theme,
      note: 'focus-outlineColor (borderColor-accent-emphasis), drawn as the playbook’s ring',
    },
    'radius-sm': { light: '3px', dark: '3px', from: radius, note: 'borderRadius-small' },
    'radius-md': { light: '6px', dark: '6px', from: radius, note: 'borderRadius-medium, the default' },
    'radius-lg': { light: '12px', dark: '12px', from: radius, note: 'borderRadius-large' },
    'radius-control': { light: '6px', dark: '6px', from: radius, note: 'borderRadius-default' },
    'radius-field': { light: '6px', dark: '6px', from: radius, note: 'borderRadius-default, as GitHub draws its text inputs' },
    'shadow-xs': {
      light: '0 1px 1px 0 #1f23280d',
      dark: '0 1px 1px 0 #010409cc',
      from: theme,
      note: 'shadow-resting-xsmall',
    },
    'shadow-sm': {
      light: '0 1px 1px 0 #1f23280a, 0 1px 2px 0 #1f232808',
      dark: '0 1px 1px 0 #01040999, 0 1px 3px 0 #01040999',
      from: theme,
      note: 'shadow-resting-small',
    },
    'shadow-md': {
      light: '0 0 0 1px #d1d9e040, 0 6px 12px -3px #25292e0a, 0 6px 18px 0 #25292e1f',
      dark: '0 0 0 1px #3d444d, 0 6px 12px -3px #01040966, 0 6px 18px 0 #01040966',
      from: theme,
      note: 'shadow-floating-small',
    },
    'control-md': { light: '32px', dark: '32px', from: size, note: 'control-medium-size' },
    'ease-out': { light: 'cubic-bezier(0.3, 0.8, 0.6, 1)', dark: 'cubic-bezier(0.3, 0.8, 0.6, 1)', from: motion, note: 'base-easing-easeOut' },
    'font-sans': { light: sans, dark: sans, from: type, note: 'fontStack-sansSerif' },
    'text-sm': same('12px', baseType, 'text-body-size-small (base-text-size-xs)'),
    'text-md': same('14px', baseType, 'text-body-size-medium (base-text-size-sm), the default UI text'),
    'text-lg': same('16px', baseType, 'text-title-size-small (base-text-size-md)'),
    'text-xl': same('32px', baseType, 'text-title-size-large (base-text-size-xl)'),
    'leading-md': same('1.5', baseType, 'text-body-lineHeight-medium (base-text-lineHeight-normal)'),
    'weight-body': same('400', baseType, 'text-body-weight (base-text-weight-normal)'),
    'weight-strong': same('600', baseType, 'text-title-weight-small (base-text-weight-semibold)'),
    'line-width': same('1px', border, 'borderWidth-default'),
    'space-stack': same('8px', size, 'stack-gap-condensed'),
    'space-card': same('16px', size, 'stack-padding-normal'),
    'space-gap': same('16px', size, 'stack-gap-normal'),
  },
};
