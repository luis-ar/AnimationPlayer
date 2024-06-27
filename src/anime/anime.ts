import { isBrowser, win, doc } from "./consts";

import { defaults } from "./globals";

import { utils } from "./utils";

import { eases } from "./eases";

import { spring } from "./spring";

import { svg } from "./svg";

import { stagger } from "./stagger";

import { onScroll, Scroller, scrollContainers } from "./scroll";

import { Clock } from "./clock";

import { Engine, engine } from "./engine";

import { Timer } from "./timer";

import { Animation } from "./animation";

import { Timeline } from "./timeline";

import { Animatable } from "./animatable";

import { Draggable } from "./draggable";

import { Scope } from "./scope";
import { TimelineParams } from "./types";

// Main methods

/**
 * @param {TimerParams} [parameters]
 * @return {Timer}
 */
const createTimer = (parameters) => new Timer(parameters, null, 0).init();

/**
 * @param {TargetsParam} targets
 * @param {AnimationParams} parameters
 * @return {Animation}
 */
const animate = (targets, parameters) =>
  new Animation(targets, parameters, null, 0, false).init();

/**
 * @param {TimelineParams} [parameters]
 * @return {Timeline}
 */
const createTimeline = (parameters: TimelineParams) =>
  new Timeline(parameters).init();

/**
 * @param {TargetsParam} targets
 * @param {AnimatableParams} parameters
 * @return {AnimatableObject}
 */
const createAnimatable = (targets, parameters) =>
  /** @type {AnimatableObject} */ new Animatable(targets, parameters);

/**
 * @param {DOMTargetSelector} target
 * @param {DraggableParams} [parameters]
 * @return {Draggable}
 */
const createDraggable = (target, parameters) =>
  new Draggable(target, parameters);

/**
 * @param {ScopeParams} [params]
 * @return {Scope}
 */
const createScope = (params) => new Scope(params);

// Global Object and visibility checks event register

if (isBrowser) {
  if (!win.AnimeJS) win.AnimeJS = [];
  win.AnimeJS.push({
    version: "__packageVersion__",
    engine,
  });
  doc.addEventListener("visibilitychange", () =>
    engine.suspendWhenHidden
      ? doc.hidden
        ? engine.suspend()
        : engine.resume()
      : 0
  );
}

export {
  animate,
  createTimeline,
  createTimer,
  createAnimatable,
  createDraggable,
  createScope,
  defaults,
  onScroll,
  scrollContainers,
  engine,
  eases,
  spring,
  stagger,
  svg,
  utils,
  Clock,
  Engine,
  Timer,
  Animation,
  Timeline,
  Animatable,
  Draggable,
  Scroller,
  Scope,
};
