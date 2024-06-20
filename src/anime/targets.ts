import {
  isRegisteredTargetSymbol,
  isDomSymbol,
  isSvgSymbol,
  transformsSymbol,
} from "./consts";

import { isSvg, isNil, isArr, toArray } from "./helpers";

/**
 * @param  {TargetsParam} targets
 * @return {TargetsArray}
 */
export const parseTargets = (targets) => {
  if (isNil(targets)) return;
  if (isArr(targets)) {
    const targetsArray = /** @type {Array} */ targets;
    // TODO: Remove spread operator?
    const parsed = [].concat(...targetsArray.map(toArray));
    // TODO: Test again if Set is more performant than indexOf
    return parsed.filter((t, index) => parsed.indexOf(t) === index);
  } else {
    return toArray(targets);
  }
};

/**
 * @param  {TargetsParam} targets
 * @return {TargetsArray}
 */
export const registerTargets = (targets) => {
  if (isNil(targets)) return;
  const parsedTargetsArray = parseTargets(targets);
  for (let i = 0, l = parsedTargetsArray.length; i < l; i++) {
    const target = parsedTargetsArray[i];
    if (!target[isRegisteredTargetSymbol]) {
      target[isRegisteredTargetSymbol] = true;
      const isSvgType = isSvg(target);
      const isDom = target.nodeType || isSvgType;
      if (isDom) {
        target[isDomSymbol] = true;
        target[isSvgSymbol] = isSvgType;
        target[transformsSymbol] = {};
      }
    }
  }
  return parsedTargetsArray;
};
