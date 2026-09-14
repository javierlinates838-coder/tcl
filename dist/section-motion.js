// Everything remains visible without JS or animation support. Nothing in the
// hero or quote form waits for an entrance effect.
export function mountSectionMotion(root, motion, Observer = globalThis.IntersectionObserver) {
  if (motion.matches || !Observer) return { destroy() {} };
  const running = new Map();
  const observer = new Observer(entries => {
    let stagger = 0;
    for (const { target, isIntersecting } of entries) {
      if (!isIntersecting) continue;
      observer.unobserve(target);
      if (motion.matches || target.contains(root.activeElement) || !target.animate) continue;
      const effect = target.animate([
        { opacity: .45, transform: 'translateY(18px)' },
        { opacity: 1, transform: 'translateY(0)' }
      ], { duration: 650, delay: Math.min(stagger++ * 75, 150), easing: 'cubic-bezier(.22,.61,.36,1)', fill: 'backwards' });
      running.set(target, effect);
      effect.finished.then(() => running.delete(target), () => running.delete(target));
    }
  }, { threshold: .12 });
  root.querySelectorAll('.section-heading, .work-photo, .package, .review-card, .faq-layout > div:first-child, .faq-item, .contact-photo').forEach(node => observer.observe(node));
  function stopFocused(event) {
    for (const [node, effect] of running) {
      if (node.contains(event.target)) { effect.cancel(); running.delete(node); }
    }
  }
  function destroy() {
    observer.disconnect();
    for (const effect of running.values()) effect.cancel();
    running.clear();
    motion.removeEventListener('change', onPreference);
    root.removeEventListener('focusin', stopFocused);
  }
  function onPreference() { if (motion.matches) destroy(); }
  motion.addEventListener('change', onPreference);
  root.addEventListener('focusin', stopFocused);
  return { destroy };
}
