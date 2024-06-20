import { minValue, maxValue } from "../consts";

import { isNil, forEachChildren } from "../helpers";

import { animate, createTimeline, utils, svg } from "../anime";

import {
  instances,
  getActiveInstance,
  parameters,
  parseParameters,
  setParameter,
} from "./parameters";

import { msToEm, prefix, appendStyles } from "./css";

import { sideBarWidth, toolbarHeight } from "./consts";

import { getIconCode, createBlock, initDOM } from "./dom";

import { getColor } from "./colors";

import { styles } from "./styles";

const dom = initDOM();
const targetsIdMap = new Map();
const idsTargetMap = new Map();

let targetId = 0;

function registerTarget($target) {
  const id = targetsIdMap.get($target);
  if (id !== undefined) {
    return id;
  } else {
    targetsIdMap.set($target, ++targetId);
    idsTargetMap.set(targetId, $target);
    return targetId;
  }
}

function highlightTarget(targetId, color) {
  const $target = idsTargetMap.get(targetId);
  if (!$target) return;
  const { left, top, width, height } = $target.getBoundingClientRect();
  if (width + height === 0) return;
  let $highlight = utils.$(`.${prefix}highlight.${prefix}${targetId}`)[0];
  if (!$highlight) {
    $highlight = createBlock(["highlight", targetId]);
    document.body.appendChild($highlight);
  }
  utils.set($highlight, { left, top, width, height, opacity: 1, color: color });
}

function clearHighlight() {
  utils.$(`.${prefix}highlight`).forEach(($highlight) => $highlight.remove());
}

function createLabel(text, css) {
  const el = createBlock("label-block", css);
  el.innerHTML = text;
  return el;
}

function createTweenBlock(
  tween,
  previousTweenEl,
  animationEl,
  isFirstIteration
) {
  const el = createBlock(["line-block", "tween-line-block"]);
  const tweenEl = createBlock(["tween-block"]);
  const backgroundEl = createBlock(["tween-background-block"]);
  const delayEl = createBlock(["tween-delay-block", "tween-block-item"]);
  const durationEl = createBlock(["tween-duration-block", "tween-block-item"]);
  const skippedDurationEl = createBlock([
    "tween-skipped-duration-block",
    "tween-block-item",
  ]);
  const fromValueLabelEl = createLabel(
    tween._fromNumbers ? tween._fromNumbers[0] : tween._fromNumber,
    `padding-right: 1px;`
  );
  const fromToLabelEl = createLabel(
    tween._toNumbers ? tween._toNumbers[0] : tween._toNumber,
    `padding-left: 1px;`
  );
  tweenEl.setAttribute("data-tween", tween.id);
  if (tween._prevRep)
    tweenEl.setAttribute("data-previous-tween", tween._prevRep.id);
  if (tween._nextRep)
    tweenEl.setAttribute("data-next-tween", tween._nextRep.id);
  if (tween._isOverridden) tweenEl.style.opacity = `${0.5}`;
  durationEl.appendChild(fromValueLabelEl);
  if (parameters.showTweenId)
    durationEl.appendChild(
      createLabel(
        tween.id,
        `justify-content: center; position: absolute; left: 0; right: 0; text-align: center;`
      )
    );
  durationEl.appendChild(fromToLabelEl);
  tweenEl.appendChild(backgroundEl);
  // const tweenDelay = (tween.parent._offset + tween._startTime) - tween._absoluteStartTime;
  const tweenDelay = tween._delay;
  if (tweenDelay || tween.parent._delay) {
    delayEl.style.width = msToEm(
      previousTweenEl ? tweenDelay : tween.parent._delay + tweenDelay
    );
    tweenEl.appendChild(delayEl);
  }
  // if (tween._changeDuration) {
  durationEl.style.width = msToEm(tween._updateDuration);
  if (tween._updateDuration <= minValue) {
    durationEl.style.width = msToEm(10);
  }
  skippedDurationEl.style.width = msToEm(
    tween._updateDuration - tween._changeDuration
  );
  durationEl.appendChild(skippedDurationEl);
  tweenEl.appendChild(durationEl);
  // }
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
      const propertyLabelEl = createLabel(tween.property + "—");
      tweenEl.appendChild(propertyLabelEl);
    }
    el.appendChild(tweenEl);
    return el;
  } else {
    previousTweenEl.appendChild(tweenEl);
    return previousTweenEl;
  }
}

function createTimelineLabel(labels, name, tlOffset) {
  const startTime = tlOffset + labels[name];
  const el = createBlock("tl-label-block", `left: ${msToEm(startTime)};`);
  el.dataset.startTime = startTime;
  el.appendChild(createLabel(name));
  return el;
}

function createIterationBlock(animation, i, iterationsEl, color, $tlScrubber) {
  const {
    _reversed,
    _alternate,
    _delay,
    _loopDelay,
    _iterationDuration,
    _offset,
    labels,
  } = animation;
  const isFirstIteration = !i;
  // const isOdd = i % 2;
  // const isInverted = _direction > 0 && (_direction === 1 || _direction === 2 && isOdd || _direction === 3 && !isOdd);
  const isOdd = i % 2;
  // const isInverted = ~~(_direction === -1 || _direction === 2 && isOdd || _direction === -2 && !isOdd);
  const isReversed = _reversed ^ (_alternate && isOdd);
  const iterationEl = createBlock(["iteration-block", "iteration-block-item"]);
  const iterationLineEl = createBlock(["line-block", "iteration-line-block"]);
  const backgroundEl = createBlock(["iteration-background-block"]);
  const delayEl = createBlock([
    "iteration-delay-block",
    "iteration-block-item",
  ]);
  const durationEl = createBlock([
    "iteration-duration-block",
    "iteration-block-item",
  ]);
  const loopDelayEl = createBlock([
    "iteration-loopDelay-block",
    "iteration-block-item",
  ]);
  iterationLineEl.appendChild(backgroundEl);
  if (isFirstIteration) {
    const labelPrefix = isNaN(+animation.id)
      ? ""
      : animation._hasChildren
      ? "Timeline "
      : "Animation ";
    const labelEl = createLabel(labelPrefix + animation.id + "—");
    iterationLineEl.appendChild(labelEl);
  }
  if (_delay) {
    delayEl.style.width = msToEm(_delay);
    iterationLineEl.appendChild(delayEl);
  }
  const isSet = _iterationDuration <= minValue;
  // TODO: REMOVE?
  if (_iterationDuration === Infinity || _iterationDuration === maxValue) {
    // durationEl.style.width = msToEm(_iterationDuration);
    durationEl.appendChild(
      createLabel(
        "∞",
        `
      font-size: 16px;
      margin-left: auto;
      margin-right: auto;
    `
      )
    );
  } else if (isSet) {
    durationEl.style.width = msToEm(10);
  } else {
    durationEl.style.width = msToEm(_iterationDuration);
  }
  iterationLineEl.appendChild(durationEl);
  if (_loopDelay) {
    loopDelayEl.style.width = msToEm(_loopDelay);
    iterationLineEl.appendChild(loopDelayEl);
  }

  if (isSet) {
    iterationEl.style.width = msToEm(10);
  } else {
    iterationEl.style.width = msToEm(
      animation._iterationDuration + animation._loopDelay
    );
  }

  // if (!animation._hasChildren) {
  //   iterationEl.appendChild(iterationLineEl);
  // }

  iterationEl.appendChild(iterationLineEl);

  if (isReversed) {
    iterationEl.classList.add(`${prefix}is-reversed`);
  }

  if (!animation._hasChildren) {
    let playHeadHeight = 0;
    let currentTarget;
    let currentProperty;
    let previousTargetTweenEl;
    forEachChildren(animation, (tween) => {
      const target = tween.target;
      const property = tween.property;
      let hasPreviousTween =
        property === currentProperty && currentTarget === target;
      if (currentTarget !== target) {
        currentTarget = target;
      }
      const tweenBLockEl = createTweenBlock(
        tween,
        hasPreviousTween ? previousTargetTweenEl : false,
        iterationsEl,
        isFirstIteration
      );
      previousTargetTweenEl = tweenBLockEl;
      currentProperty = property;
      tweenBLockEl.dataset.color = color;
      tweenBLockEl.dataset.targetId = registerTarget(target);
      iterationEl.appendChild(tweenBLockEl);
      playHeadHeight++;
    });
  }

  if (labels) {
    for (let name in labels) {
      const timelineLabelEl = createTimelineLabel(labels, name, _offset);
      $tlScrubber.appendChild(timelineLabelEl);
    }
  }

  return iterationEl;
}

function createIterationsBlock(animation, color) {
  const { $tlScrubber } = dom;
  const $el = createBlock("iterations-block");
  // const iterationCount = 1;
  const iterationCount =
    animation._iterationCount === Infinity ? 1 : animation._iterationCount;
  const visualOffsetMs = animation._offset;
  for (let i = 0; i < iterationCount; i++) {
    const iterationEl = createIterationBlock(
      animation,
      i,
      $el,
      color,
      $tlScrubber
    );
    if (animation._hasChildren) {
      forEachChildren(animation, (child) => {
        // Do not display tl.set() animations
        // if (child.duration > 1) {
        const childAnimationEl = createAnimationBlock(child, $tlScrubber);
        childAnimationEl.style.marginLeft = msToEm(-visualOffsetMs);
        iterationEl.appendChild(childAnimationEl);
        // }
      });
    }
    $el.appendChild(iterationEl);
  }
  $el.style.marginLeft = msToEm(visualOffsetMs);
  $el.dataset.startTime = visualOffsetMs;
  $el.dataset.endTime = visualOffsetMs + animation.duration;
  $el.dataset.color = color;
  return $el;
}

function createAnimationBlock(animation) {
  const color = getColor(animation.id);
  const el = createBlock("animation-block", `color: ${color};`);
  const iterationsBLockEl = createIterationsBlock(animation, color);
  el.setAttribute("data-animation", animation.id);
  el.appendChild(iterationsBLockEl);
  return el;
}

function clearHighlightTweens() {
  const $tweens = dom.$wrapper.querySelectorAll(`.${prefix}tween-block`);
  for (let i = 0, l = $tweens.length; i < l; i++) {
    $tweens[i].classList.remove(`${prefix}is-highlighted`);
  }
}

function highlightSiblings($tween) {
  clearHighlightTweens();
  const nextId = $tween.getAttribute("data-next-tween");
  const prevId = $tween.getAttribute("data-previous-tween");
  if (nextId) {
    const $nextTween = dom.$wrapper.querySelector(
      `.${prefix}tween-block[data-tween="${nextId}"]`
    );
    if ($nextTween) $nextTween.classList.add(`${prefix}is-highlighted`);
  }
  if (prevId) {
    const $prevTween = dom.$wrapper.querySelector(
      `.${prefix}tween-block[data-tween="${prevId}"]`
    );
    if ($prevTween) $prevTween.classList.add(`${prefix}is-highlighted`);
  }
}

function updateCurrentTimeParam() {
  const activeInstance = getActiveInstance();
  setParameter("time", utils.round(activeInstance.currentTime, 0));
}

function generateScrubberTL(progressAnimation) {
  const activeInstance = getActiveInstance();
  const { duration } = activeInstance;
  const { clamped } = parameters;
  const scrubberDuration = clamped
    ? parameters.endTime - parameters.startTime
    : duration;
  const scrubberStart = clamped ? parameters.startTime : 0;
  const scrubberEnd = clamped ? parameters.endTime : duration;
  const minProgress = clamped ? scrubberStart / duration : 0;
  const maxProgress = clamped ? scrubberEnd / duration : 1;

  const tl = createTimeline({
    autoplay: false,
    onBegin: () => setPlaybackStatus(false),
    onComplete: () => setPlaybackStatus(true),
    playbackRate: parameters.speed,
    loop: parameters.loop,
    defaults: {
      duration: scrubberDuration,
      ease: "linear",
    },
  })
    .add(
      {
        frameRate: 1,
        duration: scrubberDuration,
        onUpdate: updateCurrentTimeParam,
      },
      0
    )
    .add(
      [activeInstance, progressAnimation],
      {
        progress: [minProgress, maxProgress],
        // onUpdate: () => {
        //   console.log(activeInstance.progress, progressAnimation.progress);
        // }
      },
      0
    )
    .add(
      `.${prefix}time-scrubber`,
      {
        value: [minProgress, maxProgress],
      },
      0
    )
    .add(
      dom.$currentTime,
      {
        innerHTML: [scrubberStart, scrubberEnd],
        modifier: utils.round(0),
      },
      0
    )
    .add(
      dom.$currentTimeShadow,
      {
        innerHTML: [scrubberStart, scrubberEnd],
        modifier: utils.round(0).padStart(6, "0"),
      },
      0
    );

  return tl.seek(parameters.time);
}

function createMMMap($tlBlock, duration, loopDelay) {
  const $map = createBlock("mm-tl");
  const $tlIterationsBlock = $tlBlock.querySelector(
    `:scope > .${prefix}iterations-block`
  );
  const $tlIterationBlocks = $tlIterationsBlock.querySelectorAll(
    `:scope > .${prefix}iteration-block`
  );
  const totalIterations = $tlIterationBlocks.length;
  const iterationTotalDuration = (duration + loopDelay) / totalIterations;
  const loopDelayScale =
    (iterationTotalDuration / (duration / totalIterations)) * 100;
  const iterationLoopDelayPercent =
    (loopDelay * totalIterations) / (duration + loopDelay);
  const iterationDurationPercent = 1 - iterationLoopDelayPercent;

  $tlIterationBlocks.forEach(($iterationBlock, i) => {
    const $tlIterationsBlocks = $iterationBlock.querySelectorAll(
      `.${prefix}iterations-block`
    );
    const isReversed = $iterationBlock.classList.contains(
      `${prefix}is-reversed`
    );
    const $mmScroll = createBlock(
      "mm-tl-scroll",
      `
      width: ${(iterationDurationPercent / totalIterations) * loopDelayScale}%;
      margin-right: ${
        totalIterations - 1 === i
          ? 0
          : (iterationLoopDelayPercent / totalIterations) * loopDelayScale
      }%;
      transform: scaleX(${isReversed ? -1 : 1});
    `
    );
    const $iterationEl = createBlock(
      "mm-tl-line",
      `
      left: 0%;
      width: 100%;
      color: ${$tlIterationsBlock.dataset.color};
    `
    );
    $mmScroll.appendChild($iterationEl);
    $tlIterationsBlocks.forEach(($block) => {
      const startTime =
        (+$block.dataset.startTime /
          (duration - loopDelay * (totalIterations - 1))) *
        totalIterations *
        100;
      const endTime =
        (+$block.dataset.endTime /
          (duration - loopDelay * (totalIterations - 1))) *
        totalIterations *
        100;
      const $el = createBlock(
        "mm-tl-line",
        `
        left: ${startTime}%;
        width: ${endTime - startTime}%;
        color: ${$block.dataset.color};
      `
      );
      $mmScroll.appendChild($el);
    });
    $map.appendChild($mmScroll);
  });
  return $map;
}

function cteateTimeRuller(duration) {
  const $timeRuller = createBlock(
    ["time-ruller", "ruller-bg"],
    `
    width: ${msToEm(duration)}
  `
  );

  for (let i = 0, l = utils.round(duration / 500, 0) + 1; i < l; i++) {
    const timeRullerDigitEl = createBlock("time-ruller-digit");
    timeRullerDigitEl.innerHTML = `<span>${i / 2}</span>`;
    $timeRuller.appendChild(timeRullerDigitEl);
  }

  return $timeRuller;
}

function renderTL() {
  const activeInstance = getActiveInstance();
  const { $tl, $mmScrubber, $tlScrubber, $totalDuration } = dom;
  let duration = activeInstance.duration;
  // TODO: REMOVE?
  if (duration === maxValue) {
    duration = activeInstance._iterationDuration;
  }
  const $tlBlock = createAnimationBlock(activeInstance);
  const $timeRuller = cteateTimeRuller(duration);
  const $mmMap = createMMMap($tlBlock, duration, activeInstance._loopDelay);

  $tlScrubber.appendChild($timeRuller);
  $tl.appendChild($tlBlock);
  $mmScrubber.appendChild($mmMap);

  utils.set(`.${prefix}scrubber`, { step: utils.round(1 / duration, 8) });
  utils.set($tl, { width: `calc(${msToEm(duration)} + ${sideBarWidth}px)` });
  utils.set($totalDuration, { innerHTML: `${duration}<br>ms` });
  utils.set(`.${prefix}toggle-button svg`, {
    rotate: parameters.minified !== false ? 0 : 180,
  });

  // Events

  const $iterationLines = $tlBlock.querySelectorAll(
    `.${prefix}iteration-line-block`
  );
  const $tweenLines = $tlBlock.querySelectorAll(`.${prefix}tween-line-block`);
  const $tweens = $tlBlock.querySelectorAll(`.${prefix}tween-block`);

  $iterationLines.forEach(($iterationLine) => {
    $iterationLine.onmouseenter = () => {
      const $tweenLines = $iterationLine.parentNode.querySelectorAll(
        `.${prefix}tween-line-block`
      );
      $tweenLines.forEach(($tweenLine) => {
        const iterationColor = utils.get($tweenLine.parentNode, "color");
        highlightTarget(+$tweenLine.dataset.targetId, iterationColor);
      });
    };
    $iterationLine.onmouseleave = clearHighlight;
  });

  $tweenLines.forEach(($tweenLine) => {
    const { targetId, color } = $tweenLine.dataset;
    $tweenLine.onmouseenter = () => highlightTarget(+targetId, color);
    $tweenLine.onmouseleave = clearHighlight;
  });

  if (parameters.highlightSiblings) {
    for (let i = 0, l = $tweens.length; i < l; i++) {
      const $tween = $tweens[i];
      $tween.onmouseenter = () => highlightSiblings($tween);
      $tween.onmouseleave = () => highlightSiblings($tween);
    }
  }

  return $tlBlock;
}

function appendDOM($wrapper) {
  utils.set(parameters.$container, {
    "--anime-gui-height": `${parameters.height}px`,
    "--anime-gui-tl-height": `calc(var(--anime-gui-height) - ${toolbarHeight}px)`,
    paddingBottom: "var(--anime-gui-height)",
  });
  parameters.$container.appendChild($wrapper);
}

let wrapperWasOpen;

function setWrapperSize(newH) {
  const height = utils.clamp(toolbarHeight, window.innerHeight).round(0)(newH);
  const isOpen = height > toolbarHeight;
  setParameter("height", height);
  utils.set(parameters.$container, { "--anime-gui-height": height + "px" });
  if (wrapperWasOpen !== isOpen) {
    animate(`.${prefix}toggle-button svg`, {
      rotate: !wrapperWasOpen ? 180 : 0,
      duration: 250,
    });
  }
  wrapperWasOpen = isOpen;
}

function resizeSrubberRange(duration) {
  const { startTime, endTime } = parameters;
  utils.set(dom.$mmBox, {
    left: `calc(${(startTime / duration) * 100}% - 3px)`,
    right: `calc(${((duration - endTime) / duration) * 100}% - 3px)`,
    modifier: utils.round(1),
  });
}

function setPlaybackStatus(paused) {
  const playbackMode = paused ? "play" : "pause";
  const classMode = paused ? "remove" : "add";
  utils.set(`.${prefix}playback-button`, {
    innerHTML: getIconCode(playbackMode),
  });
  document.body.classList[classMode](`${prefix}is-playing`);
  updateCurrentTimeParam();
}

function togglePlayback(scrubberTL) {
  const { paused } = scrubberTL;
  scrubberTL[paused ? "play" : "pause"]();
  setPlaybackStatus(!paused);
}

export function inspect(instance, userParams = {}) {
  instance.pause();
  if (instance._iterationCount === Infinity) {
    instance._iterationCount = 1;
    instance.duration = instance._iterationDuration;
    parameters.loop = true;
  }
  parseParameters(userParams);
  instances.push(instance);
  const { height } = parameters;
  if (isNil(parameters.endTime)) parameters.endTime = instance.duration;
  if (isNil(parameters.active)) parameters.active = instances.length - 1;
  if (isNil(parameters.minified))
    parameters.minified = height === toolbarHeight ? false : height;
  dom.$speedButton.value = parameters.speed;

  appendStyles(styles);
  appendDOM(dom.$wrapper);
  renderTL();

  const progressAnimation = animate(
    svg.createDrawable(`.${prefix}progress-circle path`),
    {
      draw: "0 1",
      ease: "linear",
      autoplay: false,
    }
  );

  let scrubberTL = generateScrubberTL(progressAnimation);

  function updateClamp() {
    const { clamped } = parameters;
    const { paused } = scrubberTL;
    const { currentTime } = instance;
    const className = clamped ? "add" : "remove";
    dom.$clampButton.classList[className](`${prefix}is-active`);
    dom.$wrapper.classList[className](`${prefix}is-clamped`);
    scrubberTL.cancel();
    scrubberTL = generateScrubberTL(progressAnimation);
    scrubberTL.pause().seek(clamped ? 0 : currentTime);
    if (!paused) scrubberTL.play();
  }

  function toggleClamp() {
    parameters.clamped = !parameters.clamped;
    setParameter("clamped", parameters.clamped);
    updateClamp();
  }

  setPlaybackStatus(scrubberTL.paused);
  updateClamp();

  function updateTimeScrubberValue(timeValue, duration) {
    clearHighlight();
    updateCurrentTimeParam();
    const minProgress = parameters.clamped
      ? parameters.startTime / duration
      : 0;
    const maxProgress = parameters.clamped ? parameters.endTime / duration : 1;
    const value = utils.clamp(timeValue, minProgress, maxProgress);
    utils.set(`.${prefix}time-scrubber`, { value });
    scrubberTL.completed = false;
    scrubberTL.progress = utils.mapRange(value, minProgress, maxProgress, 0, 1);
  }

  function seekToRange(startTime, endTime) {
    if (parameters.clamped) {
      setParameter("startTime", startTime);
      setParameter("endTime", endTime);
      scrubberTL.cancel();
      scrubberTL = generateScrubberTL(progressAnimation);
      createTimeline({
        defaults: { duration: 250, ease: "out(3)", composition: "add" },
      })
        .add(
          `.${prefix}min-scrubber`,
          { value: startTime / instance.duration },
          0
        )
        .add(
          `.${prefix}max-scrubber`,
          { value: endTime / instance.duration },
          0
        )
        .add(
          dom.$mmBox,
          {
            left: `calc(${(startTime / instance.duration) * 100}% - 3px)`,
            right: `calc(${
              ((instance.duration - endTime) / instance.duration) * 100
            }% - 3px)`,
            modifier: utils.round(1),
          },
          0
        );
      updateTimeScrubberValue(startTime, instance.duration);
      resizeSrubberRange(instance.duration);
      scrubberTL.play();
    } else {
      scrubberTL.pause().seek(startTime).play();
    }
  }

  const $timeScrubbers = utils.$(`.${prefix}time-scrubber`);
  const $minScrubbers = utils.$(`.${prefix}min-scrubber`);
  const $maxScrubbers = utils.$(`.${prefix}max-scrubber`);

  utils.set($timeScrubbers, { value: parameters.time / instance.duration });
  utils.set($minScrubbers, { value: parameters.startTime / instance.duration });
  utils.set($maxScrubbers, { value: parameters.endTime / instance.duration });

  resizeSrubberRange(instance.duration);

  $timeScrubbers.forEach(($timeScrubber) => {
    $timeScrubber.onmousedown = () => {
      scrubberTL.pause();
      setPlaybackStatus(scrubberTL.paused);
    };
    $timeScrubber.oninput = () =>
      updateTimeScrubberValue($timeScrubber.value, instance.duration);
  });

  const onMinScrubberInput = function () {
    const startTime = utils.clamp(0, parameters.endTime).round(0)(
      this.value * instance.duration
    );
    setParameter("startTime", startTime);
    scrubberTL.cancel();
    scrubberTL = generateScrubberTL(progressAnimation);
    scrubberTL.pause().seek(0);
    setPlaybackStatus(scrubberTL.paused);
    utils.set($minScrubbers, { value: startTime / instance.duration });
    resizeSrubberRange(instance.duration);
  };

  const onMaxScrubberInput = function () {
    const endTime = utils
      .clamp(parameters.startTime, instance.duration)
      .round(0)(this.value * instance.duration);
    setParameter("endTime", endTime);
    scrubberTL.cancel();
    scrubberTL = generateScrubberTL(progressAnimation);
    scrubberTL.pause().seek(scrubberTL.duration);
    setPlaybackStatus(scrubberTL.paused);
    utils.set($maxScrubbers, { value: endTime / instance.duration });
    resizeSrubberRange(instance.duration);
  };

  $minScrubbers.forEach(
    ($scrubber) => ($scrubber.oninput = onMinScrubberInput)
  );
  $maxScrubbers.forEach(
    ($scrubber) => ($scrubber.oninput = onMaxScrubberInput)
  );

  dom.$speedButton.addEventListener("change", () => {
    const speed = dom.$speedButton.value;
    setParameter("speed", dom.$speedButton.value);
    scrubberTL.playbackRate = speed;
  });

  window.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
      e.preventDefault();
      togglePlayback(scrubberTL);
    }
    if (e.code === "KeyB") {
      scrubberTL.progress = 0;
    }
    if (e.code === "KeyR") {
      scrubberTL.progress = 0;
      scrubberTL.play();
    }
  });

  document.addEventListener("click", (e) => {
    const $closestIterationsBlock = e.target.closest(
      `.${prefix}iterations-block`
    );
    if ($closestIterationsBlock) {
      const startTime = utils.round(
        $closestIterationsBlock.dataset.startTime,
        0
      );
      const endTime = utils.round($closestIterationsBlock.dataset.endTime, 0);
      seekToRange(startTime, endTime);
    }
    const $closestTlLabelBlock = e.target.closest(`.${prefix}tl-label-block`);
    if ($closestTlLabelBlock) {
      const $nextSlibling = $closestTlLabelBlock.nextElementSibling
        ? $closestTlLabelBlock.nextElementSibling.matches(
            `.${prefix}tl-label-block`
          )
          ? $closestTlLabelBlock.nextElementSibling
          : null
        : null;
      const startTime = utils.round($closestTlLabelBlock.dataset.startTime, 0);
      const endTime = $nextSlibling
        ? utils.round($nextSlibling.dataset.startTime, 0)
        : parameters.endTime <= startTime
        ? instance.duration
        : parameters.endTime;
      seekToRange(startTime, endTime);
    }
    const $closestToggleButton = e.target.closest(`.${prefix}toggle-button`);
    if ($closestToggleButton) {
      const isOpen = parameters.minified === false;
      createTimeline({
        onRender: () => setWrapperSize(parameters.height),
        defaults: { duration: 350, ease: "out(4)" },
      }).add(
        parameters,
        { height: isOpen ? toolbarHeight : parameters.minified },
        0
      );
      setParameter("minified", isOpen ? parameters.height : false);
    }
    const $closestPlaybackButton = e.target.closest(
      `.${prefix}playback-button`
    );
    if ($closestPlaybackButton) {
      togglePlayback(scrubberTL);
    }
    const $closestBackButton = e.target.closest(`.${prefix}back-button`);
    if ($closestBackButton) {
      scrubberTL.progress = 0;
    }
    const $closestClampButton = e.target.closest(`.${prefix}clamp-button`);
    if ($closestClampButton) {
      toggleClamp();
    }
  });

  dom.$tlWrapper.scrollLeft = parameters.scrollX;
  dom.$tlWrapper.scrollTop = parameters.scrollY;

  dom.$tlWrapper.addEventListener("scroll", () => {
    setParameter("scrollX", dom.$tlWrapper.scrollLeft);
    setParameter("scrollY", dom.$tlWrapper.scrollTop);
  });

  // Resize

  let startY = 0;
  let startHeight = window.innerHeight;

  function resizeWrapper(diffY) {
    const newH = parameters.height + diffY;
    setWrapperSize(newH);
    setParameter(
      "minified",
      newH > toolbarHeight ? false : utils.round(window.innerHeight * 0.33, 0)
    );
  }

  function onWrapperResize(e) {
    const diffY = startY - e.y;
    resizeWrapper(diffY);
    startY = e.y;
  }

  function onWindowResize() {
    const diffY = window.innerHeight - startHeight;
    resizeWrapper(diffY);
    startHeight = window.innerHeight;
  }

  dom.$resizer.addEventListener(
    "mousedown",
    (e) => {
      startY = e.y;
      document.addEventListener("mousemove", onWrapperResize, false);
    },
    false
  );

  dom.$mmScrubber.addEventListener(
    "wheel",
    (e) => {
      e.preventDefault();
      const speed = instance.duration / scrubberTL.duration / 10000;
      scrubberTL.progress += e.deltaY * speed;
      scrubberTL.progress += e.deltaX * -speed;
    },
    { passive: false }
  );

  document.addEventListener(
    "mouseup",
    () => {
      document.removeEventListener("mousemove", onWrapperResize, false);
    },
    false
  );

  window.onresize = onWindowResize;

  // Play if the active instance has autplay defined

  scrubberTL[instance._autoplay ? "play" : "pause"]();
}
