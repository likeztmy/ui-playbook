import { StatusIcon } from '../track/StatusIcon';
import { Compare } from '../shell';
import s from './copy.module.scss';

/** An issue's heading, with the line above it: an eyebrow, or where the issue sits. */
function Heading({ eyebrow }: { eyebrow?: boolean }) {
  return (
    <div className={s.issueHead}>
      {eyebrow ? (
        <span className={s.eyebrow}>Issue details</span>
      ) : (
        <span className={s.caption}>
          <StatusIcon status="progress" />
          In progress · ORB-142
        </span>
      )}
      <h3 className={s.issueTitle}>Sign-up drops the workspace name</h3>
      <p className={s.issueBody}>After sign-up, the workspace field on the welcome screen is empty, though it was filled in on the form.</p>
    </div>
  );
}

export function CopyCaption() {
  return (
    <Compare
      height={220}
      beforeLabel="An eyebrow"
      afterLabel="Where it sits"
      before={<Heading eyebrow />}
      after={<Heading />}
      beforeNote="The line above a heading is read first, and this one tells someone looking at an issue that it’s an issue. One agent’s tracker went further: the eyebrow visible, the issue’s real title hidden for screen readers."
      afterNote={
        <>
          The line names where the issue sits, its status and its ID, as{' '}
          <a href="https://design-system.service.gov.uk/styles/headings/">GOV.UK’s caption</a> names the section a question belongs to: sentence case,
          muted ink, text size.
        </>
      }
    />
  );
}
