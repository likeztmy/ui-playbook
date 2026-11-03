import type { AnchorHTMLAttributes } from 'react';
import { follow } from '../address';
import type { Place } from './model';
import { useNav } from './nav';

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & { to: Place };

/** A link to one of Ship's places: a real address, opened in place on a plain click. */
export function PlaceLink({ to, onClick, ...rest }: Props) {
  const nav = useNav();
  return (
    <a
      {...rest}
      href={nav.href(to)}
      onClick={(e) => {
        onClick?.(e);
        follow(e, () => nav.go(to));
      }}
    />
  );
}
