import { globals } from "./globals";

import { noop, minValue, compositionTypes, valueTypes, K } from "./consts";

import {
  isUnd,
  isNil,
  floor,
  PI,
  snap,
  clamp,
  round,
  interpolate,
  removeChild,
  forEachChildren,
  isArr,
} from "./helpers";

import { Engine, engine } from "./engine";

import { Animation, cleanInlineStyles } from "./animation";

import { parseTargets, registerTargets } from "./targets";

import { sanitizePropertyName } from "./properties";

import {
  setValue,
  getTweenType,
  getOriginalAnimatableValue,
  decomposeRawValue,
  decomposedOriginalValue,
} from "./values";

import { convertValueUnit } from "./units";

/**
 * @overload
 * @param  {DOMTarget|NodeList|String} targetSelector
 * @param  {String} propName
 * @return {String}
 *
 * @overload
 * @param  {Record<String, any>} targetSelector
 * @param  {String} propName
 * @return {Number}
 *
 * @overload
 * @param  {TargetsParam} targetSelector
 * @param  {String} propName
 * @param  {String} unit
 * @return {String}
 *
 * @overload
 * @param  {TargetsParam} targetSelector
 * @param  {String} propName
 * @param  {Boolean} unit
 * @return {Number}
 *
 * @param  {TargetsParam} targetSelector
 * @param  {String} propName
 * @param  {String|Boolean} [unit]
 */
export function getTargetValue(targetSelector, propName, unit) {
  const targets = registerTargets(targetSelector);
  if (isNil(targets) || (isArr(targets) && !targets.length)) return;
  if (targets && targets.length) {
    const [target] = targets;
    const tweenType = getTweenType(target, propName);
    const normalizePropName = sanitizePropertyName(propName, target, tweenType);
    let originalValue = getOriginalAnimatableValue(target, normalizePropName);
    if (isUnd(unit)) {
      return originalValue;
    } else {
      decomposeRawValue(originalValue, decomposedOriginalValue);
      if (
        decomposedOriginalValue.t === valueTypes.NUMBER ||
        decomposedOriginalValue.t === valueTypes.UNIT
      ) {
        if (unit === false) {
          return decomposedOriginalValue.n;
        } else {
          const convertedValue = convertValueUnit(
            target,
            decomposedOriginalValue,
            /** @type {String} */ unit,
            false
          );
          return `${round(convertedValue.n, 3)}${convertedValue.u}`;
        }
      }
    }
  }
}

/**
 * @param {TargetsParam} targets
 * @param {AnimationParams} parameters
 * @return {Animation}
 */
export const setTargetValues = (targets, parameters) => {
  if (isUnd(parameters)) return;
  parameters.duration = minValue;
  // Do not overrides currently active tweens by default
  parameters.composition = setValue(
    parameters.composition,
    compositionTypes.none
  );
  // Skip init() and force rendering by playing the animation
  return new Animation(targets, parameters, null, 0, true).play();
};

/**
 * @param  {TargetsArray} targetsArray
 * @param  {Animation} animation
 * @return {Boolean}
 */
const removeTargetsFromAnimation = (targetsArray, animation) => {
  let tweensMatchesTargets = false;
  forEachChildren(
    animation,
    (/**@type {Tween} */ tween) => {
      if (targetsArray.includes(tween.target)) {
        removeChild(animation, tween);
        tweensMatchesTargets = true;
      }
    },
    true
  );
  return tweensMatchesTargets;
};

/**
 * @param  {TargetsParam} targets
 * @param  {Renderable|Engine} [parent]
 * @return {TargetsArray}
 */
export const remove = (targets, parent) => {
  const targetsArray = parseTargets(targets);
  const parentClock = parent ? parent : engine;
  let removeMatches;
  if (parentClock._hasChildren) {
    forEachChildren(
      parentClock,
      (/**@type {Renderable} */ child) => {
        if (!child._hasChildren) {
          removeMatches = removeTargetsFromAnimation(
            targetsArray,
            /**@type {Animation} */ child
          );
          // Remove the child from its parent if he has no tweens and no children left after the removal
          if (removeMatches && !child._head) removeChild(parentClock, child);
        }
        // Make sure to also remove engine's children targets
        // NOTE: Avoid recursion?
        if (child._head) {
          remove(targets, child);
        } else {
          child._hasChildren = false;
        }
      },
      true
    );
  } else {
    removeMatches = removeTargetsFromAnimation(
      targetsArray,
      /**@type {Animation} */ parentClock
    );
  }

  if (removeMatches && !parentClock._head) {
    parentClock._hasChildren = false;
    const pausableTimer = /**@type {Renderable} */ parentClock;
    // Pause the parent if there are no tweens and no children left after the removal
    // Only pause {Renderable} by checking if the pause function exists
    // NOTE: Find a way to homogenize
    if (pausableTimer.pause) pausableTimer.pause();
  }

  return targetsArray;
};

/**
 * @param  {Number} min
 * @param  {Number} max
 * @param  {Number} [decimalLength]
 * @return {Number}
 */
const random = (min, max, decimalLength) => {
  const m = 10 ** (decimalLength || 0);
  return floor((Math.random() * (max - min + 1 / m) + min) * m) / m;
};

/**
 * @param  {String|Array} items
 * @return {any}
 */
const randomPick = (items) => items[random(0, items.length - 1)];

/**
 * https://bost.ocks.org/mike/shuffle/
 * @param  {Array} items
 * @return {Array}
 */
const shuffle = (items) => {
  let m = items.length - 1,
    t,
    i;
  while (m) {
    i = random(0, m--);
    t = items[m];
    items[m] = items[i];
    items[i] = t;
  }
  return items;
};

/**
 * @param  {Number|String} v
 * @param  {Number} decimalLength
 * @return {String}
 */
const roundPad = (v, decimalLength) => (+v).toFixed(decimalLength);

/**
 * @param  {Number} v
 * @param  {Number} totalLength
 * @param  {String} padString
 * @return {String}
 */
const padStart = (v, totalLength, padString) =>
  `${v}`.padStart(totalLength, padString);

/**
 * @param  {Number} v
 * @param  {Number} totalLength
 * @param  {String} padString
 * @return {String}
 */
const padEnd = (v, totalLength, padString) =>
  `${v}`.padEnd(totalLength, padString);

/**
 * @param  {Number} v
 * @param  {Number} min
 * @param  {Number} max
 * @return {Number}
 */
const wrap = (v, min, max) =>
  ((((v - min) % (max - min)) + (max - min)) % (max - min)) + min;

/**
 * @param  {Number} value
 * @param  {Number} inLow
 * @param  {Number} inHigh
 * @param  {Number} outLow
 * @param  {Number} outHigh
 * @return {Number}
 */
const mapRange = (value, inLow, inHigh, outLow, outHigh) =>
  outLow + ((value - inLow) / (inHigh - inLow)) * (outHigh - outLow);

/**
 * @param  {Number} degrees
 * @return {Number}
 */
const degToRad = (degrees) => (degrees * PI) / 180;

/**
 * @param  {Number} radians
 * @return {Number}
 */
const radToDeg = (radians) => (radians * 180) / PI;

/**
 * https://www.rorydriscoll.com/2016/03/07/frame-rate-independent-damping-using-lerp/
 * @param  {Number} start
 * @param  {Number} end
 * @param  {Number} amount
 * @param  {Renderable|Boolean} [renderable]
 * @return {Number}
 */
export const lerp = (start, end, amount, renderable) => {
  let dt = K / globals.defaults.frameRate;
  if (renderable !== false) {
    const ticker =
      /** @type Renderable */
      renderable || (engine._hasChildren && engine);
    if (ticker && ticker.deltaTime) {
      dt = ticker.deltaTime;
    }
  }
  const t = 1 - Math.exp(-amount * dt * 0.1);
  return !amount ? start : amount === 1 ? end : (1 - t) * start + t * end;
};

// Chain-able utilities

/**
 * @callback UtilityFunction
 * @param {...*} args
 * @return {Number|String}
 *
 * @param {UtilityFunction} fn
 * @param {Number} [last=0]
 * @return {function(...(Number|String)): function(Number|String): (Number|String)}
 */
const curry =
  (fn, last = 0) =>
  (...args) =>
    last ? (v) => fn(...args, v) : (v) => fn(v, ...args);

/**
 * @param {Function} fn
 * @return {function(...(Number|String))}
 */
const chain = (fn) => {
  return (...args) => {
    const result = fn(...args);
    return new Proxy(noop, {
      apply: (_, __, [v]) => result(v),
      get: (_, prop) =>
        chain(
          /**@param {...Number|String} nextArgs */ (...nextArgs) => {
            const nextResult = utils[prop](...nextArgs);
            return (/**@type {Number|String} */ v) => nextResult(result(v));
          }
        ),
    });
  };
};

/**
 * @param {UtilityFunction} fn
 * @param {Number} [right]
 * @return {function(...(Number|String)): UtilityFunction}
 */
const makeChainable =
  (fn, right = 0) =>
  (...args) =>
    (args.length < fn.length ? chain(curry(fn, right)) : fn)(...args);

/**
 * @callback ChainedUtilsResult
 * @param {Number} value
 * @return {Number}
 *
 * @typedef {Object} ChainableUtils
 * @property {ChainedClamp} clamp
 * @property {ChainedRound} round
 * @property {ChainedSnap} snap
 * @property {ChainedWrap} wrap
 * @property {ChainedInterpolate} interpolate
 * @property {ChainedMapRange} mapRange
 * @property {ChainedRoundPad} roundPad
 * @property {ChainedPadStart} padStart
 * @property {ChainedPadEnd} padEnd
 * @property {ChainedDegToRad} degToRad
 * @property {ChainedRadToDeg} radToDeg
 *
 * @typedef {ChainableUtils & ChainedUtilsResult} ChainableUtil
 *
 * @callback ChainedClamp
 * @param {Number} min
 * @param {Number} max
 * @return {ChainableUtil}
 *
 * @callback ChainedRound
 * @param {Number} decimalLength
 * @return {ChainableUtil}
 *
 * @callback ChainedSnap
 * @param {Number} increment
 * @return {ChainableUtil}
 *
 * @callback ChainedWrap
 * @param {Number} min
 * @param {Number} max
 * @return {ChainableUtil}
 *
 * @callback ChainedInterpolate
 * @param {Number} start
 * @param {Number} end
 * @return {ChainableUtil}
 *
 * @callback ChainedMapRange
 * @param {Number} inLow
 * @param {Number} inHigh
 * @param {Number} outLow
 * @param {Number} outHigh
 * @return {ChainableUtil}
 *
 * @callback ChainedRoundPad
 * @param {Number} decimalLength
 * @return {ChainableUtil}
 *
 * @callback ChainedPadStart
 * @param {Number} totalLength
 * @param {String} padString
 * @return {ChainableUtil}
 *
 * @callback ChainedPadEnd
 * @param {Number} totalLength
 * @param {String} padString
 * @return {ChainableUtil}
 *
 * @callback ChainedDegToRad
 * @return {ChainableUtil}
 *
 * @callback ChainedRadToDeg
 * @return {ChainableUtil}
 */

export const utils = {
  $: registerTargets,
  get: getTargetValue,
  set: setTargetValues,
  remove,
  cleanInlineStyles,
  random,
  randomPick,
  shuffle,
  lerp,
  clamp: /** @type {typeof clamp & ChainedClamp} */ makeChainable(clamp),
  round: /** @type {typeof round & ChainedRound} */ makeChainable(round),
  snap: /** @type {typeof snap & ChainedSnap} */ makeChainable(snap),
  wrap: /** @type {typeof wrap & ChainedWrap} */ makeChainable(wrap),
  interpolate:
    /** @type {typeof interpolate & ChainedInterpolate} */ makeChainable(
      interpolate,
      1
    ),
  mapRange:
    /** @type {typeof mapRange & ChainedMapRange} */ makeChainable(mapRange),
  roundPad:
    /** @type {typeof roundPad & ChainedRoundPad} */ makeChainable(roundPad),
  padStart:
    /** @type {typeof padStart & ChainedPadStart} */ makeChainable(padStart),
  padEnd: /** @type {typeof padEnd & ChainedPadEnd} */ makeChainable(padEnd),
  degToRad:
    /** @type {typeof degToRad & ChainedDegToRad} */ makeChainable(degToRad),
  radToDeg:
    /** @type {typeof radToDeg & ChainedRadToDeg} */ makeChainable(radToDeg),
};
