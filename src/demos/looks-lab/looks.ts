// The looks the lab directions switch between, built at the server as the gallery's are: the
// playbook's in each palette, then each product's that has been sampled. One secondary line per look
// would say the same thing five times (C34), so a look carries only its name.
import { LOOKS, ours, PALETTES, playbook, rootBlock, valuesOf, type Look } from '../../looks';
import type { Values } from '../looks/Panel';

export type LabLook = { id: string; name: string; font: string; href: string; values: Values; root: string };

const item = (look: Look, page: string): LabLook => ({
  id: look.id,
  name: look.name,
  font: look.font.name,
  href: `/systems/look-${page}`,
  values: valuesOf(look),
  root: rootBlock(look),
});

export function labLooks(): LabLook[] {
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

export const lookOptions = (looks: LabLook[]) => looks.map((l) => ({ value: l.id, label: l.name }));

/** What sets a look apart, in one line: its face, body size, row height, control shape and accent. */
export function factsOf(look: LabLook) {
  const v = (n: string) => look.values.find(([k]) => k === n)?.[1].light ?? '';
  const control = v('radius-control') === '9999px' ? 'pill controls' : `${v('radius-control')} controls`;
  return [look.font, `${v('text-md')} text`, `${v('row-height')} rows`, control];
}
