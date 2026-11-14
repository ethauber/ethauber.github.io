// Site-wide navigation behaviour. Section scrolling itself is plain anchor
// links plus `scroll-behavior: smooth` in CSS, so there is very little here.
(function () {
  'use strict';

  const navbar = document.querySelector('.site-nav');
  if (!navbar) return;

  const links = Array.from(navbar.querySelectorAll('[data-section]'));
  const sections = links
    .map(link => document.getElementById(link.dataset.section))
    .filter(Boolean);

  function setActive(id) {
    links.forEach(link => {
      const isActive = link.dataset.section === id;
      link.classList.toggle('active', isActive);
      if (isActive) {
        link.setAttribute('aria-current', 'true');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  // Highlight the section currently under the top of the viewport.
  function updateActive() {
    // A little past the navbar, to cover the scroll-padding set in main.css.
    const marker = window.scrollY + navbar.offsetHeight + 24;
    let current = sections[0];
    sections.forEach(section => {
      if (section.offsetTop <= marker) current = section;
    });
    // A short last section can never reach the top, so use it at page bottom.
    const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
    if (atBottom) current = sections[sections.length - 1];
    if (current) setActive(current.id);
  }

  // Hide the navbar while scrolling down, show it when scrolling up.
  let lastY = window.scrollY;
  let ticking = false;
  function onScroll() {
    const y = window.scrollY;
    const menuOpen = navbar.querySelector('.navbar-collapse.show');
    if (y > lastY && y > 100 && !menuOpen) {
      navbar.classList.add('navbar-hidden');
    } else {
      navbar.classList.remove('navbar-hidden');
    }
    lastY = y;
    if (sections.length) updateActive();
    ticking = false;
  }
  window.addEventListener('scroll', () => {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(onScroll);
    }
  }, { passive: true });

  // Close the mobile menu after choosing a link (Bootstrap 4 collapse API).
  links.forEach(link => {
    link.addEventListener('click', () => {
      if (window.jQuery) window.jQuery('.navbar-collapse.show').collapse('hide');
    });
  });

  if (sections.length) updateActive();
})();
