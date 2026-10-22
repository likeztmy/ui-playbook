import { Tabs as BaseTabs } from '@base-ui/react/tabs';
import type { ComponentProps, ReactNode } from 'react';
import { cx } from './cx';
import s from './Tabs.module.scss';

export { s as tabsClasses };

function List({ className, children, ...props }: ComponentProps<typeof BaseTabs.List>) {
  return (
    // Panels show at once, so arrowing onto a tab opens it (WAI-ARIA's
    // automatic activation).
    <BaseTabs.List activateOnFocus {...props} className={cx(s.list, className as string)}>
      {children}
      <BaseTabs.Indicator className={s.indicator} renderBeforeHydration />
    </BaseTabs.List>
  );
}

type TabProps = Omit<ComponentProps<typeof BaseTabs.Tab>, 'children'> & {
  children: ReactNode;
  /** A number beside the label: open issues, unread comments. */
  count?: number;
  /** Holds a state still for display: "hover", "focus". */
  pin?: string;
};

function Tab({ children, count, pin, className, ...props }: TabProps) {
  return (
    <BaseTabs.Tab {...props} className={cx(s.tab, className as string)} data-pin={pin}>
      {children}
      {count != null && <span className={s.count}>{count}</span>}
    </BaseTabs.Tab>
  );
}

function Panel({ className, ...props }: ComponentProps<typeof BaseTabs.Panel>) {
  return <BaseTabs.Panel {...props} className={cx(s.panel, className as string)} />;
}

/** Views of one thing, side by side: Overview, Activity, Settings. */
export const Tabs = { Root: BaseTabs.Root, List, Tab, Panel };
