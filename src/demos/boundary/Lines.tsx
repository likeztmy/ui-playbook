import { cx } from '../../ui/cx';
import { Compare } from '../shell';
import { Members } from './Members';
import s from './boundary.module.scss';

/** The access section: lines under the heading and around every part, or only between rows. */
function Access({ ruled }: { ruled?: boolean }) {
  return (
    <section className={cx(s.access, ruled && s.ruled)}>
      <h4 className={s.heading}>Access</h4>
      <p className={s.muted}>People who can see and edit this project.</p>
      <Members />
    </section>
  );
}

export function BoundaryLines() {
  return (
    <Compare
      height={300}
      beforeLabel="A rule under everything"
      afterLabel="Lines between rows, lighter than the edge"
      before={<Access ruled />}
      after={<Access />}
      beforeNote={
        <>
          A rule under the heading, another under the description, every line edge to edge and as dark as the box. Fluent: “Don’t underline headers
          with dividers”; put one above a header if it needs one.
        </>
      }
      afterNote="Lines only between the repeated rows, starting at the text as iOS draws them, one step lighter than the group’s edge so the edge stays the boundary."
    />
  );
}
