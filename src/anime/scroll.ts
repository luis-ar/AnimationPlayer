import { win, doc, noop, isDomSymbol, relativeValuesExecRgx } from "./consts";

import { globals } from "./globals";

import { none, parseEasings } from "./eases";

import {
  addChild,
  removeChild,
  forEachChildren,
  interpolate,
  clamp,
  round,
  isFnc,
  isNum,
  isObj,
  isStr,
  isUnd,
} from "./helpers";

import { parseTargets } from "./targets";

import { Timer } from "./timer";

import { convertValueUnit } from "./units";

import { lerp, getTargetValue, setTargetValues } from "./utils";

import {
  decomposeRawValue,
  decomposedOriginalValue,
  getRelativeValue,
  setValue,
} from "./values";

/**
 * @typedef {String|Number} ScrollerThresholdValue
 */

/**
 * @return {Number}
 */
const getMaxViewHeight = () => {
  const $el = document.createElement("div");
  doc.body.appendChild($el);
  $el.style.height = "100lvh";
  const height = $el.offsetHeight;
  doc.body.removeChild($el);
  return height;
};

/**
 * @template {ScrollerThresholdValue|String|Number|Boolean|Function|Object} T
 * @param {T} value
 * @param {Scroller} scroller
 * @return {T}
 */
const parseFunctionValue = (value, scroller) =>
  value && isFnc(value) ? /** @type {Function} */ value(scroller) : value;

export const scrollContainers = new Map();

class ScrollContainer {
  /**
   * @param {HTMLElement} $el
   */
  constructor($el) {
    /** @type {HTMLElement} */
    this.element = $el;
    /** @type {Boolean} */
    this.useWin = this.element === doc.body;
    /** @type {Number} */
    this.winWidth = 0;
    /** @type {Number} */
    this.winHeight = 0;
    /** @type {Number} */
    this.width = 0;
    /** @type {Number} */
    this.height = 0;
    /** @type {Number} */
    this.left = 0;
    /** @type {Number} */
    this.top = 0;
    /** @type {Number} */
    this.scrollX = 0;
    /** @type {Number} */
    this.scrollY = 0;
    /** @type {Number} */
    this.prevScrollX = 0;
    /** @type {Number} */
    this.prevScrollY = 0;
    /** @type {Number} */
    this.scrollWidth = 0;
    /** @type {Number} */
    this.scrollHeight = 0;
    /** @type {Number} */
    this.velocity = 0;
    /** @type {Boolean} */
    this.backwardX = false;
    /** @type {Boolean} */
    this.backwardY = false;
    /** @type {Timer} */
    this.scrollTicker = new Timer({
      autoplay: false,
      onBegin: () => this.dataTimer.play(),
      onUpdate: () => {
        forEachChildren(this, (/** @type {Scroller} */ child) =>
          child.handleScroll()
        );
      },
      onComplete: () => this.dataTimer.pause(),
    }).init();
    /** @type {Timer} */
    this.dataTimer = new Timer({
      frameRate: 30,
      autoplay: false,
      onUpdate: (self) => {
        const dt = self.deltaTime;
        const px = this.prevScrollX;
        const py = this.prevScrollY;
        const nx = this.scrollX;
        const ny = this.scrollY;
        const dx = px - nx;
        const dy = py - ny;
        this.prevScrollX = nx;
        this.prevScrollY = ny;
        if (dx) this.backwardX = px > nx;
        if (dy) this.backwardY = py > ny;
        this.velocity = dt > 0 ? Math.sqrt(dx * dx + dy * dy) / dt : 0;
      },
    }).init();
    /** @type {Timer} */
    this.resizeTicker = new Timer({
      duration: 250,
      onComplete: () => {
        const winWidth = this.winWidth;
        const winHeight = this.winHeight;
        this.updateWindowBounds();
        if (winWidth !== this.winWidth || winHeight !== this.winHeight) {
          this.refreshScrollers();
          this.handleScroll();
        }
      },
    });
    /** @type {Timer} */
    this.wakeTicker = new Timer({
      duration: 66,
      onBegin: (self) => {
        this.scrollTicker.play();
      },
      onComplete: () => {
        this.scrollTicker.pause();
      },
    }).init();
    /** @type {Scroller} */
    this._head = null;
    /** @type {Scroller} */
    this._tail = null;
    this.updateScrollCoords();
    this.updateWindowBounds();
    this.updateBounds();
    (this.useWin ? win : this.element).addEventListener("scroll", this, false);
    win.addEventListener("resize", this, false);
  }

  updateScrollCoords() {
    const useWin = this.useWin;
    const $el = this.element;
    this.scrollX = round(useWin ? win.scrollX : $el.scrollLeft, 0);
    this.scrollY = round(useWin ? win.scrollY : $el.scrollTop, 0);
  }

  updateWindowBounds() {
    this.winWidth = win.innerWidth;
    this.winHeight = getMaxViewHeight();
  }

  updateBounds() {
    const style = getComputedStyle(this.element);
    const $el = this.element;
    this.scrollWidth =
      $el.scrollWidth +
      parseFloat(style.marginLeft) +
      parseFloat(style.marginRight);
    this.scrollHeight =
      $el.scrollHeight +
      parseFloat(style.marginTop) +
      parseFloat(style.marginBottom);
    this.updateWindowBounds();
    let width, height;
    if (this.useWin) {
      width = this.winWidth;
      height = this.winHeight;
    } else {
      const elRect = $el.getBoundingClientRect();
      width = elRect.width;
      height = elRect.height;
      this.top = elRect.top;
      this.left = elRect.left;
    }
    this.width = width;
    this.height = height;
  }

  refreshScrollers() {
    forEachChildren(this, (/** @type {Scroller} */ child) => {
      if (child._debug) {
        child.removeDebug();
      }
    });
    this.updateBounds();
    forEachChildren(this, (/** @type {Scroller} */ child) => {
      child.refresh();
      if (child._debug) {
        child.debug();
      }
    });
  }

  refresh() {
    this.updateWindowBounds();
    this.updateBounds();
    this.refreshScrollers();
    this.handleScroll();
  }

  handleScroll() {
    this.updateScrollCoords();
    this.wakeTicker.restart();
  }

  handleResize() {
    this.resizeTicker.restart();
  }

  /**
   * @param {Event} e
   */
  handleEvent(e) {
    switch (e.type) {
      case "scroll":
        this.handleScroll();
        break;
      case "resize":
        this.handleResize();
        break;
    }
  }

  revert() {
    if (!this._head) {
      this.scrollTicker.cancel();
      this.dataTimer.cancel();
      this.resizeTicker.cancel();
      this.wakeTicker.cancel();
      (this.useWin ? win : this.element).removeEventListener("scroll", this);
      win.removeEventListener("resize", this);
      scrollContainers.delete(this.element);
    }
  }
}

/**
 * @param {TargetsParam} target
 * @return {ScrollContainer}
 */
const registerAndGetScrollContainer = (target) => {
  const $el = /** @type {HTMLElement} */ target
    ? parseTargets(target)[0] || doc.body
    : doc.body;
  let scrollContainer = scrollContainers.get($el);
  if (!scrollContainer) {
    scrollContainer = new ScrollContainer($el);
    scrollContainers.set($el, scrollContainer);
  }
  return scrollContainer;
};

/**
 * @param {HTMLElement} $el
 * @param {Number|string} v
 * @param {Number} size
 * @param {Number} [under]
 * @param {Number} [over]
 * @return {Number}
 */
const convertValueToPx = ($el, v, size, under, over) => {
  const clampMin = v === "min";
  const clampMax = v === "max";
  const value =
    v === "top" || v === "left" || v === "start" || clampMin
      ? 0
      : v === "bottom" || v === "right" || v === "end" || clampMax
      ? "100%"
      : v === "center"
      ? "50%"
      : v;
  const { n, u } = decomposeRawValue(value, decomposedOriginalValue);
  let px = n;
  if (u === "%") {
    px = (n / 100) * size;
  } else if (u) {
    px = convertValueUnit($el, decomposedOriginalValue, "px", true).n;
  }
  if (clampMax && under < 0) px += under;
  if (clampMin && over > 0) px += over;
  return px;
};

/**
 * @param {HTMLElement} $el
 * @param {ScrollerThresholdValue} v
 * @param {Number} size
 * @param {Number} [under]
 * @param {Number} [over]
 * @return {Number}
 */
const parseBoundValue = ($el, v, size, under, over) => {
  /** @type {Number} */
  let value;
  if (isStr(v)) {
    const matchedOperator = relativeValuesExecRgx.exec(/** @type {String} */ v);
    if (matchedOperator) {
      const splitter = matchedOperator[0];
      const operator = splitter[0];
      const splitted = /** @type {String} */ v.split(splitter);
      const clampMin = splitted[0] === "min";
      const clampMax = splitted[0] === "max";
      const valueAPx = convertValueToPx($el, splitted[0], size, under, over);
      const valueBPx = convertValueToPx($el, splitted[1], size, under, over);
      if (clampMin) {
        const min = getRelativeValue(
          convertValueToPx($el, "min", size),
          valueBPx,
          operator
        );
        value = min < valueAPx ? valueAPx : min;
      } else if (clampMax) {
        const max = getRelativeValue(
          convertValueToPx($el, "max", size),
          valueBPx,
          operator
        );
        value = max > valueAPx ? valueAPx : max;
      } else {
        value = getRelativeValue(valueAPx, valueBPx, operator);
      }
    } else {
      value = convertValueToPx($el, v, size, under, over);
    }
  } else {
    value = /** @type {Number} */ v;
  }
  return round(value, 0);
};

/**
 * @param {$Animation} linked
 * @return {HTMLElement}
 */
const getAnimationDomTarget = (linked) => {
  let $linkedTarget;
  const linkedTargets = linked.targets;
  for (let i = 0, l = linkedTargets.length; i < l; i++) {
    const target = linkedTargets[i];
    if (target[isDomSymbol]) {
      $linkedTarget = /** @type {HTMLElement} */ target;
      break;
    }
  }
  return $linkedTarget;
};

let scrollerId = 0;

const debugColors = [
  "#FF4B4B",
  "#FF971B",
  "#FFC730",
  "#F9F640",
  "#7AFF5A",
  "#18FF74",
  "#17E09B",
  "#3CFFEC",
  "#05DBE9",
  "#33B3F1",
  "#638CF9",
  "#C563FE",
  "#FF4FCF",
  "#F93F8A",
];

/**
 * @callback ScrollerCallback
 * @param {Scroller} self - Returns itself
 * @return {*}
 */

/**
 * @typedef {Object} ScrollerThresholdParam
 * @property {ScrollerThresholdValue} [target]
 * @property {ScrollerThresholdValue} [container]
 */

/**
 * @callback ScrollerAxisCallback
 * @param {Scroller} self
 * @return {'x'|'y'}
 */

/**
 * @callback ScrollerThresholdCallback
 * @param {Scroller} self
 * @return {ScrollerThresholdValue|ScrollerThresholdParam}
 */

/**
 * @typedef {Object} ScrollerParams
 * @property {Boolean|Number|String|EasingParam} [sync]
 * @property {TargetsParam} [container]
 * @property {TargetsParam} [target]
 * @property {'x'|'y'|ScrollerAxisCallback} [axis]
 * @property {ScrollerThresholdValue|ScrollerThresholdParam|ScrollerThresholdCallback} [enter]
 * @property {ScrollerThresholdValue|ScrollerThresholdParam|ScrollerThresholdCallback} [leave]
 * @property {Boolean} [repeat]
 * @property {Boolean} [debug]
 * @property {ScrollerCallback} [onEnter]
 * @property {ScrollerCallback} [onLeave]
 * @property {ScrollerCallback} [onEnterForward]
 * @property {ScrollerCallback} [onLeaveForward]
 * @property {ScrollerCallback} [onEnterBackward]
 * @property {ScrollerCallback} [onLeaveBackward]
 * @property {ScrollerCallback} [onUpdate]
 * @property {ScrollerCallback} [onSyncComplete]
 */

export class Scroller {
  /**
   * @param {ScrollerParams} parameters
   */
  constructor(parameters) {
    if (globals.scope) globals.scope.revertibles.push(this);
    const sync = setValue(parameters.sync, "play pause");
    const ease = sync ? parseEasings(/** @type {EasingParam} */ sync) : null;
    const isLinear = sync && (sync === "linear" || sync === none);
    const isEase = sync && !(ease === none && !isLinear);
    const isSmooth = sync && (isNum(sync) || sync === true || isLinear);
    const isMethods = sync && isStr(sync) && !isEase && !isSmooth;
    const syncMethods = isMethods
      ? /** @type {String} */ sync
          .split(" ")
          .map((/** @type {String} */ m) => () => {
            const linked = this.linked;
            return linked && linked[m] ? linked[m]() : null;
          })
      : null;
    const biDirSync = isMethods && syncMethods.length > 2;
    /** @type {Number} */
    this.id = scrollerId++;
    /** @type {ScrollContainer} */
    this.container = registerAndGetScrollContainer(parameters.container);
    /** @type {HTMLElement} */
    this.target = null;
    /** @type {Tickable} */
    this.linked = null;
    /** @type {Boolean} */
    this.repeat = null;
    /** @type {Boolean} */
    this.horizontal = null;
    /** @type {ScrollerThresholdParam|ScrollerThresholdValue|ScrollerThresholdCallback} */
    this.enter = null;
    /** @type {ScrollerThresholdParam|ScrollerThresholdValue|ScrollerThresholdCallback} */
    this.leave = null;
    /** @type {Boolean} */
    this.sync = isEase || isSmooth || !!syncMethods;
    /** @type {EasingFunction} */
    this.syncEase = isEase ? ease : null;
    /** @type {Number} */
    this.syncSmooth = isSmooth
      ? sync === true || isLinear
        ? 1
        : /** @type {Number} */ sync
      : null;
    /** @type {ScrollerCallback|typeof noop} */
    this.onSyncEnter =
      syncMethods && !biDirSync && syncMethods[0] ? syncMethods[0] : noop;
    /** @type {ScrollerCallback|typeof noop} */
    this.onSyncLeave =
      syncMethods && !biDirSync && syncMethods[1] ? syncMethods[1] : noop;
    /** @type {ScrollerCallback|typeof noop} */
    this.onSyncEnterForward =
      syncMethods && biDirSync && syncMethods[0] ? syncMethods[0] : noop;
    /** @type {ScrollerCallback|typeof noop} */
    this.onSyncLeaveForward =
      syncMethods && biDirSync && syncMethods[1] ? syncMethods[1] : noop;
    /** @type {ScrollerCallback|typeof noop} */
    this.onSyncEnterBackward =
      syncMethods && biDirSync && syncMethods[2] ? syncMethods[2] : noop;
    /** @type {ScrollerCallback|typeof noop} */
    this.onSyncLeaveBackward =
      syncMethods && biDirSync && syncMethods[3] ? syncMethods[3] : noop;
    /** @type {ScrollerCallback|typeof noop} */
    this.onEnter = parameters.onEnter || noop;
    /** @type {ScrollerCallback|typeof noop} */
    this.onLeave = parameters.onLeave || noop;
    /** @type {ScrollerCallback|typeof noop} */
    this.onEnterForward = parameters.onEnterForward || noop;
    /** @type {ScrollerCallback|typeof noop} */
    this.onLeaveForward = parameters.onLeaveForward || noop;
    /** @type {ScrollerCallback|typeof noop} */
    this.onEnterBackward = parameters.onEnterBackward || noop;
    /** @type {ScrollerCallback|typeof noop} */
    this.onLeaveBackward = parameters.onLeaveBackward || noop;
    /** @type {ScrollerCallback|typeof noop} */
    this.onUpdate = parameters.onUpdate || noop;
    /** @type {ScrollerCallback|typeof noop} */
    this.onSyncComplete = parameters.onSyncComplete || noop;
    /** @type {Boolean} */
    this.completed = false;
    /** @type {Boolean} */
    this.began = false;
    /** @type {Boolean} */
    this.isInView = false;
    /** @type {Number} */
    this.offset = 0;
    /** @type {Number} */
    this.offsetStart = 0;
    /** @type {Number} */
    this.offsetEnd = 0;
    /** @type {Number} */
    this.distance = 0;
    /** @type {[Number, Number, Number, Number]} */
    this.coords = [0, 0, 0, 0];
    /** @type {HTMLElement} */
    this.debugElement = null;
    /** @type {ScrollerParams} */
    this._params = parameters;
    /** @type {Boolean} */
    this._debug = setValue(parameters.debug, false);
    /** @type {Scroller} */
    this._next = null;
    /** @type {Scroller} */
    this._prev = null;
    addChild(this.container, this);
    // Overrides the linked object after the scroller creation
    const targetPram = this._params ? this._params.target : null;
    requestAnimationFrame(() => {
      this.target = /** @type {HTMLElement} */ targetPram
        ? parseTargets(targetPram)[0] || doc.body
        : this.linked && this.target
        ? this.target
        : doc.body;
      // Only calculate the initial bounds on the next frame in case the linked object is set after the scroller creation
      this.refresh();
      if (this._debug) this.debug();
    });
  }

  /**
   * @param {Tickable} linked
   */
  link(linked) {
    if (linked) {
      // Make sure to pause the linked object in case it's added later
      linked.pause();
      this.linked = linked;
      const params = this._params;
      if (!params || (params && !params.target)) {
        /** @type {HTMLElement} */
        let $linkedTarget;
        if (!isUnd(/** @type {$Animation} */ linked.targets)) {
          $linkedTarget = getAnimationDomTarget(
            /** @type {$Animation} */ linked
          );
        } else {
          forEachChildren(
            /** @type {Timeline} */ linked,
            (/** @type {$Animation} */ child) => {
              if (child.targets && !$linkedTarget) {
                $linkedTarget = getAnimationDomTarget(
                  /** @type {$Animation} */ child
                );
              }
            }
          );
        }
        if ($linkedTarget) {
          this.target = $linkedTarget;
          this.refresh();
        }
      }
    }
  }

  get velocity() {
    return this.container.velocity;
  }

  get backward() {
    return this.horizontal
      ? this.container.backwardX
      : this.container.backwardY;
  }

  get scroll() {
    return this.horizontal ? this.container.scrollX : this.container.scrollY;
  }

  get progress() {
    const p = (this.scroll - this.offsetStart) / this.distance;
    return p === Infinity || isNaN(p) ? 0 : round(clamp(p, 0, 1), 6);
  }

  refresh() {
    const params = this._params;
    this.repeat = setValue(parseFunctionValue(params.repeat, this), true);
    this.horizontal =
      setValue(parseFunctionValue(params.axis, this), "y") === "x";
    this.enter = setValue(parseFunctionValue(params.enter, this), "start end");
    this.leave = setValue(parseFunctionValue(params.leave, this), "end start");
    this.updateBounds();
    this.handleScroll();
  }

  removeDebug() {
    if (this.debugElement) {
      this.debugElement.parentNode.removeChild(this.debugElement);
      this.debugElement = null;
    }
  }

  debug() {
    this.removeDebug();
    const container = this.container;
    const isHori = this.horizontal;
    const $existingDebug = container.element.querySelector(
      ":scope > .animejs-onscroll-debug"
    );
    const $debug = doc.createElement("div");
    const $thresholds = doc.createElement("div");
    const $triggerss = doc.createElement("div");
    const labels = ["target", "target", "enter", "leave"];
    const color = debugColors[this.id % debugColors.length];
    const useWin = container.useWin;
    const containerWidth = useWin ? container.winWidth : container.width;
    const containerHeight = useWin ? container.winHeight : container.height;
    const scrollWidth = container.scrollWidth;
    const scrollHeight = container.scrollHeight;
    const size = 160;
    const offLeft = isHori ? 0 : 10;
    const offTop = isHori ? 10 : 0;
    const half = isHori ? 24 : size / 2;
    const labelHeight = isHori ? half : 15;
    const labelWidth = isHori ? 40 : half;
    const labelSize = isHori ? labelWidth : labelHeight;
    const repeat = isHori ? "repeat-x" : "repeat-y";
    /**
     * @param {Number} v
     * @return {String}
     */
    const gradientOffset = (v) =>
      isHori ? "-1px " + v + "px" : v + "px" + " 0";
    /**
     * @param {String} c
     * @return {String}
     */
    const lineCSS = (c) =>
      `linear-gradient(${isHori ? 90 : 0}deg, ${c} 1px, transparent 1px)`;
    /**
     * @param {String} p
     * @param {Number} l
     * @param {Number} t
     * @param {Number} w
     * @param {Number} h
     * @return {String}
     */
    const baseCSS = (p, l, t, w, h) =>
      `position:${p};left:${l}px;top:${t}px;width:${w}px;height:${h}px;`;
    $debug.style.cssText = `${baseCSS(
      "absolute",
      offLeft,
      offTop,
      isHori ? scrollWidth : size,
      isHori ? size : scrollHeight
    )}
      pointer-events: none;
      z-index: 1000000;
      display: flex;
      flex-direction: ${isHori ? "column" : "row"};
    `;
    $thresholds.style.cssText = `${baseCSS(
      "sticky",
      0,
      0,
      isHori ? containerWidth : half,
      isHori ? half : containerHeight
    )}`;
    if (!$existingDebug) {
      $thresholds.style.cssText += `background:
        ${lineCSS("#A7A7A7")}${gradientOffset(half - 8)} / ${
        isHori ? "10px 8px" : "8px 10px"
      } ${repeat},
        ${lineCSS("#A7A7A7")}${gradientOffset(half - 16)} / ${
        isHori ? "100px 16px" : "16px 100px"
      } ${repeat};
      `;
    }
    $triggerss.style.cssText = `${baseCSS(
      "relative",
      0,
      0,
      isHori ? scrollWidth : half,
      isHori ? half : scrollHeight
    )}`;
    if (!$existingDebug) {
      $triggerss.style.cssText += `background:
        ${lineCSS("#A7A7A7")}${gradientOffset(0)} / ${
        isHori ? "10px 0px" : "0px 10px"
      } ${repeat},
        ${lineCSS("#A7A7A7")}${gradientOffset(0)} / ${
        isHori ? "100px 8px" : "8px 100px"
      } ${repeat};
      `;
    }
    this.coords.forEach((v, i) => {
      const isView = i > 1;
      const value = (isView ? 0 : this.offset) + v;
      const isTail = i % 2;
      const isFirst = value < labelSize;
      const isOver =
        value >
        (isView
          ? isHori
            ? containerWidth
            : containerHeight
          : isHori
          ? scrollWidth
          : scrollHeight) -
          labelSize;
      const isFlip = (!isTail && !isFirst) || isOver;
      const $label = doc.createElement("div");
      const $text = doc.createElement("div");
      const dirProp = isHori
        ? isFlip
          ? "right"
          : "left"
        : isFlip
        ? "bottom"
        : "top";
      const flipOffset = isFlip
        ? isHori
          ? labelWidth
          : labelHeight
        : !isView
        ? 1
        : 0;
      $text.innerHTML = `${labels[i]} ${
        isStr(this._debug) ? this._debug : this.id
      }`;
      $label.style.cssText = `${baseCSS(
        "absolute",
        0,
        0,
        labelWidth,
        labelHeight
      )}
        display: flex;
        flex-direction: ${isHori ? "column" : "row"};
        justify-content: flex-${isView ? "start" : "end"};
        align-items: flex-${isFlip ? "end" : "start"};
        border-${dirProp}: 1px ${isTail ? "solid" : "solid"} ${color};
      `;
      $text.style.cssText = `
        overflow: hidden;
        max-width: ${size / 2 - 20}px;
        height: ${labelHeight};
        margin-${
          isHori ? (isFlip ? "right" : "left") : isFlip ? "bottom" : "top"
        }: -1px;
        padding: 1px;
        font-family: ui-monospace, monospace;
        font-size: 10px;
        text-transform: uppercase;
        line-height: 9px;
        font-weight: bold;
        text-align: ${
          (isHori && isFlip) || (!isHori && !isView) ? "right" : "left"
        };
        white-space: pre;
        text-overflow: ellipsis;
        color: ${isTail ? color : "rgba(0,0,0,.75)"};
        background-color: ${isTail ? "rgba(0,0,0,.65)" : color};
        border: 1px solid ${isTail ? color : "transparent"};
        border-${
          isHori
            ? isFlip
              ? "top-left"
              : "top-right"
            : isFlip
            ? "top-left"
            : "bottom-left"
        }-radius: 3px;
        border-${
          isHori
            ? isFlip
              ? "bottom-left"
              : "bottom-right"
            : isFlip
            ? "top-right"
            : "bottom-right"
        }-radius: 3px;
      `;
      $label.appendChild($text);
      $label.style[isHori ? "left" : "top"] =
        value - flipOffset + (!isFlip && isFirst && !isView ? 1 : 0) + "px";
      (isView ? $thresholds : $triggerss).appendChild($label);
    });
    $debug.appendChild($thresholds);
    $debug.appendChild($triggerss);
    container.element.appendChild($debug);
    if (!$existingDebug) $debug.classList.add("animejs-onscroll-debug");
    this.debugElement = $debug;
  }

  updateBounds() {
    if (this._debug) {
      this.removeDebug();
    }
    let stickys;
    const $target = this.target;
    const container = this.container;
    const isHori = this.horizontal;
    const linked = this.linked;
    let linkedTime;
    let $el = $target;
    let offset = 0;
    if (linked) {
      linkedTime = linked.currentTime;
      linked.seek(0, true);
    }
    while ($el && $el !== container.element && $el !== doc.body) {
      const isSticky =
        getTargetValue($el, "position") === "sticky"
          ? setTargetValues($el, { position: "static" })
          : false;
      offset += (isHori ? $el.offsetLeft : $el.offsetTop) || 0;
      $el = /** @type {HTMLElement} */ $el.offsetParent;
      if (isSticky) {
        if (!stickys) stickys = [];
        stickys.push(isSticky);
      }
    }
    const targetSize = isHori ? $target.offsetWidth : $target.offsetHeight;
    const containerSize = isHori ? container.width : container.height;
    const scrollSize = isHori ? container.scrollWidth : container.scrollHeight;
    const maxScroll = scrollSize - containerSize;
    const enter = this.enter;
    const leave = this.leave;

    /** @type {ScrollerThresholdValue} */
    let enterTarget = "start";
    /** @type {ScrollerThresholdValue} */
    let leaveTarget = "end";
    /** @type {ScrollerThresholdValue} */
    let enterContainer = "end";
    /** @type {ScrollerThresholdValue} */
    let leaveContainer = "start";

    if (isStr(enter)) {
      const splitted = /** @type {String} */ enter.split(" ");
      enterTarget = splitted[0];
      enterContainer = splitted.length > 1 ? splitted[1] : splitted[0];
    } else if (isObj(enter)) {
      const e = /** @type {ScrollerThresholdParam} */ enter;
      if (!isUnd(e.target)) enterTarget = e.target;
      if (!isUnd(e.container)) enterContainer = e.container;
    } else if (isNum(enter)) {
      enterContainer = /** @type {Number} */ enter;
    }

    if (isStr(leave)) {
      const splitted = /** @type {String} */ leave.split(" ");
      leaveTarget = splitted[0];
      leaveContainer = splitted.length > 1 ? splitted[1] : splitted[0];
    } else if (isObj(leave)) {
      const t = /** @type {ScrollerThresholdParam} */ leave;
      if (!isUnd(t.target)) leaveTarget = t.target;
      if (!isUnd(t.container)) leaveContainer = t.container;
    } else if (isNum(leave)) {
      leaveContainer = /** @type {Number} */ leave;
    }

    const parsedEnterTarget = parseBoundValue($target, enterTarget, targetSize);
    const parsedLeaveTarget = parseBoundValue($target, leaveTarget, targetSize);
    const under = parsedEnterTarget + offset - containerSize;
    const over = parsedLeaveTarget + offset - maxScroll;
    const parsedEnterContainer = parseBoundValue(
      $target,
      enterContainer,
      containerSize,
      under,
      over
    );
    const parsedLeaveContainer = parseBoundValue(
      $target,
      leaveContainer,
      containerSize,
      under,
      over
    );
    const offsetStart = parsedEnterTarget + offset - parsedEnterContainer;
    const offsetEnd = parsedLeaveTarget + offset - parsedLeaveContainer;
    const scrollDelta = offsetEnd - offsetStart;
    this.offset = offset;
    this.offsetStart = offsetStart;
    this.offsetEnd = offsetEnd;
    this.distance = scrollDelta <= 0 ? 0 : scrollDelta;
    this.coords = [
      parsedEnterTarget,
      parsedLeaveTarget,
      parsedEnterContainer,
      parsedLeaveContainer,
    ];
    if (stickys) {
      stickys.forEach((sticky) => sticky.revert());
    }
    if (linked) {
      linked.seek(linkedTime, true);
    }
    if (this._debug) {
      this.debug();
    }
  }

  handleScroll() {
    const linked = this.linked;
    const sync = this.sync;
    const syncEase = this.syncEase;
    const syncSmooth = this.syncSmooth;
    const isHori = this.horizontal;
    const container = this.container;
    const scroll = this.scroll;
    const isBefore = scroll <= this.offsetStart;
    const isAfter = scroll >= this.offsetEnd;
    const isInView = !isBefore && !isAfter;
    let hasUpdated = false;
    let syncCompleted = false;
    let p = this.progress;

    if (isBefore && this.began) {
      this.began = false;
    }

    if (p > 0 && !this.began) {
      this.began = true;
    }

    if (linked && (syncEase || syncSmooth)) {
      const ap = linked.progress;
      if (syncSmooth && isNum(syncSmooth)) {
        if (/** @type {Number} */ syncSmooth < 1) {
          const step = 0.0001;
          const snap = ap < p && p === 1 ? step : ap > p && !p ? -step : 0;
          p = round(
            lerp(
              ap,
              p,
              interpolate(0.01, 0.2, /** @type {Number} */ syncSmooth),
              false
            ) + snap,
            6
          );
        }
      } else if (syncEase) {
        p = syncEase(p);
      }
      linked.seek(linked.duration * p);
      hasUpdated = p !== ap;
      syncCompleted = ap === 1;
      if (hasUpdated && !syncCompleted && syncSmooth && ap) {
        container.wakeTicker.restart();
      }
    }

    if (this._debug && this.debugElement) {
      const sticky = isHori ? container.scrollY : container.scrollX;
      this.debugElement.style[isHori ? "top" : "left"] = sticky + 10 + "px";
    }

    if (isInView) {
      hasUpdated = true;
      if (!this.isInView) {
        this.isInView = true;
        this.onSyncEnter(this);
        this.onEnter(this);
        if (this.backward) {
          this.onSyncEnterBackward(this);
          this.onEnterBackward(this);
        } else {
          this.onSyncEnterForward(this);
          this.onEnterForward(this);
        }
      }
    }

    if (!isInView && this.isInView) {
      hasUpdated = true;
    }

    if (hasUpdated) {
      this.onUpdate(this);
    }

    if (!isInView && this.isInView) {
      this.isInView = false;
      this.onSyncLeave(this);
      this.onLeave(this);
      if (this.backward) {
        this.onSyncLeaveBackward(this);
        this.onLeaveBackward(this);
      } else {
        this.onSyncLeaveForward(this);
        this.onLeaveForward(this);
      }
      if (sync && !syncSmooth) {
        syncCompleted = true;
      }
    }

    if (
      p >= 1 &&
      this.began &&
      !this.completed &&
      ((sync && syncCompleted) || !sync)
    ) {
      if (sync) {
        this.onSyncComplete(this);
      }
      this.completed = true;
      if (
        (!this.repeat && !linked) ||
        (!this.repeat && linked && linked.completed)
      ) {
        this.revert();
      }
    }

    if (p < 1 && this.completed) {
      this.completed = false;
    }
  }

  revert() {
    const container = this.container;
    removeChild(container, this);
    container.revert();
    if (this._debug) {
      this.removeDebug();
    }
  }
}

/**
 * @param {ScrollerParams} [parameters={}]
 * @return {Scroller}
 */
export const onScroll = (parameters = {}) => new Scroller(parameters);
