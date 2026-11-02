// Linear's brand neutrals and typefaces: all it publishes that's visual.
import type { Look, Source } from './look';

const brand: Source = { label: 'Linear brand', href: 'https://linear.app/brand' };
const redesign: Source = { label: 'Linear, UI redesign', href: 'https://linear.app/now/how-we-redesigned-the-linear-ui' };
const sans = '"Inter Variable", Inter, system-ui, sans-serif';

export const linear: Look = {
  id: 'linear',
  name: 'After Linear',
  font: {
    name: 'Inter, with Inter Display for headings',
    licence: 'SIL Open Font License 1.1: free to embed on the web.',
    from: { label: 'rsms/inter', href: 'https://github.com/rsms/inter' },
  },
  values: {
    bg: { light: '#f4f5f8', dark: '#0e0f11', from: brand, note: 'Mercury White; dark is the playbook’s' },
    ink: { light: '#222326', dark: '#ececef', from: brand, note: 'Nordic Gray; dark is the playbook’s' },
    'font-sans': { light: sans, dark: sans, from: redesign, note: 'Inter for text, Inter Display for headings' },
  },
};
