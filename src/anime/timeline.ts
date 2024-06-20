import { globals } from "./globals";

import {
  relativeValuesExecRgx,
  minValue,
  tickModes,
  compositionTypes,
} from "./consts";

import {
  isObj,
  isFnc,
  isUnd,
  isNil,
  isNum,
  isStr,
  addChild,
  forEachChildren,
  stringStartsWith,
  mergeObjects,
  clampInfinity,
} from "./helpers";

import { getRelativeValue, setValue } from "./values";

import { parseTargets } from "./targets";

import { Timer } from "./timer";

import { Animation, cleanInlineStyles } from "./animation";

import { tick } from "./render";
import { parseEasings } from "./eases";

/**
 * @typedef {Number|String|Function} TimePosition
 */

/**
 * Timeline's children offsets positions parser
 * @param  {Timeline} timeline
 * @param  {String} timePosition
 * @return {Number}
 */
const getPrevChildOffset = (timeline, timePosition) => {
  if (stringStartsWith(timePosition, "<")) {
    const goToPrevAnimationOffset = timePosition[1] === "<";
    const prevAnimation = timeline._tail;
    const prevOffset = prevAnimation
      ? prevAnimation._offset + prevAnimation._delay
      : 0;
    return goToPrevAnimationOffset
      ? prevOffset
      : prevOffset + prevAnimation.duration;
  }
};

/**
 * @param  {Timeline} timeline
 * @param  {TimePosition} [timePosition]
 * @return {Number}
 */
export const parseTimelinePosition = (timeline, timePosition) => {
  let tlDuration = timeline._iterationDuration;
  if (tlDuration === minValue) tlDuration = 0;
  if (isUnd(timePosition)) return tlDuration;
  if (isNum(+timePosition)) return +timePosition;
  const timePosStr = /** @type {String} */ timePosition;
  const tlLabels = timeline ? timeline.labels : null;
  const hasLabels = !isNil(tlLabels);
  const prevOffset = getPrevChildOffset(timeline, timePosStr);
  const hasSibling = !isUnd(prevOffset);
  const matchedRelativeOperator = relativeValuesExecRgx.exec(timePosStr);
  if (matchedRelativeOperator) {
    const fullOperator = matchedRelativeOperator[0];
    const split = timePosStr.split(fullOperator);
    const labelOffset = hasLabels && split[0] ? tlLabels[split[0]] : tlDuration;
    const parsedOffset = hasSibling
      ? prevOffset
      : hasLabels
      ? labelOffset
      : tlDuration;
    const parsedNumericalOffset = +split[1];
    return getRelativeValue(
      parsedOffset,
      parsedNumericalOffset,
      fullOperator[0]
    );
  } else {
    return hasSibling
      ? prevOffset
      : hasLabels
      ? !isUnd(tlLabels[timePosStr])
        ? tlLabels[timePosStr]
        : tlDuration
      : tlDuration;
  }
};

/**
 * @overload
 * @param  {TimerParams} childParams
 * @param  {Timeline} tl
 * @param  {Number} parsedTLPosition
 * @return {Timeline}
 *
 * @overload
 * @param  {AnimationParams} childParams
 * @param  {Timeline} tl
 * @param  {Number} parsedTLPosition
 * @param  {TargetsParam} targets
 * @param  {Number} [index]
 * @param  {Number} [length]
 * @return {Timeline}
 *
 * @param  {TimerParams|AnimationParams} childParams
 * @param  {Timeline} tl
 * @param  {Number} parsedTLPosition
 * @param  {TargetsParam} [targets]
 * @param  {Number} [index]
 * @param  {Number} [length]
 */
function addTlChild(childParams, tl, parsedTLPosition, targets, index, length) {
  // Offset the tl position with -minValue for 0 duration animations or .set() calls in order to align their end value with the defined position
  const TLPosition =
    isNum(childParams.duration) &&
    /** @type {Number} */ childParams.duration <= minValue
      ? parsedTLPosition - minValue
      : parsedTLPosition;
  tick(tl, TLPosition, 1, 1, tickModes.AUTO);
  const tlChild = targets
    ? new Animation(
        targets,
        /** @type {AnimationParams} */ childParams,
        tl,
        TLPosition,
        false,
        index,
        length
      )
    : new Timer(/** @type {TimerParams} */ childParams, tl, TLPosition);
  tlChild.init(1);
  // TODO: Might be better to insert at a position relative to startTime?
  addChild(tl, tlChild);
  forEachChildren(tl, (/** @type {Renderable} */ child) => {
    const childTLOffset = child._offset + child._delay;
    const childDur = childTLOffset + child.duration;
    if (childDur > tl._iterationDuration) {
      tl._iterationDuration = childDur;
    }
  });
  tl.duration = clampInfinity(
    (tl._iterationDuration + tl._loopDelay) * tl._iterationCount - tl._loopDelay
  );
  return tl;
}

export class Timeline extends Timer {
  /**
   * @param {TimelineParams} [parameters]
   */
  constructor(parameters = {}) {
    super(/** @type {TimerParams} */ parameters, null, 0);
    this.duration = 0; // TL duration starts at 0 and grows when adding children
    this.labels = {}; // TODO: Do not create an Object until we actually add a label
    /** @type {DefaultsParams} */
    const defaultsParams = parameters.defaults;
    const globalDefaults = globals.defaults;
    this.defaults = defaultsParams
      ? mergeObjects(defaultsParams, globalDefaults)
      : globalDefaults;
    /** @type {TimelineCallback} */
    this.onRender =
      /** @type {TimelineCallback} */ parameters.onRender ||
      globalDefaults.onRender;
    const tlPlaybackEase = setValue(
      parameters.playbackEase,
      globalDefaults.playbackEase
    );
    this._ease = tlPlaybackEase ? parseEasings(tlPlaybackEase) : null;
    /** @type {Number} */
    this._iterationDuration = 0;
    /** @type {Renderable} */
    this._head = null;
    /** @type {Renderable} */
    this._tail = null;
  }

  /**
   * @overload
   * @param {TargetsParam} a1
   * @param {AnimationParams} a2
   * @param {TimePosition} [a3]
   * @return {this}
   *
   * @overload
   * @param {TimerParams} a1
   * @param {TimePosition} [a2]
   * @return {this}
   *
   * @overload
   * @param {String} a1
   * @param {TimePosition} [a2]
   * @return {this}
   *
   * @overload
   * @param {TimerCallback} a1
   * @param {TimePosition} [a2]
   * @return {this}
   *
   * @param {TargetsParam|TimerParams|String|TimerCallback} a1
   * @param {AnimationParams|TimePosition} a2
   * @param {TimePosition} [a3]
   */
  add(a1, a2, a3) {
    const isAnim = isObj(a2);
    const isTimer = isObj(a1);
    const isFunc = isFnc(a1);
    if (isAnim || isTimer || isFunc) {
      this._hasChildren = true;
      if (isAnim) {
        const childParams = /** @type {AnimationParams} */ a2;
        // Check for function for children stagger positions
        if (isFnc(a3)) {
          const staggeredPosition = /** @type {Function} */ a3;
          const parsedTargetsArray = parseTargets(a1);
          // Store initial duration before adding new children that will change the duration
          const tlDuration = this.duration;
          // Store initial _iterationDuration before adding new children that will change the duration
          const tlIterationDuration = this._iterationDuration;
          // Store the original id in order to add specific indexes to the new animations ids
          const id = childParams.id;
          let i = 0;
          const parsedLength = parsedTargetsArray.length;
          parsedTargetsArray.forEach((/** @type {Target} */ target) => {
            // Create a new parameter object for each staggered children
            const staggeredChildParams = { ...childParams };
            // Reset the duration of the timeline iteration before each stagger to prevent wrong start value calculation
            this.duration = tlDuration;
            this._iterationDuration = tlIterationDuration;
            if (!isUnd(id)) staggeredChildParams.id = id + "-" + i;
            addTlChild(
              staggeredChildParams,
              this,
              staggeredPosition(target, i, parsedLength, this),
              target,
              i,
              parsedLength
            );
            i++;
          });
        } else {
          addTlChild(childParams, this, parseTimelinePosition(this, a3), a1);
        }
      } else {
        // It's a Timer or a Function
        addTlChild(
          /** @type TimerParams */ isTimer
            ? a1
            : { onComplete: a1, duration: minValue },
          this,
          parseTimelinePosition(this, /** @type TimePosition */ a2)
        );
      }
      this.init(1); // 1 = internalRender
      return this._autoplay ? this.play() : this;
    } else if (isStr(a1)) {
      this.labels[a1] = parseTimelinePosition(
        this,
        /** @type TimePosition */ a2
      );
      return this;
    }
  }

  /**
   * @param {TargetsParam} targets
   * @param {AnimationParams} parameters
   * @param {TimePosition} [position]
   * @return {this}
   */
  set(targets, parameters, position) {
    if (isUnd(parameters)) return this;
    parameters.duration = minValue;
    parameters.composition = compositionTypes.replace;
    return this.add(targets, parameters, position);
  }

  /**
   * @param  {Number} newDuration
   * @return {this}
   */
  stretch(newDuration) {
    const currentDuration = this.duration;
    if (currentDuration === newDuration) return this;
    const timeScale = newDuration / currentDuration;
    const labels = this.labels;
    forEachChildren(this, (/** @type {Animation} */ child) => {
      child.stretch(child.duration * timeScale);
    });
    for (let labelName in labels) {
      labels[labelName] *= timeScale;
    }
    return super.stretch(newDuration);
  }

  /**
   * @return {this}
   */
  refresh() {
    forEachChildren(this, (/** @type {Animation} */ child) => {
      child.refresh();
    });
    return this;
  }

  /**
   * @return {this}
   */
  revert() {
    super.revert();
    forEachChildren(
      this,
      (/** @type {Animation} */ child) => child.revert,
      true
    );
    return cleanInlineStyles(this);
  }

  /**
   * @param  {TimelineCallback} [callback]
   * @return {Promise}
   */
  then(callback) {
    return super.then(/** @type {TimerCallback} */ callback);
  }
}
