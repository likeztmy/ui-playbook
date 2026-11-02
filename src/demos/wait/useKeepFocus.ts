import { useEffect, useRef } from 'react';

/**
 * Keeps focus in a demo whose controls change with each step. When the focused control goes (the
 * export ends and its button gives way to the question), focus moves to the new step's first
 * button instead of falling to <body>. Only while focus was in the demo: a step that ends after
 * the reader has gone elsewhere takes nothing from them.
 */
export function useKeepFocus<T extends HTMLElement>(step: unknown) {
  const box = useRef<T>(null);
  const inside = useRef(false);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const enter = () => (inside.current = true);
    // A removed control blurs with no target; only a real move elsewhere counts as leaving.
    const leave = (e: FocusEvent) => {
      const to = e.relatedTarget as Node | null;
      if (to && !el.contains(to)) inside.current = false;
    };
    const press = (e: PointerEvent) => {
      if (!el.contains(e.target as Node)) inside.current = false;
    };
    el.addEventListener('focusin', enter);
    el.addEventListener('focusout', leave);
    document.addEventListener('pointerdown', press, true);
    return () => {
      el.removeEventListener('focusin', enter);
      el.removeEventListener('focusout', leave);
      document.removeEventListener('pointerdown', press, true);
    };
  }, []);

  useEffect(() => {
    const active = document.activeElement;
    if (!inside.current || (active && active !== document.body)) return;
    box.current?.querySelector<HTMLElement>('button')?.focus();
  }, [step]);

  return box;
}
