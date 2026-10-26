import type { ComponentType, ReactNode } from 'react';
import { Walk } from '../Walk';
import { Arrival } from './Arrival';
import { Checkout } from './Checkout';
import { Filters } from './Filters';
import { Format } from './Format';
import { Player } from './Player';
import { Share } from './Share';
import { Stacked } from './Stacked';

export type Case = { id: string; label: string; good: boolean; why: ReactNode; Scene: ComponentType };

/** What goes in a sheet, and what doesn't: each one live, with the reason. */
export const CASES: Case[] = [
  {
    id: 'place',
    label: 'A place on a map',
    good: true,
    why: 'Standard. The sheet is about the map, so the map stays in use: tap another café and the sheet follows.',
    Scene: Walk,
  },
  {
    id: 'filters',
    label: 'Filters, live',
    good: true,
    why: 'Standard. Each switch changes the results above it at once, so the count answers before you decide to look.',
    Scene: () => <Filters live />,
  },
  {
    id: 'format',
    label: 'Formatting a note',
    good: true,
    why: 'Standard and short. The word stays selected and visible; Apple’s example of a non-modal sheet is just this, in Notes.',
    Scene: Format,
  },
  {
    id: 'player',
    label: 'What’s playing',
    good: true,
    why: 'Standard as a bar, so the library stays in use; pulled up, it covers the library and blocks it.',
    Scene: Player,
  },
  {
    id: 'share',
    label: 'Share',
    good: true,
    why: 'Modal and short. A list of actions you pick one of; each closes the sheet, and the result shows where you were.',
    Scene: Share,
  },
  {
    id: 'filters-modal',
    label: 'Filters, applied',
    good: false,
    why: 'Modal over the results it filters. Every change is a guess until Show, and checking one means closing it.',
    Scene: () => <Filters />,
  },
  {
    id: 'checkout',
    label: 'A checkout',
    good: false,
    why: 'Eight fields and a payment are a task of their own: a page. In a sheet the keyboard takes half of it, and a swipe down throws it away.',
    Scene: Checkout,
  },
  {
    id: 'arrival',
    label: 'On arrival',
    good: false,
    why: 'Nothing asked for it. It covers what was opened before a line of it is read.',
    Scene: Arrival,
  },
  {
    id: 'stacked',
    label: 'A sheet on a sheet',
    good: false,
    why: 'Two layers to dismiss, and the first one’s purpose is gone. The playlists belong in the first sheet, in place of its actions.',
    Scene: Stacked,
  },
];
