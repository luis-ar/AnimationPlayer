import { tickModes, isBrowser } from "./consts";

import { now, forEachChildren, removeChild } from "./helpers";

import { Clock } from "./clock";

import { additive } from "./additive";

import { tick } from "./render";

/**
 * @type {Function}
 * @return {Number}
 */
export const engineTickMethod = isBrowser
  ? requestAnimationFrame
  : setImmediate;

/**
 * @type {Function}
 * @return {Number}
 */
export const engineCancelMethod = isBrowser
  ? cancelAnimationFrame
  : clearImmediate;

export class Engine extends Clock {
  public useDefaultMainLoop: boolean;
  public suspendWhenHidden: boolean;
  public currentTime: number;
  public _elapsedTime: number;
  public _startTime: number;
  public _lastTime: number;
  public _speed: number;
  public _fps: number;
  public _reqId: number;

  constructor() {
    super();

    // Clock's parameters
    const initTime = now();
    this.currentTime = initTime;
    this._elapsedTime = initTime;
    this._startTime = initTime;
    this._lastTime = initTime;

    // Engine's parameters
    this.useDefaultMainLoop = true;
    this.suspendWhenHidden = true;
    this._reqId = 0;
    /** @type {Tickable} */
    this._head = null;
    /** @type {Tickable} */
    this._tail = null;
  }

  update() {
    const time = (this.currentTime = now());
    if (this.requestTick(time)) {
      this.computeDeltaTime(time);
      const engineSpeed = this._speed;
      const engineFps = this._fps;
      let activeTickable = this._head;
      while (activeTickable) {
        const nextTickable = activeTickable._next;
        if (!activeTickable.paused) {
          tick(
            activeTickable,
            (time - activeTickable._startTime) *
              activeTickable._speed *
              engineSpeed,
            0, // !muteCallbacks
            0, // !internalRender
            // Only process the tick of the child clock if its frameRate is lower than the engine
            activeTickable._fps < engineFps
              ? activeTickable.requestTick(time)
              : tickModes.AUTO
          );
        } else {
          removeChild(engine, activeTickable);
          this._hasChildren = !!this._tail;
          activeTickable._running = false;
          if (activeTickable.completed && !activeTickable._cancelled) {
            activeTickable.cancel();
          }
        }
        activeTickable = nextTickable;
      }
      additive.update();
    }
  }

  start() {
    return this.useDefaultMainLoop && !this._reqId
      ? (this._reqId = engineTickMethod(mainLoop))
      : 0;
  }

  resume() {
    forEachChildren(this, (/** @type {Tickable} */ child) => child.resetTime());
    return this.start();
  }

  suspend() {
    this._reqId = engineCancelMethod(this._reqId);
    return this;
  }

  get playbackRate() {
    return super.playbackRate;
  }

  set playbackRate(playbackRate) {
    super.playbackRate = playbackRate;
    // Forces children time to reset by reseting their playbackRate
    forEachChildren(
      this,
      (/** @type {Tickable} */ child) => (child.playbackRate = child._speed)
    );
  }
}

export const engine = new Engine();

const mainLoop = () => {
  if (engine._head) {
    engine._reqId = engineTickMethod(mainLoop);
    engine.update();
  } else {
    engine._reqId = 0;
  }
};
