// Run with: node --test tests/*.test.js
'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const scale = require('../assets/js/orbit-scale.js');

// distance_au, period_days, radius_earths: same order as _data/space.yml.
const PLANETS = [
  ['Mercury', 0.39, 88, 0.383],
  ['Venus', 0.72, 225, 0.949],
  ['Earth', 1.0, 365, 1.0],
  ['Mars', 1.52, 687, 0.532],
  ['Jupiter', 5.2, 4333, 11.21],
  ['Saturn', 9.58, 10759, 9.45],
  ['Uranus', 19.2, 30687, 4.01],
  ['Neptune', 30.05, 60190, 3.88]
];
const INNERMOST = PLANETS[0][1];

test('orbits keep the real order and never touch their neighbours', () => {
  const radii = PLANETS.map(p => scale.orbitRadius(p[1], INNERMOST));
  const sizes = PLANETS.map(p => scale.planetSize(p[3]));
  for (let i = 1; i < PLANETS.length; i++) {
    const gap = radii[i] - radii[i - 1];
    assert.ok(gap > sizes[i] + sizes[i - 1],
      `${PLANETS[i - 1][0]} and ${PLANETS[i][0]} overlap (gap ${gap.toFixed(2)})`);
  }
});

test('the whole system stays a drawable size', () => {
  const outer = scale.orbitRadius(30.05, INNERMOST);
  assert.ok(outer > 10 && outer < 25, `outer orbit radius ${outer}`);
});

test('closer planets orbit faster, and Earth sets the pace', () => {
  const speeds = PLANETS.map(p => scale.orbitSpeed(p[2]));
  for (let i = 1; i < speeds.length; i++) {
    assert.ok(speeds[i] < speeds[i - 1]);
  }
  assert.equal(scale.orbitSpeed(365), 0.25);
});

test('Jupiter is the biggest planet and Mercury the smallest', () => {
  const sizes = PLANETS.map(p => scale.planetSize(p[3]));
  assert.equal(Math.max(...sizes), sizes[4]);
  assert.equal(Math.min(...sizes), sizes[0]);
});

test('bad data falls back to finite Earth-like values', () => {
  for (const bad of [undefined, '', 'abc', 0, -3, NaN]) {
    assert.ok(Number.isFinite(scale.orbitRadius(bad, INNERMOST)));
    assert.ok(Number.isFinite(scale.orbitRadius(1, bad)));
    assert.equal(scale.planetSize(bad), scale.planetSize(1));
    assert.equal(scale.orbitSpeed(bad), scale.orbitSpeed(365));
  }
});

test('attribute strings from the page are read as numbers', () => {
  assert.equal(scale.orbitRadius('5.2', '0.39'), scale.orbitRadius(5.2, 0.39));
});

test('a narrower viewport pulls the camera further back', () => {
  const wide = scale.fitDistance(20, 45, 16 / 9, 1);
  const narrow = scale.fitDistance(20, 45, 9 / 16, 1);
  assert.ok(narrow > wide);
});

// How far the edge of the disc reaches toward the edge of the view, as a
// fraction: 1 touches it, more than 1 is cut off. Mirrors the camera set-up
// in orbit.js (camera `distance` from the centre, looking at it).
function reach(radius, fov, aspect, polar, distance) {
  const vertical = Math.tan(fov * Math.PI / 360);
  const horizontal = vertical * aspect;
  let worst = 0;
  for (let step = 0; step < 720; step++) {
    const angle = step / 720 * Math.PI * 2;
    const toward = radius * Math.cos(angle);
    const sideways = radius * Math.sin(angle);
    const depth = distance - toward * Math.sin(polar);
    assert.ok(depth > 0, 'edge of the disc is behind the camera');
    worst = Math.max(
      worst,
      Math.abs(sideways) / depth / horizontal,
      Math.abs(toward * Math.cos(polar)) / depth / vertical
    );
  }
  return worst;
}

test('the fitted camera shows the whole disc, snugly, at any shape and tilt', () => {
  // Includes 720x320, the wide and short stage that used to clip the orbits.
  const shapes = [720 / 320, 715 / 520, 358 / 320, 9 / 16, 3];
  const tilts = [0.15, 0.5, 1.0, 1.45];   // MIN_POLAR to MAX_POLAR in orbit.js
  for (const aspect of shapes) {
    for (const polar of tilts) {
      const distance = scale.fitDistance(20, 45, aspect, polar);
      const used = reach(20, 45, aspect, polar, distance);
      const where = `aspect ${aspect.toFixed(2)}, polar ${polar}`;
      assert.ok(used <= 1 + 1e-9, `clipped at ${where}: ${used}`);
      assert.ok(used > 0.99, `too far away at ${where}: ${used}`);
    }
  }
});

test('clamp keeps a value inside its range', () => {
  assert.equal(scale.clamp(5, 0, 1), 1);
  assert.equal(scale.clamp(-5, 0, 1), 0);
  assert.equal(scale.clamp(0.5, 0, 1), 0.5);
});
