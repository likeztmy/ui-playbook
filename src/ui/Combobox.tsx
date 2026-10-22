import { Combobox as BaseCombobox } from '@base-ui/react/combobox';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import { useId, useState, type ReactNode } from 'react';
import { cx } from './cx';
import { fieldClasses as f } from './Field';
import { menuClasses as m } from './Menu';
import { usePortalContainer } from './portal';
import s from './Combobox.module.scss';

export { s as comboboxClasses };

export type ComboItem = { value: string; label: string; /** Trailing detail, also searched. */ meta?: string };
export type ComboGroup = { value: string; items: ComboItem[] };

type CommonProps = {
  label: string;
  items: ComboItem[] | ComboGroup[];
  placeholder?: string;
  description?: ReactNode;
  /** Highlight the first match so Enter picks it. */
  autoHighlight?: boolean;
  /** Set the matched letters in bold. */
  showMatch?: boolean;
  /** Only for showing the mistake: case- and accent-sensitive matching. */
  strict?: boolean;
  /** What the list says when nothing matches the query. */
  empty?: (query: string) => ReactNode;
  className?: string;
};

type SingleProps = CommonProps & {
  multiple?: false;
  defaultValue?: ComboItem | null;
  value?: ComboItem | null;
  onValueChange?: (value: ComboItem | null) => void;
};

type MultipleProps = CommonProps & {
  multiple: true;
  defaultValue?: ComboItem[];
  value?: ComboItem[];
  onValueChange?: (value: ComboItem[]) => void;
};

const isGrouped = (items: ComboItem[] | ComboGroup[]): items is ComboGroup[] => items.length > 0 && 'items' in items[0];

const defaultEmpty = (query: string) => (query ? <>Nothing matches “{query}”.</> : 'No options.');

/** The label with the first match of the query in bold. */
function Match({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>;
  // Compare without case or accents, so the bold lands where the match was.
  const fold = (t: string) => t.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();
  const at = fold(text).indexOf(fold(query));
  if (at < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, at)}
      <b className={s.match}>{text.slice(at, at + query.length)}</b>
      {text.slice(at + query.length)}
    </>
  );
}

/**
 * A Select you can type into: filter a long list, pick one (or several, as
 * chips). Matching ignores case and accents and searches the trailing detail.
 */
export function Combobox(props: SingleProps | MultipleProps) {
  const {
    label,
    items,
    placeholder,
    description,
    autoHighlight = true,
    showMatch = true,
    strict,
    empty = defaultEmpty,
    className,
    multiple,
    onValueChange,
    ...value
  } = props;
  const id = useId();
  const container = usePortalContainer();
  const [query, setQuery] = useState('');
  const { contains } = BaseCombobox.useFilter();
  const filter = strict
    ? (item: ComboItem, q: string) => item.label.includes(q)
    : (item: ComboItem, q: string) => contains(item.label, q) || (item.meta ? contains(item.meta, q) : false);
  const grouped = isGrouped(items);

  const row = (item: ComboItem) => (
    <BaseCombobox.Item key={item.value} value={item} className={cx(m.item, s.item)}>
      <BaseCombobox.ItemIndicator keepMounted className={m.check}>
        <Check size={16} strokeWidth={1.75} nonScalingStroke aria-hidden />
      </BaseCombobox.ItemIndicator>
      <span className={m.text}>{showMatch ? <Match text={item.label} query={query} /> : item.label}</span>
      {item.meta && <span className={s.meta}>{showMatch ? <Match text={item.meta} query={query} /> : item.meta}</span>}
    </BaseCombobox.Item>
  );

  const input = (hasValue: boolean) => (
    <BaseCombobox.Input id={id} className={cx(f.control, s.input)} placeholder={hasValue ? undefined : placeholder} />
  );

  return (
    <div className={cx(f.field, className)}>
      <BaseCombobox.Root
        {...(value as object)}
        multiple={multiple}
        items={items}
        filter={filter as never}
        autoHighlight={autoHighlight}
        itemToStringLabel={(i: ComboItem) => i.label}
        isItemEqualToValue={(a: ComboItem, b: ComboItem) => a.value === b.value}
        onValueChange={(next: unknown, details: BaseCombobox.Root.ChangeEventDetails) => {
          // Base UI clears the value on a second Esc. A picker keeps it:
          // Esc backs out of the list, it doesn't throw the choice away.
          if (details.reason === 'escape-key') return details.cancel();
          (onValueChange as ((v: unknown) => void) | undefined)?.(next);
        }}
        onInputValueChange={(q: string, details: BaseCombobox.Root.ChangeEventDetails) => {
          if (details.reason === 'escape-key' && q === '') return details.cancel();
          setQuery(q);
        }}
      >
        <label htmlFor={id} className={f.label}>
          {label}
        </label>
        <BaseCombobox.InputGroup className={cx(f.box, s.box, multiple && s.multiple)}>
          {multiple ? (
            <BaseCombobox.Value>
              {(chosen: ComboItem[]) => (
                <BaseCombobox.Chips className={s.chips} aria-label={chosen.length ? `Chosen ${label.toLowerCase()}` : undefined}>
                  {chosen.map((c) => (
                    <BaseCombobox.Chip key={c.value} className={s.chip} aria-label={c.label}>
                      {c.label}
                      <BaseCombobox.ChipRemove className={s.chipRemove} aria-label={`Remove ${c.label}`}>
                        <X size={12} strokeWidth={1.75} nonScalingStroke aria-hidden />
                      </BaseCombobox.ChipRemove>
                    </BaseCombobox.Chip>
                  ))}
                  {input(chosen.length > 0)}
                </BaseCombobox.Chips>
              )}
            </BaseCombobox.Value>
          ) : (
            input(false)
          )}
          <BaseCombobox.Trigger className={s.trigger} aria-label={`Show all ${label.toLowerCase()}`}>
            <ChevronsUpDown size={16} strokeWidth={1.5} nonScalingStroke aria-hidden />
          </BaseCombobox.Trigger>
        </BaseCombobox.InputGroup>
        {description && <p className={f.hint}>{description}</p>}
        <BaseCombobox.Portal container={container}>
          <BaseCombobox.Positioner className={s.positioner} sideOffset={6} align="start">
            <BaseCombobox.Popup className={cx(m.popup, s.popup)}>
              <BaseCombobox.Empty className={s.empty}>{empty(query)}</BaseCombobox.Empty>
              <BaseCombobox.List className={s.list}>
                {grouped
                  ? (g: ComboGroup) => (
                      <BaseCombobox.Group key={g.value} items={g.items} className={s.group}>
                        <BaseCombobox.GroupLabel className={m.label}>{g.value}</BaseCombobox.GroupLabel>
                        <BaseCombobox.Collection>{row}</BaseCombobox.Collection>
                      </BaseCombobox.Group>
                    )
                  : row}
              </BaseCombobox.List>
            </BaseCombobox.Popup>
          </BaseCombobox.Positioner>
        </BaseCombobox.Portal>
      </BaseCombobox.Root>
    </div>
  );
}
