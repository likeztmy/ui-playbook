import { Children, isValidElement, cloneElement, type CSSProperties, type ReactElement, type ReactNode } from 'react';
import { cx } from './cx';
import s from './Card.module.scss';

export { s as cardClasses };

type CardProps = {
  /** What the card shows: a thumbnail, a chart, a sample. */
  stage: ReactNode;
  title: string;
  subtitle?: ReactNode;
  /** A ghost icon button at the end of the meta row, e.g. More. */
  action?: ReactNode;
  /** Makes the card a link. */
  href?: string;
  /** Makes the card a button. */
  onOpen?: () => void;
  /** Holds a state still for display: "hover", "active", "focus". */
  pin?: string;
  stageClassName?: string;
  className?: string;
  style?: CSSProperties;
};

/** A unit to browse: a project, a sample, a file. */
export function Card({ stage, title, subtitle, action, href, onOpen, pin, stageClassName, className, style }: CardProps) {
  const interactive = Boolean(href || onOpen);
  const titleEl = href ? (
    <a className={s.primary} href={href}>
      {title}
    </a>
  ) : onOpen ? (
    <button type="button" className={s.primary} onClick={onOpen}>
      {title}
    </button>
  ) : (
    title
  );
  return (
    <article className={cx(s.card, className)} data-interactive={interactive || undefined} data-pin={pin} style={style}>
      <div className={cx(s.stage, stageClassName)}>{stage}</div>
      <div className={s.meta}>
        <div className={s.text}>
          <h3 className={s.title}>{titleEl}</h3>
          {subtitle && <p className={s.sub}>{subtitle}</p>}
        </div>
        {action && <div className={s.action}>{action}</div>}
      </div>
    </article>
  );
}

type GridProps = {
  children: ReactNode;
  /** Stagger the cards in when the grid first appears. */
  enter?: boolean;
  /** Narrowest a column may get. */
  minWidth?: number;
  className?: string;
};

/** Cards in columns. With `enter`, they arrive one after another, capped at eight. */
export function CardGrid({ children, enter = true, minWidth, className }: GridProps) {
  let i = 0;
  const items = Children.map(children, (child) =>
    isValidElement(child) ? cloneElement(child as ReactElement<{ style?: CSSProperties }>, { style: { ...(child.props as { style?: CSSProperties }).style, '--i': i++ } as CSSProperties }) : child,
  );
  return (
    <div className={cx(s.grid, enter && s.entering, className)} style={minWidth ? ({ '--card-min': `${minWidth}px` } as CSSProperties) : undefined}>
      {items}
    </div>
  );
}
