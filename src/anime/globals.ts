import { K, noop, maxFps, compositionTypes, doc } from "./consts";

/** @type {DefaultsParams} */
export const defaults = {
  /** @type {Number|String} */
  id: null,
  /** @type {PercentageKeyframes|DurationKeyframes} */
  keyframes: null,
  playbackEase: null,
  playbackRate: 1,
  frameRate: maxFps,
  /** @type {Number|Boolean} */
  loop: 0,
  reversed: false,
  alternate: false,
  autoplay: true,
  duration: K,
  delay: 0,
  loopDelay: 0,
  /** @type {EasingParam} */
  ease: "outQuad",
  /** @type {'none'|'replace'|'blend'|compositionTypes} */
  composition: compositionTypes.replace,
  /** @type {TweenModifier} */
  modifier: (v) => v,
  onBegin: noop,
  onUpdate: noop,
  onRender: noop,
  onLoop: noop,
  onComplete: noop,
};

export const globals = {
  /** @type {DefaultsParams} */
  defaults,
  /** @type {Document|DOMTarget} */
  root: doc,
  /** @type {import('./scope').Scope} */
  scope: null,
};
