#!/usr/bin/env node
/* ============================================================
   TRZR mockup renderer
   Composes "framed phone + caption + background" posters from a
   config and renders them with headless Chrome.

   - App Store targets render at EXACT pixel sizes (App Store Connect
     rejects anything off-spec).
   - Web targets render at 2x for retina (transparent bg optional).

   Usage:
     node render.mjs              # render everything in shots.config.mjs
     node render.mjs appstore     # only targets in the "appstore" group
     node render.mjs web

   The device frame itself lives in frame.css (shared with the LP).
   ============================================================ */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { SHOTS, DEVICE_SIZES } from './shots.config.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const FRAME_CSS = readFileSync(join(__dirname, 'frame.css'), 'utf8');
const OUT = join(__dirname, 'out');
const TMP = join(__dirname, '.tmp');
mkdirSync(OUT, { recursive: true });
mkdirSync(TMP, { recursive: true });

const CHROME_CANDIDATES = [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
];
const CHROME = CHROME_CANDIDATES.find(existsSync);
if (!CHROME) { console.error('No Chrome/Chromium/Edge found.'); process.exit(1); }

const esc = (s = '') => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

function html(shot, W, H) {
  const pw = W;                                  // poster width in px (drives type scale)
  const bg = shot.bg || `radial-gradient(${pw*0.9}px ${H*0.55}px at 50% 8%, #1b1b1e 0%, #0B0B0C 60%)`;
  const layout = shot.layout || 'caption-top';
  const devFrac = shot.deviceFrac ?? (layout === 'center' ? 0.74 : 0.66);
  const bleed = shot.bleed ?? 0.10;              // fraction of device height bled off bottom
  const media = shot.video
    ? `<video src="${shot.video}" autoplay muted loop playsinline></video>`
    : `<img src="${shot.imgUrl}" alt="">`;
  const bareCls = shot.bare ? ' bare' : '';
  return `<!DOCTYPE html><html lang="ja"><head><meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700;900&display=swap" rel="stylesheet">
<style>
${FRAME_CSS}
:root{--ink:#0B0B0C;--snow:#F7F6F2;--g1:#9C9C9C;--g2:#5E5E60;
  --font:"Noto Sans JP",-apple-system,"Hiragino Kaku Gothic ProN",sans-serif;--pw:${pw}px}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:${W}px;height:${H}px}
body{font-family:var(--font);background:var(--ink);color:var(--snow);overflow:hidden;
  -webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility}
.poster{position:relative;width:${W}px;height:${H}px;overflow:hidden;background:${bg};
  display:flex;flex-direction:column;align-items:center}
.cap{width:100%;padding:calc(var(--pw)*.085) calc(var(--pw)*.08) 0;text-align:center}
.cap .eyebrow{font-weight:700;font-size:calc(var(--pw)*.024);letter-spacing:.3em;
  text-transform:uppercase;color:var(--g1);margin-bottom:calc(var(--pw)*.028)}
.cap h1{font-weight:900;font-size:calc(var(--pw)*.082);line-height:1.08;letter-spacing:-.03em}
.cap .sub{margin:calc(var(--pw)*.03) auto 0;max-width:20em;color:var(--g1);
  font-size:calc(var(--pw)*.03);line-height:1.7}
.stage{flex:1;width:100%;display:flex;justify-content:center;align-items:flex-end}
.device{--dev-w:calc(var(--pw)*${devFrac});transform:translateY(calc(var(--dev-w)/var(--dev-ar)*${bleed}))}
/* center layout = phone only, vertically centered */
.poster.center .cap{display:none}
.poster.center .stage{align-items:center}
.poster.center .device{transform:none}
</style></head>
<body>
<div class="poster ${layout === 'center' ? 'center' : ''}">
  <div class="cap">
    ${shot.eyebrow ? `<p class="eyebrow">${esc(shot.eyebrow)}</p>` : ''}
    ${shot.title ? `<h1>${shot.title}</h1>` : ''}
    ${shot.sub ? `<p class="sub">${shot.sub}</p>` : ''}
  </div>
  <div class="stage">
    <div class="device${bareCls}">
      <div class="island"></div>
      <span class="btn action"></span><span class="btn vol-up"></span>
      <span class="btn vol-dn"></span><span class="btn power"></span>
      <div class="screen">${media}</div>
    </div>
  </div>
</div>
</body></html>`;
}

function render(shot, target, outName) {
  const { w, h, scale = 1 } = target;
  const doc = html(shot, w, h);
  const htmlPath = join(TMP, `${outName}.html`);
  writeFileSync(htmlPath, doc);
  const outPath = join(OUT, `${outName}.png`);
  const args = [
    '--headless', '--disable-gpu', '--no-sandbox', '--hide-scrollbars',
    `--force-device-scale-factor=${scale}`,
    `--window-size=${w},${h}`,
    '--virtual-time-budget=5000',
    `--screenshot=${outPath}`,
    `file://${htmlPath}`,
  ];
  if (shot.transparent) args.splice(4, 0, '--default-background-color=00000000');
  const r = spawnSync(CHROME, args, { encoding: 'utf8' });
  if (r.status !== 0 && !existsSync(outPath)) {
    console.error(`  ✗ ${outName}:`, (r.stderr || '').split('\n')[0]);
    return false;
  }
  console.log(`  ✓ ${outName}.png  (${w*scale}×${h*scale})`);
  return true;
}

const onlyGroup = process.argv[2];
for (const shot of SHOTS) {
  if (onlyGroup && shot.group !== onlyGroup) continue;
  // resolve local screenshot paths to file:// URLs
  shot.imgUrl = shot.img ? 'file://' + resolve(__dirname, shot.img) : shot.imgUrl;
  const targets = shot.targets || (shot.group === 'appstore'
    ? Object.entries(DEVICE_SIZES).map(([k, v]) => ({ key: k, ...v }))
    : [{ key: 'web', w: shot.w || 1280, h: shot.h || 960, scale: 2 }]);
  console.log(`▶ ${shot.name} [${shot.group}]`);
  for (const t of targets) render(shot, t, `${shot.name}_${t.key}`);
}
console.log('\nDone →', OUT);
