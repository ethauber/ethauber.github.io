// 3D orbit view for /space/. Draws the Sun and the planets with Three.js and
// keeps it in step with the planet navigator (planets.js): clicking a planet
// opens its card, and changing the card highlights the planet.
//
// Planet data comes from the data-orbit-* attributes on the planet cards,
// which Jekyll fills in from _data/space.yml. Colours for the scene itself
// come from the --space-* tokens in main.css.
//
// Three.js is fetched from a CDN only when this script runs. The view starts
// hidden in the HTML and is shown once everything has loaded, so if WebGL or
// the CDN is unavailable the page simply keeps working without it.
(function () {
  'use strict';

  const THREE_URL = 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.min.js';

  const scale = window.OrbitScale;   // orbit-scale.js, loaded just before this
  const view = document.querySelector('[data-orbit-view]');
  const navigator = document.querySelector('[data-planet-navigator]');
  if (!scale || !view || !navigator) return;

  const stage = view.querySelector('[data-orbit-stage]');
  const cards = Array.from(navigator.querySelectorAll('.planet-card[data-orbit-distance]'));
  if (!stage || !cards.length || !hasWebGL()) return;

  import(THREE_URL)
    .then(start)
    .catch(() => { view.hidden = true; });

  function hasWebGL() {
    try {
      const canvas = document.createElement('canvas');
      return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'));
    } catch (e) {
      return false;
    }
  }

  function start(THREE) {
    // ----- Tuning. How distances, sizes and speeds are compressed to fit on
    // screen lives in orbit-scale.js.
    const SUN_RADIUS = 1.3;
    const MIN_HIT_RADIUS = 0.9;   // small planets still get a fair click target
    const DEFAULT_AZIMUTH = 0.6;
    const DEFAULT_POLAR = 1.0;    // radians down from straight overhead
    const MIN_POLAR = 0.15;
    const MAX_POLAR = 1.45;
    const DRAG_THRESHOLD = 5;     // px of movement before a press is a drag
    const TURN_STEP = 0.25;       // radians per press of a rotate button
    const TILT_STEP = 0.15;       // radians per press of a tilt button
    const FOV = 45;

    const styles = getComputedStyle(view);
    const token = name => styles.getPropertyValue(name).trim();
    const lineColor = new THREE.Color(token('--space-line'));
    const highlightColor = new THREE.Color(token('--space-highlight'));
    const starColor = new THREE.Color(token('--space-star'));

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ----- Scene
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    const canvas = renderer.domElement;
    canvas.setAttribute('aria-hidden', 'true');

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 500);

    // Mostly ambient light: planets on the near side of the Sun show us their
    // night side, and they still need to be recognisable.
    scene.add(new THREE.AmbientLight(0xffffff, 1.5));
    const sunLight = new THREE.PointLight(0xffffff, 1.8, 0, 0);
    scene.add(sunLight);

    const sunColor = new THREE.Color(view.dataset.sunColor || '#ffffff');
    const sun = new THREE.Mesh(
      new THREE.SphereGeometry(SUN_RADIUS, 32, 24),
      new THREE.MeshBasicMaterial({ color: sunColor })
    );
    scene.add(sun);
    scene.add(makeGlow(sunColor, SUN_RADIUS * 5));
    scene.add(makeStars(500));

    const innermost = Math.min.apply(null, cards.map(card => Number(card.dataset.orbitDistance) || Infinity));
    const circle = unitCircle(128);

    const planets = cards.map((card, i) => {
      const data = card.dataset;
      const distance = scale.orbitRadius(data.orbitDistance, innermost);
      const size = scale.planetSize(data.orbitRadius);
      const speed = scale.orbitSpeed(data.orbitPeriod);

      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(size, 32, 24),
        new THREE.MeshStandardMaterial({ color: new THREE.Color(data.orbitColor || '#ffffff'), roughness: 1 })
      );
      if (data.orbitRing === 'true') {
        const ring = new THREE.Mesh(
          new THREE.RingGeometry(size * 1.25, size * 1.8, 64),
          new THREE.MeshBasicMaterial({
            color: mesh.material.color, side: THREE.DoubleSide, transparent: true, opacity: 0.55
          })
        );
        ring.rotation.x = -Math.PI / 2 + 0.45;
        mesh.add(ring);
      }
      scene.add(mesh);

      // Invisible, larger sphere used for hover and click tests.
      const hit = new THREE.Mesh(
        new THREE.SphereGeometry(Math.max(size * 1.6, MIN_HIT_RADIUS), 12, 8),
        new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false })
      );
      hit.userData.planet = i;
      mesh.add(hit);

      const orbit = new THREE.LineLoop(circle, new THREE.LineBasicMaterial({ color: lineColor }));
      orbit.scale.setScalar(distance);
      scene.add(orbit);

      // Spread the starting positions out with the golden angle.
      return {
        id: card.id, name: data.planet, mesh: mesh, hit: hit, orbit: orbit,
        distance: distance, size: size, speed: speed, angle: i * 2.4
      };
    });
    const hits = planets.map(planet => planet.hit);
    // Outermost orbit, plus room for the planet on it and its name label.
    const systemRadius = planets.reduce((max, planet) => Math.max(max, planet.distance), 0) + 2;

    // Ring that faces the camera and marks the selected planet.
    // The orbit circle lies flat (XZ), so stand a copy upright (XY) for it.
    const marker = new THREE.LineLoop(
      circle.clone().rotateX(Math.PI / 2),
      new THREE.LineBasicMaterial({ color: highlightColor })
    );
    marker.visible = false;
    scene.add(marker);

    const selectedLabel = makeLabel('orbit-label orbit-label--selected');
    const hoverLabel = makeLabel('orbit-label');
    const enterpriseLabel = makeLabel('orbit-label orbit-label--enterprise');

    const earth = planets.find(planet => planet.id === 'earth') || null;
    const enterprise = earth ? makeEnterprise(THREE) : null;
    let enterpriseActive = new URLSearchParams(window.location.search).get('engage') === '1';
    let enterpriseAngle = 0.9;
    let enterpriseHovered = false;
    if (enterprise) {
      enterprise.group.visible = enterpriseActive;
      scene.add(enterprise.group);
    }

    // ----- State
    let azimuth = DEFAULT_AZIMUTH;
    let polar = DEFAULT_POLAR;
    let selected = -1;
    let hovered = -1;
    let playing = !reducedMotion;
    let inView = true;
    let dirty = true;
    let frameId = 0;
    let lastTime = 0;
    let width = 0;
    let height = 0;

    function placeEnterprise() {
      if (!enterprise || !earth || !enterpriseActive) return;
      const orbitRadius = earth.size + 0.58;
      const x = earth.mesh.position.x + Math.cos(enterpriseAngle) * orbitRadius;
      const z = earth.mesh.position.z - Math.sin(enterpriseAngle) * orbitRadius;
      const y = 0.16 * Math.sin(enterpriseAngle);
      enterprise.group.position.set(x, y, z);
      // Face tangent direction along the orbit around Earth (+Z is bow).
      enterprise.group.rotation.y = Math.atan2(-Math.sin(enterpriseAngle), -Math.cos(enterpriseAngle));
    }

    function placePlanets() {
      planets.forEach(planet => {
        planet.mesh.position.set(
          Math.cos(planet.angle) * planet.distance, 0, -Math.sin(planet.angle) * planet.distance
        );
      });
      placeEnterprise();
    }

    // The distance is refitted every time, so the whole system stays in view
    // at any stage shape and however far the camera has been tilted.
    function placeCamera() {
      const cameraDistance = scale.fitDistance(systemRadius, FOV, camera.aspect, polar);
      camera.position.set(
        cameraDistance * Math.sin(polar) * Math.sin(azimuth),
        cameraDistance * Math.cos(polar),
        cameraDistance * Math.sin(polar) * Math.cos(azimuth)
      );
      camera.lookAt(0, 0, 0);
    }

    function resize() {
      width = stage.clientWidth;
      height = stage.clientHeight;
      if (!width || !height) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      dirty = true;
    }

    const projected = new THREE.Vector3();
    function positionLabel(label, planet) {
      if (!planet) {
        label.hidden = true;
        return;
      }
      // Sit just above the planet on screen, whichever way the camera faces.
      projected.set(0, Math.max(planet.size * 2, 0.55) + 0.25, 0)
        .applyQuaternion(camera.quaternion)
        .add(planet.mesh.position)
        .project(camera);
      const x = (projected.x + 1) / 2 * width;
      const y = (1 - projected.y) / 2 * height;
      label.textContent = planet.name;
      label.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
      label.hidden = false;
    }

    function render() {
      placeCamera();
      const current = planets[selected];
      if (current) {
        marker.position.copy(current.mesh.position);
        marker.quaternion.copy(camera.quaternion);
        marker.scale.setScalar(Math.max(current.size * 2, 0.55));
      }
      marker.visible = Boolean(current);
      renderer.render(scene, camera);
      positionLabel(selectedLabel, current);
      positionLabel(hoverLabel, hovered === selected ? null : planets[hovered]);
      positionLabel(
        enterpriseLabel,
        enterprise && enterpriseActive
          ? {
              mesh: enterprise.group,
              size: 0.24,
              name: enterpriseHovered ? 'USS Enterprise (NCC-1701-D)' : 'NCC-1701-D'
            }
          : null
      );
    }

    function frame(time) {
      frameId = requestAnimationFrame(frame);
      const delta = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;
      if (playing) {
        planets.forEach(planet => { planet.angle += planet.speed * delta; });
        if (enterpriseActive) enterpriseAngle += 1.15 * delta;
        placePlanets();
        dirty = true;
      }
      if (dirty) {
        dirty = false;
        render();
      }
    }

    // Only spend frames while the view is on screen and the tab is visible.
    function updateLoop() {
      const shouldRun = inView && !document.hidden;
      if (shouldRun && !frameId) {
        lastTime = performance.now();
        frameId = requestAnimationFrame(frame);
      } else if (!shouldRun && frameId) {
        cancelAnimationFrame(frameId);
        frameId = 0;
      }
    }

    function lookFrom(nextAzimuth, nextPolar) {
      azimuth = nextAzimuth;
      polar = scale.clamp(nextPolar, MIN_POLAR, MAX_POLAR);
      dirty = true;
    }

    function select(id) {
      const next = planets.findIndex(planet => planet.id === id);
      if (next === selected) return;
      if (planets[selected]) planets[selected].orbit.material.color.copy(lineColor);
      selected = next;
      if (planets[selected]) planets[selected].orbit.material.color.copy(highlightColor);
      dirty = true;
    }

    // ----- Pointer: drag to look around, click a planet to open its card.
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let press = null;

    function targetAt(event) {
      const box = canvas.getBoundingClientRect();
      pointer.x = (event.clientX - box.left) / box.width * 2 - 1;
      pointer.y = -((event.clientY - box.top) / box.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const candidates = enterprise && enterpriseActive ? [enterprise.hit].concat(hits) : hits;
      const found = raycaster.intersectObjects(candidates, false)[0];
      if (!found) return { planet: -1, enterprise: false };
      if (found.object.userData.enterprise) return { planet: -1, enterprise: true };
      return { planet: found.object.userData.planet, enterprise: false };
    }

    function setHovered(nextPlanet, nextEnterprise) {
      if (nextPlanet === hovered && nextEnterprise === enterpriseHovered) return;
      hovered = nextPlanet;
      enterpriseHovered = nextEnterprise;
      stage.classList.toggle('is-pointing', hovered !== -1 || enterpriseHovered);
      dirty = true;
    }

    canvas.addEventListener('pointerdown', event => {
      if (event.button !== 0) return;
      press = {
        id: event.pointerId, x: event.clientX, y: event.clientY,
        azimuth: azimuth, polar: polar, dragged: false
      };
      canvas.setPointerCapture(event.pointerId);
    });

    canvas.addEventListener('pointermove', event => {
      if (!press || press.id !== event.pointerId) {
        if (event.pointerType === 'mouse') {
          const target = targetAt(event);
          setHovered(target.planet, target.enterprise);
        }
        return;
      }
      const dx = event.clientX - press.x;
      const dy = event.clientY - press.y;
      if (!press.dragged && Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
      press.dragged = true;
      stage.classList.add('is-dragging');
      lookFrom(press.azimuth - dx * 0.008, press.polar - dy * 0.006);
    });

    canvas.addEventListener('pointerup', event => {
      if (!press || press.id !== event.pointerId) return;
      const wasDrag = press.dragged;
      press = null;
      stage.classList.remove('is-dragging');
      if (wasDrag) return;
      const target = targetAt(event);
      if (target.enterprise) {
        selectEarthAndOpenHud();
      } else if (target.planet !== -1) {
        pendingEnterpriseHud = false;
        navigator.dispatchEvent(new CustomEvent('planet:select', { detail: { id: planets[target.planet].id } }));
      }
    });

    canvas.addEventListener('pointercancel', () => {
      press = null;
      stage.classList.remove('is-dragging');
    });

    canvas.addEventListener('pointerleave', () => setHovered(-1, false));

    // ----- Controls
    const toggle = view.querySelector('[data-orbit-toggle]');
    function updateToggle() {
      if (toggle) toggle.textContent = playing ? 'Pause' : 'Play';
    }
    if (toggle) {
      toggle.addEventListener('click', () => {
        playing = !playing;
        updateToggle();
      });
    }

    const reset = view.querySelector('[data-orbit-reset]');
    if (reset) {
      reset.addEventListener('click', () => lookFrom(DEFAULT_AZIMUTH, DEFAULT_POLAR));
    }

    // Buttons do what dragging does, for keyboards, switches and touch
    // screens (where an up or down drag scrolls the page instead).
    const turns = {
      left: [TURN_STEP, 0],
      right: [-TURN_STEP, 0],
      up: [0, -TILT_STEP],
      down: [0, TILT_STEP]
    };
    view.querySelectorAll('[data-orbit-turn]').forEach(button => {
      const turn = turns[button.dataset.orbitTurn];
      if (!turn) return;
      button.addEventListener('click', () => lookFrom(azimuth + turn[0], polar + turn[1]));
    });

    let pendingEnterpriseHud = false;

    function openEnterpriseHud() {
      if (window.StarTrekEasterEggs && typeof window.StarTrekEasterEggs.triggerLcars === 'function') {
        window.StarTrekEasterEggs.triggerLcars();
      }
    }

    function isEarthSettled() {
      if (navigator.querySelector('.planet-card.is-fading')) return false;
      const activeCard = navigator.querySelector('.planet-card:not([hidden])');
      return Boolean(activeCard && activeCard.id === 'earth');
    }

    function selectEarthAndOpenHud() {
      if (isEarthSettled()) {
        pendingEnterpriseHud = false;
        openEnterpriseHud();
        return;
      }
      pendingEnterpriseHud = true;
      navigator.dispatchEvent(new CustomEvent('planet:select', { detail: { id: 'earth' } }));
    }

    navigator.addEventListener('planet:change', event => {
      const id = event.detail.id;
      select(id);
      if (!pendingEnterpriseHud) return;
      if (id === 'earth') {
        pendingEnterpriseHud = false;
        openEnterpriseHud();
      } else {
        navigator.dispatchEvent(new CustomEvent('planet:select', { detail: { id: 'earth' } }));
      }
    });

    function activateEnterprise() {
      if (!enterprise || !earth) return;
      enterpriseActive = true;
      enterprise.group.visible = true;
      placeEnterprise();
      navigator.dispatchEvent(new CustomEvent('planet:select', { detail: { id: 'earth' } }));
      dirty = true;
    }

    window.addEventListener('star-trek:engage', activateEnterprise);

    // ----- Go
    stage.appendChild(canvas);
    stage.appendChild(selectedLabel);
    stage.appendChild(hoverLabel);
    stage.appendChild(enterpriseLabel);
    view.hidden = false;

    placePlanets();
    resize();
    updateToggle();
    if (enterpriseActive) {
      activateEnterprise();
    } else {
      const visibleCard = cards.find(card => !card.hidden);
      if (visibleCard) select(visibleCard.id);
    }

    new ResizeObserver(resize).observe(stage);
    new IntersectionObserver(entries => {
      inView = entries[entries.length - 1].isIntersecting;
      updateLoop();
    }).observe(stage);
    document.addEventListener('visibilitychange', updateLoop);
    updateLoop();

    // ----- Helpers
    function unitCircle(segments) {
      const points = [];
      for (let i = 0; i < segments; i++) {
        const angle = i / segments * Math.PI * 2;
        points.push(new THREE.Vector3(Math.cos(angle), 0, Math.sin(angle)));
      }
      return new THREE.BufferGeometry().setFromPoints(points);
    }

    function makeGlow(color, size) {
      const side = 128;
      const image = document.createElement('canvas');
      image.width = image.height = side;
      const context = image.getContext('2d');
      const gradient = context.createRadialGradient(side / 2, side / 2, 0, side / 2, side / 2, side / 2);
      const rgb = [color.r, color.g, color.b].map(part => Math.round(part * 255)).join(', ');
      gradient.addColorStop(0, `rgba(${rgb}, 0.55)`);
      gradient.addColorStop(0.35, `rgba(${rgb}, 0.18)`);
      gradient.addColorStop(1, `rgba(${rgb}, 0)`);
      context.fillStyle = gradient;
      context.fillRect(0, 0, side, side);
      const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
        map: new THREE.CanvasTexture(image), transparent: true, depthWrite: false,
        blending: THREE.AdditiveBlending
      }));
      sprite.scale.setScalar(size);
      return sprite;
    }

    function makeStars(count) {
      const positions = new Float32Array(count * 3);
      const point = new THREE.Vector3();
      for (let i = 0; i < count; i++) {
        point.randomDirection().multiplyScalar(120 + Math.random() * 60);
        positions.set([point.x, point.y, point.z], i * 3);
      }
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      return new THREE.Points(geometry, new THREE.PointsMaterial({
        color: starColor, size: 1.5, sizeAttenuation: false, transparent: true, opacity: 0.8
      }));
    }

    function makeLabel(className) {
      const label = document.createElement('span');
      label.className = className;
      label.setAttribute('aria-hidden', 'true');
      label.hidden = true;
      return label;
    }

    // Stylized Galaxy-class USS Enterprise (NCC-1701-D) built from Three.js primitives.
    function makeEnterprise(THREE) {
      const group = new THREE.Group();
      const hullMat = new THREE.MeshStandardMaterial({ color: 0xd8dee9, roughness: 0.45, metalness: 0.15 });
      const darkMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.6 });
      const deflectorMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
      const bussardMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
      const warpGlowMat = new THREE.MeshBasicMaterial({ color: 0x60a5fa });

      const saucer = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.19, 0.034, 24), hullMat);
      saucer.scale.set(1.2, 1, 1);
      saucer.position.set(0, 0.055, 0.15);
      group.add(saucer);

      const bridge = new THREE.Mesh(new THREE.SphereGeometry(0.048, 16, 10), hullMat);
      bridge.scale.set(1.1, 0.45, 1.3);
      bridge.position.set(0, 0.075, 0.15);
      group.add(bridge);

      const neck = new THREE.Mesh(new THREE.BoxGeometry(0.068, 0.10, 0.09), hullMat);
      neck.rotation.x = 0.28;
      neck.position.set(0, 0.01, 0.0);
      group.add(neck);

      const stardrive = new THREE.Mesh(new THREE.CylinderGeometry(0.042, 0.058, 0.27, 16), hullMat);
      stardrive.rotation.x = Math.PI / 2;
      stardrive.position.set(0, -0.04, -0.08);
      group.add(stardrive);

      const deflector = new THREE.Mesh(new THREE.SphereGeometry(0.04, 12, 10), deflectorMat);
      deflector.scale.set(1, 0.85, 0.5);
      deflector.position.set(0, -0.04, 0.058);
      group.add(deflector);

      [-1, 1].forEach(side => {
        const pylon = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.02, 0.05), darkMat);
        pylon.position.set(side * 0.085, 0.01, -0.10);
        pylon.rotation.z = side * 0.45;
        group.add(pylon);

        const nacelle = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.020, 0.30, 12), hullMat);
        nacelle.rotation.x = Math.PI / 2;
        nacelle.position.set(side * 0.15, 0.055, -0.13);
        group.add(nacelle);

        const bussard = new THREE.Mesh(new THREE.SphereGeometry(0.025, 10, 8), bussardMat);
        bussard.position.set(side * 0.15, 0.055, 0.02);
        group.add(bussard);

        const warpStrip = new THREE.Mesh(new THREE.BoxGeometry(0.014, 0.012, 0.21), warpGlowMat);
        warpStrip.position.set(side * 0.15, 0.072, -0.14);
        group.add(warpStrip);
      });

      const hit = new THREE.Mesh(
        new THREE.SphereGeometry(0.45, 10, 8),
        new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false })
      );
      hit.userData.enterprise = true;
      group.add(hit);

      return { group: group, hit: hit };
    }
  }
})();
