# Upgrade validation — September 14, 2026

## Passed

- Static build: five serving files, 49,228 bytes before fonts/HTTP compression. HTML anchors, local references, ES module imports and JavaScript syntax validated. This is a file-size measurement, not a load-time or Lighthouse score.
- 14 Node tests: quote package identity, undecided requests, special characters, input bounds, media approval gating, mobile/data-saving/reduced-motion gating, photo/metadata/frame readiness, explicit Play/Pause, cancellation, timeout, errors, buffering, unsuitable duration, retry and photo failure.
- Browser viewports: 320, 390, 768 and 1440 CSS pixels. Document widths stayed within their viewports. The 320px heading wrap was refined and checked again.
- Desktop package comparison: all four rows have matching measured top positions and heights after the subgrid fix.
- Mobile Full Detail selection: selected radio, visible card state, focused radio and composed SMS all carry Extra TLC Full Detail. Vehicle, area and notes were entered and verified in the message preview and encoded SMS link.
- Copy message returned the success state. No message was sent and no appointment was confirmed.
- Mobile menu opened with Enter, Tab reached its first link, and Escape closed the menu and returned focus to its summary.
- FAQ opened with Enter and exposed its answer.
- Browser console contained no captured errors after the final reload.
- Page, stylesheet and three JavaScript modules returned HTTP 200 locally. Removed stock photo paths returned 404; no image or video element is present in the page.
- Git whitespace check passed. The hosting manifest is unchanged from the original checkpoint. No source push, hosting mutation or deployment was performed.

## Limits and remaining work

- No approved original TLC media exists in the project. Actual image loading/crops/optimization, before-and-after matching, decoded video playback and photograph fallback cannot be checked with genuine content yet. The optional video controller was tested with mocked elements; it is inactive on the actual page.
- Reduced-motion playback logic is tested with mocked media-query changes. The stylesheet disables animation and transitions under the reduced-motion query; an OS-level preference switch was not performed in the browser.
- Call/SMS destinations and the composed draft were inspected. External dialers and message sending were not triggered.
- Copy success was exercised in the browser; the manual-copy failure path is present but was not forced through a browser permission failure.
- Google rating and testimonial come from the supplied screenshots, not a live review integration.
