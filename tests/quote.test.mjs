import test from 'node:test';
import assert from 'node:assert/strict';
import { PHONE, createQuoteMessage, createSmsUrl } from '../dist/quote.js';

test('package selections survive the message handoff', () => {
  for (const [key, name] of [['quick', 'Quick Detail'], ['full', 'Full Detail']]) {
    const message = createQuoteMessage({ package: key, vehicle: '2022 Toyota Camry', area: 'Downtown' });
    assert.match(message, new RegExp(name));
    assert.match(message, /Vehicle: 2022 Toyota Camry\nArea: Downtown/);
    const uri = createSmsUrl(message);
    assert.ok(uri.startsWith('sms:' + PHONE + '?body='));
    assert.equal(decodeURIComponent(uri.split('?body=')[1]), message);
  }
});
test('an undecided visitor gets a usable draft without empty placeholders', () => {
  const message = createQuoteMessage();
  assert.match(message, /help choosing/);
  assert.doesNotMatch(message, /undefined|Vehicle:|Area:|Notes:|___/);
});
test('special characters and multiline details remain text inside the SMS body', () => {
  const message = createQuoteMessage({ package: 'full', vehicle: '  José’s truck & trailer  ', notes: '<script>bad</script>\nDog hair? #clean' });
  const uri = createSmsUrl(message);
  assert.equal(new URL(uri).searchParams.get('body'), message);
  assert.ok(!uri.includes('<script>'));
  assert.match(message, /Dog hair\? #clean/);
});
test('unknown package values do not become claims, and inputs are bounded', () => {
  const message = createQuoteMessage({ package: 'ceramic coating', vehicle: 'a'.repeat(200), notes: 'x'.repeat(900) });
  assert.match(message, /help choosing/);
  assert.doesNotMatch(message, /ceramic coating/);
  assert.equal(message.match(/Vehicle: (.*)/)[1].length, 120);
  assert.equal(message.match(/Notes: (.*)/)[1].length, 500);
});
