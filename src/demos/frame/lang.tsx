import { createContext, useContext, type ComponentType } from 'react';

export type Lang = 'en' | 'zh';

const LangContext = createContext<Lang>('en');

/** The page's language, for a demo's notes. */
export const useLang = () => useContext(LangContext);

/**
 * Lets an MDX page say which language a demo speaks: <Demo lang="zh" />.
 * Each island is its own React root, so the language rides in as a prop.
 */
export function localized<P extends object>(Demo: ComponentType<P>) {
  const Localized = ({ lang = 'en', ...props }: P & { lang?: Lang }) => (
    <LangContext.Provider value={lang}>
      <Demo {...(props as P)} />
    </LangContext.Provider>
  );
  Localized.displayName = Demo.displayName ?? Demo.name;
  return Localized;
}

export const FRAME_UI = {
  en: { avoid: 'Avoid', prefer: 'Prefer', theme: 'Switch theme', slow: 'Slow motion', gaps: 'Show gaps' },
  zh: { avoid: 'Avoid', prefer: 'Prefer', theme: '切换主题', slow: '慢放', gaps: '显示间距' },
} as const;
