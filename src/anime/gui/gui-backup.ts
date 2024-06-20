import { forEachChildren, addChild } from "../helpers";

import { createTimer, utils } from "../anime";

let parameters;
const animations = { _head: null, _tail: null };
const maxValue = 1e9;

const prefix = "anime-gui-";
const dot = ".";
const classPrefix = dot + prefix;
const sideBarWidth = 160;
const blackColor = "#2E2C2C";
const whiteColor = "#F6F4F2";
const whiteAlpha1Color = "rgba(246, 244, 242, .0275)";
const whiteAlpha2Color = "rgba(246, 244, 242, .05)";
const blackAlpha1Color = "rgba(46, 44, 44, .5)";
const blackAlpha2Color = "rgba(46, 44, 44, .65)";
const blackAlpha3Color = "rgba(46, 44, 44, .9)";

const colors = [
  "#FF4B4B",
  "#FF8F42",
  "#FFC730",
  "#F6FF56",
  "#A4FF4F",
  "#18FF74",
  "#00D672",
  "#3CFFEC",
  "#61C3FF",
  "#5A87FF",
  "#8453E3",
  "#C26EFF",
  "#FB89FB",
];
// const colors = [...Array(32)].map((c, i) => 'hsl(' + Math.round(360 / 32 * i) + ', 88%, 62%)');
const colorLength = colors.length;
const colorIds = {};
let colorIndex = 0;

function msToEm(ms) {
  return ms / 125 + "em";
}

const CSSStyles = `
  .wrapper,
  .wrapper *,
  .wrapper *:before,
  .wrapper *:after {
    box-sizing: border-box;
    display: flex;
    flex-shrink: 0;
  }
  .absolute { position: absolute; }
  .relative { position: relative; }
  .wrapper {
    overflow: hidden;
    position: fixed;
    // left: 0;
    right: 0;
    bottom: 0;
    font-family: sans-serif;
    font-size: 20px;
  }
  .app {
    overflow: auto;
    flex-direction: column;
    width: 100%;
    padding-left: ${sideBarWidth}px;
    padding-bottom: 8px;
    background-color: ${blackColor};
    color: ${whiteColor};
    backface-visibility: hidden;
    background-repeat: repeat-x repeat-y;
    background-position: left calc(${sideBarWidth}px + 8em) bottom 0px;
    background-size: 8em 16px, 4em 10px;
    background-attachment: local;
    background-image: linear-gradient(to right, ${whiteAlpha2Color} 1px, transparent 1px),
                      linear-gradient(to right, ${whiteAlpha2Color} 1px, transparent 1px);
  }
  .scrubber-block {
    position: sticky;
    z-index: 3;
    top: 0;
    align-items: flex-start;
    min-width: calc(100% + ${sideBarWidth}px);
    height: 48px;
    margin-left: -${sideBarWidth}px;
    margin-bottom: 2px;
    padding-top: 4px;
    padding-left: ${sideBarWidth}px;
    background-color: ${blackAlpha3Color};
    backdrop-filter: blur(8px);
    background-repeat: repeat-x;
    background-position: left calc(${sideBarWidth}px + 8em) bottom 0px;
    background-size: 8em 10px, 4em 7px, .2em 4px;
    background-image: linear-gradient(to right, ${whiteColor} 1px, transparent 1px),
                      linear-gradient(to right, ${whiteColor} 1px, transparent 1px),
                      linear-gradient(to right, ${whiteColor} 1px, transparent 1px);
  }
  .scrubber-playhead {
    pointer-events: none;
    position: absolute;
    top: 4px;
    left: 0;
    width: 1px;
    height: calc(var(--app-height) - 4px);
    background: currentColor;
    font-weight: bold;
  }
  .scrubber {
    -webkit-appearance: none;
    width: 100%;
    background: transparent;
    cursor: crosshair;
  }
  .scrubber:focus {
   outline: none;
  }
  .clock-time {
    pointer-events: none;
    position: relative;
    left: 0;
    z-index: 2;
    justify-content: center;
    align-items: center;
    width: 64px;
    height: 32px;
    margin-left: -32px;
    padding-left: 8px;
    padding-right: 8px;
    font-size: 12px;
    border-radius: 10px;
    color: ${blackColor};
    background-color: ${whiteColor};
  }
  .scrubber::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 64px;
    height: 32px;
    border-radius: 10px;
    // background-color: ${whiteColor};
    cursor: grab;
  }
  .scrubber::-webkit-slider-thumb:active {
    cursor: grabbing;
  }
  .scrubber::-webkit-slider-runnable-track {
    -webkit-appearance: none;
    background-color: rgba(255, 255, 255, .025);
    height: 32px;
    border-radius: 10px;
  }
  .time-ruller {
    pointer-events: none;
    opacity: .5;
    position: absolute;
    align-items: center;
    justify-content: center;
    left: calc(${sideBarWidth}px - ${msToEm(500)});
    top: 4px;
    height: 32px;
  }
  .time-ruller-digit {
    justify-content: center;
    align-items: center;
    position: relative;
    width: ${msToEm(1000)};
    height: 1em;
    text-align: center;
  }
  .time-ruller-digit span {
    font-weight: bold;
    font-size: 10px;
  }
  .timeline-block {
    flex-direction: column;
  }
  .animation-block {
    flex-direction: column;
  }
  .iterations-block {
    flex-direction: row;
    align-items: flex-start;
  }
  .iteration-block {
    flex-direction: column;
  }
  .iteration-block.is-reversed {
    transform: scaleX(-1);
  }
  .iteration-block.is-reversed .label-block {
    transform: scaleX(-1);
  }
  .iteration-label {
    position: absolute;
    left: 0;
    top: 0;
    color: currentColor;
    transform: translateX(-100%);
  }
  .iteration-block:not(.is-reversed) .iteration-label {
    left: 0;
    transform: translateX(-100%);
  }
  .iteration-block.is-reversed .iteration-label {
    right: 0;
    transform: translateX(100%);
  }
  .line-block {
    height: 14px;
    margin-top: 1px;
    margin-bottom: 1px;
  }
  .iteration-line-block {
    border-radius: 3px;
    background-color: currentColor;
  }
  .iteration-background-block {
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: ${blackAlpha1Color};
    border-radius: 3px;
  }
  .iteration-delay-block {
    border-radius: 3px 0 0 3px;
  }
  .iteration-duration-block {
    justify-content: space-between;
    background-color: currentColor;
    border-radius: 3px;
  }
  .iteration-endDelay-block {
    border-radius: 0 3px 3px 0;
  }
  .tween-line-block {
    border-radius: 7px;
  }
  .tween-block {
    background-color: currentColor;
    border-radius: 7px;
  }
  .tween-block-item {
    height: 14px;
  }
  .tween-background-block {
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: ${blackAlpha1Color};
    border-radius: 7px;
  }
  .tween-duration-block {
    overflow: hidden;
    justify-content: space-between;
    background-color: currentColor;
    border-radius: 7px;
  }
  .tween-skipped-duration-block {
    top: 0;
    right: 0;
    border-radius: 0px 7px 7px 0px;
    background-image: linear-gradient(45deg, transparent  25%, ${blackAlpha3Color} 25%, ${blackAlpha3Color} 50%, transparent  50%, transparent  75%, ${blackAlpha3Color} 75%, ${blackAlpha3Color} 100%);
    background-size: 3px 3px;
  }
  .label-block {
    pointer-events: none;
    z-index: 1;
    align-items: center;
    height: 100%;
    margin-top: 0px;
    padding-left: 4px;
    padding-right: 4px;
    font-size: 10px;
    font-weight: bold;
    white-space: pre;
    color: ${blackColor};
  }
  .timeline-label-block {
    pointer-events: auto;
    z-index: 1;
    position: absolute;
    top: 1px;
    width: 1px;
    height: 100%;
    min-height: calc(var(--timeline-height) - 1px);
    border-left: 1px solid currentColor;
  }
  .timeline-label-block span {
    opacity: .9;
    margin-top: -1px;
    margin-left: -6px;
    margin-right: 1px;
    font-size: 16px;
    color: ${blackColor};
  }
  .tween-line-block .label-block, .iterations-block .iteration-block:not(:first-child) .label-block {
    opacity: 0;
    // transition: opacity .25s ease-out;
  }
  .tween-line-block .label-block:last-child {
    opacity: .4;
  }
  .animation-block:hover > .iterations-block:first-child .tween-line-block .label-block:last-child {
    opacity: .75;
    transition-duration: 0s;
  }
  .animation-block:hover > .iterations-block:first-child .iteration-line-block .label-block,
  .animation-block:hover > .iterations-block:first-child .tween-line-block:hover .label-block {
    opacity: 1!important;
    transition-duration: 0s;
  }
  .animation-block:before {
    content: "";
    opacity: 0;
    position: absolute;
    left: -${sideBarWidth}px;
    top: 0;
    right: 0;
    bottom: 0;
    background-color: currentColor;
    transition: opacity .25s ease-out;
  }
  .animation-block:hover > .animation-block:hover:before {
    opacity: .075;
    transition-duration: .125s;
  }
  .is-highlighted {
    filter: brightness(1.5);
  }
`;

function prefixCSS(CSS) {
  let prefixed = CSS;
  CSS.match(/\.-?[_a-zA-Z\-]+[\w\-:\[\]]*/gm).forEach(
    (match) =>
      (prefixed = prefixed.replace(match, match.replace(dot, classPrefix)))
  );
  return prefixed;
}

function minifyCSS(CSS) {
  return CSS.replace(/\/\*.*?\*\//g, "").replace(/\s{3,}/g, ""); // Remove comments than remove 3 or more consecutive spaces
}

function addCSS(CSS) {
  const styleEl = document.createElement("style");
  styleEl.setAttribute("id", prefix + "styles");
  styleEl.innerHTML = minifyCSS(prefixCSS(CSS));
  document.head.appendChild(styleEl);
}

function getNextColor() {
  const color = colors[colorIndex++];
  if (colorIndex > colorLength - 1) colorIndex = 0;
  return color;
}

function getColor(id) {
  if (id) {
    const idColor = colorIds[id];
    if (idColor) {
      return idColor;
    } else {
      return (colorIds[id] = getNextColor());
    }
  } else {
    return getNextColor();
  }
}

let targetColors = new Map();

function getTargetColor(target) {
  let color = targetColors.get(target);
  if (!color) {
    color = getColor();
    targetColors.set(target, color);
    // target.style.boxShadow = `0 0 0 4px ${blackColor}, 0 0 0 8px ${color}`;
  }
  return color;
}

function createBlock(className, css) {
  var el = document.createElement("div");
  el.classList.add(prefix + "block");
  if (Array.isArray(className)) {
    for (let i = 0, l = className.length; i < l; i++) {
      el.classList.add(prefix + className[i]);
    }
  } else {
    el.classList.add(prefix + className);
  }
  el.style.cssText = css;
  return el;
}

function createLabel(text, css) {
  const el = createBlock("label-block", css);
  el.innerHTML = text;
  return el;
}

function createTweenBlock(
  offset,
  tween,
  color,
  previousTweenEl,
  animationEl,
  isFirstIteration
) {
  const el = createBlock(["line-block", "tween-line-block", "relative"]);
  const tweenEl = createBlock(["tween-block", "tween-block-item", "relative"]);
  const backgroundEl = createBlock(["tween-background-block", "absolute"]);
  const delayEl = createBlock([
    "tween-delay-block",
    "tween-block-item",
    "relative",
  ]);
  const durationEl = createBlock([
    "tween-duration-block",
    "tween-block-item",
    "relative",
  ]);
  const skippedDurationEl = createBlock([
    "tween-skipped-duration-block",
    "tween-block-item",
    "absolute",
  ]);
  const endDelayEl = createBlock([
    "tween-endDelay-block",
    "tween-block-item",
    "relative",
  ]);
  const idEl = createLabel(
    tween.id,
    `display: flex; justify-content: center; position: absolute; left: 0; right: 0; text-align: center;`
  );
  const fromValueLabelEl = createLabel(
    tween._fromNumbers ? tween._fromNumbers[0] : tween._fromNumber,
    `padding-right: 1px; text-shadow: -1px -1px 0 ${color}, 1px -1px 0 ${color}, -1px 1px 0 ${color}, 1px 1px 0 ${color};`
  );
  const fromToLabelEl = createLabel(
    tween._toNumbers ? tween._toNumbers[0] : tween._toNumber,
    `padding-left: 1px; text-shadow: -1px -1px 0 ${color}, 1px -1px 0 ${color}, -1px 1px 0 ${color}, 1px 1px 0 ${color};`
  );
  tweenEl.setAttribute("data-tween", tween.id);
  if (tween._prevRep)
    tweenEl.setAttribute("data-previous-tween", tween._prevRep.id);
  if (tween._nextRep)
    tweenEl.setAttribute("data-next-tween", tween._nextRep.id);
  if (tween._isOverridden) tweenEl.style.opacity = 0.5;
  durationEl.appendChild(fromValueLabelEl);
  if (parameters.showTweenId) durationEl.appendChild(idEl);
  durationEl.appendChild(fromToLabelEl);
  tweenEl.appendChild(backgroundEl);
  if (tween._delay) {
    delayEl.style.width = msToEm(tween._delay);
    tweenEl.appendChild(delayEl);
  }
  // if (tween._changeDuration) {
  durationEl.style.width = msToEm(tween._updateDuration);
  skippedDurationEl.style.width = msToEm(
    tween._updateDuration - tween._changeDuration
  );
  durationEl.appendChild(skippedDurationEl);
  tweenEl.appendChild(durationEl);
  // }
  if (tween._endDelay) {
    endDelayEl.style.width = msToEm(tween._endDelay);
    tweenEl.appendChild(endDelayEl);
  }
  if (tween._head) {
    tweenEl.style.filter = "saturate(200%)";
    const tweenHeadEl =
      animationEl.querySelector(
        `.${prefix}tween-block[data-tween="${tween._head.id}"]`
      ) || tweenEl;
    tweenHeadEl.style.filter = "saturate(50%)";
  }
  if (!previousTweenEl) {
    if (isFirstIteration) {
      const propertyLabelEl = createLabel(
        tween.property,
        `
        position: absolute;
        left: 0;
        top: 0;
        color: currentColor;
        transform: translateX(-100%)
      `
      );
      tweenEl.appendChild(propertyLabelEl);
    }
    el.appendChild(tweenEl);
    return el;
  } else {
    previousTweenEl.appendChild(tweenEl);
    return previousTweenEl;
  }
}

function createTimelineLabel(labelName, timeStamp, tlOffset, color) {
  const el = createBlock(
    "timeline-label-block",
    `left: ${msToEm(tlOffset + timeStamp)};`
  );
  const label = createLabel(
    "<span>▸</span>" + labelName,
    `
    position: relative;
    top: 2px;
    height: 10px;
    border-radius: 0 5px 5px 0;
    background-color: ${color};
  `
  );
  el.appendChild(label);
  return el;
}

function createIterationBlock(
  animation,
  i,
  iterationsEl,
  color,
  blendedEasingAnimation
) {
  const {
    _direction,
    _iterationChangeStartTime,
    _iterationChangeEndTime,
    _offset,
    labels,
  } = animation;
  const isFirstIteration = !i;
  // const isOdd = i % 2;
  // const isInverted = _direction > 0 && (_direction === 1 || _direction === 2 && isOdd || _direction === 3 && !isOdd);
  const isOdd = i % 2;
  const isInverted = ~~(
    _direction === -1 ||
    (_direction === 2 && isOdd) ||
    (_direction === -2 && !isOdd)
  );
  const iterationEl = createBlock([
    "iteration-block",
    "iteration-block-item",
    "relative",
  ]);
  const iterationLineEl = createBlock([
    "line-block",
    "iteration-line-block",
    "relative",
  ]);
  const backgroundEl = createBlock(["iteration-background-block", "absolute"]);
  const delayEl = createBlock([
    "iteration-delay-block",
    "iteration-block-item",
    "relative",
  ]);
  const durationEl = createBlock([
    "iteration-duration-block",
    "iteration-block-item",
    "relative",
  ]);
  const endDelayEl = createBlock([
    "iteration-endDelay-block",
    "iteration-block-item",
    "relative",
  ]);
  iterationLineEl.appendChild(backgroundEl);
  if (isFirstIteration) {
    const labelPrefix = isNaN(+animation.id)
      ? ""
      : blendedEasingAnimation
      ? "Easing blender "
      : animation._hasChildren
      ? "Timeline "
      : "Animation ";
    const labelEl = createLabel(labelPrefix + animation.id);
    labelEl.classList.add(`${prefix}iteration-label`);
    iterationLineEl.appendChild(labelEl);
  }
  if (_iterationChangeStartTime) {
    delayEl.style.width = msToEm(_iterationChangeStartTime);
    iterationLineEl.appendChild(delayEl);
  }
  const changeDuration = _iterationChangeEndTime - _iterationChangeStartTime;
  if (changeDuration === Infinity || changeDuration === maxValue) {
    // durationEl.style.width = msToEm(changeDuration);
    durationEl.appendChild(
      createLabel("∞", `font-size: 16px; margin-left: auto; margin-right: auto`)
    );
  } else {
    durationEl.style.width = msToEm(changeDuration);
  }
  iterationLineEl.appendChild(durationEl);
  if (_iterationChangeEndTime) {
    endDelayEl.style.width = msToEm(changeDuration - _iterationChangeEndTime);
    iterationLineEl.appendChild(endDelayEl);
  }

  // iterationEl.style.width = `calc(${msToEm(_iterationDuration)} - 1px)`;
  // iterationEl.style.marginRight = '1px';
  iterationEl.style.width = msToEm(getMaxIterationTime(animation));
  iterationEl.appendChild(iterationLineEl);

  if (isInverted) iterationEl.classList.add(`${prefix}is-reversed`);

  if (!animation._hasChildren) {
    let playHeadHeight = 0;
    let currentTarget;
    let currentProperty;
    let currentTargetColor;
    let previousTargetTweenEl;
    forEachChildren(animation, (tween) => {
      const target = tween.target;
      const property = tween.property;
      let hasPreviousTween =
        property === currentProperty && currentTarget === target;
      if (currentTarget !== target) {
        currentTarget = target;
        currentTargetColor = getTargetColor(target);
      }
      const tweenBLockEl = createTweenBlock(
        _offset,
        tween,
        currentTargetColor,
        hasPreviousTween ? previousTargetTweenEl : false,
        iterationsEl,
        isFirstIteration
      );
      previousTargetTweenEl = tweenBLockEl;
      currentProperty = property;
      tweenBLockEl.style.color = currentTargetColor;
      iterationEl.appendChild(tweenBLockEl);
      playHeadHeight++;
    });
  }

  if (labels) {
    for (let labelName in labels) {
      const timelineLabelEl = createTimelineLabel(
        labelName,
        labels[labelName],
        _offset,
        color
      );
      iterationEl.appendChild(timelineLabelEl);
    }
  }

  return iterationEl;
}

function createIterationsBlock(animation, color) {
  const el = createBlock("iterations-block");
  // const iterationCount = 1;
  const iterationCount =
    animation._iterationCount === Infinity ? 1 : animation._iterationCount;
  const visualOffsetMs =
    (animation._iterationChangeStartTime < 0
      ? animation._offset + animation._iterationChangeStartTime
      : animation._offset) - animation._beginDelay;
  for (let i = 0; i < iterationCount; i++) {
    const iterationEl = createIterationBlock(animation, i, el, color);
    if (animation._hasChildren) {
      forEachChildren(animation, (child) => {
        const childAnimationEl = createAnimationBlock(child);
        childAnimationEl.style.marginLeft = msToEm(-visualOffsetMs);
        iterationEl.appendChild(childAnimationEl);
      });
    }
    el.appendChild(iterationEl);
  }
  el.style.marginLeft = msToEm(visualOffsetMs);
  return el;
}

function createAnimationBlock(animation) {
  const color = getColor(animation.id);
  const el = createBlock(["animation-block", "relative"], `color: ${color};`);
  const iterationsBLockEl = createIterationsBlock(animation, color);
  el.setAttribute("data-animation", animation.id);
  el.appendChild(iterationsBLockEl);
  return el;
}

function getMaxIterationTime(animation) {
  // const durationFallBack = 5000; // In case of Infinity everywhere
  // // console.trace(animation);
  // if (animation._iterationDuration !== Infinity) return animation._iterationDuration;
  // if (!animation._hasChildren) return durationFallBack;
  // let maxChildrenDuration = 0;
  // forEachChildren(animation, child => {
  //   const childDur = child._offset + child._iterationDuration;
  //   if (childDur > maxChildrenDuration && childDur !== Infinity) {
  //     maxChildrenDuration = childDur;
  //   }
  // });
  // return maxChildrenDuration ? maxChildrenDuration : durationFallBack;
}

function getAnimationDuration(animation) {
  const { duration, _iterationDuration, _iterationCount } = animation;
  return _iterationCount === Infinity
    ? _iterationDuration
    : duration === Infinity || duration === maxValue
    ? 0
    : duration;
}

function normalizeAnimationTime(animation) {
  const clampAndRoundTime = utils
    .round(2)
    .clamp(parameters.startTime, parameters.endTime);
  const {
    duration,
    currentTime,
    _iterationDuration,
    _iterationCount,
    _iterationTime,
  } = animation;
  const time = clampAndRoundTime(
    _iterationCount === Infinity
      ? _iterationTime
      : duration === Infinity || duration === maxValue
      ? currentTime % _iterationDuration
      : currentTime
  );
  return time;
}

function createScrubberBlock(animation, parentHeight) {
  const scruberTimer = createTimer();
  const animDuration = getAnimationDuration(animation);
  const el = createBlock(
    "scrubber-block",
    `width: calc(${msToEm(animDuration)} + ${sideBarWidth}px);`
  );
  const clockTimeEl = createBlock("clock-time");
  const playHead = createBlock("scrubber-playhead");
  const scrubberEl = document.createElement("input");
  scrubberEl.classList.add(`${prefix}scrubber`);
  scrubberEl.setAttribute("type", "range");
  scrubberEl.setAttribute(
    "step",
    Math.floor((10 / animDuration) * animDuration) / animDuration
  );
  scrubberEl.setAttribute("min", "0");
  scrubberEl.setAttribute("max", "1");
  scrubberEl.setAttribute("value", "0");
  scrubberEl.style.width = `calc(${msToEm(animDuration)} + 64px)`;
  scrubberEl.style.marginLeft = "-32px";

  scrubberEl.onmousedown = function () {
    animation.pause();
    scruberTimer.pause();
  };

  scrubberEl.oninput = function () {
    let newTime = animation._beginDelay + animDuration * scrubberEl.value;

    if (
      animation._iterationCount === Infinity &&
      newTime === animation._iterationDuration
    ) {
      newTime -= 0.000000000001;
    }

    animation.seek(
      utils.round(2).clamp(parameters.startTime, parameters.endTime)(newTime)
    );

    setPlayHeadPosition(normalizeAnimationTime(animation));
  };

  const timeRullerEl = createBlock("time-ruller");

  for (let i = 0; i < 12; i++) {
    const timeRullerDigitEl = createBlock("time-ruller-digit");
    timeRullerDigitEl.innerHTML = `<span>${i}</span>`;
    timeRullerEl.appendChild(timeRullerDigitEl);
  }

  el.appendChild(timeRullerEl);

  // el.style.width = `calc(${sideBarWidth}px + ${msToEm(animation.duration)})`;
  playHead.appendChild(clockTimeEl);
  // el.appendChild(animationTimeEl);
  el.appendChild(playHead);
  el.appendChild(scrubberEl);

  function setPlayHeadPosition(time) {
    playHead.style.transform = `translateX(calc(${sideBarWidth}px + ${msToEm(
      time
    )}))`;
    clockTimeEl.innerHTML = time;
  }

  function updatePlayHeadPosition(animation) {
    const time = normalizeAnimationTime(animation);
    setPlayHeadPosition(time);
    animation.seek(time);
    scrubberEl.value = animation.progress;
    // if (animation._hasChildren) {
    //   forEachChildren(animation, child => {
    //     forEachChildren(child, tween => {
    //       const tweenEl = document.querySelector(`.${prefix}tween-block[data-tween="${tween.id}"]`);
    //       tweenEl.style.color = child._isUpdating && tween._isUpdating ? whiteColor : 'inherit';
    //     });
    //   })
    // }
  }
  scruberTimer.onUpdate = () => {
    updatePlayHeadPosition(animation);
  };
  return { el, timer: scruberTimer };
}

function clearHighlightAnimation(guiWrapperEl) {
  const tweenEls = guiWrapperEl.querySelectorAll(`.${prefix}tween-block`);
  for (let i = 0, l = tweenEls.length; i < l; i++) {
    tweenEls[i].classList.remove(`${prefix}is-highlighted`);
  }
}

function highlightTweenSiblings(guiWrapperEl, tweenEl) {
  clearHighlightAnimation(guiWrapperEl);
  const nextId = tweenEl.getAttribute("data-next-tween");
  const prevId = tweenEl.getAttribute("data-previous-tween");
  if (nextId) {
    const nextTweenEl = guiWrapperEl.querySelector(
      `.${prefix}tween-block[data-tween="${nextId}"]`
    );
    if (nextTweenEl) nextTweenEl.classList.add(`${prefix}is-highlighted`);
  }
  if (prevId) {
    const prevTweenEl = guiWrapperEl.querySelector(
      `.${prefix}tween-block[data-tween="${prevId}"]`
    );
    if (prevTweenEl) prevTweenEl.classList.add(`${prefix}is-highlighted`);
  }
}

function getParameters(value, urlParams, userParams) {
  const fromUrl = urlParams.get(value);
  const fromUser = userParams[value];
  let param = null;
  if (typeof fromUrl !== "undefined") {
    param = fromUrl;
  } else if (typeof fromUser !== "undefined") {
    urlParams.set(value, fromUser);
    param = fromUser;
  }
  if (param === "true") param = true;
  if (param === "false") param = false;
  return param;
}

function parseParameters(userParams = {}) {
  const windowLocationSearch = window.location.search;
  const urlParams = new URLSearchParams(windowLocationSearch);
  return {
    animations: userParams.animations,
    parentEl: userParams.parentEl || document.body,
    highlightTweenSiblings: getParameters(
      "highlightTweenSiblings",
      urlParams,
      userParams
    ),
    showTweenId: getParameters("showTweenId", urlParams, userParams),
    startTime: +getParameters("startTime", urlParams, userParams) || 0,
    endTime: +getParameters("endTime", urlParams, userParams) || Infinity,
  };
}

export function createGUI(userParams = {}) {
  parameters = parseParameters(userParams);
  let width = "100%";
  let height = "52vh";
  let isPaused = true;
  const guiWrapperEl = createBlock(
    "wrapper",
    `
    --app-height: ${height};
    --timeline-height: calc(${height} - 50px);
    width: ${width};
    height: ${height};
  `
  );

  addCSS(CSSStyles);
  const guiAppEl = createBlock("app");
  const Anime = AnimeJS[AnimeJS.length - 1];
  const scrubbers = [];

  setTimeout(() => {
    console.log(parameters.parentEl);
    if (!AnimeJS[0].engine._head) return;
    addChild(animations, AnimeJS[0].engine._head);
    forEachChildren(animations, (animation) => {
      animation.pause();
      animation.seek(parameters.startTime);
      animation.play();
      const scrubber = createScrubberBlock(animation, height);
      const timelineBlockEl = createAnimationBlock(animation, height);
      scrubbers.push(scrubber);
      guiAppEl.appendChild(scrubber.el);
      guiAppEl.appendChild(timelineBlockEl);
    });

    guiWrapperEl.appendChild(guiAppEl);
    parameters.parentEl.appendChild(guiWrapperEl);
    parameters.parentEl.style.paddingBottom = height;
    const tweenEls = guiWrapperEl.querySelectorAll(`.${prefix}tween-block`);
    if (parameters.highlightTweenSiblings) {
      for (let i = 0, l = tweenEls.length; i < l; i++) {
        const tweenEl = tweenEls[i];
        tweenEl.addEventListener("mouseenter", () => {
          highlightTweenSiblings(guiWrapperEl, tweenEl);
        });
        tweenEl.addEventListener("mouseleave", () => {
          highlightTweenSiblings(guiWrapperEl, tweenEl);
        });
      }
    }
  }, 10);

  window.addEventListener("keydown", (e) => {
    if (e.code == "Space") {
      e.preventDefault();
      isPaused = !isPaused;
      forEachChildren(animations, (animation) => {
        if (animation.paused) {
          animation.play();
          scrubbers.forEach((scrubber) => scrubber.timer.play());
        } else {
          animation.pause();
          scrubbers.forEach((scrubber) => scrubber.timer.pause());
        }
      });
    }
  });

  if (window.location === window.parent.location) {
    // document.write('<!DOCTYPE html><html><head><meta charset="utf-8"><title>Responsive Design Testing</title><style>body %7B margin: 20px; font-family: sans-serif; overflow-x: scroll; %7D.wrapper %7B width: 6000px; %7D.frame %7B float: left; %7Dh2 %7B margin: 0 0 5px 0; %7Diframe %7B margin: 0 20px 20px 0; border: 1px solid %23666; %7D</style></head><body><div class="wrapper"><div class="frame"><h2>240<span> x 320</span> <small>(mobile)</small></h2><iframe src="' + window.location + '" sandbox="allow-same-origin allow-forms" seamless width="240" height="320"></iframe></div><div class="frame"><h2>320<span> x 480</span> <small>(mobile)</small></h2><iframe src="' + window.location + '" sandbox="allow-same-origin allow-forms" seamless width="320" height="480"></iframe></div><div class="frame"><h2>480<span> x 640</span> <small>(small tablet)</small></h2><iframe src="' + window.location + '" sandbox="allow-same-origin allow-forms" seamless width="480" height="640"></iframe></div><div class="frame"><h2>768<span> x 1024</span> <small>(tablet - portrait)</small></h2><iframe src="' + window.location + '" sandbox="allow-same-origin allow-forms" seamless width="768" height="1024"></iframe></div><div class="frame"><h2>1024<span> x 768</span> <small>(tablet - landscape)</small></h2><iframe src="' + window.location + '" sandbox="allow-same-origin allow-forms" seamless width="1024" height="768"></iframe></div><div class="frame"><h2>1200<span> x 800</span> <small>(desktop)</small></h2><iframe src="' + window.location + '" sandbox="allow-same-origin allow-forms" seamless width="1200" height="800"></iframe></div></div></body></html>')
    // document.documentElement.innerHTML = '<!DOCTYPE html><html><head><meta charset="utf-8"><title>' + document.title + '</title><style>iframe { resize: both; overflow: auto; }</style></head><body><iframe src="' + window.location + '" sandbox="allow-same-origin allow-scripts allow-popups allow-forms" seamless width="240" height="320"></iframe></body></html>'
  }
}
