# Media placeholders and specifications

All media in dist/assets/ is a generated neutral placeholder: flat gradients rendered with ffmpeg, labelled "PLACEHOLDER PHOTO" / "PLACEHOLDER VIDEO". Nothing depicts a real business, vehicle, person or location. The manifest in content/approved-media.json lists every slot and its `source` is `TODO` until the new client's approved media is dropped in.

## What to supply for the new client
- Hero photograph: desktop WebP 1080 × 1920 and mobile WebP 540 × 960. Ideally a still frame from the hero video so the crossfade is seamless. Referenced in the initial HTML with high fetch priority.
- Hero film: silent H.264 MP4, portrait 720 × 1280, 6 to 10 seconds, faststart. dist/hero-media.js rejects clips outside 5 to 11 seconds and falls back to the photograph.
- Six photographs at 3:4: 960 × 1280 and 480 × 640 WebP each. Slots: gallery exterior (cropped to 3:2 by CSS, keep the subject centred slightly low), gallery interior, gallery close-up, Quick Detail package, Full Detail package, contact panel. Do not enlarge small originals.
- Logo: roughly square SVG or WebP, displayed at about 52 px.

Use only the client's own media or media they have the right to publish. No stock cars, generated images of real-looking vehicles, competitor photography, enlarged screenshots or fabricated results.

## Playback behaviour (unchanged)
The photograph appears before video. Desktop playback waits for the image, metadata and a decoded video frame, then crossfades the media without moving copy. Mobile below 768px, reduced-motion and Save-Data start with the photograph and do not assign a video src. Explicit Play is available. Pause returns to the photo. Resizing/poster changes preserve the initial preference and a visitor's pause.

Playback rejection, source errors, an eight-second loading deadline or persistent two-second buffering return to the photo. Brief loop buffering is tolerated. Tab hiding and a new reduced-motion or mobile preference pause video. No animation is required to navigate or quote.

## Photo framing (unchanged)
- Gallery: first image uses a 3:2 crop at 50% 60%; the interior and close-up retain their native 3:4 framing. Desktop aligns all three in one row; mobile places the first above the two portrait details. Captions sit below photographs.
- Package photos sit beside package titles in 4:5 portrait frames. The Full Detail photo is bottom-aligned.
- The contact photo is a lazy-loaded, responsive image in a 4:5 frame.
