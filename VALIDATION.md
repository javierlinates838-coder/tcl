# Validation — September 14, 2026

All work is in the existing static project. Hosting configuration and production deployment are unchanged. Recoverable pre-change tag: checkpoint-before-real-media-20260914.

## Executed
- npm test: 16 quote/media tests pass.
- Static build: local references, anchors, JS syntax and imports validated; current content/approved-media.json records the real media.
- Real in-app Chromium browser: desktop video decoded and continued playing across multiple 9.20s loops; keyboard Play/Pause checked. Mobile 390px and 320px reloads show photograph, null video src, no automatic video request; explicit mobile Play works.
- Responsive checks at actual DOM widths 320, 390, 768 and 1440: no document horizontal overflow. Fixed a clipped headline at 320px and rechecked its scrollWidth/clientWidth. Desktop package card heights match. Gallery, service photos and poster loaded; desktop and mobile crops visually inspected.
- Keyboard menu Enter/Tab/Escape closes and restores focus; native FAQ opens via Enter. Clear focus outlines retained.
- Both package buttons carry the correct selection to the form. Vehicle and area persist when switching packages and appear in the encoded SMS draft. Call/SMS targets retain the actual TLC number. No message was sent and no booking made.
- Browser fixture at /__checks__/media.html: reduced-motion and Save-Data input paths leave src null; failed video URL and rejected playback retain a loaded photo with accurate fallback status. Preference inputs are injected into the real controller in this local fixture; OS/browser preference settings were not changed.
- Media decode via ffmpeg: complete clip passed, no audio stream, H.264/yuv420p, moov before mdat.
- Local preview video range requests: normal and suffix requests return 206 with video/mp4 and correct byte counts; out-of-range requests return 416.
- Unit tests cover decoded-frame crossfade, slow loading, cancellation, missing photo, persistent buffering, loop-buffer recovery, rejected playback, preference changes and preserving pause across responsive poster loads.

## Fixes from checks
- Mobile hero heading could clip at 320px: reduced its narrow-screen type size.
- Hiding the mobile line break joined two words: preserved whitespace.
- A responsive poster reload could restart video after Pause: autoplay is now evaluated once.
- Brief loop-boundary waiting could stop playback: allow two seconds to recover before fallback.
- Preview served MP4 without media type/ranges: added correct MIME, HEAD and byte-range responses.

## Limits
No Safari/iOS hardware run, production network timing, Lighthouse score or booking delivery is claimed. Reviews are verified excerpts with a dated Google rating snapshot, not a live feed. No authentic matched before/after pair was available.
