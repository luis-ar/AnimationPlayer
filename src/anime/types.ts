import type { Animation } from "./animation";
import type { Scroller } from "./scroll";
import type { Timeline } from "./timeline";

type EaseStringParamNames =
  | "linear"
  | "linear(x1, x2 25%, x3)"
  | "in"
  | "out"
  | "inOut"
  | "outIn"
  | "inQuad"
  | "outQuad"
  | "inOutQuad"
  | "outInQuad"
  | "inCubic"
  | "outCubic"
  | "inOutCubic"
  | "outInCubic"
  | "inQuart"
  | "outQuart"
  | "inOutQuart"
  | "outInQuart"
  | "inQuint"
  | "outQuint"
  | "inOutQuint"
  | "outInQuint"
  | "inSine"
  | "outSine"
  | "inOutSine"
  | "outInSine"
  | "inCirc"
  | "outCirc"
  | "inOutCirc"
  | "outInCirc"
  | "inExpo"
  | "outExpo"
  | "inOutExpo"
  | "outInExpo"
  | "inBounce"
  | "outBounce"
  | "inOutBounce"
  | "outInBounce"
  | "inBack"
  | "outBack"
  | "inOutBack"
  | "outInBack"
  | "inElastic"
  | "outElastic"
  | "inOutElastic"
  | "outInElastic"
  | "irregular"
  | "cubicBezier"
  | "steps"
  | "in(p = 1.675)"
  | "out(p = 1.675)"
  | "inOut(p = 1.675)"
  | "outIn(p = 1.675)"
  | "inBack(overshoot = 1.70158)"
  | "outBack(overshoot = 1.70158)"
  | "inOutBack(overshoot = 1.70158)"
  | "outInBack(overshoot = 1.70158)"
  | "inElastic(amplitude = 1, period = .3)"
  | "outElastic(amplitude = 1, period = .3)"
  | "inOutElastic(amplitude = 1, period = .3)"
  | "outInElastic(amplitude = 1, period = .3)"
  | "irregular(length = 10, randomness = 1)"
  | "cubicBezier(x1, y1, x2, y2)"
  | "steps(steps = 10)";

type SpringEasing = {
  duration: number;
  solver: EasingFunction;
};
type EasingParam =
  | (string & {})
  | EaseStringParamNames
  | EasingFunction
  | SpringEasing;
type DOMTarget = HTMLElement | SVGElement | SVGGeometryElement;
type JSTarget = Record<string, any>;
type Target = DOMTarget | JSTarget;

type EasingFunction = (time: number) => number;

type TweenObjectValue = Partial<{
  to: TweenParamValue | Array<TweenParamValue>;
  from: TweenParamValue | Array<TweenParamValue>;
  fromTo: TweenParamValue | Array<TweenParamValue>;
}>;
type TweenModifier = (value: number) => number | string;

type FunctionValue = (
  target?: Target,
  index?: number,
  length?: number
) =>
  | number
  | string
  | TweenObjectValue
  | Array<number | string | TweenObjectValue>
  | void;

type compositionTypes = number;
declare namespace compositionTypes {
  let replace: number;
  let none: number;
  let blend: number;
}
type TweenComposition = "none" | "replace" | "blend" | compositionTypes;

type TweenParamsOptions = {
  duration?: TweenParamValue;
  delay?: TweenParamValue;
  ease?: EasingParam;
  modifier?: TweenModifier;
  composition?: TweenComposition;
};
type TweenKeyValue = TweenParamsOptions & TweenValues;
type TweenPropValue = TweenParamValue | [TweenParamValue, TweenParamValue];
type TweenValues = {
  from?: TweenParamValue;
  to?: TweenPropValue;
  fromTo?: TweenPropValue;
};
type TweenOptions =
  | TweenParamValue
  | (TweenPropValue | TweenKeyValue)[]
  | TweenKeyValue;

type PercentageKeyframeParams = Record<string, TweenParamValue>;

type DurationKeyframes = Array<
  Record<string, TweenOptions | TweenModifier | boolean> & TweenParamsOptions
>;

type PercentageKeyframeOptions = {
  ease?: EasingParam;
};
type PercentageKeyframes = Record<
  string,
  PercentageKeyframeParams & PercentageKeyframeOptions
>;

type AnimationCallback = (self: Animation) => any;

type AnimationOptions = {
  keyframes?: PercentageKeyframes | DurationKeyframes;
  playbackEase?: EasingParam;
  onComplete?: AnimationCallback;
  onLoop?: AnimationCallback;
  onRender?: AnimationCallback;
  onBegin?: AnimationCallback;
  onUpdate?: AnimationCallback;
};

type DefaultsParams = TimerOptions & AnimationOptions & TweenParamsOptions;

type TweenParamValue = number | string | FunctionValue;

type TimelineCallback = (self: Timeline) => any;

type TimelineOptions = {
  defaults?: DefaultsParams;
  playbackEase?: EasingParam;
  onComplete?: TimelineCallback;
  onLoop?: TimelineCallback;
  onRender?: TimelineCallback;
  onBegin?: TimelineCallback;
  onUpdate?: TimelineCallback;
};

type TimerOptions = {
  id?: number | string;
  duration?: TweenParamValue;
  delay?: TweenParamValue;
  loopDelay?: number;
  reversed?: boolean;
  alternate?: boolean;
  loop?: boolean | number;
  autoplay?: boolean | Scroller;
  frameRate?: number;
  playbackRate?: number;
};
export type TimelineParams = TimerOptions & TimelineOptions;
