import { Wall } from '../wall/Wall';
import { Dashboard } from './Dashboard';
import { Marketing } from './marketing/Marketing';
import { Overlays } from './Overlays';
import { Release } from './Release';
import { Releases } from './Releases';
import { Settings } from './Settings';
import { States } from './States';

/** Ship's pages, in the order the gallery's switcher lists them. */
export const PAGES = [
  { id: 'cards', label: 'Cards', Page: Wall },
  { id: 'dashboard', label: 'Dashboard', Page: Dashboard },
  { id: 'releases', label: 'Releases', Page: Releases },
  { id: 'release', label: 'Release', Page: Release },
  { id: 'settings', label: 'Settings', Page: Settings },
  { id: 'overlays', label: 'Overlays', Page: Overlays },
  { id: 'states', label: 'States', Page: States },
  { id: 'marketing', label: 'Marketing', Page: Marketing },
] as const;

export type PageId = (typeof PAGES)[number]['id'];
