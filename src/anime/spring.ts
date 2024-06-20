import { minValue, K } from "./consts";

import { round, clamp, sqrt, exp, cos, sin, abs } from "./helpers";

/** @type {Map.<Array, SpringEasing>} */
const springsCache = new Map();

/**
 * Spring ease solver adapted from https://webkit.org/demos/spring/spring.js
 * Webkit Copyright © 2016 Apple Inc
 * Improved by Jake Archibald https://github.com/juliangarnier/anime/issues/850#issuecomment-1476603393
 *
 * @param {Number} [mass=1] - Mass, default 1
 * @param {Number} [stiffness=100] - Stiffness, default 100
 * @param {Number} [damping=10] - Damping, default 10
 * @param {Number} [velocity=0] - Initial velocity, default 0
 * @returns {SpringEasing}
 */
export const spring = (
  mass = 1,
  stiffness = 100,
  damping = 10,
  velocity = 0
) => {
  const parameters = [mass, stiffness, damping, velocity];
  let springEasing = springsCache.get(parameters);

  if (!springEasing) {
    const m = clamp(mass, 0, K);
    const s = clamp(stiffness, 1, K);
    const d = clamp(damping, 0.1, K);
    const w0 = clamp(sqrt(s / m), minValue, K);
    const zeta = d / (2 * sqrt(s * m));
    const wd = zeta < 1 ? w0 * sqrt(1 - zeta * zeta) : 0;
    const b = zeta < 1 ? (zeta * w0 + -velocity) / wd : -velocity + w0;
    const step = K / 60 / 100;
    const threshold = 0.0001;

    /** @type {EasingFunction} */
    const solver = (t) => {
      if (zeta < 1) {
        t = exp(-t * zeta * w0) * (1 * cos(wd * t) + b * sin(wd * t));
      } else {
        t = (1 + b * t) * exp(-t * w0);
      }
      return 1 - t;
    };

    const duration = (() => {
      let time = 0;
      while (true) {
        if (abs(1 - solver(time)) < threshold) {
          const restStart = time;
          let restSteps = 1;
          while (true) {
            time += step;
            if (abs(1 - solver(time)) >= threshold) break;
            restSteps++;
            if (restSteps === 16) return restStart;
          }
        }
        time += step;
      }
    })();

    springEasing = {
      duration: round(duration * K, 0),
      solver: (t) => round(solver(duration * t), 5),
    };

    springsCache.set(parameters, springEasing);
  }

  return springEasing;
};
