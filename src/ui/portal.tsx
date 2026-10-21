import { createContext, useContext } from 'react';

// Popups portal into the nearest demo frame, so a frame pinned to one
// theme keeps its menus in that theme too. Null falls back to <body>.
export const PortalContainer = createContext<HTMLElement | null>(null);

export function usePortalContainer() {
  return useContext(PortalContainer) ?? undefined;
}
