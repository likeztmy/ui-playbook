import { Compare } from '../shell';
import { Walk } from './Walk';

/** A sheet with more than fits at half height: scrolling it either raises the sheet or scrolls the list. */
export function SheetScroll() {
  return (
    <Compare
      beforeLabel="Scrolling raises the sheet"
      afterLabel="Scrolling scrolls the list"
      height={0}
      before={<Walk long scrollGrows />}
      after={<Walk long />}
      beforeNote="Scroll the list and the sheet rises first, over the map you were following. Apple’s default, designed for sheets that block anyway."
      afterNote="The list scrolls inside the sheet at half height; the grabber and the header change the height. Apple’s advice for a non-modal sheet."
    />
  );
}
