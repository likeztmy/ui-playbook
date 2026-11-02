import { useState } from 'react';
import { Button } from '../../../ui/Button';
import { TextField } from '../../../ui/Field';
import { Select } from '../../../ui/Select';
import { Slider } from '../../../ui/Slider';
import { Switch } from '../../../ui/Switch';
import s from './Wall.module.scss';

/** The form: field, select, slider, switch and the two buttons. */
export function Publish() {
  const [share, setShare] = useState(25);
  return (
    <section className={s.card} aria-label="Publish 4.2.0">
      <div className={s.head}>
        <h3>Publish 4.2.0</h3>
        <span className={s.meta}>12 changes</span>
      </div>
      <TextField label="Version" defaultValue="4.2.0" />
      <Select
        label="Channel"
        defaultValue="stable"
        options={[
          { value: 'stable', label: 'Stable' },
          { value: 'beta', label: 'Beta' },
          { value: 'nightly', label: 'Nightly' },
        ]}
      />
      <Slider label="First rollout" value={share} onValueChange={setShare} step={5} unit="%" />
      <Switch label="Email subscribers" defaultChecked />
      <div className={s.actions}>
        <Button>Save draft</Button>
        <Button variant="primary">Publish</Button>
      </div>
    </section>
  );
}
