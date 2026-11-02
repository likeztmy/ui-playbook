import { Checkbox } from '../../../ui/Checkbox';
import { Radio, RadioGroup } from '../../../ui/Radio';
import s from './Wall.module.scss';

/** Checkboxes for what, radios for where. */
export function Notify() {
  return (
    <section className={s.card} aria-label="Notifications">
      <div className={s.head}>
        <h3>Notifications</h3>
      </div>
      <Checkbox label="A release goes out" defaultChecked />
      <Checkbox label="A check fails" defaultChecked />
      <Checkbox label="Weekly digest" />
      <RadioGroup label="Send to" defaultValue="email" inline>
        <Radio value="email" label="Email" />
        <Radio value="chat" label="Team chat" />
      </RadioGroup>
    </section>
  );
}
