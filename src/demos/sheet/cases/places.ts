// Places to stay behind the filter sheets.

export type Stay = { name: string; price: number; pets: boolean; cancel: boolean };

export const STAYS: Stay[] = [
  { name: 'Flat by the harbour', price: 92, pets: true, cancel: true },
  { name: 'Loft on Quay Street', price: 140, pets: false, cancel: true },
  { name: 'Room above the bakery', price: 64, pets: false, cancel: false },
  { name: 'Cottage on the hill', price: 118, pets: true, cancel: false },
  { name: 'Studio near the ferry', price: 78, pets: true, cancel: true },
  { name: 'Two-bed by the park', price: 156, pets: true, cancel: true },
  { name: 'Attic in the old town', price: 58, pets: false, cancel: true },
  { name: 'Boathouse', price: 99, pets: true, cancel: false },
];

export type Filters = { pets: boolean; cheap: boolean; cancel: boolean };
export const NONE: Filters = { pets: false, cheap: false, cancel: false };

export const matching = (f: Filters) => STAYS.filter((x) => (!f.pets || x.pets) && (!f.cheap || x.price < 100) && (!f.cancel || x.cancel));
