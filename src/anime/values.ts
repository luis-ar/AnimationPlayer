import {
  shortTransforms,
  validTransforms,
  tweenTypes,
  valueTypes,
  emptyString,
  digitWithExponentRgx,
  unitsExecRgx,
  relativeValuesExecRgx,
  isDomSymbol,
  isSvgSymbol,
  proxyTargetSymbol,
} from "./consts";

import {
  stringStartsWith,
  cloneArray,
  isFnc,
  isUnd,
  isNil,
  isCol,
} from "./helpers";

import { parseInlineTransforms } from "./transforms";

import { isValidSVGAttribute } from "./svg";

import { convertColorStringValuesToRgbaArray } from "./colors";

/**
 * @template T, D
 * @param {T|undefined} targetValue
 * @param {D} defaultValue
 * @return {T|D}
 */
export const setValue = (targetValue, defaultValue) => {
  return isUnd(targetValue) ? defaultValue : targetValue;
};

/**
 * @param  {TweenPropValue} value
 * @param  {Target} target
 * @param  {Number} index
 * @param  {Number} total
 * @param  {Object} [store]
 * @return {any}
 */
export const getFunctionValue = (value, target, index, total, store) => {
  if (isFnc(value)) {
    const func = () => {
      const computed = /** @type {Function} */ value(target, index, total);
      // Fallback to 0 if the function returns undefined / NaN / null / false / 0
      return !isNaN(+computed) ? +computed : computed || 0;
    };
    if (store) {
      store.func = func;
    }
    return func();
  } else {
    return value;
  }
};

/**
 * @param  {Target} target
 * @param  {String} prop
 * @return {tweenTypes}
 */
export const getTweenType = (target, prop) => {
  const type = !target[isDomSymbol]
    ? tweenTypes.OBJECT
    : // Handle SVG attributes
    target[isSvgSymbol] && isValidSVGAttribute(target, prop)
    ? tweenTypes.ATTRIBUTE
    : // Handle CSS Transform properties differently than CSS to allow individual animations
    validTransforms.includes(prop) || shortTransforms.get(prop)
    ? tweenTypes.TRANSFORM
    : // CSS variables
    stringStartsWith(prop, "--")
    ? tweenTypes.CSS_VAR
    : // All other CSS properties
    prop in /** @type {DOMTarget} */ target.style
    ? tweenTypes.CSS
    : // Handle DOM Attributes
    !isNil(target.getAttribute(prop))
    ? tweenTypes.ATTRIBUTE
    : !isUnd(target[prop])
    ? tweenTypes.OBJECT
    : tweenTypes.INVALID;
  if (type === tweenTypes.INVALID)
    console.warn(`Can't find property '${prop}' on target '${target}'.`);
  return type;
};

/**
 * @param  {DOMTarget} target
 * @param  {String} propName
 * @param  {Object} animationInlineStyles
 * @return {String}
 */
const getCSSValue = (target, propName, animationInlineStyles) => {
  const inlineStyles = target.style[propName];
  if (inlineStyles && animationInlineStyles) {
    animationInlineStyles[propName] = inlineStyles;
  }
  const value =
    inlineStyles ||
    getComputedStyle(target[proxyTargetSymbol] || target).getPropertyValue(
      propName
    );
  return value === "auto" ? "0" : value;
};

/**
 * @param {Target} target
 * @param {String} propName
 * @param {tweenTypes} [tweenType]
 * @param {Object|void} [animationInlineStyles]
 * @return {String|Number}
 */
export const getOriginalAnimatableValue = (
  target,
  propName,
  tweenType,
  animationInlineStyles
) => {
  const type = !isUnd(tweenType) ? tweenType : getTweenType(target, propName);
  return type === tweenTypes.OBJECT
    ? target[propName] || 0
    : type === tweenTypes.ATTRIBUTE
    ? target.getAttribute(propName)
    : type === tweenTypes.TRANSFORM
    ? parseInlineTransforms(
        /** @type {DOMTarget} */ target,
        propName,
        animationInlineStyles
      )
    : type === tweenTypes.CSS_VAR
    ? getCSSValue(
        /** @type {DOMTarget} */ target,
        propName,
        animationInlineStyles
      ).trimStart()
    : getCSSValue(
        /** @type {DOMTarget} */ target,
        propName,
        animationInlineStyles
      );
};

/**
 * @param  {Number} x
 * @param  {Number} y
 * @param  {String} operator
 * @return {Number}
 */
export const getRelativeValue = (x, y, operator) => {
  return operator === "-" ? x - y : operator === "+" ? x + y : x * y;
};

/** @return {TweenDecomposedValue} */
export const createDecomposedValueTargetObject = () => {
  return {
    /** @type {valueTypes} */
    t: valueTypes.NUMBER,
    n: 0,
    u: null,
    o: null,
    d: null,
    s: null,
  };
};

/**
 * @param  {String|Number} rawValue
 * @param  {TweenDecomposedValue} targetObject
 * @return {TweenDecomposedValue}
 */
export const decomposeRawValue = (rawValue, targetObject) => {
  /** @type {valueTypes} */
  targetObject.t = valueTypes.NUMBER;
  targetObject.n = 0;
  targetObject.u = null;
  targetObject.o = null;
  targetObject.d = null;
  targetObject.s = null;
  if (!rawValue) return targetObject;
  let val = rawValue;
  const numberedVal = +val;
  // It's a number
  if (!isNaN(numberedVal)) {
    targetObject.n = numberedVal;
    return targetObject;
  } else {
    // NOTE: Test if it's possible to use string starts with instead?
    const matchedRelativeOperator = relativeValuesExecRgx.exec(
      /** @type {String} */ val
    );
    if (matchedRelativeOperator) {
      val = /** @type {String} */ val.slice(2);
      targetObject.o = matchedRelativeOperator[0][0];
    }
    // Skip unit match if the value contains a space to prevent long rgx backtracking
    const unitMatch = /** @type {String} */ val.includes(" ")
      ? false
      : unitsExecRgx.exec(/** @type {String} */ val);
    // Has a number and a unit
    if (unitMatch) {
      targetObject.t = valueTypes.UNIT;
      targetObject.n = +unitMatch[1];
      targetObject.u = unitMatch[2];
      return targetObject;
      // Has an operator like +=, -=, *=
    } else if (targetObject.o) {
      targetObject.n = +val;
      return targetObject;
      // Is a color
    } else if (isCol(val)) {
      targetObject.t = valueTypes.COLOR;
      targetObject.d = convertColorStringValuesToRgbaArray(
        /** @type {String} */ val
      );
      return targetObject;
      // Is a more complex string
    } else {
      const stringifiedVal = val + emptyString;
      const matchedNumbers = stringifiedVal.match(digitWithExponentRgx);
      targetObject.t = valueTypes.COMPLEX;
      targetObject.d = matchedNumbers ? matchedNumbers.map(Number) : [];
      targetObject.s = stringifiedVal.split(digitWithExponentRgx) || [];
      return targetObject;
    }
  }
};

/**
 * @param  {Tween} tween
 * @param  {TweenDecomposedValue} targetObject
 * @return {TweenDecomposedValue}
 */
export const decomposeTweenValue = (tween, targetObject) => {
  targetObject.t = tween._valueType;
  targetObject.n = tween._toNumber;
  targetObject.u = tween._unit;
  targetObject.o = null;
  targetObject.d = cloneArray(tween._toNumbers);
  targetObject.s = cloneArray(tween._strings);
  return targetObject;
};

export const decomposedOriginalValue = createDecomposedValueTargetObject();
