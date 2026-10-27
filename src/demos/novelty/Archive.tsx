import { Compare } from '../shell';
import { BRIEF, FLOURISH, Inbox } from './Inbox';

/** Archive all thirty, twice: a flourish that holds the next press, and a close-up that doesn't. */
export function NoveltyArchive() {
  return (
    <Compare
      beforeLabel="450 ms flight, press waits"
      afterLabel="120 ms close-up, no wait"
      height={380}
      before={<Inbox flourish />}
      after={<Inbox />}
      beforeNote={`Each archive lifts the row and flies it off in ${FLOURISH} ms, and Archive waits for it. All thirty cost 13.5 s of waiting, and the wait is as long on the thirtieth as on the first.`}
      afterNote={`The row closes up in ${BRIEF} ms and the next press counts at once, so holding Enter on Archive empties the Inbox as fast as the key repeats.`}
    />
  );
}
