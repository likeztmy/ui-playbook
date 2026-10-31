// Dark: the same first screen with the system set to dark. Whatever scheme the build offers there,
// its text holds 4.5:1, as it must in light.
import { look } from '../look.mjs';

export default async function dark({ page, snap, check, light }) {
  const { faintText } = await look(page);
  await snap('dark');
  check('contrast-light', light.faintText <= 0.02, `${(light.faintText * 100).toFixed(1)}% of text under 4.5:1`);
  check('contrast-dark', faintText <= 0.02, `${(faintText * 100).toFixed(1)}% of text under 4.5:1`);
}
