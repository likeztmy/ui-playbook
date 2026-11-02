import { useState, type CSSProperties } from 'react';
import { Button } from '../../ui/Button';
import { SegmentedControl } from '../../ui/SegmentedControl';
import { Switch } from '../../ui/Switch';
import type { Name, Value } from '../../looks';
import { Frame } from '../shell';
import s from './looks.module.scss';

type Values = [Name, Value][];
type Palette = { id: string; name: string; values: Values };

/** One screen built only from the look's variables, in light and dark side by side. */
function Panel({ values, theme }: { values: Values; theme: 'light' | 'dark' }) {
  const vars = Object.fromEntries(values.map(([n, v]) => [`--${n}`, v[theme]])) as CSSProperties;
  return (
    <div
      className={s.panel}
      style={{ ...vars, colorScheme: theme }}
      data-theme={theme}
      aria-label={theme === 'light' ? 'Light' : 'Dark'}
      role="group"
    >
      <div className={s.card}>
        <div className={s.head}>
          <span className={s.title}>Release 4.2</span>
          <span className={s.status} data-tone="success">
            Passed
          </span>
        </div>
        <p className={s.meta}>Tuesday · 12 changes · 2 waiting</p>
        <a href="#" className={s.link} onClick={(e) => e.preventDefault()}>
          Changelog
        </a>
        <label className={s.field}>
          <span>Version</span>
          <input defaultValue="4.2.0" />
        </label>
        <Switch label="Roll out in stages" defaultChecked />
        <div className={s.row}>
          <span className={s.status} data-tone="warning">
            Waiting
          </span>
          <span className={s.status} data-tone="danger">
            Failed
          </span>
        </div>
        <div className={s.actions}>
          <Button>Cancel</Button>
          <Button variant="primary">Publish</Button>
        </div>
      </div>
    </div>
  );
}

/** A look's specimen; with palettes (the playbook's own), a switch between them. */
export function LookSpecimen({ values, palettes }: { values: Values; palettes?: Palette[] }) {
  const [id, setId] = useState(palettes?.[0].id);
  const shown = palettes?.find((p) => p.id === id)?.values ?? values;
  return (
    <Frame label={palettes ? 'Each palette in light and dark' : 'Light and dark'} height={0}>
      <div className={s.specimen}>
        {palettes && (
          <SegmentedControl label="Palette" value={id!} onValueChange={setId} segments={palettes.map((p) => ({ value: p.id, label: p.name }))} />
        )}
        <div className={s.pair}>
          <Panel values={shown} theme="light" />
          <Panel values={shown} theme="dark" />
        </div>
      </div>
    </Frame>
  );
}
