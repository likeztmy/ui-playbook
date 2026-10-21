import { Frame } from '../shell';
import { LiveMenu, StillMenu, type Look } from './LabMenu';
import native from './native.module.scss';
import caps from './caps.module.scss';
import command from './command.module.scss';
import s from './lab.module.scss';

export const LOOKS: Record<'native' | 'caps' | 'command', Look> = {
  native: { s: native, icons: false, labels: false, keys: 'native', check: 'left', filter: false },
  caps: { s: caps, icons: true, labels: false, keys: 'caps', check: 'right', filter: false },
  command: { s: command, icons: true, labels: true, keys: 'plain', check: 'right', filter: true },
};

/** One direction: a light still, a dark still, and the live menu. */
export function Direction({ look }: { look: keyof typeof LOOKS }) {
  const l = LOOKS[look];
  const height = look === 'native' ? 300 : 420;
  return (
    <div className={s.row}>
      <Frame label="Light · Duplicate highlighted" defaultTheme="light" height={height}>
        <StillMenu look={l} initial="duplicate" />
      </Frame>
      <Frame label="Dark · Delete highlighted" defaultTheme="dark" height={height}>
        <StillMenu look={l} initial="delete" />
      </Frame>
      <Frame label="Live" height={height}>
        <div className={s.top}>
          <LiveMenu look={l} />
        </div>
      </Frame>
    </div>
  );
}

export const NativeDirection = () => <Direction look="native" />;
export const CapsDirection = () => <Direction look="caps" />;
export const CommandDirection = () => <Direction look="command" />;
