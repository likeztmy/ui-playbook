// How Ship moves between its places: each is a link with its own address, swapped in place on a plain
// click. The gallery provides it; any link inside Ship reads it.
import { createContext, useContext } from 'react';
import type { Place } from './model';

export type Nav = { current: Place; href: (to: Place) => string; go: (to: Place) => void };

export const NavContext = createContext<Nav | null>(null);

export function useNav() {
  const nav = useContext(NavContext);
  if (!nav) throw new Error('Ship needs a NavContext');
  return nav;
}
