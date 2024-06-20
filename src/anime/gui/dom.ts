import { utils } from "../anime";

import { icons } from "./consts";

import { prefix } from "./css";

export function createBlock(className, css) {
  var $el = document.createElement("div");
  $el.classList.add(prefix + "block");
  if (Array.isArray(className)) {
    for (let i = 0, l = className.length; i < l; i++) {
      $el.classList.add(prefix + className[i]);
    }
  } else {
    $el.classList.add(prefix + className);
  }
  if (css) $el.style.cssText = css;
  return $el;
}

export function getIconCode(name) {
  return `<svg viewBox="0 0 45 36"><g fill-rule="evenodd">${icons[name]}</g></svg>`;
}

function createProgressBar() {
  const $el = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  $el.classList.add(`${prefix}progress-circle`);
  utils.set($el, { viewBox: "0 0 14 14" });
  $el.innerHTML = `<g fill="none" fill-rule="evenodd"><circle cx="7" cy="7" r="6" stroke="#FFFFFF" stroke-width="2" opacity=".2"/><path stroke="#FFFFFF" stroke-width="2" d="M7 1a6 6 0 1 1-.023 0"/></g>`;
  return $el;
}

function createButton(className, innerHTML = "") {
  const $el = document.createElement("button");
  $el.classList.add(`${prefix}${className}`);
  $el.classList.add(`${prefix}sidebar-item`);
  $el.classList.add(`${prefix}sidebar-button`);
  $el.innerHTML = innerHTML;
  return $el;
}

function createSpeedButton() {
  const $el = document.createElement("select");
  const options = [2, 1.8, 1.5, 1.2, 1, 0.8, 0.5, 0.2, 0.1];
  $el.classList.add(`${prefix}speed-button`);
  $el.classList.add(`${prefix}sidebar-item`);
  $el.classList.add(`${prefix}sidebar-button`);
  for (let i = 0; i < options.length; i++) {
    const $option = document.createElement("option");
    $option.value = options[i];
    $option.text = options[i] + "×";
    $el.appendChild($option);
  }
  $el.value = 1;
  return $el;
}

function createScrubberInput(className) {
  const $input = document.createElement("input");
  $input.classList.add(`${prefix}scrubber`);
  $input.classList.add(`${prefix}${className}`);
  utils.set($input, { type: "range", min: "0", max: "1", value: "0" });
  return $input;
}

function createScrubberBlock(className) {
  const $scrubber = createBlock(className);
  const tlScrubber = createScrubberInput("time-scrubber");
  const tlMinScrubber = createScrubberInput("min-scrubber");
  const tlMaxScrubber = createScrubberInput("max-scrubber");
  $scrubber.appendChild(tlScrubber);
  $scrubber.appendChild(tlMinScrubber);
  $scrubber.appendChild(tlMaxScrubber);
  return $scrubber;
}

export function initDOM() {
  const $wrapper = createBlock("wrapper");
  const $tlWrapper = createBlock("tl-wrapper");
  const $toolbar = createBlock("toolbar");
  const $resizer = createBlock("resizer");
  const $sidebarLeft = createBlock("sidebar");
  const $sidebarRight = createBlock("sidebar");
  const $toggleButton = createButton("toggle-button", getIconCode("toggle"));
  const $playbackButton = createButton("playback-button", getIconCode("play"));
  const $backButton = createButton("back-button", getIconCode("back"));
  const $speedButton = createSpeedButton();
  const $clampButton = createButton("clamp-button", getIconCode("clamp"));
  const $mm = createBlock("mm");
  const $clock = createBlock(["clock", "sidebar-item"]);
  const $currentTime = createBlock("current-time");
  const $currentTimeShadow = createBlock([
    "current-time",
    "current-time-shadow",
  ]);
  const $totalDuration = createBlock("total-duration");
  const $totalTime = createBlock("total-time");
  const $progressBar = createProgressBar();
  const $tl = createBlock(["tl", "ruller-bg"]);
  const $tlScrubber = createScrubberBlock("tl-scrubber");
  const $mmScrubber = createScrubberBlock("mm-scrubber");
  const $mmBox = createBlock("mm-box");

  $totalTime.appendChild($totalDuration);
  $clock.appendChild($currentTimeShadow);
  $clock.appendChild($currentTime);
  $clock.appendChild($totalTime);
  $clock.appendChild($progressBar);
  $mmScrubber.appendChild($mmBox);
  $mm.appendChild($mmScrubber);
  $tl.appendChild($tlScrubber);
  $sidebarLeft.appendChild($playbackButton);
  $sidebarLeft.appendChild($backButton);
  $sidebarLeft.appendChild($speedButton);
  $sidebarLeft.appendChild($clampButton);
  $sidebarRight.appendChild($clock);
  $sidebarRight.appendChild($toggleButton);
  $toolbar.appendChild($sidebarLeft);
  $toolbar.appendChild($mm);
  $toolbar.appendChild($resizer);
  $toolbar.appendChild($sidebarRight);
  $wrapper.appendChild($toolbar);
  $wrapper.appendChild($tlWrapper);
  $tlWrapper.appendChild($tl);

  return {
    $wrapper,
    $tlWrapper,
    $tl,
    $tlScrubber,
    $resizer,
    $mmScrubber,
    $mmBox,
    $speedButton,
    $clampButton,
    $currentTimeShadow,
    $currentTime,
    $totalDuration,
  };
}
