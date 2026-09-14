// CLIENT: replace the placeholder phone number; the same number is used in every tel:/sms: link in index.html.
export const PHONE = '+10000000000';
export const PHONE_DISPLAY = '(000) 000-0000';
export const PACKAGES = Object.freeze({ quick: 'Quick Detail', full: 'Full Detail', help: 'Help me choose' });
const clean = (value, limit) => String(value ?? '').trim().replace(/\s+/g, ' ').slice(0, limit);
export function createQuoteMessage({ package: selected, vehicle, area, notes } = {}) {
  const key = Object.hasOwn(PACKAGES, selected ?? '') ? selected : 'help';
  const lines = [key === 'help' ? "Hi! I'd like help choosing a detailing package." : "Hi! I'd like a quote for " + PACKAGES[key] + '.'];
  for (const [label, value, limit] of [['Vehicle', vehicle, 120], ['Area', area, 120], ['Notes', notes, 500]]) {
    const text = clean(value, limit);
    if (text) lines.push(label + ': ' + text);
  }
  lines.push('Please let me know pricing and availability. Thank you!');
  return lines.join('\n');
}
export function createSmsUrl(message) { return 'sms:' + PHONE + '?body=' + encodeURIComponent(message); }
