// Shared utilities for keyboard sequence easter eggs and stardate calculation.
// Kept DOM-optional so sequence matching and stardates can be unit tested with
// `node --test tests/*.test.js`.
(function (root, factory) {
  'use strict';
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.EasterEggUtils = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const EDITABLE_TAGS = new Set(['INPUT', 'TEXTAREA', 'SELECT']);
  const TNG_BASE_YEAR = 1987;
  const TNG_BASE_STARDATE = 41000;

  function normalizeKey(key, caseInsensitive) {
    if (typeof key !== 'string') return '';
    return caseInsensitive ? key.toLowerCase() : key;
  }

  // KMP prefix table so partial overlapping inputs (e.g. "hah" -> "h", or
  // "engengage" -> "engage") recover without dropping a new sequence start.
  function buildPrefixTable(sequence, caseInsensitive) {
    const table = new Array(sequence.length).fill(0);
    let len = 0;
    for (let i = 1; i < sequence.length; i++) {
      const current = normalizeKey(sequence[i], caseInsensitive);
      while (len > 0 && current !== normalizeKey(sequence[len], caseInsensitive)) {
        len = table[len - 1];
      }
      if (current === normalizeKey(sequence[len], caseInsensitive)) {
        len++;
      }
      table[i] = len;
    }
    return table;
  }

  function advanceSequence(sequence, index, key, caseInsensitive, prefixTable) {
    if (!Array.isArray(sequence) || sequence.length === 0 || typeof key !== 'string') {
      return 0;
    }
    const table = prefixTable || buildPrefixTable(sequence, caseInsensitive);
    const input = normalizeKey(key, caseInsensitive);
    let pos = Number.isInteger(index) && index >= 0 && index < sequence.length ? index : 0;

    while (pos > 0 && input !== normalizeKey(sequence[pos], caseInsensitive)) {
      pos = table[pos - 1];
    }
    if (input === normalizeKey(sequence[pos], caseInsensitive)) {
      pos++;
    }
    return pos;
  }

  function isEditableElement(el) {
    return Boolean(el && (el.isContentEditable || EDITABLE_TAGS.has(el.tagName)));
  }

  function prefersReducedMotion() {
    return Boolean(
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  }

  // Creates a stateful dispatcher for multiple key sequences.
  // Each binding is { sequence: string[], caseInsensitive?: boolean, onMatch: () => void }.
  function createSequenceDispatcher(bindings, options) {
    const allowEditable = Boolean(options && options.allowEditable);
    const entries = (bindings || []).map(binding => {
      const caseInsensitive = Boolean(binding.caseInsensitive);
      return {
        sequence: binding.sequence,
        caseInsensitive: caseInsensitive,
        prefixTable: buildPrefixTable(binding.sequence, caseInsensitive),
        onMatch: binding.onMatch,
        index: 0
      };
    });

    function handleKey(key, target) {
      if (!allowEditable && isEditableElement(target)) {
        return;
      }
      entries.forEach(entry => {
        entry.index = advanceSequence(
          entry.sequence,
          entry.index,
          key,
          entry.caseInsensitive,
          entry.prefixTable
        );
        if (entry.index === entry.sequence.length) {
          entry.index = 0;
          if (typeof entry.onMatch === 'function') {
            entry.onMatch();
          }
        }
      });
    }

    function reset() {
      entries.forEach(entry => {
        entry.index = 0;
      });
    }

    return {
      handleKey: handleKey,
      reset: reset
    };
  }

  // TNG-style stardate: 41000.0 at the start of 1987, advancing 1000 units per Earth year.
  function computeStardate(dateInput) {
    const d = dateInput instanceof Date && !Number.isNaN(dateInput.getTime())
      ? dateInput
      : new Date();
    const year = d.getFullYear();
    const yearStart = new Date(year, 0, 1).getTime();
    const nextYearStart = new Date(year + 1, 0, 1).getTime();
    const fraction = (d.getTime() - yearStart) / (nextYearStart - yearStart);
    const stardate = TNG_BASE_STARDATE + (year - TNG_BASE_YEAR + fraction) * 1000;
    return stardate.toFixed(1);
  }

  return {
    advanceSequence: advanceSequence,
    buildPrefixTable: buildPrefixTable,
    computeStardate: computeStardate,
    createSequenceDispatcher: createSequenceDispatcher,
    isEditableElement: isEditableElement,
    prefersReducedMotion: prefersReducedMotion
  };
});
