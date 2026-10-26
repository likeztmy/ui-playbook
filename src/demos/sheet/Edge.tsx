import { useState } from 'react';
import { Slider } from '../../ui/Slider';
import { Tweak } from '../shell';
import { Details } from './Details';
import { Map } from './Map';
import { Walk } from './Walk';
import s from './sheet.module.scss';

const WIDE = 460;

/** The same walk at any window width: a sheet over the map when narrow, a column beside it when wide. */
export function SheetEdge() {
  const [width, setWidth] = useState(360);
  const [picked, setPicked] = useState<string | null>(null);
  const wide = width >= WIDE;
  return (
    <Tweak
      height={540}
      readout={wide ? 'Wide: a column beside the map, which makes room' : 'Narrow: a sheet over the map, from the bottom'}
      stage={
        <div className={s.window} style={{ width: `min(${width}px, 100%)` }}>
          {wide ? (
            <div className={s.split}>
              <Map picked={picked} onPick={setPicked} />
              <aside className={s.side} aria-label="Walk to the ferry">
                <h3 className={s.sideTitle}>Walk to the ferry</h3>
                <Details picked={picked} />
              </aside>
            </div>
          ) : (
            <Walk />
          )}
        </div>
      }
      controls={<Slider label="Window width" value={width} onValueChange={setWidth} min={320} max={520} step={10} unit="px" />}
    />
  );
}
