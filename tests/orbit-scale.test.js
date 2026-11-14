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

test('clamp keeps a value inside its range', () => {
  assert.equal(scale.clamp(5, 0, 1), 1);
  assert.equal(scale.clamp(-5, 0, 1), 0);
  assert.equal(scale.clamp(0.5, 0, 1), 0.5);
});
