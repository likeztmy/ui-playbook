// A morning walk to the ferry, drawn on a 340 × 520 map: the route, and two cafés near it.

export type Place = {
  id: string;
  name: string;
  x: number;
  y: number;
  /** Where it sits against the walk. */
  where: string;
  hours: string;
  /** Whether it's open by the time you'd get there: the answer the reader looks for. */
  openThen: boolean;
};

export const PLACES: Place[] = [
  { id: 'harbour', name: 'Harbour Beans', x: 196, y: 128, where: 'On your route · you pass at 8:12', hours: 'Opens 8:30', openThen: false },
  { id: 'kettle', name: 'Kettle & Crumb', x: 108, y: 96, where: '3 min off your route', hours: 'Open now · until 15:00', openThen: true },
];

/** The walk, as map points: from home (bottom left) to the terminal (top right). */
export const ROUTE: [number, number][] = [
  [60, 236],
  [60, 176],
  [150, 176],
  [150, 128],
  [262, 128],
  [262, 64],
];

/** The same walk with a stop at Kettle & Crumb. */
export const VIA: [number, number][] = [
  [60, 236],
  [60, 96],
  [150, 96],
  [150, 128],
  [262, 128],
  [262, 64],
];

export const STEPS = [
  { at: '8:06', what: 'Leave home' },
  { at: '8:09', what: 'Left on Quay Street' },
  { at: '8:12', what: 'Pass Harbour Beans' },
  { at: '8:24', what: 'Ferry terminal, gate 2' },
];

export const place = (id: string | null) => PLACES.find((p) => p.id === id) ?? null;

/** What you pass on the walk, for a sheet longer than its height. */
export const ALONG = [
  'Corner shop, open from 7',
  'Bus stop for the 14',
  'Post box, last collection 9:00',
  'Quay Street steps',
  'Harbour Beans',
  'Fish market',
  'Lifeboat station',
  'Public toilets',
  'Bike racks',
  'Ticket machines',
  'Waiting room',
  'Gate 1',
  'Gate 2',
  'Café on board',
];
