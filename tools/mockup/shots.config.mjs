/* ============================================================
   TRZR mockup config — define once, render for web + App Store.
   Edit captions / screenshots here; run `node render.mjs`.

   Sources are RAW (un-framed) captures so the CSS frame adds the
   one and only device frame. Capture with:
     xcrun simctl io booted screenshot raw_x.png
   or extract a clean frame from a recording with ffmpeg.
   ============================================================ */

/* App Store Connect accepted pixel sizes (portrait).
   TRZR is iPhone-only. ip69 matches the iPhone 17 Pro Max native
   capture (1320×2868) so raw stills aren't rescaled. */
export const DEVICE_SIZES = {
  ip69: { w: 1320, h: 2868 },   // 6.9" (iPhone 16/17 Pro Max) — native
  ip65: { w: 1242, h: 2688 },   // 6.5" (legacy fallback)
};

const RAW = (n) => `../../v1.2_screenshots/raw_${n}.png`;

export const SHOTS = [
  {
    name: '01-write', group: 'appstore', img: RAW('compose'),
    eyebrow: 'Write',
    title: '思いついた<br>瞬間に、書く。',
    sub: 'タイトルも日付もいらない。',
  },
  {
    name: '02-timeline', group: 'appstore', img: RAW('timeline'),
    eyebrow: 'Your timeline',
    title: '自分だけの、<br>タイムライン。',
    sub: '流れるのは、過去の自分の一行だけ。',
  },
  {
    name: '03-search', group: 'appstore', img: RAW('search'),
    eyebrow: 'Search',
    title: '数百件から、<br>数秒で掘り当てる。',
    sub: '検索とタグの AND 絞り込み。',
  },
  {
    name: '04-tune', group: 'appstore', img: RAW('fonts'),
    eyebrow: 'Tune',
    title: '読み返す時間まで、<br>整える。',
    sub: '和文 4・欧文 4 のフォントと、和の色 8 種。',
  },
  /* Privacy poster awaits a raw Face-ID-lock capture; add when available:
     { name:'05-privacy', group:'appstore', img:RAW('lock'),
       eyebrow:'Privacy', title:'プライバシーは、<br>設計の話。',
       sub:'投稿の中身は、あなたの iCloud のみ。' }, */

  /* Web/OG social card (1200×630) — phone + headline. */
  {
    name: 'og-card', group: 'web', img: RAW('timeline'),
    w: 1200, h: 630, layout: 'caption-top',
    deviceFrac: 0.34, bleed: 0.18,
    eyebrow: 'TRZR',
    title: '書くほど、<br>見返したくなる。',
  },
];
