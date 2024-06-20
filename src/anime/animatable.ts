import { compositionTypes, noop } from "./consts";

import {
  isKey,
  isObj,
  isStr,
  isUnd,
  mergeObjects,
  forEachChildren,
  isArr,
} from "./helpers";

import { Animation } from "./animation";

import { parseEasings } from "./eases";

export class Animatable {
  /**
   * @param {TargetsParam} targets
   * @param {AnimatableParams} parameters
   */
  constructor(targets, parameters) {
    const globalParams = {};
    const properties = {};
    this.targets = [];
    this.animations = {};
    if (isUnd(targets) || isUnd(parameters)) return;
    for (let propName in parameters) {
      const paramValue = parameters[propName];
      if (isKey(propName)) {
        properties[propName] = paramValue;
      } else {
        globalParams[propName] = paramValue;
      }
    }
    for (let propName in properties) {
      const propValue = properties[propName];
      const isObjValue = isObj(propValue);
      let propParams = {};
      let to = "+=0";
      if (isObjValue) {
        const unit = propValue.unit;
        if (isStr(unit)) to += unit;
      } else {
        propParams.duration = propValue;
      }
      propParams[propName] = isObjValue ? mergeObjects({ to }, propValue) : to;
      const animParams = mergeObjects(globalParams, propParams);
      animParams.composition = compositionTypes.replace;
      animParams.autoplay = false;
      const animation = (this.animations[propName] = new Animation(
        targets,
        animParams,
        null,
        0,
        false
      ).init());
      // console.log(animation, animParams[propName].composition);
      if (!this.targets.length) this.targets.push(...animation.targets);
      /** @type {AnimatableProperty} */
      this[propName] = (to, duration, ease) => {
        const tween = animation._head;
        if (isUnd(to)) {
          const numbers = tween._numbers;
          if (numbers && numbers.length) {
            return numbers;
          } else {
            return tween._modifier(tween._number);
          }
        } else {
          forEachChildren(animation, (/** @type {Tween} */ tween) => {
            if (isArr(to)) {
              for (let i = 0, l = /** @type {Array} */ to.length; i < l; i++) {
                if (!isUnd(tween._numbers[i])) {
                  tween._fromNumbers[i] = /** @type {Number} */ tween._modifier(
                    tween._numbers[i]
                  );
                  tween._toNumbers[i] = to[i];
                }
              }
            } else {
              tween._fromNumber = /** @type {Number} */ tween._modifier(
                tween._number
              );
              tween._toNumber = /** @type {Number} */ to;
            }
            if (!isUnd(ease)) tween._ease = parseEasings(ease);
            tween._currentTime = 0;
          });
          if (!isUnd(duration)) animation.stretch(duration);
          animation.seek(0, 1).resetTime().play();
          return this;
        }
      };
    }
  }

  revert() {
    for (let propName in this.animations) {
      this[propName] = noop;
      this.animations[propName].revert();
    }
    this.animations = {};
    this.targets.length = 0;
  }
}
