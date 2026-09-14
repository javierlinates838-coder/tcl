// Progressive enhancement for an approved photo + optional approved 6–10s clip.
// Source provenance is recorded in content/approved-media.json.
export function mountHeroMedia(root, environment = {}) {
  if (!root || root.dataset.approvedMedia !== 'true') return null;
  const video = root.querySelector('video');
  const photo = root.querySelector('[data-hero-photo]');
  const button = root.querySelector('[data-media-toggle]');
  const status = root.querySelector('[data-media-status]');
  const src = video?.dataset.src;
  if (!photo || !video || !button || !/^\/assets\/[^?#]+\.(mp4|webm)$/i.test(src || '') || src.includes('..')) return null;
  const doc = environment.document ?? document;
  const query = environment.matchMedia ?? matchMedia;
  const motion = query('(prefers-reduced-motion: reduce)');
  const mobile = query('(max-width: 767px)');
  const connection = environment.connection ?? globalThis.navigator?.connection;
  const schedule = environment.setTimeout ?? setTimeout;
  const cancel = environment.clearTimeout ?? clearTimeout;
  const listeners = [];
  let desired = false;
  let destroyed = false;
  let photoReady = false;
  let initialPhotoHandled = false;
  let metadataReady = false;
  let playingReceived = false;
  let attempt = 0;
  let timeout;
  let stallTimeout;
  let frame;
  let sourceAttached = false;
  let needsReload = false;
  const on = (node, type, handler) => { node.addEventListener(type, handler); listeners.push(() => node.removeEventListener(type, handler)); };
  const announce = message => { if (status) status.textContent = message; };
  const clearPending = () => {
    if (timeout !== undefined) cancel(timeout);
    timeout = undefined;
    if (stallTimeout !== undefined) cancel(stallTimeout);
    stallTimeout = undefined;
    if (frame !== undefined && video.cancelVideoFrameCallback) video.cancelVideoFrameCallback(frame);
    frame = undefined;
  };
  function showPhoto(message = '') {
    root.dataset.mediaState = 'photo';
    button.textContent = 'Play video';
    button.setAttribute('aria-label', 'Play background video');
    button.setAttribute('aria-pressed', 'false');
    button.disabled = false;
    announce(message);
  }
  function pause(message = '') {
    desired = false;
    attempt++;
    playingReceived = false;
    clearPending();
    showPhoto(message);
    video.pause();
  }
  function fail() { needsReload = true; pause('Video unavailable. Showing the photograph.'); }
  function revealWhenReady() {
    if (!desired || !photoReady || !metadataReady || !playingReceived || video.readyState < 2 || destroyed) return;
    const thisAttempt = attempt;
    const reveal = () => {
      frame = undefined;
      if (!desired || destroyed || thisAttempt !== attempt || video.paused) return;
      if (timeout !== undefined) cancel(timeout);
      timeout = undefined;
      root.dataset.mediaState = 'playing';
      button.textContent = 'Pause video';
      button.setAttribute('aria-label', 'Pause background video');
      button.setAttribute('aria-pressed', 'true');
      button.disabled = false;
      announce('');
    };
    if (video.requestVideoFrameCallback) {
      if (frame === undefined) frame = video.requestVideoFrameCallback(reveal);
    } else reveal();
  }
  async function play() {
    if (!photoReady || destroyed || desired) return;
    desired = true;
    const thisAttempt = ++attempt;
    playingReceived = false;
    button.textContent = 'Cancel video';
    button.setAttribute('aria-label', 'Cancel loading background video');
    announce('Loading video. The photograph remains visible.');
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    if (!sourceAttached || needsReload) {
      metadataReady = false;
      video.src = src;
      sourceAttached = true;
      needsReload = false;
      video.load();
    }
    timeout = schedule(() => { if (thisAttempt === attempt && desired) fail(); }, 8000);
    try {
      await video.play();
      if (thisAttempt !== attempt || destroyed || !desired) { video.pause(); return; }
      revealWhenReady();
    } catch { if (thisAttempt === attempt && desired) fail(); }
  }
  function photoLoaded() {
    photoReady = photo.complete && photo.naturalWidth > 0;
    if (!photoReady || destroyed) return;
    button.hidden = false;
    // Responsive poster swaps must not override a visitor's pause choice.
    if (initialPhotoHandled) return;
    initialPhotoHandled = true;
    if (!mobile.matches && !motion.matches && !connection?.saveData && !doc.hidden) void play();
  }
  button.hidden = true;
  video.preload = 'none';
  video.muted = true;
  video.loop = true;
  video.playsInline = true;
  showPhoto();
  on(button, 'click', () => { if (desired) pause(); else void play(); });
  on(photo, 'load', photoLoaded);
  on(photo, 'error', () => { photoReady = false; pause(); button.hidden = true; });
  on(video, 'loadedmetadata', () => {
    metadataReady = Number.isFinite(video.duration) && video.duration >= 5 && video.duration <= 11;
    if (!metadataReady) fail(); else revealWhenReady();
  });
  on(video, 'playing', () => {
    if (!desired) { video.pause(); return; }
    if (stallTimeout !== undefined) cancel(stallTimeout);
    stallTimeout = undefined;
    playingReceived = true;
    revealWhenReady();
  });
  on(video, 'error', fail);
  // A brief waiting event is normal at a loop boundary. Keep the decoded frame
  // during that gap; fall back only if playback cannot recover within two seconds.
  const buffering = () => {
    if (!desired || root.dataset.mediaState !== 'playing' || stallTimeout !== undefined) return;
    stallTimeout = schedule(() => { stallTimeout = undefined; if (desired) fail(); }, 2000);
  };
  on(video, 'waiting', buffering);
  on(video, 'stalled', () => { if (video.readyState < 3) buffering(); });
  on(doc, 'visibilitychange', () => { if (doc.hidden) pause(); });
  on(motion, 'change', () => { if (motion.matches) pause(); });
  on(mobile, 'change', () => { if (mobile.matches) pause(); });
  photoLoaded();
  return {
    play,
    pause,
    destroy() { destroyed = true; pause(); listeners.forEach(remove => remove()); }
  };
}
