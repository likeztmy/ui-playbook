// The looks, by id. The playbook's own is built from its tokens; each product's is typed out with sources.
import { playbook, type Look } from './look';
import { primer } from './primer';

export const ours: Look = {
  id: 'playbook',
  name: 'Playbook',
  font: {
    name: 'Geist',
    licence: 'SIL Open Font License 1.1: free to embed on the web.',
    from: { label: 'vercel/geist-font', href: 'https://github.com/vercel/geist-font' },
  },
  values: playbook(),
};

export const LOOKS: Look[] = [ours, primer];
export const lookById = (id: string) => LOOKS.find((l) => l.id === id)!;
export { NAMES, PALETTES, playbook, rootBlock, valuesOf, type Look, type Name, type Value } from './look';
