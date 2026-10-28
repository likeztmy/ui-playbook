import { Compare } from '../shell';
import { Issues } from './Issues';

/** The rule: the same twelve issues, one overdue, with labels in their own fills or grey with a dot. */
export function GreyOverdue() {
  return (
    <Compare
      stacked
      height={0}
      beforeLabel="Every label in its own colour"
      afterLabel="Labels grey, their colour a dot"
      before={<Issues filled />}
      after={<Issues />}
      beforeNote={
        <>
          Is anything late? With ten hues on the screen, the red that answers is one more colour to check. Finding a colour you were told to look for
          barely slows down as hues are added; noticing the one you weren’t looking for does (
          <a href="https://doi.org/10.1109/TVCG.2012.233">Haroz and Whitney 2012</a>).
        </>
      }
      afterNote="The screen is grey, so the one red is seen before it’s looked for. Each label keeps its colour, small, beside its name."
    />
  );
}
