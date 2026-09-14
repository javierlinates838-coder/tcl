# TLC Detailing

Premium static website in the existing project. No framework or runtime dependencies were added. Hosting identity and production remain unchanged.

## Local use

- `npm run dev` starts the existing preview at http://127.0.0.1:4173.
- `npm run build` validates HTML anchors, local assets, imports, JavaScript syntax and absence of stock references, then emits a byte-for-byte static release under ignored `.sites-build/`.
- `npm test` runs the quote and progressive-video controller tests with Node's built-in runner.

The canonical site files remain in `dist/`. Quote details stay in the page's memory. Open Messages creates an SMS draft; it does not send, confirm a price, or reserve an appointment. Copy has a manual selection fallback. No backend, persistence, tracking, or integration was added.

Native details and SMS/call links remain usable without JavaScript. Reduced-motion users get no motion or autoplay. Content is visible without entrance animations.

## Recoverable checkpoint

`checkpoint-before-premium-upgrade-20260914` points to the original committed site. The working project contains the upgrade. Do not push, publish, or modify hosting access without the user's approval.

## Media and evidence

Read `MEDIA.md` for the original-media blocker and the optional video integration contract. The stock assets have been removed from the serving folder. See `content/sources.md` for package and testimonial provenance. Original photo crops, image optimization, and real video playback cannot be completed without approved media.