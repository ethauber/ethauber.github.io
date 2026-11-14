// Planet navigator for /space/. Shows one planet card at a time.
// Arrow keys only act while focus is inside the navigator, so they never
// hijack normal page scrolling.
//
// Other scripts talk to the navigator through two events on its root:
//   planet:select  (listened for)  detail: { id }         show that planet
//   planet:change  (dispatched)    detail: { id, index }  a planet was shown
(function () {
  'use strict';

  const root = document.querySelector('[data-planet-navigator]');
  if (!root) return;

  const cards = Array.from(root.querySelectorAll('.planet-card'));
  const counter = document.getElementById('planetCounter');
  const FADE_MS = 150;
  let index = Math.max(cards.findIndex(card => !card.hidden), 0);
  let animating = false;

  const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

  function updateCounter() {
    if (counter) {
      counter.textContent = `${cards[index].dataset.planet} (${index + 1} of ${cards.length})`;
    }
  }

  function announce() {
    root.dispatchEvent(new CustomEvent('planet:change', {
      detail: { id: cards[index].id, index: index }
    }));
  }

  async function show(target) {
    if (animating || target === index || target < 0 || target >= cards.length) return;
    animating = true;

    const current = cards[index];
    current.classList.add('is-fading');
    await wait(FADE_MS);
    // Hiding a card that holds focus would drop focus to <body> and the arrow
    // keys would stop reaching the navigator, so hand focus to it first.
    if (current.contains(document.activeElement)) root.focus({ preventScroll: true });
    current.hidden = true;
    current.classList.remove('is-fading');

    index = target;
    const next = cards[index];
    next.classList.add('is-fading');
    next.hidden = false;
    await wait(20);
    next.classList.remove('is-fading');

    updateCounter();
    animating = false;
    announce();
  }

  function go(step) {
    show((index + step + cards.length) % cards.length);
  }

  root.querySelector('[data-planet-prev]').addEventListener('click', () => go(-1));
  root.querySelector('[data-planet-next]').addEventListener('click', () => go(1));

  root.addEventListener('keydown', event => {
    if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
      event.preventDefault();
      go(-1);
    } else if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      event.preventDefault();
      go(1);
    }
  });

  root.addEventListener('planet:select', event => {
    const id = event.detail && event.detail.id;
    show(cards.findIndex(card => card.id === id));
  });

  updateCounter();
})();
