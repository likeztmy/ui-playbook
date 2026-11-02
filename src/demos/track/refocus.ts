/**
 * After issues leave the list: once focus has fallen to <body> with them, now or when a closing menu
 * or dialog hands it back to a row that's gone, it goes to the list's current issue, its one tab
 * stop, which deleting has moved to the next issue, else the one before it. With none left, the
 * issues' region. On a phone, where the panel covers the list, it's the panel's Back. Watches for
 * half a second; focus that lands anywhere else in that time is left where it is.
 */
export function refocus(scope: Element | null | undefined) {
  const until = performance.now() + 500;
  const target = () =>
    scope?.isConnected
      ? (scope.querySelector<HTMLElement>('aside[data-narrow] button') ??
        scope.querySelector<HTMLElement>('[data-n][tabindex="0"]') ??
        scope.querySelector<HTMLElement>('[data-issues]'))
      : null;
  const check = () => {
    const at = document.activeElement;
    if (!at || at === document.body) target()?.focus();
    else if (performance.now() < until) requestAnimationFrame(check);
  };
  requestAnimationFrame(check);
}
