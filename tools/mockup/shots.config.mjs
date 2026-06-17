/* ============================================================
   TRZR mockup config — define once, render for web + App Store.
   Edit captions / screenshots here; run `node render.mjs`.
   ============================================================ */

/* App Store Connect accepted pixel sizes (portrait).
   TRZR is iPhone-only, so we ship the 6.9" set and a 6.5" fallback.
   (Add iPad here if an iPad build is ever submitted:
    ipad13:{w:2064,h:2752}, ipad13_legacy:{w:2048,h:2732}) */
export const DEVICE_SIZES = {
  ip69: { w: 1290, h: 2796 },   // 6.9" / 6.7"  (iPhone 15/16 Pro Max etc.)
  ip65: { w: 1242, h: 2688 },   // 6.5"         (legacy fallback)
};

const SHOT = (n) => `../../v1.2_screenshots/screenshot_v1.2_${n}.png`;

export const SHOTS = [
  {
    name: '01-write', group: 'appstore', img: SHOT(2),
    eyebrow: 'Write',
    title: '思いついた<br>瞬間に、書く。',
    sub: 'タイトルも日付もいらない。',
  },
  {
    name: '02-timeline', group: 'appstore', img: SHOT(1),
    eyebrow: 'Your timeline',
    title: '自分だけの、<br>タイムライン。',
    sub: '流れるのは、過去の自分の一行だけ。',
  },
  {
    name: '03-search', group: 'appstore', img: SHOT(4),
    eyebrow: 'Search',
    title: '数百件から、<br>数秒で掘り当てる。',
    sub: '検索とタグの AND 絞り込み。',
  },
  {
    name: '04-tune', group: 'appstore', img: SHOT(5),
    eyebrow: 'Tune',
    title: '読み返す時間まで、<br>整える。',
    sub: '和文 4・欧文 4 のフォントと、和の色 8 種。',
  },
  {
    name: '05-privacy', group: 'appstore', img: SHOT(3),
    eyebrow: 'Privacy',
    title: 'プライバシーは、<br>設計の話。',
    sub: '投稿の中身は、あなたの iCloud のみ。',
  },

  /* Example web/OG share image (1200×630) — phone + headline.
     The landing page itself uses live frames, so this is just a
     bonus social-card example. */
  {
    name: 'og-card', group: 'web', img: SHOT(1),
    w: 1200, h: 630, layout: 'caption-top',
    deviceFrac: 0.34, bleed: 0.18,
    eyebrow: 'TRZR',
    title: '書くほど、<br>見返したくなる。',
  },
];
