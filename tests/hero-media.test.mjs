import test from 'node:test';
import assert from 'node:assert/strict';
import { mountHeroMedia } from '../dist/hero-media.js';

class Node extends EventTarget {
  dataset = {}; attrs = {}; hidden = false; textContent = '';
  setAttribute(key, value) { this.attrs[key] = value; }
  emit(type) { this.dispatchEvent(new Event(type)); }
}
class Query extends Node {
  constructor(matches) { super(); this.matches = matches; }
  change(value) { this.matches = value; this.emit('change'); }
}
function fixture({ mobile = false, reduced = false, saveData = false, photoReady = true, reject = false } = {}) {
  const root = new Node(); root.dataset.approvedMedia = 'true';
  const video = new Node();
  // Virtual source for a mocked media element only; no URL is fetched or served.
  video.dataset.src = '/assets/test-only-video.mp4';
  video.readyState = 2; video.duration = 8; video.paused = true;
  video.loads = 0; video.plays = 0; video.reject = reject;
  video.load = () => { video.loads++; };
  video.pause = () => { video.paused = true; };
  video.play = async () => { video.plays++; if (video.reject) throw Error('Blocked'); video.paused = false; };
  video.requestVideoFrameCallback = callback => { video.frameCallback = callback; return 1; };
  video.cancelVideoFrameCallback = () => { video.frameCallback = null; };
  const photo = new Node(); photo.complete = photoReady; photo.naturalWidth = photoReady ? 1600 : 0;
  const button = new Node(); const status = new Node(); const doc = new Node(); doc.hidden = false;
  const motion = new Query(reduced); const narrow = new Query(mobile);
  const nodes = { video, '[data-hero-photo]': photo, '[data-media-toggle]': button, '[data-media-status]': status };
  root.querySelector = selector => nodes[selector];
  const timers = new Map(); let nextId = 0;
  const controller = mountHeroMedia(root, { document: doc, matchMedia: q => q.includes('reduced-motion') ? motion : narrow, connection: { saveData }, setTimeout: callback => { timers.set(++nextId, callback); return nextId; }, clearTimeout: id => timers.delete(id) });
  const ready = () => { video.emit('loadedmetadata'); video.emit('playing'); video.frameCallback?.(); };
  return { root, video, photo, button, status, doc, motion, narrow, timers, controller, ready };
}

test('no approved source means no player and no media requests', () => {
  assert.equal(mountHeroMedia(null), null);
  assert.equal(mountHeroMedia({ dataset: {} }), null);
});
test('mobile, reduced motion and data saving never start or download video automatically', () => {
  for (const options of [{ mobile: true }, { reduced: true }, { saveData: true }]) {
    const f = fixture(options);
    assert.equal(f.video.loads, 0); assert.equal(f.video.plays, 0);
    assert.equal(f.root.dataset.mediaState, 'photo'); assert.equal(f.button.hidden, false);
    f.controller.destroy();
  }
});
test('autoplay waits for the photo, metadata and a decoded video frame', async () => {
  const f = fixture({ photoReady: false });
  assert.equal(f.video.loads, 0);
  f.photo.complete = true; f.photo.naturalWidth = 1600; f.photo.emit('load');
  assert.equal(f.video.loads, 1); assert.equal(f.root.dataset.mediaState, 'photo');
  f.video.emit('waiting'); // initial buffering must not be treated as a failure
  f.video.emit('loadedmetadata'); f.video.emit('playing');
  assert.equal(f.root.dataset.mediaState, 'photo');
  f.video.frameCallback();
  assert.equal(f.root.dataset.mediaState, 'playing');
  assert.equal(f.button.attrs['aria-label'], 'Pause background video');
  assert.equal(f.button.attrs['aria-pressed'], 'true');
  f.controller.destroy();
});
test('explicit mobile play and pause keep controls accurate and restore the photo', async () => {
  const f = fixture({ mobile: true });
  await f.controller.play(); f.ready();
  assert.equal(f.root.dataset.mediaState, 'playing');
  f.button.emit('click');
  assert.equal(f.video.paused, true); assert.equal(f.root.dataset.mediaState, 'photo');
  assert.equal(f.button.attrs['aria-label'], 'Play background video');
  f.controller.destroy();
});
test('rejected playback restores the photo and permits an explicit retry', async () => {
  const f = fixture({ mobile: true, reject: true });
  await f.controller.play();
  assert.equal(f.root.dataset.mediaState, 'photo'); assert.match(f.status.textContent, /unavailable/);
  f.video.reject = false;
  await f.controller.play(); f.ready();
  assert.equal(f.video.loads, 2); assert.equal(f.root.dataset.mediaState, 'playing');
  f.controller.destroy();
});
test('error, buffering after playback and unsuitable duration use the photo fallback', async () => {
  for (const event of ['error', 'waiting', 'stalled']) {
    const f = fixture({ mobile: true }); await f.controller.play(); f.ready(); f.video.emit(event);
    assert.equal(f.root.dataset.mediaState, 'photo'); assert.equal(f.video.paused, true);
    f.controller.destroy();
  }
  const f = fixture({ mobile: true }); await f.controller.play(); f.video.duration = 80; f.video.emit('loadedmetadata');
  assert.equal(f.root.dataset.mediaState, 'photo'); assert.match(f.status.textContent, /unavailable/);
  f.controller.destroy();
});
test('slow loading times out without replacing the photograph', async () => {
  const f = fixture({ mobile: true }); await f.controller.play();
  for (const callback of [...f.timers.values()]) callback();
  assert.equal(f.root.dataset.mediaState, 'photo'); assert.equal(f.video.paused, true);
  assert.equal(f.timers.size, 0); f.controller.destroy();
});
test('cancelling a load cannot reveal a stale frame', async () => {
  const f = fixture({ mobile: true }); await f.controller.play();
  f.video.emit('loadedmetadata'); f.video.emit('playing');
  const oldFrame = f.video.frameCallback;
  f.controller.pause(); oldFrame();
  assert.equal(f.root.dataset.mediaState, 'photo');
  f.controller.destroy();
});
test('a new motion preference, mobile breakpoint or hidden tab pauses playback', async () => {
  for (const action of [f => f.motion.change(true), f => f.narrow.change(true), f => { f.doc.hidden = true; f.doc.emit('visibilitychange'); }]) {
    const f = fixture(); await Promise.resolve(); f.ready();
    assert.equal(f.root.dataset.mediaState, 'playing'); action(f);
    assert.equal(f.root.dataset.mediaState, 'photo'); assert.equal(f.video.paused, true);
    f.controller.destroy();
  }
});
test('a failed fallback photo prevents any video load', () => {
  const f = fixture({ mobile: true, photoReady: false });
  f.photo.emit('error'); f.button.emit('click');
  assert.equal(f.video.loads, 0); assert.equal(f.button.hidden, true);
  f.controller.destroy();
});
