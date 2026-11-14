// Mandelbrot and Julia set renderers for the Works section.
// Each <figure data-fractal="mandelbrot|julia"> holds a canvas, a loader and a
// re-render button. Rendering starts the first time the figure scrolls into
// view and is chunked so the page stays responsive.
(function () {
  'use strict';

  const ITERATIONS = 100;
  const CHUNK = 10000; // pixels drawn between frames

  function mandelbrotEscape(x, y) {
    let re = x;
    let im = y;
    for (let i = 0; i < ITERATIONS; i++) {
      const nextRe = re * re - im * im + x;
      im = 2 * re * im + y;
      re = nextRe;
      if (re * im > 99999) return (i / ITERATIONS) * 100;
    }
    return 0;
  }

  function juliaEscape(x, y, cRe, cIm) {
    let zx = x;
    let zy = y;
    for (let i = 0; i < ITERATIONS; i++) {
      const nextZx = zx * zx - zy * zy + cRe;
      zy = 2 * zx * zy + cIm;
      zx = nextZx;
      if (zx * zx + zy * zy > 16) return (i / ITERATIONS) * 100;
    }
    return 0;
  }

  function juliaColor(x, y, escape, width, height) {
    const fadeStart = 0.92;
    const dx = (x - width / 2) / (width / 2);
    const dy = (y - height / 2) / (height / 2);
    const dist = Math.sqrt(dx * dx + dy * dy);
    const fade = dist > fadeStart ? 1 - Math.min((dist - fadeStart) / (1 - fadeStart), 1) : 1;

    if (escape === 0) {
      return `rgba(251, 220, 117, ${0.95 * fade})`;
    }
    const norm = Math.log(1 + escape) / Math.log(101);
    const hue = (200 + 120 * norm + 60 * Math.sin((x - y) / 90)) % 360;
    const light = 55 + 35 * Math.sin(norm * Math.PI * 2);
    const alpha = Math.max((0.45 + 0.45 * Math.pow(norm, 0.7)) * fade, 0);
    return `hsla(${hue}, 85%, ${light}%, ${alpha})`;
  }

  // kind -> function returning the fill colour for a pixel
  const PIXEL = {
    mandelbrot(x, y) {
      const escape = mandelbrotEscape(x / 200 - 2, y / 200 - 1.5);
      return escape === 0 ? '#fbdc75' : `hsl(261, 80%, ${Math.abs(escape - 100)}%)`;
    },
    julia(x, y, width, height) {
      const escape = juliaEscape(x / 200 - 1.5, y / 200 - 1.5, -0.7, 0.27015);
      return juliaColor(x, y, escape, width, height);
    }
  };

  const nextFrame = () => new Promise(resolve => window.requestAnimationFrame(resolve));

  async function draw(canvas, pixel) {
    const ctx = canvas.getContext('2d');
    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);
    let count = 0;
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        ctx.fillStyle = pixel(x, y, width, height);
        ctx.fillRect(x, y, 1, 1);
        if (++count % CHUNK === 0) await nextFrame();
      }
    }
  }

  function setup(figure) {
    const pixel = PIXEL[figure.dataset.fractal];
    const canvas = figure.querySelector('canvas');
    const loader = figure.querySelector('.fractal__loader');
    const button = figure.querySelector('.btn-render');
    if (!pixel || !canvas) return;

    const label = button ? button.textContent : '';
    let busy = false;

    async function render() {
      if (busy) return;
      busy = true;
      if (loader) loader.hidden = false;
      if (button) { button.disabled = true; button.textContent = 'Rendering...'; }
      await draw(canvas, pixel);
      if (loader) loader.hidden = true;
      if (button) { button.disabled = false; button.textContent = label; }
      busy = false;
    }

    if (button) button.addEventListener('click', render);

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => {
        if (entries.some(entry => entry.isIntersecting)) {
          observer.disconnect();
          render();
        }
      }, { rootMargin: '200px' });
      observer.observe(figure);
    } else {
      render();
    }
  }

  document.querySelectorAll('[data-fractal]').forEach(setup);
})();
