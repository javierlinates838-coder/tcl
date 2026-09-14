# Approved TLC media

The original project contained only two stock photographs. They are removed from the serving directory and remain recoverable at Git checkpoint `checkpoint-before-premium-upgrade-20260914`. The supplied screenshots support content but cannot be used as enlarged photography.

No owner-approved original TLC photos, footage, or matching before/after pairs are available. The page uses a typographic layout and links to TLC's Instagram. It has no placeholder tiles, fabricated URLs, stock cars, or simulated results.

Before adding media, record source, owner approval, and filenames in `content/approved-media.json`. Export responsive AVIF/WebP with a JPEG fallback from original files without upscaling. Inspect actual desktop/mobile crops. Use width/height, descriptive alt, and sizes/srcset. Put the hero picture in initial HTML with eager loading and `fetchpriority="high"`; lazy-load other images. Genuine before/after pairs must show the same vehicle and area.

For a suitable silent 6–10-second clip, `mountHeroMedia` in `dist/hero-media.js` expects a root marked `data-hero-media` and `data-approved-media="true"`, containing the actual fallback photo marked `data-hero-photo`, a video with its real local path in `data-src` (no src), `preload="none"`, muted/loop/playsinline, a hidden `data-media-toggle` button, and a `data-media-status` node with role=status. Supply real approved paths only.

Desktop playback waits for the photo, metadata and a decoded video frame. Mobile, reduced-motion and data-saving visitors stay on the photo unless they explicitly press Play. Pause, loading cancellation, errors, an 8-second loading timeout, buffering, and motion-preference changes restore the photo. The text and quote controls never move with video. Set the actual crop using `--photo-position-desktop` and `--photo-position-mobile` after inspecting real imagery.

Controller behavior has mocked tests. Real decoding, crop, optimization, browser playback and image-failure QA remain pending original media. Do not claim the photographic hero is complete until those checks pass.
