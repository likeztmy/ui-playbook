// What the first screen carries: hues, tinted surfaces, decoration, small or faint text, eyebrow
// lines and boxes. Numbers, not pass or fail, until the owner's picks set the lines.

/** Hue families, the shares of the screen under tint and decoration, of the text that is small or faint, and counts of eyebrows and boxes. */
export const look = (page) =>
  page.evaluate(() => {
    // Any computed colour to sRGB bytes, by painting it: covers rgb(), oklch(), color() and the rest.
    const ctx = Object.assign(document.createElement('canvas'), { width: 1, height: 1 }).getContext('2d', { willReadFrequently: true });
    const seen = new Map();
    const oklch = (css) => {
      if (seen.has(css)) return seen.get(css);
      ctx.clearRect(0, 0, 1, 1);
      ctx.fillStyle = css;
      ctx.fillRect(0, 0, 1, 1);
      const [r8, g8, b8, a8] = ctx.getImageData(0, 0, 1, 1).data;
      const lin = (v) => ((v /= 255) <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
      const [r, g, b] = [lin(r8), lin(g8), lin(b8)];
      const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
      const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
      const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
      const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
      const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
      const out = { c: Math.hypot(A, B), h: ((Math.atan2(B, A) * 180) / Math.PI + 360) % 360, alpha: a8 / 255, y: 0.2126 * r + 0.7152 * g + 0.0722 * b };
      seen.set(css, out);
      return out;
    };

    const W = innerWidth;
    const H = innerHeight;
    const media = 'img, picture, video, canvas, iframe';
    const onScreen = (el) => {
      const r = el.getBoundingClientRect();
      return r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < H && r.right > 0 && r.left < W && el.checkVisibility({ visibilityProperty: true, opacityProperty: true });
    };

    // Every hue the chrome paints: text, fills and borders, leaving out photos and video.
    const hues = [];
    for (const el of document.body.querySelectorAll('*')) {
      if (el.closest(media) || !onScreen(el)) continue;
      const cs = getComputedStyle(el);
      const paints = [];
      if ([...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) paints.push(cs.color);
      paints.push(cs.backgroundColor);
      if (parseFloat(cs.borderTopWidth) > 0) paints.push(cs.borderTopColor);
      if (el instanceof SVGElement) paints.push(cs.fill, cs.stroke);
      for (const p of paints) {
        if (!p || p === 'none' || p.startsWith('url')) continue;
        const k = oklch(p);
        if (k.alpha > 0.3 && k.c >= 0.03) hues.push(k.h);
      }
    }
    // A family is a run of hues with no gap wider than 25°, around the circle.
    const sorted = [...new Set(hues.map((h) => Math.round(h)))].sort((a, b) => a - b);
    let families = 0;
    for (let i = 0; i < sorted.length; i++) {
      const prev = i ? sorted[i - 1] : sorted.at(-1) - 360;
      if (sorted[i] - prev > 25) families++;
    }
    if (sorted.length && !families) families = 1;

    // The screen sampled on a 16px grid: what surface is under each point, and is it decoration.
    const decorative = (el) =>
      (el.matches('img[alt=""], [aria-hidden="true"], [role="presentation"], [role="none"]') || getComputedStyle(el).backgroundImage !== 'none') &&
      el.getBoundingClientRect().width * el.getBoundingClientRect().height >= 64 * 64;
    let points = 0;
    let tinted = 0;
    let decoration = 0;
    for (let y = 8; y < H; y += 16)
      for (let x = 8; x < W; x += 16) {
        points++;
        const stack = document.elementsFromPoint(x, y);
        const surface = stack.find((el) => el.matches(media) || oklch(getComputedStyle(el).backgroundColor).alpha >= 0.5);
        // Light mode only: the playbook's own greys stay under C 0.003; a faint warm or green sidebar is 0.004.
        if (surface && !surface.matches(media) && oklch(getComputedStyle(surface).backgroundColor).c > 0.004) tinted++;
        if (stack.some((el) => el !== document.body && el !== document.documentElement && decorative(el))) decoration++;
      }

    // The surface an element sits on: its nearest opaque background, white if none.
    const under = (el) => {
      for (let e = el; e; e = e.parentElement) {
        const k = oklch(getComputedStyle(e).backgroundColor);
        if (k.alpha >= 0.5) return k;
      }
      return oklch('#fff');
    };

    // Text, by characters: how much is under 13px, and how much is under 4.5:1 on its surface.
    let chars = 0;
    let small = 0;
    let faint = 0;
    let eyebrows = 0;
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    for (let n; (n = walker.nextNode()); ) {
      const text = n.textContent.trim();
      const el = n.parentElement;
      if (!text || !el || el.closest('script, style, noscript') || !onScreen(el)) continue;
      const cs = getComputedStyle(el);
      const size = parseFloat(cs.fontSize);
      const ink = oklch(cs.color);
      const bg = under(el);
      const y = ink.alpha * ink.y + (1 - ink.alpha) * bg.y;
      const ratio = (Math.max(y, bg.y) + 0.05) / (Math.min(y, bg.y) + 0.05);
      chars += text.length;
      if (size < 13) small += text.length;
      if (ratio < 4.5) faint += text.length;
      // An eyebrow: a spaced-out capitals line of three words or more; one word is a section label.
      const caps = cs.textTransform === 'uppercase' || (/[A-Z]{2}/.test(text) && text === text.toUpperCase());
      if (caps && parseFloat(cs.letterSpacing) > 0.05 * size && text.split(/\s+/).length >= 3 && !el.closest('a, button, label, th, [role="columnheader"], [role="tab"]')) eyebrows++;
    }

    // Boxes: anything 48px or more that draws its own edge, by fill, a full border or a shadow.
    let boxes = 0;
    for (const el of document.body.querySelectorAll('*')) {
      if (el.matches(`${media}, svg, svg *, input, textarea, select, button`) || !onScreen(el)) continue;
      const r = el.getBoundingClientRect();
      if (r.width < 48 || r.height < 48) continue;
      const cs = getComputedStyle(el);
      const fill = oklch(cs.backgroundColor);
      const parent = el.parentElement ? under(el.parentElement) : oklch('#fff');
      const filled = fill.alpha >= 0.5 && (Math.abs(fill.y - parent.y) > 0.005 || Math.abs(fill.c - parent.c) > 0.003);
      const bordered = ['Top', 'Right', 'Bottom', 'Left'].every((side) => parseFloat(cs[`border${side}Width`]) >= 1 && oklch(cs[`border${side}Color`]).alpha > 0.3);
      if (filled || bordered || cs.boxShadow !== 'none') boxes++;
    }

    const share = (n, of) => +(n / of || 0).toFixed(3);
    return {
      hueFamilies: families,
      hues: sorted,
      tinted: share(tinted, points),
      decoration: share(decoration, points),
      smallText: share(small, chars),
      faintText: share(faint, chars),
      eyebrows,
      boxes,
    };
  });
