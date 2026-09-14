# Mobile detailing site template

A static, single-page mobile detailing website with no framework or production dependencies. All client-specific content (name, phone, city, photos, video, logo, reviews and social links) has been removed and replaced with clearly labelled placeholders, so the site can be re-skinned for a new client while keeping every design and animation feature intact. netlify.toml publishes dist directly.

## Local use
- npm run dev — http://127.0.0.1:4173
- npm run build — validates the site and copies a static release to ignored .sites-build/.
- npm test — runs the quote, hero-media and section-motion tests using Node's built-in runner.
- Local media failure/preference fixture: http://127.0.0.1:4173/__checks__/media.html (outside the deployable dist folder).

Canonical site files are in dist/. Quote details remain in page memory. Open Messages opens a draft; it does not send, confirm pricing or book. Native details and package SMS/call links remain available without JavaScript.

## Preserved features
- Hero photograph that crossfades into a silent looping video once a frame is decoded, with photo fallback on mobile, reduced motion, Save-Data, slow loading, buffering and playback errors (dist/hero-media.js).
- Once-only section entrance animations that respect reduced motion and never move a focused element (dist/section-motion.js).
- Animated mobile menu, hover/focus micro-interactions, gold photo frames, custom SVG icon sprite (dist/assets/icons.svg), package selection that fills the quote form and SMS draft, copy-to-clipboard fallback and Netlify badge suppression.

## Setting up a new client
Search dist/index.html for `CLIENT:` comments. Each one marks a placeholder to replace:
1. Business name, city/state, founding year and phone number (also `PHONE` and `PHONE_DISPLAY` in dist/quote.js, and the tests in tests/quote.test.mjs).
2. Hero poster and video, six 3:4 photos and the logo in dist/assets/. Record the sources in content/approved-media.json. See MEDIA.md for the exact specifications.
3. Package names and inclusions from the client's own service sheet.
4. Verified review excerpts, Google rating, review count, listing URL and the date checked.
5. Instagram/TikTok URLs.

Do not publish or push without user approval.
