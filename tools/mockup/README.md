# TRZR mockup generator

Turn raw simulator screenshots (or screen recordings) into framed,
captioned marketing shots — for **both** the landing page and the
**App Store**, from one source and one design.

```
frame.css          reusable iPhone frame component (also used live on the LP)
shots.config.mjs   what to render: screenshots, captions, sizes
render.mjs         composes posters and renders them with headless Chrome
out/               generated PNGs   (git-ignored)
.tmp/              intermediate HTML (git-ignored)
```

## 1. Capture from the Simulator

Boot the app in a Simulator, then:

```bash
# Clean, consistent status bar (9:41, full battery/signal) — do this first
xcrun simctl status_bar booted override \
  --time "9:41" --batteryState charged --batteryLevel 100 \
  --cellularBars 4 --wifiBars 3

# Still screenshot
xcrun simctl io booted screenshot shot.png

# Screen recording (for video-in-frame on the web)
xcrun simctl io booted recordVideo demo.mov   # Ctrl-C to stop
```

Drop the stills into `../../v1.2_screenshots/` (or anywhere; point the
config at them).

## 2. Configure

Edit `shots.config.mjs` — each entry is one poster (eyebrow, title, sub,
screenshot, optional `bg`, `layout`, `deviceFrac`, `bleed`). `group:'appstore'`
renders every size in `DEVICE_SIZES`; `group:'web'` renders a single 2x image.

## 3. Render

```bash
node render.mjs            # everything
node render.mjs appstore   # only App Store posters
node render.mjs web        # only web/OG images
```

Output lands in `out/` at the exact pixel sizes App Store Connect requires.

### App Store sizes shipped here

| key  | px (portrait) | display |
|------|---------------|---------|
| ip69 | 1290 × 2796   | 6.9″ / 6.7″ (primary required) |
| ip65 | 1242 × 2688   | 6.5″ (legacy fallback) |

iPad is omitted because TRZR is iPhone-only. To add it later, drop e.g.
`ipad13:{w:2064,h:2752}` into `DEVICE_SIZES`.

## Video in the frame

The frame's `.screen` accepts a `<video>` exactly like an `<img>`:

```html
<div class="device"><div class="screen">
  <video src="demo.webm" autoplay muted loop playsinline></video>
</div></div>
```

- **Web only.** App Store *screenshots* are static images; a video belongs
  in an **App Preview** (separate ASC slot, 15–30 s, its own size specs).
- Convert the simulator `.mov` to web formats with **ffmpeg** (not yet
  installed on this machine — `brew install ffmpeg`):

  ```bash
  ffmpeg -i demo.mov -vf "scale=-2:1280" -an -c:v libx264 -crf 23 -movflags +faststart demo.mp4
  ffmpeg -i demo.mov -vf "scale=-2:1280" -an -c:v libvpx-vp9 -crf 32 demo.webm
  ```

  Provide both `<source>`s for Safari (mp4/h264) and others (webm).

## Design source of truth

Frame geometry and the monochrome brand come from `docs/brand.md` in the TRZR
repo. The same `frame.css` component is inlined into the landing page so the
site and the App Store shots stay visually identical.
