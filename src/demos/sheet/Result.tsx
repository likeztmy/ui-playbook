import { Compare } from '../shell';
import { Walk } from './Walk';

/** Adding a stop from a sheet that covers the map: the change happens where it can't be seen, or the sheet moves to show it. */
export function SheetResult() {
  return (
    <Compare
      height={0}
      before={<Walk tall stop />}
      after={<Walk tall stop reveal />}
      beforeNote="Add stop changes the walk on the map, under the sheet. The button’s label is all that says anything happened."
      afterNote="Add stop lowers the sheet to half, so the new walk is in sight. Apple’s fix in its own sheets: when a sheet stops closing, it has to move to show what it did."
    />
  );
}
