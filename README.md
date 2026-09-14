# TLC Detailing

The existing static website, refined around real TLC photography, a silent Mercedes interior film and attributed customer review excerpts. No framework or production dependencies were added. Production hosting remains unchanged.

## Local use
- npm run dev — http://127.0.0.1:4173
- npm run build — validates the site and copies a static release to ignored .sites-build/.
- npm test — runs 19 tests using Node's built-in runner.
- Local media failure/preference fixture: http://127.0.0.1:4173/__checks__/media.html (outside the deployable dist folder).

Canonical site files are in dist/. Quote details remain in page memory. Open Messages opens a draft; it does not send, confirm pricing or book. Native details and package SMS/call links remain available without JavaScript.

## Recovery and sources
Tag checkpoint-before-real-media-20260914 preserves the version before this photographic refinement. Tag checkpoint-before-premium-upgrade-20260914 preserves the original site. Do not publish or push without user approval.

See MEDIA.md, VALIDATION.md and content/ for media, reviews, package provenance and measured checks.
