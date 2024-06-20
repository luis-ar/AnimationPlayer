import {
  isBrowser,
  lowerCaseRgx,
  hexTestRgx,
  maxValue,
  minValue,
} from "./consts";

import { globals } from "./globals";

// Strings

/**
 * @param  {String} str
 * @return {NodeListOf<Element>|void}
 */
export const selectString = (str) => {
  try {
    const nodes = /** @type {HTMLElement} */ globals.root.querySelectorAll(str);
    return nodes;
  } catch (e) {
    return;
  }
};

/**
 * @param  {String} str
 * @return {String}
 */
export const toLowerCase = (str) =>
  str.replace(lowerCaseRgx, "$1-$2").toLowerCase();

/**
 * Prioritize this method instead of regex when possible
 * @param  {String} str
 * @param  {String} sub
 * @return {Boolean}
 */
export const stringStartsWith = (str, sub) => str.indexOf(sub) === 0;

// Time
// Note: Date.now is used instead of performance.now since it is precise enough for timings calculations, performs slightly faster and works in Node.js environement.
export const now = Date.now;

// Types checkers

/**@param {any} a @return {Boolean} */
export const isArr = (a) => Array.isArray(a);
/**@param {any} a @return {Boolean} */
export const isObj = (a) => a && a.constructor === Object;
/**@param {any} a @return {Boolean} */
export const isNum = (a) => typeof a === "number" && !isNaN(a);
/**@param {any} a @return {Boolean} */
export const isStr = (a) => typeof a === "string";
/**@param {any} a @return {Boolean} */
export const isFnc = (a) => typeof a === "function";
/**@param {any} a @return {Boolean} */
export const isUnd = (a) => typeof a === "undefined";
/**@param {any} a @return {Boolean} */
export const isNil = (a) => isUnd(a) || a === null;
/**@param {any} a @return {Boolean} */
export const isSvg = (a) => isBrowser && a instanceof SVGElement;
/**@param {any} a @return {Boolean} */
export const isHex = (a) => hexTestRgx.test(a);
/**@param {any} a @return {Boolean} */
export const isRgb = (a) => stringStartsWith(a, "rgb");
/**@param {any} a @return {Boolean} */
export const isHsl = (a) => stringStartsWith(a, "hsl");
/**@param {any} a @return {Boolean} */
export const isCol = (a) => isHex(a) || isRgb(a) || isHsl(a);
/**@param {any} a @return {Boolean} */
export const isKey = (a) => !globals.defaults.hasOwnProperty(a);

// Number

/**
 * @param  {Number|String} str
 * @return {Number}
 */
export const parseNumber = (str) =>
  isStr(str)
    ? parseFloat(/** @type {String} */ str)
    : /** @type {Number} */ str;

// Math

export const pow = Math.pow;
export const sqrt = Math.sqrt;
export const sin = Math.sin;
export const cos = Math.cos;
export const abs = Math.abs;
export const exp = Math.exp;
export const ceil = Math.ceil;
export const floor = Math.floor;
export const asin = Math.asin;
export const max = Math.max;
export const atan2 = Math.atan2;
export const PI = Math.PI;

/**
 * @param  {Number} v
 * @param  {Number} min
 * @param  {Number} max
 * @return {Number}
 */
export const clamp = (v, min, max) => (v < min ? min : v > max ? max : v);

/**
 * @param  {Number} v
 * @param  {Number} decimalLength
 * @return {Number}
 */
export const round = (v, decimalLength) => {
  const m = 10 ** (decimalLength || 0);
  return Math.round(v * m) / m;
};

/**
 * @param  {Number} v
 * @param  {Number} increment
 * @return {Number}
 */
export const snap = (v, increment) =>
  increment ? Math.round(v / increment) * increment : v;

/**
 * @param  {Number} start
 * @param  {Number} end
 * @param  {Number} progress
 * @return {Number}
 */
export const interpolate = (start, end, progress) =>
  start + (end - start) * progress;

/**
 * @param  {Number} v
 * @return {Number}
 */
export const clampInfinity = (v) =>
  v === Infinity ? maxValue : v === -Infinity ? -maxValue : v;

/**
 * @param  {Number} v
 * @return {Number}
 */
export const clampZero = (v) => (v < minValue ? minValue : v);

// Arrays

/**
 * @param  {any} v
 * @return {Array.<any>}
 */
export const toArray = (v) => {
  if (!isBrowser) return [v];
  if (isStr(v)) v = selectString(v) || v;
  if (v instanceof NodeList || v instanceof HTMLCollection)
    return [].slice.call(v);
  return [v];
};

/**
 * @template T
 * @param  {T[]} a
 * @return {T[]}
 */
export const cloneArray = (a) => (isArr(a) ? [...a] : a);

// Objects

/**
 * @param {Record<string, any>} o1
 * @param {Record<string, any>} o2
 * @return {Record<string, any>}
 */
export const mergeObjects = (o1, o2) => {
  const merged = { ...o1 };
  for (let p in o2) merged[p] = isUnd(o1[p]) ? o2[p] : o1[p];
  return merged;
};

// Linked lists

/**
 * @param  {Object}   parent
 * @param  {Function} callback
 * @param  {Boolean}  [reverse]
 * @param  {String}   [prevProp]
 * @param  {String}   [nextProp]
 * @return {void}
 */
export const forEachChildren = (
  parent,
  callback,
  reverse,
  prevProp = "_prev",
  nextProp = "_next"
) => {
  let next = parent._head;
  let adjustedNextProp = nextProp;
  if (reverse) {
    next = parent._tail;
    adjustedNextProp = prevProp;
  }
  while (next) {
    const currentNext = next[adjustedNextProp];
    callback(next);
    next = currentNext;
  }
};

/**
 * @param  {Object} parent
 * @param  {Object} child
 * @param  {String} [prevProp]
 * @param  {String} [nextProp]
 * @return {void}
 */
export const removeChild = (
  parent,
  child,
  prevProp = "_prev",
  nextProp = "_next"
) => {
  const prev = child[prevProp];
  const next = child[nextProp];
  prev ? (prev[nextProp] = next) : (parent._head = next);
  next ? (next[prevProp] = prev) : (parent._tail = prev);
  child[prevProp] = null;
  child[nextProp] = null;
};

/**
 * @param  {Object} parent
 * @param  {Object} child
 * @param  {Function} [sortMethod]
 * @param  {String} prevProp
 * @param  {String} nextProp
 * @return {void}
 */
export const addChild = (
  parent,
  child,
  sortMethod,
  prevProp = "_prev",
  nextProp = "_next"
) => {
  let prev = parent._tail;
  while (prev && sortMethod && sortMethod(prev, child)) prev = prev[prevProp];
  const next = prev ? prev[nextProp] : parent._head;
  prev ? (prev[nextProp] = child) : (parent._head = child);
  next ? (next[prevProp] = child) : (parent._tail = child);
  child[prevProp] = prev;
  child[nextProp] = next;
};
