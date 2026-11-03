import { when, type Event } from './story';
import t from './Release.module.scss';

/** The release's history, newest first: who did what, when, and what they said. */
export function Timeline({ events }: { events: Event[] }) {
  return (
    <ol className={t.timeline}>
      {events.map(({ Icon, who, what, hours, quote }) => (
        <li key={`${who}-${what}-${hours}`}>
          <span className={t.mark}>
            <Icon size={16} aria-hidden />
          </span>
          <div>
            <p>
              <strong>{who}</strong> {what} <span className={t.when}>· {hours === 0 ? 'now' : when(hours)}</span>
            </p>
            {quote && <p className={t.quote}>{quote}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}
