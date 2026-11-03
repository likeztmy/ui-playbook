import { Activity } from './Activity';
import { Alert } from './Alert';
import { Checks } from './Checks';
import { Health } from './Health';
import { History } from './History';
import { Hotfixes } from './Hotfixes';
import { Notes } from './Notes';
import { Notify } from './Notify';
import { Publish } from './Publish';
import { Team } from './Team';
import c from './Components.module.scss';

/**
 * Every part of the look at once, from one release tool. Each part is a section held by its heading
 * and space, in columns: no card round any of them (the lightest boundary). The one box is the alert,
 * the region that differs.
 */
export function Components() {
  return (
    <div className={c.page}>
      <Health />
      <Publish />
      <Hotfixes />
      <Activity />
      <Checks />
      <Alert />
      <History />
      <Team />
      <Notify />
      <Notes />
    </div>
  );
}
