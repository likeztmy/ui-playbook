import { useLayoutEffect, useRef, useState } from 'react';
import { Switch } from '../../ui/Switch';
import { Tweak } from '../shell';
import { App } from './App';

/** The layer between the window and the panes, with and without `min-height: 0`. */
export function AppShellMinHeight() {
  const [zero, setZero] = useState(false);
  const app = useRef<HTMLDivElement>(null);
  const [read, setRead] = useState<{ pane: number; scrolls: number } | null>(null);
  useLayoutEffect(() => {
    const body = app.current?.querySelector<HTMLElement>('[data-pane="content"]');
    if (body) setRead({ pane: Math.round(body.clientHeight), scrolls: Math.round(body.scrollHeight - body.clientHeight) });
  }, [zero]);
  const px = (n: number) => `${n.toLocaleString('en')} px`;
  return (
    <Tweak
      height={0}
      readout={
        read &&
        (read.scrolls > 0
          ? `The document pane is ${px(read.pane)} and scrolls ${px(read.scrolls)}`
          : `The document pane is ${px(read.pane)}, cut off by the window: nothing scrolls`)
      }
      stage={<App ref={app} loose={!zero} />}
      controls={<Switch label="min-height: 0 on the layout" checked={zero} onCheckedChange={setZero} />}
    />
  );
}
