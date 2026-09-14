# TLC media and provenance

The site now uses TLC's own public business media. No stock cars, generated images, competitor photography, enlarged screenshots, or fabricated results are used.

## Included
- Hero photograph: 6-second still from the real TLC Mercedes interior clip. Desktop WebP 1080 × 1920, 133,808 bytes; mobile WebP 540 × 960, 52,812 bytes. It is in initial HTML with high fetch priority.
- Hero film: silent H.264, 720 × 1280, 30 fps, 9.20 seconds, 1,817,545 bytes, faststart. Source duration was 9.263 seconds; the short audio tail was removed. Natural camera movement is preserved. Sampled across the complete clip and fully decoded.
- Six photo subjects: BMW exterior, BMW interior, Rolls-Royce wheel, Lexus, Porsche and classic-car paint. 480px/960px WebP variants from TLC's 1600 × 2133 owner uploads. No enlargement. Gallery and package photos are lazy-loaded with explicit dimensions and responsive sizes.
- Actual TLC Instagram profile logo, 150 × 150 source displayed at approximately 52px.

Source identity was matched using the business phone (832) 466-1100, Bakersfield address and Google owner account 114835948839158276820. Photo/video sources and original media IDs are recorded in content/owner-photo-sources.json and content/video-source.json. Logo source: https://www.instagram.com/tlc.detailing_661/.

## Playback
The photograph appears before video. Desktop playback waits for the image, metadata and a decoded video frame, then crossfades the media without moving copy. Mobile below 768px, reduced-motion and Save-Data start with the photograph and do not assign a video src. Explicit Play is available. Pause returns to the photo. Resizing/poster changes preserve the initial preference and a visitor's pause.

Playback rejection, source errors, an eight-second loading deadline or persistent two-second buffering return to the photo. Brief loop buffering is tolerated. Tab hiding and a new reduced-motion or mobile preference pause video. No animation is required to navigate or quote.

## Remaining content
No verified before-and-after pair was located. No comparison slider or claimed transformation was fabricated. Higher-resolution original Instagram post access was login-gated; full-size verified Google owner photos were used instead.

## Photo framing refinement
- BMW gallery image uses a 3:2 crop at 50% 60%, preserving roof, wheels and bumper. Interior and wheel retain their native 3:4 framing. Desktop aligns all three images in one row; mobile places the BMW above the two portrait details. Captions sit below photographs.
- Lexus and Porsche now sit beside package titles in 4:5 portrait frames. The Porsche is bottom-aligned to keep its entire front visible. Responsive image sizes now match these smaller panels.
- The classic-car paint image is a lazy-loaded, responsive image with descriptive alt text in a 4:5 frame, replacing the heavily cropped decorative background.
- No media was added, enlarged, generated or downloaded for these changes.
