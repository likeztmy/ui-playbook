// Linear, read from the app's own CSS (custom properties and computed styles) on 2026-11-02, light
// theme; LCH values converted to sRGB hex. Its brand page publishes the neutrals and typefaces.
import { playbook, type Look, type Source } from './look';

const app: Source = { label: 'linear.app CSS, read 2026-11-02', href: 'https://linear.app' };
const redesign: Source = { label: 'Linear, UI redesign', href: 'https://linear.app/now/how-we-redesigned-the-linear-ui' };
const sans = '"Inter Variable", Inter, "SF Pro Display", -apple-system, system-ui, sans-serif';
const ours = playbook();
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
      note: 'the content panel, set apart by its edge and shadow; dark is bg-base-color-dark',
    },
    'surface-sunken': { light: '#f4f4f4', dark: '#09090a', from: app, note: 'color-bg-secondary' },
    line: { light: '#ededed', dark: '#212224', from: app, note: 'color-border-secondary; dark is bg-border-color-dark. Drawn 0.5px.' },
    ink: { light: '#1c1c1c', dark: '#ffffff', from: app, note: 'color-text-primary' },
    'ink-muted': {
      light: '#616261',
      dark: ours['ink-muted'].dark,
      from: app,
      note: 'color-text-tertiary: IDs, button labels; dark is the playbook’s',
    },
    'ink-disabled': { light: '#a6a7a6', dark: ours['ink-disabled'].dark, from: app, note: 'color-text-quaternary; dark is the playbook’s' },
    'fill-hover': {
      light: '#f8f8f8',
      dark: ours['fill-hover'].dark,
      from: app,
      note: 'color-bg-quaternary, also the group header band; dark is the playbook’s',
    },
    'fill-active': { light: '#f3f3f3', dark: ours['fill-active'].dark, from: app, note: 'the selected sidebar item; dark is the playbook’s' },
    accent: { light: '#5a68cf', dark: '#5a68cf', from: app, note: 'the send button, lch(47 59 288)' },
    'accent-hover': {
      light: 'color-mix(in oklab, #5a68cf, #000 12%)',
      dark: 'color-mix(in oklab, #5a68cf, #fff 12%)',
      note: 'not read; the accent a step darker, lighter in dark',
    },
    'on-accent': { light: '#fffeff', dark: '#fffeff', from: app, note: 'lch(100 5 288)' },
    'accent-soft': {
      light: 'color-mix(in srgb, #6d78d5 16%, transparent)',
      dark: 'color-mix(in srgb, #6d78d5 24%, transparent)',
      from: app,
      note: 'from selection-bg-active, which is the focus colour at 40%; lighter here so text stays readable',
    },
    'accent-text': {
      light: '#5a68cf',
      dark: 'color-mix(in oklab, #5a68cf, #fff 35%)',
      note: 'not read; the accent, 4.9:1 on white, lightened in dark',
    },
    'focus-ring': {
      light: '0 0 0 2px #6d78d5',
      dark: '0 0 0 2px #6d78d5',
      from: app,
      note: 'focus-ring-color; Linear draws it 1px, widened to the playbook’s 2px',
    },
    'radius-sm': { ...px('6px'), note: 'editor-block-radius' },
    'radius-md': { ...px('8px'), note: 'control-border-radius, the sidebar items' },
    'radius-lg': { ...px('12px'), note: 'the content panel' },
    'radius-control': { ...px('9999px'), note: 'radius-rounded: buttons, tabs and chips are pills' },
    'shadow-sm': {
      light: '0 3px 6px -2px rgb(0 0 0 / 0.02), 0 1px 1px rgb(0 0 0 / 0.04)',
      dark: '0 4px 4px -1px rgb(0 0 0 / 0.04), 0 1px 1px rgb(0 0 0 / 0.08)',
      from: app,
      note: 'the content panel’s shadow; dark is its loading screen’s',
    },
    'control-md': { ...px('28px'), note: 'sidebar items, tabs and header buttons' },
    'font-sans': { light: sans, dark: sans, from: redesign, note: 'font-regular; text is 13px at weight 450–500' },
  },
};
