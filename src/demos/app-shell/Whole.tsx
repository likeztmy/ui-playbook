import { Compare } from '../shell';
import { App } from './App';

/** The same window scrolled as one page against scrolled by pane. */
export function AppShellWhole() {
  return (
    <Compare
      beforeLabel="The window scrolls"
      afterLabel="Each pane scrolls"
      stacked
      height={0}
      before={<App whole />}
      after={<App />}
      beforeNote="Read down the page and the sidebar goes with it: the current page’s highlight, the other pages and the account all scroll away, and the account only shows past the end of the longer pane."
      afterNote="The document scrolls under its title; the sidebar keeps the current page lit and the account at its foot. Scroll the pages and the document stays where you were."
    />
  );
}
