// Two languages: English at /, Chinese under /zh/. English is the source;
// a page not yet translated links to its English original. Server-only:
// the page glob would pull every MDX page into a client bundle.

export type Lang = 'en' | 'zh';

export const langOf = (pathname: string): Lang => (pathname === '/zh' || pathname.startsWith('/zh/') ? 'zh' : 'en');

/** The same path in `lang`. */
export const pathIn = (pathname: string, lang: Lang) => {
  const bare = pathname.replace(/^\/zh(?=\/|$)/, '') || '/';
  return lang === 'zh' ? (bare === '/' ? '/zh/' : `/zh${bare}`) : bare;
};

// Which pages have a Chinese version: /components/x and /principles/x.
const zhPages = new Set(
  Object.keys(import.meta.glob('./pages/zh/{components,principles}/*.mdx')).map((p) => p.replace('./pages/zh', '').replace(/\.mdx$/, '')),
);
export const hasZh = (path: string) => zhPages.has(path.replace(/\/$/, ''));

/** Where a link to `path` should go from a page in `lang`. */
export const linkIn = (path: string, lang: Lang) => (lang === 'zh' && hasZh(path) ? pathIn(path, 'zh') : path);

export const ui = {
  en: {
    lede: 'The small details that make interface components feel right, each one shown side by side.',
    search: 'Search components and principles',
    components: 'Components',
    principles: 'Principles',
    allComponents: 'All components',
    allPrinciples: 'All principles',
    component: 'Component',
    principle: 'Principle',
    previous: 'Previous',
    next: 'Next',
    more: 'More entries',
    details: (n: number) => `${n} ${n === 1 ? 'detail' : 'details'}`,
    nothing: 'Nothing matches',
    clear: 'Clear search',
    other: '中文',
    otherLang: 'zh-CN',
    description: 'The small details that make interface components feel right.',
  },
  zh: {
    lede: '让界面组件用起来顺手的那些细节，每一条都摆在一起对比。',
    search: '搜索组件和原则',
    components: '组件',
    principles: '原则',
    allComponents: '全部组件',
    allPrinciples: '全部原则',
    component: '组件',
    principle: '原则',
    previous: '上一篇',
    next: '下一篇',
    more: '更多条目',
    details: (n: number) => `${n} 个细节`,
    nothing: '没有匹配',
    clear: '清除搜索',
    other: 'English',
    otherLang: 'en',
    description: '让界面组件用起来顺手的那些细节。',
  },
} as const;

