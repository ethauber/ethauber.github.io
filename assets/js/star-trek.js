// Star Trek keyboard sequence easter eggs and visual effects.
// Supports "engage" (Warp), "redalert" (Red Alert), "makeitso" (Transporter),
// "lcars" (LCARS HUD), and "trek" (cycles through all four).
(function () {
  'use strict';

  const utils = window.EasterEggUtils;
  if (!utils) return;

  let trekRotationIndex = 0;
  let isTrekActive = false;

  const WARP_DURATION_MS = 2800;
  const RED_ALERT_DURATION_MS = 3500;
  const TRANSPORTER_DURATION_MS = 2600;
  const LCARS_DURATION_MS = 5000;

  function createOverlayCanvas(className) {
    const canvas = document.createElement('canvas');
    canvas.className = className;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);
    return canvas;
  }

  function showLcarsToast(badgeText, messageText, durationMs) {
    const toast = document.createElement('div');
    toast.className = 'trek-toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');

    const badge = document.createElement('span');
    badge.className = 'trek-toast__badge';
    badge.textContent = badgeText;

    const text = document.createElement('span');
    text.className = 'trek-toast__text';
    text.textContent = messageText;

    toast.appendChild(badge);
    toast.appendChild(text);
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, durationMs);
    return toast;
  }

  function runExclusive(fn) {
    if (isTrekActive) return false;
    isTrekActive = true;
    fn(() => {
      isTrekActive = false;
    });
    return true;
  }

  // --- EFFECT 1: WARP SPEED ("engage") ---
  function triggerWarpSpeed() {
    return runExclusive(done => {
      console.log('%c🖖 HELM: Ahead warp factor 9.975. Engage!', 'color: #99ccff; font-weight: bold;');
      const reduced = utils.prefersReducedMotion();
      const canvas = createOverlayCanvas('trek-canvas');
      const ctx = canvas.getContext('2d');
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      const starCount = 160;
      const stars = Array.from({ length: starCount }, () => ({
        angle: Math.random() * Math.PI * 2,
        radius: 10 + Math.random() * Math.max(cx, cy) * 0.7,
        speed: 1.5 + Math.random() * 3.5,
        hue: Math.random() > 0.25 ? '#dbeafe' : '#99ccff'
      }));

      showLcarsToast('WARP 9.975', 'ENGAGE — COURSE LAID IN', WARP_DURATION_MS);

      let frameId = null;
      const startTime = performance.now();

      function drawFrame(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / WARP_DURATION_MS, 1);
        const accel = reduced ? 0 : 1 + progress * 14;

        ctx.fillStyle = reduced ? 'rgba(10, 14, 28, 0.78)' : 'rgba(10, 14, 28, 0.35)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        stars.forEach(star => {
          const prevR = star.radius;
          if (!reduced) {
            star.radius += star.speed * accel;
            if (star.radius > Math.max(canvas.width, canvas.height)) {
              star.radius = 6 + Math.random() * 24;
            }
          }
          const x1 = cx + Math.cos(star.angle) * prevR;
          const y1 = cy + Math.sin(star.angle) * prevR;
          const streak = reduced ? 2 : Math.min(star.radius * 0.28 + accel * 2, 110);
          const x2 = cx + Math.cos(star.angle) * (star.radius + streak);
          const y2 = cy + Math.sin(star.angle) * (star.radius + streak);

          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.strokeStyle = star.hue;
          ctx.lineWidth = reduced ? 2 : 1.5 + progress * 1.5;
          ctx.stroke();
        });

        if (!reduced && elapsed < WARP_DURATION_MS) {
          frameId = requestAnimationFrame(drawFrame);
        }
      }

      frameId = requestAnimationFrame(drawFrame);

      if (!reduced) {
        setTimeout(() => {
          document.body.classList.add('trek-warp-flash');
        }, WARP_DURATION_MS - 500);
      }

      setTimeout(() => {
        if (frameId) cancelAnimationFrame(frameId);
        canvas.remove();
        document.body.classList.remove('trek-warp-flash');
        done();
      }, WARP_DURATION_MS);
    });
  }

  // --- EFFECT 2: RED ALERT ("redalert") ---
  function triggerRedAlert() {
    return runExclusive(done => {
      console.log('%c🚨 TACTICAL: RED ALERT! Shields up, all hands to battlestations!', 'color: #ff4d4d; font-weight: bold;');
      document.body.classList.add('trek-red-alert');

      const banner = document.createElement('div');
      banner.className = 'trek-red-alert-banner';
      banner.setAttribute('role', 'status');
      banner.setAttribute('aria-live', 'polite');

      const icon = document.createElement('span');
      icon.className = 'trek-red-alert-banner__icon';
      icon.setAttribute('aria-hidden', 'true');
      icon.textContent = '⚠';

      const label = document.createElement('span');
      label.textContent = 'RED ALERT — ALL HANDS TO BATTLESTATIONS';

      banner.appendChild(icon);
      banner.appendChild(label);
      document.body.appendChild(banner);

      setTimeout(() => {
        banner.remove();
        document.body.classList.remove('trek-red-alert');
        done();
      }, RED_ALERT_DURATION_MS);
    });
  }

  // --- EFFECT 3: TRANSPORTER BEAM ("makeitso") ---
  function triggerTransporter() {
    return runExclusive(done => {
      console.log('%c✨ TRANSPORTER ROOM: Energizing...', 'color: #ffd166; font-weight: bold;');
      const reduced = utils.prefersReducedMotion();
      const canvas = createOverlayCanvas('trek-canvas');
      const ctx = canvas.getContext('2d');

      const sweep = document.createElement('div');
      sweep.className = 'trek-transporter-sweep';
      document.body.appendChild(sweep);

      showLcarsToast('TRANSPORTER', 'MAKE IT SO — ENERGIZING', TRANSPORTER_DURATION_MS);

      const particles = Array.from({ length: 140 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vy: (Math.random() - 0.5) * 2.2,
        size: 1.5 + Math.random() * 2.5,
        phase: Math.random() * Math.PI * 2,
        gold: Math.random() > 0.35
      }));

      let frameId = null;
      const startTime = performance.now();

      function drawParticles(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / TRANSPORTER_DURATION_MS, 1);
        const envelope = Math.sin(progress * Math.PI);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
          if (!reduced) {
            p.y += p.vy;
            if (p.y < 0) p.y = canvas.height;
            if (p.y > canvas.height) p.y = 0;
          }
          const twinkle = reduced ? 0.75 : 0.35 + 0.65 * Math.abs(Math.sin(elapsed * 0.01 + p.phase));
          const alpha = (reduced ? 0.65 : envelope) * twinkle;
          ctx.fillStyle = p.gold
            ? `rgba(255, 209, 102, ${alpha.toFixed(3)})`
            : `rgba(125, 249, 255, ${alpha.toFixed(3)})`;
          ctx.fillRect(p.x, p.y, p.size, p.size * 3);
        });

        if (!reduced && elapsed < TRANSPORTER_DURATION_MS) {
          frameId = requestAnimationFrame(drawParticles);
        }
      }

      frameId = requestAnimationFrame(drawParticles);

      setTimeout(() => {
        if (frameId) cancelAnimationFrame(frameId);
        canvas.remove();
        sweep.remove();
        done();
      }, TRANSPORTER_DURATION_MS);
    });
  }

  // --- EFFECT 4: LCARS DIAGNOSTIC PANEL ("lcars") ---
  function triggerLcarsReadout() {
    return runExclusive(done => {
      const stardate = utils.computeStardate(new Date());
      console.log(`%c📡 LCARS 47634 ONLINE — STARDATE ${stardate}`, 'color: #ff9900; font-weight: bold;');

      const panel = document.createElement('aside');
      panel.className = 'trek-lcars-panel';
      panel.setAttribute('role', 'status');
      panel.setAttribute('aria-label', 'LCARS ship status readout');

      const elbow = document.createElement('div');
      elbow.className = 'trek-lcars-panel__elbow';
      elbow.textContent = 'LCARS 1701-D';

      const body = document.createElement('div');
      body.className = 'trek-lcars-panel__body';

      const title = document.createElement('div');
      title.className = 'trek-lcars-panel__title';
      title.textContent = `STARDATE ${stardate}`;

      const rows = [
        ['SECTOR', '001 // ORION ARM'],
        ['WARP CORE', 'NOMINAL (99.8%)'],
        ['SHIELDS', 'ONLINE // 100%'],
        ['BEVERAGE', 'TEA, EARL GREY, HOT']
      ];

      const list = document.createElement('dl');
      list.className = 'trek-lcars-panel__list';
      rows.forEach(([key, value]) => {
        const dt = document.createElement('dt');
        dt.textContent = key;
        const dd = document.createElement('dd');
        dd.textContent = value;
        list.appendChild(dt);
        list.appendChild(dd);
      });

      const dismiss = document.createElement('button');
      dismiss.type = 'button';
      dismiss.className = 'trek-lcars-panel__close';
      dismiss.textContent = 'ACKNOWLEDGE';

      body.appendChild(title);
      body.appendChild(list);
      body.appendChild(dismiss);
      panel.appendChild(elbow);
      panel.appendChild(body);
      document.body.appendChild(panel);

      let cleaned = false;
      function cleanup() {
        if (cleaned) return;
        cleaned = true;
        clearTimeout(timer);
        document.removeEventListener('keydown', onEscape);
        panel.remove();
        done();
      }

      function onEscape(e) {
        if (e.key === 'Escape') cleanup();
      }

      dismiss.addEventListener('click', cleanup);
      document.addEventListener('keydown', onEscape);
      const timer = setTimeout(cleanup, LCARS_DURATION_MS);
    });
  }

  function cycleTrekEffect() {
    const effects = [triggerWarpSpeed, triggerRedAlert, triggerTransporter, triggerLcarsReadout];
    const fn = effects[trekRotationIndex % effects.length];
    if (fn()) {
      trekRotationIndex++;
    }
  }

  const trekDispatcher = utils.createSequenceDispatcher([
    { sequence: ['e', 'n', 'g', 'a', 'g', 'e'], caseInsensitive: true, onMatch: triggerWarpSpeed },
    { sequence: ['r', 'e', 'd', 'a', 'l', 'e', 'r', 't'], caseInsensitive: true, onMatch: triggerRedAlert },
    { sequence: ['m', 'a', 'k', 'e', 'i', 't', 's', 'o'], caseInsensitive: true, onMatch: triggerTransporter },
    { sequence: ['l', 'c', 'a', 'r', 's'], caseInsensitive: true, onMatch: triggerLcarsReadout },
    { sequence: ['t', 'r', 'e', 'k'], caseInsensitive: true, onMatch: cycleTrekEffect }
  ]);

  document.addEventListener('keydown', function (e) {
    trekDispatcher.handleKey(e.key, e.target);
  });

  window.StarTrekEasterEggs = {
    triggerWarp: triggerWarpSpeed,
    triggerRedAlert: triggerRedAlert,
    triggerTransporter: triggerTransporter,
    triggerLcars: triggerLcarsReadout,
    cycleEffect: cycleTrekEffect
  };
})();
