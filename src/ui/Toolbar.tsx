import { Toolbar as BaseToolbar } from '@base-ui/react/toolbar';
import { Toggle } from '@base-ui/react/toggle';
import { ToggleGroup } from '@base-ui/react/toggle-group';
import type { ComponentProps, ReactNode } from 'react';
import { buttonClass } from './Button';
import { cx } from './cx';
import { Tip, TipGroup } from './Tooltip';
import s from './Toolbar.module.scss';


// Tooltips sit space-1 from the panel's edge, not the tool's: tools are inset 4.
const TIP_OFFSET = 8;

function Root({ className, ...props }: ComponentProps<typeof BaseToolbar.Root>) {
  return (
    <TipGroup>
      <BaseToolbar.Root {...props} className={cx(s.toolbar, className as string)} />
    </TipGroup>
  );
}

/** A set of mutually exclusive tools, e.g. Select / Rectangle / Pen. */
function Tools({ className, ...props }: ComponentProps<typeof ToggleGroup>) {
  return <ToggleGroup {...props} className={cx(s.group, className as string)} />;
}

type ToolProps = {
  value: string;
  label: string;
  children: ReactNode;
  /** Its shortcut, shown in the tooltip. */
  keys?: string[];
  className?: string;
  /** Holds a state still for display; see styles/_states.scss. */
  pin?: string;
  /** Demo only: name the tool with a native title instead of a Tip. */
  nativeTitle?: boolean;
};

/** One tool in a Tools group: an icon toggle, named by its tooltip. */
function Tool({ value, label, keys, children, className, pin, nativeTitle }: ToolProps) {
  const button = (
    <BaseToolbar.Button
      render={<Toggle value={value} />}
      aria-label={label}
      title={nativeTitle ? label : undefined}
      data-pin={pin}
      className={cx(buttonClass({ icon: true }), s.tool, className)}
    >
      {children}
    </BaseToolbar.Button>
  );
  return nativeTitle ? (
    button
  ) : (
    <Tip label={label} keys={keys} offset={TIP_OFFSET}>
      {button}
    </Tip>
  );
}

type ActionProps = ComponentProps<typeof BaseToolbar.Button> & {
  primary?: boolean;
  /** Icon-only action: names it for screen readers and in a tooltip. */
  label?: string;
  keys?: string[];
};

/** A one-off command: a button, never pressed. */
function Action({ primary, label, keys, className, ...props }: ActionProps) {
  const button = (
    <BaseToolbar.Button
      {...props}
      aria-label={label ?? props['aria-label']}
      className={cx(
        buttonClass({ variant: primary ? 'primary' : 'secondary', icon: Boolean(label) }),
        !primary && s.tool,
        className as string,
      )}
    />
  );
  return label ? (
    <Tip label={label} keys={keys} offset={TIP_OFFSET}>
      {button}
    </Tip>
  ) : (
    button
  );
}

function Separator() {
  return <BaseToolbar.Separator className={s.separator} />;
}

export const Toolbar = { Root, Tools, Tool, Action, Separator };
