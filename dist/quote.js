export const PHONE = '+18324661100';
export const PACKAGES = Object.freeze({ quick: 'Quick Detail', full: 'Extra TLC Full Detail', help: 'Help me choose' });
const clean = (value, limit) => String(value ?? '').trim().replace(/\s+/g, ' ').slice(0, limit);
export function createQuoteMessage({ package: selected, vehicle, area, notes } = {}) {
  const key = Object.hasOwn(PACKAGES, selected ?? '') ? selected : 'help';
  const lines = [key === 'help' ? "Hi TLC! I'd like help choosing a detailing package." : "Hi TLC! I'd like a quote for " + PACKAGES[key] + '.'];
  for (const [label, value, limit] of [['Vehicle', vehicle, 120], ['Area', area, 120], ['Notes', notes, 500]]) {
    const text = clean(value, limit);
    if (text) lines.push(label + ': ' + text);
  }
  lines.push('Please let me know pricing and availability. Thank you!');
  return lines.join('\n');
}
export function createSmsUrl(message) { return 'sms:' + PHONE + '?body=' + encodeURIComponent(message); }
