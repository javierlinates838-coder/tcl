import { PACKAGES, createQuoteMessage, createSmsUrl } from './quote.js';
import { mountHeroMedia } from './hero-media.js';
import { mountSectionMotion } from './section-motion.js';

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const menu = document.querySelector('#mobile-menu');
const menuSummary = menu.querySelector('summary');
const menuPanel = menu.querySelector('.menu-panel');
let closingMenu;
function closeMenu({ restoreFocus = false, animate = true } = {}) {
  if (!menu.open) return;
  closingMenu?.cancel();
  const finish = () => {
    menu.open = false;
    menuSummary.setAttribute('aria-label', 'Open navigation menu');
    if (restoreFocus) menuSummary.focus({ preventScroll: true });
  };
  if (!animate || reducedMotion.matches || !menuPanel.animate) return finish();
  closingMenu = menuPanel.animate([{ opacity: 1, transform: 'translateY(0)' }, { opacity: 0, transform: 'translateY(-4px)' }], { duration: 120, easing: 'ease-out' });
  closingMenu.finished.then(finish).catch(() => {});
}
menuSummary.addEventListener('click', event => {
  if (menu.open) { event.preventDefault(); closeMenu({ restoreFocus: true }); }
});
menu.addEventListener('toggle', () => menuSummary.setAttribute('aria-label', menu.open ? 'Close navigation menu' : 'Open navigation menu'));
menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeMenu({ animate: false })));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menu.open) closeMenu({ restoreFocus: true, animate: false });
});
document.addEventListener('click', event => {
  if (!menu.contains(event.target)) closeMenu();
});
document.addEventListener('focusin', event => {
  if (menu.open && !menu.contains(event.target)) closeMenu({ animate: false });
});
matchMedia('(min-width: 901px)').addEventListener('change', event => {
  if (event.matches) closeMenu({ animate: false });
});

const form = document.querySelector('#quote-form');
const openMessages = document.querySelector('#open-messages');
const preview = document.querySelector('#message-preview');
const previewDisclosure = document.querySelector('.message-disclosure');
const copyButton = document.querySelector('.copy-message');
const selectionStatus = document.querySelector('#quote-selection');
const copyStatus = document.querySelector('#copy-status');
function readQuote() { return Object.fromEntries(new FormData(form)); }
function updateQuote(announce = false) {
  const quote = readQuote();
  const message = createQuoteMessage(quote);
  preview.value = message;
  openMessages.href = createSmsUrl(message);
  for (const key of ['quick', 'full']) document.querySelector('#package-' + key).dataset.selected = String(quote.package === key);
  copyStatus.textContent = '';
  if (announce) selectionStatus.textContent = PACKAGES[quote.package] + ' selected for your quote.';
}
form.addEventListener('input', () => updateQuote());
form.addEventListener('change', event => updateQuote(event.target.name === 'package'));
// No form submission or personal details in a page URL, including Enter in a field.
form.addEventListener('submit', event => event.preventDefault());
document.querySelectorAll('[data-package]').forEach(link => link.addEventListener('click', event => {
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
  const key = link.dataset.package;
  if (!Object.hasOwn(PACKAGES, key)) return;
  event.preventDefault();
  const radio = form.querySelector('input[name="package"][value="' + key + '"]');
  radio.checked = true;
  updateQuote(true);
  closeMenu({ animate: false });
  radio.focus({ preventScroll: true });
  form.scrollIntoView({ behavior: reducedMotion.matches ? 'instant' : 'smooth', block: 'start' });
}));
copyButton.addEventListener('click', async () => {
  const message = createQuoteMessage(readQuote());
  try {
    await navigator.clipboard.writeText(message);
    copyStatus.textContent = 'Message copied. Paste it into a text to (832) 466-1100.';
  } catch {
    previewDisclosure.open = true;
    preview.focus();
    preview.select();
    copyStatus.textContent = 'Copy the selected message, then paste it into a text to (832) 466-1100.';
  }
});
copyButton.hidden = false;
previewDisclosure.hidden = false;
updateQuote();
document.querySelector('#year').textContent = String(new Date().getFullYear());

function hideNetlifyBranding() {
  const normalized = text => (text || '').toLowerCase();
  const hasNetlifyText = text => /\bpowered by netlify\b/.test(normalized(text));
  const shouldHide = element => {
    const href = normalized(element.getAttribute?.('href'));
    const title = normalized(element.getAttribute?.('title'));
    const aria = normalized(element.getAttribute?.('aria-label'));
    const text = normalized(element.textContent);
    return href.includes('netlify.com') || href.includes('netlify.app') || href.includes('netlify') || hasNetlifyText(text) || title.includes('netlify') || aria.includes('netlify');
  };
  const hideNode = node => {
    if (node.dataset?.tlcHideNetlify === 'true') return;
    node.dataset.tlcHideNetlify = 'true';
    node.style.setProperty('display', 'none', 'important');
    node.setAttribute('aria-hidden', 'true');
    node.setAttribute('tabindex', '-1');
  };

  document.querySelectorAll('a[href], iframe[src], div, section, aside, footer, header').forEach(node => {
    if (shouldHide(node)) {
      const wrapper = node.closest('div, section, aside, footer, header') || node;
      hideNode(wrapper);
    }
  });

  document.querySelectorAll('*[style*="fixed"]').forEach(node => {
    if (node.children.length === 0 && hasNetlifyText(node.textContent)) {
      hideNode(node);
      return;
    }
    if (node.tagName === 'A' && /netlify/i.test(node.href)) hideNode(node);
  });
}

hideNetlifyBranding();
const netlifyObserver = new MutationObserver(hideNetlifyBranding);
if (document.body) netlifyObserver.observe(document.body, { childList: true, subtree: true });

mountSectionMotion(document, reducedMotion);

const mediaRoot = document.querySelector('[data-hero-media]');
if (mediaRoot) mountHeroMedia(mediaRoot);
