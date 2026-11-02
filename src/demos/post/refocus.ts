/**
 * After rows leave the list: once focus has fallen to <body> with them, now or when a closing menu
 * hands it back to a row that's gone, it goes to `target`. Watches for half a second; focus that
 * lands anywhere else in that time is left where it is.
 */
export function refocus(target: () => HTMLElement | null | undefined) {
  const until = performance.now() + 500;
  const check = () => {
    const at = document.activeElement;
    if (!at || at === document.body) target()?.focus({ preventScroll: true });
    else if (performance.now() < until) requestAnimationFrame(check);
  };
  requestAnimationFrame(check);
}

/** In an app root `scope`: a row by its id, else the list itself. */
export function rowOrList(scope: Element | null | undefined, id: string | undefined) {
  if (!scope?.isConnected) return null;
  return (id ? scope.querySelector<HTMLElement>(`[data-row="${id}"] > button`) : null) ?? scope.querySelector<HTMLElement>('[role="list"]');
}
