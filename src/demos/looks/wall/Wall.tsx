import { Activity } from './Activity';
import { Alert } from './Alert';
import { Changelog } from './Changelog';
import { Checks } from './Checks';
import { Empty } from './Empty';
import { History } from './History';
import { Notify } from './Notify';
import { Publish } from './Publish';
import { Stats } from './Stats';
import { Team } from './Team';
import s from './Wall.module.scss';

/** One release tool, many components: what a look does to all of them at once. */
export function Wall() {
  return (
    <div className={s.wall}>
      <Stats />
      <Publish />
      <Empty />
      <Activity />
      <Checks />
      <Alert />
      <History />
      <Team />
      <Notify />
      <Changelog />
    </div>
  );
}
