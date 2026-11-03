// Linear, read from the app's own CSS (custom properties and computed styles) on 2026-11-02 in its
// Pure Light and Dark themes; LCH values converted to sRGB hex. Its brand page publishes the neutrals and typefaces.
import type { Look, Source } from './look';

const app: Source = { label: 'linear.app CSS, read 2026-11-02', href: 'https://linear.app' };
const redesign: Source = { label: 'Linear, UI redesign', href: 'https://linear.app/now/how-we-redesigned-the-linear-ui' };
const sans = '"Inter Variable", Inter, "SF Pro Display", -apple-system, system-ui, sans-serif';
const px = (v: string) => ({ light: v, dark: v, from: app });

export const linear: Look = {
  id: 'linear',
  name: 'After Linear',
  font: {
    name: 'Inter, with Inter Display for headings',
    licence: 'SIL Open Font License 1.1: free to embed on the web.',
    from: { label: 'rsms/inter', href: 'https://github.com/rsms/inter' },
  },
  values: {
    bg: { light: '#ffffff', dark: '#09090a', from: app, note: 'the window and sidebar; dark is bg-sidebar-dark' },
    surface: {
      light: '#ffffff',
      dark: '#121213',
      from: app,
      note: 'the content panel, set apart by its edge and shadow: color-bg-primary',
    },
    'surface-sunken': { light: '#f4f4f4', dark: '#161617', from: app, note: 'color-bg-secondary' },
    line: { light: '#ededed', dark: '#232426', from: app, note: 'color-border-secondary, drawn 0.5px' },
    ink: { light: '#1c1c1c', dark: '#ffffff', from: app, note: 'color-text-primary' },
    'ink-muted': {
      light: '#616261',
      dark: '#959597',
      from: app,
      note: 'color-text-tertiary: IDs, button labels',
    },
    'ink-disabled': { light: '#a6a7a6', dark: '#565759', from: app, note: 'color-text-quaternary' },
    'fill-hover': {
      light: '#f8f8f8',
      dark: '#1a1a1b',
      from: app,
      note: 'color-bg-quaternary, also the group header band',
    },
    'fill-active': { light: '#f3f3f3', dark: '#232325', from: app, note: 'the selected sidebar item' },
    accent: { light: '#5a68cf', dark: '#5e6ad2', from: app, note: 'the send button, lch(47 59 288); lch(48 59 288) in dark' },
    'accent-hover': {
      light: 'color-mix(in oklab, #5a68cf, #000 12%)',
      dark: 'color-mix(in oklab, #5e6ad2, #000 12%)',
      note: 'not read; the accent a step darker in both themes, so its white label holds',
    },
    'on-accent': { light: '#fffeff', dark: '#fffeff', from: app, note: 'lch(100 5 288)' },
    'accent-soft': {
      light: 'color-mix(in srgb, #6d78d5 16%, transparent)',
      dark: 'color-mix(in srgb, #5e69d1 18%, transparent)',
      from: app,
      note: 'from selection-bg-active, which is the focus colour at 40%; fainter here so muted text on it holds 4.5:1',
    },
    'accent-text': {
      light: '#4450b2',
      dark: 'color-mix(in oklab, #5e6ad2, #fff 35%)',
      note: 'not read; the accent, darker on light and lighter on dark so it holds on accent-soft, twice over on a selected row',
    },
    info: {
      light: '#4450b2',
      dark: 'color-mix(in oklab, #5e6ad2, #fff 40%)',
      note: 'not read; accent-text, a step lighter on dark so a badge holds on a selected row',
    },
    success: { light: '#007253', dark: '#54cc9e', note: 'the playbook’s, darker on light so it holds on accent-soft' },
    warning: { light: '#935500', dark: '#eeaa3b', note: 'the playbook’s, darker on light so it holds on accent-soft' },
    'focus-ring': {
      light: '0 0 0 2px #6d78d5',
      dark: '0 0 0 2px #5e69d1',
      from: app,
      note: 'focus-ring-color; Linear draws it 1px, widened to the playbook’s 2px',
    },
    'radius-sm': { ...px('6px'), note: 'editor-block-radius, a variable; not measured on a control' },
    'radius-md': { ...px('8px'), note: 'measured: sidebar items, text fields, the group header' },
    'radius-lg': { ...px('10px'), note: 'measured: a settings card; the content panel is 12px' },
    'radius-control': { ...px('9999px'), note: 'radius-rounded: buttons, tabs and chips are pills' },
    'radius-field': { ...px('8px'), note: 'measured: text fields' },
    'shadow-sm': {
      light: '0 3px 6px -2px rgb(0 0 0 / 0.02), 0 1px 1px rgb(0 0 0 / 0.04)',
      dark: '0 0.5px 1px 1px rgb(0 0 0 / 0.3)',
      from: app,
      note: 'measured: the content panel’s and settings card’s shadow',
    },
    'control-md': { ...px('32px'), note: 'measured: a settings text field; sidebar items, tabs and header buttons are 28px' },
    'font-sans': { light: sans, dark: sans, from: redesign, note: 'font-regular' },
    'text-sm': { ...px('12px'), note: 'measured: dates, chips, descriptions, section labels' },
    'text-md': { ...px('13px'), note: 'measured: issue titles, IDs, sidebar items, field labels and values' },
    'text-lg': { ...px('15px'), note: 'measured: a settings section title, line height 23px' },
    'text-xl': { ...px('24px'), note: 'measured: a settings page title, line height 32px' },
    'leading-md': { ...px('normal'), note: 'measured: 13px text sets line-height normal, a 16px line box' },
    'weight-body': { ...px('500'), note: 'measured: titles, labels and sidebar items; IDs and descriptions are 450' },
    'weight-strong': { ...px('500'), note: 'measured: headings are 500 too' },
    'line-width': { ...px('0.5px'), note: 'measured: panel, fields, tabs and chips' },
    'row-height': { ...px('36px'), note: 'measured: an issue row and a group header' },
    'space-stack': { ...px('8px'), note: 'measured: the gap inside an issue row' },
    'space-card': { ...px('16px'), note: 'measured: a settings card row’s padding' },
    'space-gap': { ...px('8px'), note: 'measured: the content panel’s inset from the window' },
  },
};
