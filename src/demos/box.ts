import { useSyncExternalStore } from 'react';

/**
 * How a demo is framed, by `data-box` on <html>. `caption` is the playbook's frame: the label above
 * each stage, the frame's tools at the end of its row. The rest stay for the pilot's comparison:
 * - `band`: the earlier frame, a verdict band under the stage.
 * - `plate`: one plate split in two, a label in each half's corner.
 * - `toggle`: one stage, and a switch under it between the two.
 */
export type Box = 'band' | 'caption' | 'plate' | 'toggle';

const BOXES: Box[] = ['band', 'caption', 'plate', 'toggle'];

function read(): Box {
  const v = document.documentElement.dataset.box as Box | undefined;
  return v && BOXES.includes(v) ? v : 'caption';
}

function subscribe(onChange: () => void) {
  const mo = new MutationObserver(onChange);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-box'] });
  return () => mo.disconnect();
}

/** The page's frame style. Each island is its own root, so it's read from the document. */
export function useBox(): Box {
  return useSyncExternalStore(subscribe, read, () => 'caption');
}

const NARROW = '(max-width: 640px)';

function subscribeNarrow(onChange: () => void) {
  const mq = matchMedia(NARROW);
  mq.addEventListener('change', onChange);
  return () => mq.removeEventListener('change', onChange);
}

/** A phone-wide window: there a pair shows one side at a time, with the switch. */
export function useNarrow() {
  return useSyncExternalStore(subscribeNarrow, () => matchMedia(NARROW).matches, () => false);
}
