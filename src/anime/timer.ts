import { minValue, compositionTypes, tickModes, noop } from "./consts";

import {
  now,
  isUnd,
  addChild,
  forEachChildren,
  clampInfinity,
  round,
  clampZero,
  isFnc,
} from "./helpers";

import { globals } from "./globals";

import { setValue } from "./values";

import { tick } from "./render";

import {
  composeTween,
  getTweenSiblings,
  removeTweenSliblings,
} from "./compositions";

import { engine } from "./engine";

import { Clock } from "./clock";

/**
 * @param  {Timer} timer
 * @return {Timer}
 */
const resetTimerProperties = (timer) => {
  timer.paused = true;
  timer.began = false;
  timer.completed = false;
  return timer;
};

/**
 * @param  {Timer} timer
 * @return {Timer}
 */
const reviveTimer = (timer) => {
  if (!timer._cancelled) return timer;
  if (timer._hasChildren) {
    forEachChildren(timer, reviveTimer);
  } else {
    forEachChildren(timer, (/** @type {Tween} tween*/ tween) => {
      if (tween._composition !== compositionTypes.none) {
        composeTween(tween, getTweenSiblings(tween.target, tween.property));
      }
    });
  }
  timer._cancelled = 0;
  return timer;
};

let timerId = 0;

/**
 * Base class used to create Timers, Animations and Timelines
 */
export class Timer extends Clock {
  /**
   * @param {TimerParams} [parameters]
   * @param {Timeline} [parent]
   * @param {Number} [parentPosition]
   */
  constructor(parameters = {}, parent = null, parentPosition = 0) {
    super();

    const {
      id,
      delay,
      duration,
      reversed,
      alternate,
      loop,
      loopDelay,
      autoplay,
      frameRate,
      playbackRate,
      onComplete,
      onLoop,
      onBegin,
      onUpdate,
    } = parameters;

    if (globals.scope) globals.scope.revertibles.push(this);
    const timerInitTime = parent ? 0 : engine._elapsedTime;
    const timerDefaults = parent ? parent.defaults : globals.defaults;
    const timerDelay =
      isFnc(delay) || isUnd(delay) ? timerDefaults.delay : +delay;
    const timerDuration =
      isFnc(duration) || isUnd(duration) ? Infinity : +duration;
    const timerLoop = setValue(loop, timerDefaults.loop);
    const timerLoopDelay = setValue(loopDelay, timerDefaults.loopDelay);
    const timerIterationCount =
      timerLoop === true ||
      timerLoop === Infinity ||
      /** @type {Number} */ timerLoop < 0
        ? Infinity
        : /** @type {Number} */ timerLoop + 1;

    // Timer's parameters
    this.id = !isUnd(id) ? id : duration === minValue ? 0 : ++timerId;
    // NOTE: Parent timeline is currently stored only for fast tween composition in timeline
    /** @type {Timeline} */
    this.parent = parent;
    // Total duration of the timer
    this.duration = clampInfinity(
      (timerDuration + timerLoopDelay) * timerIterationCount - timerLoopDelay
    );
    /** @type {Boolean} */
    this.paused = true;
    /** @type {Boolean} */
    this.began = false;
    /** @type {Boolean} */
    this.completed = false;
    /** @type {Number} */
    this.reversed = +setValue(reversed, timerDefaults.reversed);
    /** @type {TimerCallback} */
    this.onBegin = onBegin || timerDefaults.onBegin;
    /** @type {TimerCallback} */
    this.onUpdate = onUpdate || timerDefaults.onUpdate;
    /** @type {TimerCallback} */
    this.onLoop = onLoop || timerDefaults.onLoop;
    /** @type {TimerCallback} */
    this.onComplete = onComplete || timerDefaults.onComplete;
    /** @type {Boolean|Scroller} */
    this._autoplay = parent
      ? false
      : setValue(autoplay, timerDefaults.autoplay);
    /** @type {Number} */
    this._offset = parent
      ? parentPosition
      : engine._elapsedTime - engine._startTime;
    /** @type {Number} */
    this._delay = timerDelay;
    /** @type {Number} */
    this._loopDelay = timerLoopDelay;
    /** @type {Number} */
    this._iterationTime = 0;
    /** @type {Number} */
    this._iterationDuration = timerDuration; // Duration of one loop
    /** @type {Number} */
    this._iterationCount = timerIterationCount; // Number of loops
    /** @type {Number} */
    this._currentIteration = 0; // Current loop index
    /** @type {Function} */
    this._resolve = noop; // Used by .then()
    /** @type {Boolean} */
    this._hasChildren = false;
    /** @type {Boolean} */
    this._running = false;
    /** @type {Number} */
    this._cancelled = 0;
    /** @type {Number} */
    this._reversed = this.reversed;
    /** @type {Boolean} */
    this._alternate = setValue(alternate, timerDefaults.alternate);
    /** @type {Boolean} */
    this._backwards = false;
    /** @type {Renderable} */
    this._prev = null;
    /** @type {Renderable} */
    this._next = null;

    // Clock's parameters
    /** @type {Number} */
    this._elapsedTime = timerInitTime;
    /** @type {Number} */
    this._startTime = timerInitTime;
    /** @type {Number} */
    this._lastTime = timerInitTime;
    /** @type {Number} */
    this._fps = setValue(frameRate, timerDefaults.frameRate);
    /** @type {Number} */
    this._speed = setValue(playbackRate, timerDefaults.playbackRate);
  }

  get progress() {
    return round(this.currentTime / this.duration, 6);
  }

  set progress(progress) {
    const paused = this.paused;
    // Pausing the timer is necessary to avoid time jumps
    this.pause().seek(this.duration * +progress);
    if (!paused) this.play();
  }

  // get currentTime() {
  //   return this._time;
  // }

  // set currentTime(time) {
  //   this.seek(+time);
  // }

  get playbackRate() {
    return super.playbackRate;
  }

  set playbackRate(playbackRate) {
    super.playbackRate = playbackRate;
    this.resetTime();
  }

  /**
   * @param  {Number} internalRender
   * @return {this}
   */
  reset(internalRender = 0) {
    // If cancelled, revive the timer before rendering in order to have propertly composed tweens siblings
    reviveTimer(this);
    if (!this._reversed !== !this.reversed) {
      this.reverse();
    }
    // Render timer before changing completed parameters to prevent skips and to make sure the properties are not overridden
    // Setting the iterationTime at the end to force the rendering to happend backwards, otherwise calling .reset() on Timelines might not render children in the right order
    // NOTE: This is only required for Timelines and might be better to move to the Timeline class?
    this._iterationTime = this._iterationDuration;
    // Set tickMode to tickModes.FORCE to force rendering
    tick(this, 0, 1, internalRender, tickModes.FORCE);
    // Reset timer properties after revive / render to make sure the props are not updated again
    resetTimerProperties(this);
    // Also reset children properties
    if (this._hasChildren) {
      forEachChildren(this, resetTimerProperties);
    }
    return this;
  }

  /**
   * @param  {Number} internalRender
   * @return {this}
   */
  init(internalRender = 0) {
    this.frameRate = this._fps;
    this.playbackRate = this._speed;
    // Manually calling .init() on timelines should render all children intial state
    // Forces all children to render once then render to 0 when reseted
    if (!internalRender && this._hasChildren) {
      tick(this, this.duration, 1, internalRender, tickModes.FORCE);
    }
    this.reset(internalRender);
    // Make sure to set autoplay to false if timer has a parent
    const autoplay = this._autoplay;
    if (autoplay === true) {
      this.play();
    } else if (!internalRender && autoplay && !isUnd(autoplay.linked)) {
      autoplay.link(this);
    }
    return this;
  }

  /**
   * @return {this}
   */
  resetTime() {
    const timeScale = 1 / (this._speed * engine._speed);
    // Offset by 12 ms to reduce the lag between the initialization and the rendering of the first frame
    this._startTime = now() - (this.currentTime + this._delay) * timeScale - 12;
    return this;
  }

  /**
   * @return {this}
   */
  pause() {
    if (this.paused) return this;
    this.paused = true;
    return this;
  }

  /**
   * @return {this}
   */
  play() {
    if (!this.paused) return this;
    this.paused = false;
    if (this.duration <= minValue) {
      // timer, time = 1, muteCallbacks = 0, internalRendering = 0, tickMode = 0
      tick(this, 1, 0, 0, tickModes.FORCE);
    } else {
      if (!this._running) {
        addChild(engine, this);
        engine._hasChildren = true;
        this._running = true;
      }
      this.resetTime();
      engine.start();
    }
    return this;
  }

  /**
   * @return {this}
   */
  restart() {
    return this.reset(0).play();
  }

  /**
   * @param  {Number} time
   * @param  {Boolean|Number} [muteCallbacks]
   * @return {this}
   */
  seek(time, muteCallbacks) {
    // Recompose the tween siblings in case the timer has been cancelled
    reviveTimer(this);
    // If you seek a completed animation, otherwise the next play will starts at 0
    this.completed = false;
    const isPaused = this.paused;
    this.paused = true;
    // timer, time, muteCallbacks, internalRendering, tickMode
    tick(this, time + this._delay, ~~muteCallbacks, 0, tickModes.AUTO);
    return isPaused ? this : this.play();
  }

  /**
   * @return {this}
   */
  reverse() {
    const reversed = this.reversed;
    this.reversed = +(this._alternate && !(this._iterationCount % 2)
      ? reversed
      : !reversed);
    this.seek(this.duration - this.currentTime);
    this.resetTime();
    return this;
  }

  playForward() {
    return this.reversed ? this.reverse().play() : this.play();
  }

  playBackward() {
    return !this.reversed ? this.reverse().play() : this.play();
  }

  // TODO: Move all the animation / tweens / children related code to Animation / Timeline

  /**
   * @return {this}
   */
  cancel() {
    if (this._hasChildren) {
      forEachChildren(
        this,
        (/** @type {Timer} */ child) => child.cancel(),
        true
      );
    } else {
      forEachChildren(this, removeTweenSliblings);
    }
    this._cancelled = 1;
    // Pausing the timer removes it from the engine
    return this.pause();
  }

  /**
   * @param  {Number} newDuration
   * @return {this}
   */
  stretch(newDuration) {
    const currentDuration = this.duration;
    if (currentDuration === newDuration) return this;
    const timeScale = newDuration / currentDuration;
    this.duration = clampZero(clampInfinity(currentDuration * timeScale));
    this._iterationDuration = clampZero(
      clampInfinity(this._iterationDuration * timeScale)
    );
    this._offset *= timeScale;
    this._delay *= timeScale;
    this._loopDelay *= timeScale;
    return this;
  }

  /**
   * Cancel the timer by seeking it back to 0 and reverting the attached scroller if necessary
   * @return {this}
   */
  revert() {
    tick(this, 0, 1, 0, tickModes.FORCE);
    const autoplay = /** @type {Scroller} */ this._autoplay;
    if (autoplay.linked) autoplay.revert();
    return this.cancel();
  }

  /**
   * @param  {TimerCallback} [callback]
   * @return {Promise}
   */
  then(callback = noop) {
    const then = this.then;
    const onResolve = () => {
      // this.then = null prevents infinite recursion if returned by an async function
      // https://github.com/juliangarnierorg/anime-beta/issues/26
      this.then = null;
      callback(this);
      this.then = then;
      this._resolve = noop;
    };
    return new Promise((r) => {
      this._resolve = () => r(onResolve());
      // Make sure to resolve imediatly if the timer has already completed
      if (this.completed) this._resolve();
      return this;
    });
  }
}
