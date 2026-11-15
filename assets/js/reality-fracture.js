// MTG Reality Fracture easter egg: Jace Beleren, The Theorist (Echoverse Architect).
// Triggered by typing "jace", "theorist", or "fracture", or via the terminal.
(function () {
  'use strict';

  const utils = window.EasterEggUtils;
  if (!utils) return;

  const DURATION_MS = 5500;
  const SIGIL_COUNT = 8;

  function createOverlay(className) {
    const el = document.createElement('div');
    el.className = className;
    el.setAttribute('aria-hidden', 'true');
    document.body.appendChild(el);
    return el;
  }

  function createCanvas() {
    const canvas = document.createElement('canvas');
    canvas.className = 'jace-canvas';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.setAttribute('aria-hidden', 'true');
    document.body.appendChild(canvas);
    return canvas;
  }

  function buildDossier(onDismiss) {
    const panel = document.createElement('aside');
    panel.className = 'jace-dossier';
    panel.setAttribute('role', 'status');
    panel.setAttribute('aria-label', 'Reality Fracture: Jace Beleren, The Theorist');

    const crown = document.createElement('div');
    crown.className = 'jace-dossier__crown';
    crown.textContent = '◆ REALITY FRACTURE // ECHOVERSE ARCHITECT ◆';

    const body = document.createElement('div');
    body.className = 'jace-dossier__body';

    const title = document.createElement('div');
    title.className = 'jace-dossier__title';
    title.textContent = 'Jace Beleren, The Theorist';

    const quote = document.createElement('p');
    quote.className = 'jace-dossier__quote';
    quote.textContent =
      '"Empathy is an uncontained variable. Within the Echoverse, reality itself obeys the lattice."';

    const list = document.createElement('dl');
    list.className = 'jace-dossier__list';
    [
      ['EMPATHY', 'LOCKED // SUPPRESSED'],
      ['PROTOCOL', 'MONITOR // ERASE // OVERWRITE'],
      ['ATTIRE', 'CRYSTALLINE BLUE ROBES & SOVEREIGN SIGILS'],
      ['MAGIC', 'KALEIDOSCOPIC FRACTALS & PRISM LATTICES']
    ].forEach(([term, desc]) => {
      const dt = document.createElement('dt');
      dt.textContent = term;
      const dd = document.createElement('dd');
      dd.textContent = desc;
      list.appendChild(dt);
      list.appendChild(dd);
    });

    const dismiss = document.createElement('button');
    dismiss.type = 'button';
    dismiss.className = 'jace-dossier__close';
    dismiss.textContent = 'RELEASE LATTICE';
    dismiss.addEventListener('click', onDismiss);

    body.appendChild(title);
    body.appendChild(quote);
    body.appendChild(list);
    body.appendChild(dismiss);
    panel.appendChild(crown);
    panel.appendChild(body);
    document.body.appendChild(panel);
    return panel;
  }

  function drawPolygon(ctx, cx, cy, radius, sides, rotation) {
    ctx.beginPath();
    for (let i = 0; i <= sides; i++) {
      const angle = rotation + (i / sides) * Math.PI * 2;
      const x = cx + Math.cos(angle) * radius;
      const y = cy + Math.sin(angle) * radius;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
  }

  function drawPrismLattice(ctx, width, height, elapsed, reduced) {
    const cx = width / 2;
    const cy = height / 2;
    const baseRadius = Math.min(width, height) * 0.36;
    const progress = Math.min(elapsed / DURATION_MS, 1);

    // Brief reality fracture/shatter impulse mid-sequence
    const fractureWindow = !reduced && progress > 0.38 && progress < 0.54;
    const fractureIntensity = fractureWindow
      ? Math.sin(((progress - 0.38) / 0.16) * Math.PI)
      : 0;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = fractureWindow
      ? `rgba(14, 34, 68, ${(0.22 + 0.18 * fractureIntensity).toFixed(3)})`
      : 'rgba(8, 18, 42, 0.24)';
    ctx.fillRect(0, 0, width, height);

    const spin = reduced ? 0.25 : elapsed * 0.00045;
    const palette = [
      'rgba(125, 211, 252, 0.72)',
      'rgba(56, 189, 248, 0.60)',
      'rgba(129, 140, 248, 0.55)',
      'rgba(224, 242, 254, 0.80)'
    ];

    // Sovereign throne arc & kaleidoscopic prism rings
    for (let ring = 0; ring < 4; ring++) {
      const r = baseRadius * (0.42 + ring * 0.24);
      const jitter = fractureIntensity * (ring % 2 === 0 ? 14 : -14);
      ctx.save();
      ctx.strokeStyle = palette[ring % palette.length];
      ctx.lineWidth = ring === 3 ? 1.8 : 1.2;
      drawPolygon(ctx, cx + jitter, cy - jitter * 0.5, r, 6 + (ring % 2) * 2, spin * (ring % 2 === 0 ? 1 : -1.2));
      ctx.stroke();
      ctx.restore();
    }

    // Floating geometric sigils framing the center like a crystalline throne
    const sigilNodes = [];
    for (let i = 0; i < SIGIL_COUNT; i++) {
      const angle = (i / SIGIL_COUNT) * Math.PI * 2 + spin * 0.8;
      const orbitR = baseRadius * (0.85 + 0.08 * Math.sin(spin * 3 + i));
      const shardOffset = fractureIntensity * ((i % 2 === 0 ? 1 : -1) * 26);
      const sx = cx + Math.cos(angle) * (orbitR + shardOffset);
      const sy = cy + Math.sin(angle) * (orbitR + shardOffset);
      sigilNodes.push({ x: sx, y: sy, angle: angle });

      ctx.save();
      ctx.strokeStyle = 'rgba(186, 230, 253, 0.9)';
      ctx.fillStyle = 'rgba(56, 189, 248, 0.18)';
      ctx.lineWidth = 1.5;
      drawPolygon(ctx, sx, sy, 18 + (i % 2) * 6, 4, angle + spin * 2);
      ctx.fill();
      ctx.stroke();

      // Inner crystal facet
      drawPolygon(ctx, sx, sy, 8, 4, -angle - spin);
      ctx.stroke();
      ctx.restore();
    }

    // Interconnecting prism lattice & kaleidoscopic rays
    ctx.save();
    ctx.strokeStyle = fractureWindow
      ? 'rgba(224, 242, 254, 0.85)'
      : 'rgba(96, 165, 250, 0.34)';
    ctx.lineWidth = fractureWindow ? 1.6 : 1;
    for (let i = 0; i < sigilNodes.length; i++) {
      const a = sigilNodes[i];
      const b = sigilNodes[(i + 2) % sigilNodes.length];
      const c = sigilNodes[(i + 3) % sigilNodes.length];
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.lineTo(c.x, c.y);
      ctx.stroke();
    }
    ctx.restore();
  }

  function triggerRealityFracture() {
    if (!utils.effectLock.tryAcquire('jace')) return false;

    console.log(
      '%c🔷 ECHOVERSE ARCHITECT: Empathy locked. Kaleidoscopic prism lattices overwriting reality...',
      'color: #38bdf8; font-weight: bold;'
    );

    const reduced = utils.prefersReducedMotion();
    const overlay = createOverlay('jace-fracture-overlay');
    const canvas = createCanvas();
    const ctx = canvas.getContext('2d');

    let cleaned = false;
    let frameId = null;
    let timerId = null;

    function cleanup() {
      if (cleaned) return;
      cleaned = true;
      if (frameId) cancelAnimationFrame(frameId);
      if (timerId) clearTimeout(timerId);
      document.removeEventListener('keydown', onEscape);
      canvas.remove();
      overlay.remove();
      dossier.remove();
      utils.effectLock.release('jace');
    }

    function onEscape(e) {
      if (e.key === 'Escape') cleanup();
    }

    const dossier = buildDossier(cleanup);
    document.addEventListener('keydown', onEscape);

    const startTime = performance.now();
    function renderLoop(now) {
      if (cleaned) return;
      const elapsed = now - startTime;
      drawPrismLattice(ctx, canvas.width, canvas.height, elapsed, reduced);
      if (!reduced && elapsed < DURATION_MS) {
        frameId = requestAnimationFrame(renderLoop);
      }
    }

    frameId = requestAnimationFrame(renderLoop);
    timerId = setTimeout(cleanup, DURATION_MS);
    return true;
  }

  const jaceDispatcher = utils.createSequenceDispatcher([
    { sequence: ['j', 'a', 'c', 'e'], caseInsensitive: true, onMatch: triggerRealityFracture },
    { sequence: ['t', 'h', 'e', 'o', 'r', 'i', 's', 't'], caseInsensitive: true, onMatch: triggerRealityFracture },
    { sequence: ['f', 'r', 'a', 'c', 't', 'u', 'r', 'e'], caseInsensitive: true, onMatch: triggerRealityFracture }
  ]);

  document.addEventListener('keydown', function (e) {
    jaceDispatcher.handleKey(e.key, e.target);
  });

  window.RealityFractureEasterEgg = {
    trigger: triggerRealityFracture,
    isActive: () => utils.effectLock.isActive()
  };
})();
