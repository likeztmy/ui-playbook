import { Button } from '../../../../ui/Button';
import { Combobox } from '../../../../ui/Combobox';
import { TextField } from '../../../../ui/Field';
import { Radio, RadioGroup } from '../../../../ui/Radio';
import { Switch } from '../../../../ui/Switch';
import { useToast } from '../../../../ui/Toast';
import { people } from '../data';
import { isArchived, setArchived } from '../store';
import t from './Settings.module.scss';

const approvers = people.map((p) => ({ value: p, label: p }));

/**
 * Settings that save themselves: switches for on and off, radios for one of a few (C31), so there is no
 * Save. Each group is held by its heading and space on one left edge; only the danger zone, the one
 * group unlike the rest, is set apart in a box. Archiving can be undone, so it runs at once and offers
 * Undo rather than asking first.
 */
export function Settings() {
  // Kept in Ship's store, so leaving Settings and coming back finds it as it was left.
  const archived = isArchived();
  const toast = useToast();
  const archive = () => {
    const undo = setArchived(true);
    toast({ title: 'Archived Ship mobile', action: { label: 'Undo', onClick: undo } });
  };
  return (
    <div className={t.column}>
      <section className={t.group} aria-labelledby="ship-general">
        <h3 id="ship-general">General</h3>
        <TextField label="Name" defaultValue="Ship mobile" />
        <TextField label="Bundle ID" defaultValue="app.ship.mobile" description="Set by the App Store." readOnly />
        <RadioGroup label="Default channel" defaultValue="beta" inline>
          <Radio value="stable" label="Stable" />
          <Radio value="beta" label="Beta" />
          <Radio value="nightly" label="Nightly" />
        </RadioGroup>
      </section>
      <section className={t.group} aria-labelledby="ship-rollouts">
        <h3 id="ship-rollouts">Rollouts</h3>
        <RadioGroup label="Start each release at" defaultValue="10">
          <Radio value="1" label="1% of users" description="Slowest; catches rare crashes first." />
          <Radio value="10" label="10% of users" />
          <Radio value="100" label="Everyone" description="For hotfixes." />
        </RadioGroup>
        <Combobox label="Approvers" multiple items={approvers} defaultValue={[approvers[0], approvers[2]]} />
        <div className={t.switches}>
          <Switch label="Halt when crash-free falls below 99.5%" defaultChecked />
          <Switch label="Post to #releases in Slack" />
        </div>
      </section>
      <section className={t.group} aria-labelledby="ship-danger">
        <h3 id="ship-danger">Danger zone</h3>
        <div className={t.danger}>
          {archived ? (
            <div>
              <p className={t.strong}>This project is archived</p>
              <p className={t.meta}>Its rollouts are paused; the history stays readable.</p>
            </div>
          ) : (
            <div>
              <p className={t.strong}>Archive this project</p>
              <p className={t.meta}>Rollouts pause and the history stays readable.</p>
            </div>
          )}
          <Button size="sm" variant={archived ? 'secondary' : 'danger'} onClick={archived ? () => void setArchived(false) : archive}>
            {archived ? 'Unarchive project' : 'Archive project'}
          </Button>
        </div>
      </section>
    </div>
  );
}
