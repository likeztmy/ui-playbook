import { Compare } from '../shell';
import { Settings } from './Settings';

/** The page's own scene: a project's settings, every section boxed, or bounded by its heading. */
export function BoundaryLead() {
  return (
    <Compare
      stacked
      height={0}
      beforeLabel="Every section a card"
      afterLabel="Headings and space; one box where it’s needed"
      before={<Settings boxed />}
      after={<Settings />}
      beforeNote="As the agents built it: every section a card, with the playbook and without, and in one build a header band and a footer band inside each. Three sections become nine regions, each one more for the eye to sort."
      afterNote="Each section is held by its heading and the space around it. The access list is one group with lines between its rows, and the danger zone is the one region set apart, because it is the one that differs."
    />
  );
}
