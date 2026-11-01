import { Frame } from '../shell';
import { App } from './App';

/** The page's own scene: scroll the pages or the document, and only that pane moves. */
export function AppShellLive() {
  return (
    <Frame label="Scroll either pane" height={0}>
      <App />
    </Frame>
  );
}
