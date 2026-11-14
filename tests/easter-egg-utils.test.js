// Run with: node --test tests/*.test.js
'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const utils = require('../assets/js/easter-egg-utils.js');

test('advanceSequence matches full exact and case-insensitive sequences', () => {
  const konami = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'b', 'a'];
  let idx = 0;
  for (const key of konami) {
    idx = utils.advanceSequence(konami, idx, key, false);
  }
  assert.equal(idx, konami.length);

  const halo = ['h', 'a', 'l', 'o'];
  let haloIdx = 0;
  for (const key of ['H', 'A', 'l', 'O']) {
    haloIdx = utils.advanceSequence(halo, haloIdx, key, true);
  }
  assert.equal(haloIdx, halo.length);
});

test('advanceSequence recovers overlapping prefix matches cleanly', () => {
  const engage = ['e', 'n', 'g', 'a', 'g', 'e'];
  let idx = 0;
  // User types "e", "n", "g", then "e", "n", "g", "a", "g", "e"
  for (const ch of ['e', 'n', 'g', 'e', 'n', 'g', 'a', 'g', 'e']) {
    idx = utils.advanceSequence(engage, idx, ch, true);
  }
  assert.equal(idx, engage.length);

  // Konami double ArrowUp prefix: 3 ArrowUps followed by ArrowDown still lands at index 3
  const konami = ['ArrowUp', 'ArrowUp', 'ArrowDown'];
  let kIdx = 0;
  for (const key of ['ArrowUp', 'ArrowUp', 'ArrowUp', 'ArrowDown']) {
    kIdx = utils.advanceSequence(konami, kIdx, key, false);
  }
  assert.equal(kIdx, konami.length);
});

test('advanceSequence handles non-string keys and empty sequences safely', () => {
  assert.equal(utils.advanceSequence([], 0, 'a', true), 0);
  assert.equal(utils.advanceSequence(['a', 'b'], 1, undefined, true), 0);
});

test('createSequenceDispatcher fires matching handlers and skips editable targets', () => {
  const fired = [];
  const dispatcher = utils.createSequenceDispatcher([
    { sequence: ['h', 'a', 'l', 'o'], caseInsensitive: true, onMatch: () => fired.push('halo') },
    { sequence: ['t', 'r', 'e', 'k'], caseInsensitive: true, onMatch: () => fired.push('trek') }
  ]);

  const inputEl = { tagName: 'INPUT', isContentEditable: false };
  for (const ch of 'halo') {
    dispatcher.handleKey(ch, inputEl);
  }
  assert.deepEqual(fired, []);

  for (const ch of 'trek') {
    dispatcher.handleKey(ch, { tagName: 'BODY', isContentEditable: false });
  }
  assert.deepEqual(fired, ['trek']);

  // Matching resets index so typing it again triggers a second time
  for (const ch of 'halo') {
    dispatcher.handleKey(ch, null);
  }
  assert.deepEqual(fired, ['trek', 'halo']);
});

test('isEditableElement detects form controls and contentEditable nodes', () => {
  assert.equal(utils.isEditableElement(null), false);
  assert.equal(utils.isEditableElement({ tagName: 'DIV', isContentEditable: false }), false);
  assert.equal(utils.isEditableElement({ tagName: 'DIV', isContentEditable: true }), true);
  assert.equal(utils.isEditableElement({ tagName: 'INPUT', isContentEditable: false }), true);
  assert.equal(utils.isEditableElement({ tagName: 'TEXTAREA', isContentEditable: false }), true);
  assert.equal(utils.isEditableElement({ tagName: 'SELECT', isContentEditable: false }), true);
});

test('computeStardate returns deterministic TNG-style stardates', () => {
  // Start of 1987 matches base stardate 41000.0
  assert.equal(utils.computeStardate(new Date(1987, 0, 1, 0, 0, 0)), '41000.0');
  // Midpoint of a non-leap year (1987 has 365 days -> 182.5 days after Jan 1)
  const mid1987 = new Date(1987, 0, 1, 0, 0, 0);
  mid1987.setTime(mid1987.getTime() + 182.5 * 24 * 60 * 60 * 1000);
  assert.equal(utils.computeStardate(mid1987), '41500.0');
  // Invalid date falls back to a finite formatted stardate
  assert.match(utils.computeStardate(new Date('invalid')), /^\d+\.\d$/);
});
