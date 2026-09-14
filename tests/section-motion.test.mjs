import test from 'node:test';
import assert from 'node:assert/strict';
import { mountSectionMotion } from '../dist/section-motion.js';

function fixture({ reduced = false, supported = true } = {}) {
  const effects = [];
  const nodes = Array.from({ length: 3 }, () => ({
    contains: node => node === 'focused',
    animate() {
      const effect = { cancelled: false, cancel() { this.cancelled = true; }, finished: new Promise(() => {}) };
      effects.push(effect);
      return effect;
    }
  }));
  const root = new EventTarget();
  root.querySelectorAll = () => nodes;
  const motion = new EventTarget();
  motion.matches = reduced;
  let observer;
  class Observer {
    observed = new Set();
    constructor(callback) { this.callback = callback; observer = this; }
    observe(node) { this.observed.add(node); }
    unobserve(node) { this.observed.delete(node); }
    disconnect() { this.observed.clear(); }
    enter() { this.callback([...this.observed].map(target => ({ target, isIntersecting: true }))); }
  }
  const controller = mountSectionMotion(root, motion, supported ? Observer : null);
  return { effects, nodes, root, motion, observer, controller };
}

test('reduced motion and unsupported browsers keep content static', () => {
  for (const options of [{ reduced: true }, { supported: false }]) {
    const f = fixture(options);
    assert.equal(f.observer, undefined);
    assert.equal(f.effects.length, 0);
    f.controller.destroy();
  }
});
test('entrances run only once when elements enter the viewport', () => {
  const f = fixture();
  f.observer.enter();
  assert.equal(f.effects.length, 3);
  f.observer.enter();
  assert.equal(f.effects.length, 3);
  f.controller.destroy();
});
test('changing the motion preference cancels active and pending entrances', () => {
  const f = fixture();
  f.observer.enter();
  f.motion.matches = true;
  f.motion.dispatchEvent(new Event('change'));
  assert.ok(f.effects.every(effect => effect.cancelled));
  assert.equal(f.observer.observed.size, 0);
});
test('keyboard focus is never carried by a moving card', () => {
  const f = fixture();
  f.root.activeElement = 'focused';
  f.observer.enter();
  assert.equal(f.effects.length, 0);
  f.controller.destroy();
  const g = fixture();
  g.nodes.forEach(node => { node.contains = target => target === g.root; });
  g.observer.enter();
  g.root.dispatchEvent(new Event('focusin'));
  assert.ok(g.effects.every(effect => effect.cancelled));
  g.controller.destroy();
});
