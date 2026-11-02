import { Button } from '../../../ui/Button';
import { Combobox } from '../../../ui/Combobox';
import { TextField } from '../../../ui/Field';
import { Radio, RadioGroup } from '../../../ui/Radio';
import { Select } from '../../../ui/Select';
import { Switch } from '../../../ui/Switch';
import { people } from './data';
import { Shell } from './Shell';
import s from './Page.module.scss';
import t from './Settings.module.scss';

const approvers = people.map((p) => ({ value: p, label: p }));

/** Grouped settings: each group a heading and a card, the risky one last and set apart. */
export function Settings() {
  return (
    <Shell section="settings" place="Settings">
      <div className={t.column}>
        <h2 className={s.title}>Project</h2>
        <section className={t.group} aria-labelledby="st-general">
          <h3 id="st-general">General</h3>
          <div className={s.card}>
            <TextField label="Name" defaultValue="Ship mobile" />
            <TextField label="Bundle ID" defaultValue="app.ship.mobile" description="Set by the App Store; read only." readOnly />
            <Select
              label="Default channel"
              defaultValue="beta"
              options={[
                { value: 'stable', label: 'Stable' },
                { value: 'beta', label: 'Beta' },
                { value: 'nightly', label: 'Nightly' },
              ]}
            />
          </div>
        </section>
        <section className={t.group} aria-labelledby="st-rollout">
          <h3 id="st-rollout">Rollouts</h3>
          <div className={s.card}>
            <RadioGroup label="Start each release at" defaultValue="10">
              <Radio value="1" label="1% of users" description="Slowest; catches rare crashes first." />
              <Radio value="10" label="10% of users" />
              <Radio value="100" label="Everyone" description="For hotfixes." />
            </RadioGroup>
            <Combobox label="Approvers" multiple items={approvers} defaultValue={[approvers[0], approvers[2]]} placeholder="Add a person" />
            <Switch label="Halt when crash-free falls below 99.5%" defaultChecked />
            <Switch label="Post to #releases in Slack" />
          </div>
        </section>
        <section className={t.group} aria-labelledby="st-danger">
          <h3 id="st-danger">Danger zone</h3>
          <div className={`${s.card} ${t.danger}`}>
            <div className={t.row}>
              <div>
                <p className={t.strong}>Archive this project</p>
                <p className={s.meta}>Releases stop and the history stays readable.</p>
              </div>
              <Button size="sm" variant="danger">
                Archive
              </Button>
            </div>
          </div>
        </section>
      </div>
    </Shell>
  );
}
