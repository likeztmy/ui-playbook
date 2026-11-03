// The looks the gallery switches between, built at the server: the playbook's in each palette, then
// each product's that has been sampled. After Apple has only its published greys, so it stays on its
// own page until it is. One secondary line per look would say the same thing five times (C34), so a
// look carries only its name.
import { LOOKS, ours, PALETTES, playbook, rootBlock, valuesOf, type Look } from '../../looks';
import type { Values } from './Panel';

export type GalleryLook = { id: string; name: string; href: string; values: Values; root: string };

const item = (look: Look, page: string): GalleryLook => ({
  id: look.id,
  name: look.name,
  href: `/systems/look-${page}`,
  values: valuesOf(look),
  root: rootBlock(look),
});

export function galleryLooks(): GalleryLook[] {
  return [
    ...PALETTES.map((p) =>
      item({ ...ours, id: p.id === 'blue' ? 'playbook' : `playbook-${p.id}`, name: `Playbook ${p.name}`, values: playbook(p.id) }, 'playbook'),
    ),
    item(
      LOOKS.find((l) => l.id === 'primer')!,
      'primer',
    ),
    item(
      LOOKS.find((l) => l.id === 'linear')!,
      'linear',
    ),
  ];
}

export const lookOptions = (looks: GalleryLook[]) => looks.map((l) => ({ value: l.id, label: l.name }));
