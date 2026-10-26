import { Compare } from '../shell';
import { Walk } from './Walk';

/** The same sheet at the same height, modal against standard: only what's behind it changes. */
export function SheetBlock() {
  return (
    <Compare
      height={0}
      before={<Walk kind="modal" />}
      after={<Walk />}
      beforeNote="Modal at every height. The map is dimmed and dead, so the first tap on a café only closes the sheet, and the route goes with it."
      afterNote="Standard up to half height: a tap on a café shows it in the sheet, and Back to route brings the walk back. Drag it up to cover the map and it dims and blocks, as Apple’s sheets do from a chosen height."
    />
  );
}
