// Pure maths for the /space/ orbit view (orbit.js): turns the real numbers in
// _data/space.yml into sizes and speeds that fit on screen. Kept free of the
// DOM and Three.js so it can be unit tested with `node --test tests/*.test.js`.
(function (root, factory) {
  'use strict';
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.OrbitScale = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const INNER_ORBIT = 2.6;      // scene radius of the closest orbit
  const ORBIT_SPREAD = 3.6;     // extra radius per e-fold of real distance
  const PLANET_SCALE = 0.3;     // scene radius of an Earth-sized planet
  const EARTH_SPEED = 0.25;     // radians per second for a 365 day orbit
  const EARTH_PERIOD_DAYS = 365;

  // Missing or nonsense data falls back to Earth-like values, not NaN.
  function positive(value, fallback) {
    const number = Number(value);
    return Number.isFinite(number) && number > 0 ? number : fallback;
  }

  // Log scale: Neptune is about 77 times further out than Mercury, far too
  // much to draw to scale. `innermostAu` is the closest planet's distance.
  function orbitRadius(distanceAu, innermostAu) {
    const au = positive(distanceAu, 1);
    const inner = Math.min(positive(innermostAu, au), au);
    return INNER_ORBIT + ORBIT_SPREAD * Math.log(au / inner);
  }

  // Power scale: keeps Jupiter biggest without shrinking Mercury to a dot.
  function planetSize(radiusEarths) {
    return PLANET_SCALE * Math.pow(positive(radiusEarths, 1), 0.4);
  }

  // Square root scale: outer planets still visibly move.
  function orbitSpeed(periodDays) {
    return EARTH_SPEED * Math.sqrt(EARTH_PERIOD_DAYS / positive(periodDays, EARTH_PERIOD_DAYS));
  }

  // Closest camera distance at which a flat disc of `systemRadius`, centred on
  // the look-at point and seen from `polar` radians off straight overhead,
  // sits wholly inside a perspective viewport of the given shape.
  //
  // With the camera `d` away, a point on the disc's edge that is `u` toward
  // the camera and `w` to the side has depth d - u*sin(polar), and lands at
  // screen height -u*cos(polar) and screen offset w. Requiring both to stay
  // inside the view for every edge point gives the two limits below: the
  // near edge is what runs off the bottom, and a point a little nearer than
  // the widest one is what runs off the sides.
  function fitDistance(systemRadius, fovDegrees, aspect, polar) {
    const vertical = Math.tan(fovDegrees * Math.PI / 360);
    const horizontal = vertical * positive(aspect, 1);
    const sin = Math.sin(polar);
    const cos = Math.cos(polar);
    return systemRadius * Math.max(
      cos / vertical + sin,
      Math.sqrt(1 / (horizontal * horizontal) + sin * sin)
    );
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  return {
    orbitRadius: orbitRadius,
    planetSize: planetSize,
    orbitSpeed: orbitSpeed,
    fitDistance: fitDistance,
    clamp: clamp
  };
});
