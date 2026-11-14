// Planet navigator for /space/. Shows one planet card at a time.
// Arrow keys only act while focus is inside the navigator, so they never
// hijack normal page scrolling.
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

  async function go(step) {
    if (animating || cards.length < 2) return;
    animating = true;

    const current = cards[index];
    current.classList.add('is-fading');
    await wait(FADE_MS);
    current.hidden = true;
    current.classList.remove('is-fading');

    index = (index + step + cards.length) % cards.length;
    const next = cards[index];
    next.classList.add('is-fading');
    next.hidden = false;
    await wait(20);
    next.classList.remove('is-fading');

    updateCounter();
    animating = false;
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

  updateCounter();
})();
