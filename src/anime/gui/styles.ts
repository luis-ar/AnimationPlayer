import { msToEm } from "./css";

import {
  sideBarWidth,
  toolbarHeight,
  toolbarItemHeight,
  tlScrubberHeight,
  tlLineHeight,
  thumbWidth,
} from "./consts";

import {
  blackColor,
  whiteColor,
  whiteAlpha1Color,
  whiteAlpha2Color,
  whiteAlpha3Color,
  blackAlpha1Color,
  blackAlpha2Color,
  colors,
} from "./colors";

export const styles = `
  .wrapper,
  .wrapper *,
  .wrapper *:before,
  .wrapper *:after {
    box-sizing: border-box;
    display: flex;
    flex-shrink: 0;
    position: relative;
    user-select: none;
    font-variant-numeric: tabular-nums;
  }
  .wrapper {
    position: fixed;
    z-index: 999999;
    right: 0;
    bottom: 0;
    width: 100%;
    height: var(--anime-gui-height);
    font-family: sans-serif;
    background-color: ${blackColor};
  }
  .tl-wrapper {
    position: absolute;
    left: 0;
    top: ${toolbarHeight}px;
    overflow: auto;
    flex-direction: column;
    width: 100%;
    height: var(--anime-gui-tl-height);
    background-color: ${blackColor};
  }
  .toolbar {
    position: sticky;
    z-index: 99;
    left: 0;
    top: 0;
    width: 100%;
    height: ${toolbarHeight}px;
    padding: 10px;
    background-color: ${blackColor};
    box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, .04),
                inset 0 -1px 0 0 rgba(0, 0, 0, .4);
  }
  .resizer {
    position: absolute;
    z-index: 9999;
    left: 0;
    top: -5px;
    width: 100%;
    height: 15px;
    cursor: row-resize;
  }
  .sidebar {
    overflow: hidden;
    flex-wrap: nowrap;
    width: ${sideBarWidth - 30}px;
    border-radius: 4px;
    background-color: ${whiteAlpha1Color};
    color: rgba(255,255,255,.65);
  }
  .sidebar:first-child {
    margin-right: 20px;
  }
  .sidebar:last-child {
    margin-left: 20px;
  }
  .sidebar-item {
    width: 100%;
    flex-shrink: 1;
    height: ${toolbarItemHeight}px;
    background-color: transparent;
    color: currentColor;
    box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, .025),
                inset 0 -1px 0 0 rgba(0, 0, 0, .4);
  }
  .sidebar-item.is-active {
    background-color: rgba(0, 0, 0, .5);
    color: #FFF;
    box-shadow: inset 0 1px 0 0 rgba(0, 0, 0, .4),
                inset 0 -1px 0 0 rgba(255, 255, 255, .085);
  }
  .sidebar-button {
    overflow: hidden;
    cursor: pointer;
  }
  .sidebar > *:first-child {
    border-radius: 4px 0 0 4px;
  }
  .sidebar > *:last-child {
    border-radius: 0 4px 4px 0;
  }
  .sidebar > *:first-child:last-child {
    border-radius: 4px;
  }
  .sidebar-button:not(:first-child) {
    border-left: 1px solid ${blackColor};
  }
  .sidebar-button:not(.is-active):hover {
    color: rgba(255,255,255,.85);
    background-color: rgba(255,255,255,.1);
  }
  @keyframes focus {
    from {
      box-shadow: inset 0 0 0 1px rgba(255, 255, 255, .25),
                  inset 0 0 0 0 rgba(255, 255, 255, .25);
    }
  }
  .sidebar-button:focus {
    outline: none;
    animation: focus 1s linear forwards;
  }
  .sidebar-button svg {
    width: 100%;
    height: 100%;
  }
  .speed-button {
    -webkit-appearance: none;
    -moz-appearance: none;
    text-align: center;
  }
  .mm {
    width: calc(100% - ${sideBarWidth * 2}px + 20px);
    height: ${toolbarItemHeight}px;
    background-color: rgba(0, 0, 0, .25);
    border-radius: 4px;
    box-shadow: inset 0 1px 0 0 rgba(0, 0, 0, .4),
                inset 0 -1px 0 0 rgba(255, 255, 255, .085);
  }
  .ruller-bg {
    background-repeat: repeat-x;
    background-position: left bottom 0px;
    background-image: linear-gradient(
      to right, ${whiteAlpha1Color} 1px, transparent 1px
    );
    background-size: ${msToEm(500)} 100%;
  }
  .scrubber {
    -webkit-appearance: none;
    position: absolute;

    width: calc(100% + ${thumbWidth}px);
    margin-left: -${thumbWidth / 2}px;

    background: transparent;
    cursor: col-resize;
  }
  .time-scrubber {
    z-index: 1;
    top: 0;
  }
  .min-scrubber,
  .max-scrubber {
    z-index: 2;
    top: 0;
  }
  .scrubber:focus {
   outline: none;
  }
  .scrubber::-webkit-slider-runnable-track {
    -webkit-appearance: none;
  }
  .scrubber.time-scrubber::-webkit-slider-runnable-track {
    z-index: 99;
    height: ${tlScrubberHeight}px;
    border-radius: 10px;
  }
  .scrubber.min-scrubber::-webkit-slider-runnable-track,
  .scrubber.max-scrubber::-webkit-slider-runnable-track {
    z-index: 1;
    height: 0px;
    background-color: red;
  }
  .scrubber::-webkit-slider-thumb {
    -webkit-appearance: none;
    cursor: col-resize;
    width: ${thumbWidth}px;
  }
  .scrubber.time-scrubber::-webkit-slider-thumb {
    z-index: 1;
    height: var(--anime-gui-tl-height);
    background-color: transparent;
    background-image: linear-gradient(
      90deg,
      rgba(27,26,26,0.00) 25%, #1B1A1A 25.5%,
      #1B1A1A 37.5%, #FFFFFF 38%,
      #FFFFFF 62%, #1B1A1A 62.5%,
      #1B1A1A 74.5%, rgba(27,26,26,0.00) 75%
    );
  }
  .is-playing .scrubber.time-scrubber::-webkit-slider-thumb {
    pointer-events: none;
  }
  .scrubber.min-scrubber::-webkit-slider-thumb,
  .scrubber.max-scrubber::-webkit-slider-thumb,
  .mm-box:before,
  .mm-box:after {
    z-index: 2;
    position: relative;
    height: ${tlScrubberHeight}px;
    height: var(--anime-gui-tl-height);
    background-color: ${whiteAlpha2Color};
    filter: saturate(2);
    backdrop-filter: blur(8px);
    cursor: ew-resize;
  }
  .scrubber.min-scrubber::-webkit-slider-thumb:hover,
  .scrubber.max-scrubber::-webkit-slider-thumb:hover {
    background-color: ${whiteAlpha3Color};
  }
  .scrubber.min-scrubber::-webkit-slider-thumb {
    transform: translateX(calc(-${thumbWidth / 2}px - 2px));
    border-radius: 4px 0 0 4px;
  }
  .scrubber.max-scrubber::-webkit-slider-thumb {
    transform: translateX(calc(${thumbWidth / 2}px + 2px));
    border-radius: 0 4px 4px 0;
  }
  .mm-tl {
    overflow: hidden;
    width: 100%;
    height: calc(100% - 6px);
    margin-top: 3px;
  }
  .mm-tl-scroll {
    flex-direction: column;
    justify-content: center;
    width: 100%;
    height: 100%;
  }
  .mm-tl-line {
    height: 100%;
    max-height: 4px;
    flex-shrink: 1;
    background-color: currentColor;
    box-shadow: 0 0 0 .25px currentColor;
    border-radius: 4px;
  }
  .mm-box {
    pointer-events: none;
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
  }
  .mm-box:before,
  .mm-box:after {
    content: "";
    display: block;
    position: absolute;
    z-index: 1;
    left: 0;
    right: 0;
    height: 2px;
  }
  .mm-box:before { top: 0; }
  .mm-box:after { bottom: 0; }
  .mm-scrubber .scrubber.time-scrubber {
    height: ${toolbarItemHeight - 6}px;
    margin-top: 3px;
  }
  .mm-scrubber {
    width: 100%;
  }
  .mm-scrubber .scrubber.time-scrubber::-webkit-slider-thumb {
    height: ${toolbarItemHeight - 6}px;
    margin-top: -7px;
  }
  .mm-scrubber .scrubber.min-scrubber::-webkit-slider-thumb,
  .mm-scrubber .scrubber.max-scrubber::-webkit-slider-thumb {
    height: ${toolbarItemHeight}px;
  }
  .wrapper:not(.is-clamped) .min-scrubber,
  .wrapper:not(.is-clamped) .max-scrubber,
  .wrapper:not(.is-clamped) .mm-box {
    display: none;
  }
  .tl {
    flex-direction: column;
    left: ${sideBarWidth}px;
    padding-right: ${sideBarWidth}px;
    color: ${whiteColor};
    backface-visibility: hidden;
    font-size: 40px;
  }
  .tl-scrubber {
    position: sticky;
    z-index: 3;
    top: 0;
    align-items: flex-start;
    height: ${tlScrubberHeight}px;
  }
  .clock {
    width: 140px;
    flex-shrink: 0;
    justify-content: flex-end;
    align-items: center;
    padding: 10px;
    align-items: center;
  }
  .current-time {
    justify-content: flex-end;
    position: absolute;
    left: 14px;
    top: 9px;
    width: 6ch;
    font-size: 16px;
    font-weight: bold;
    letter-spacing: 1px;
    text-align: right;
  }
  .current-time-shadow {
    opacity: .2;
  }
  .total-time {
    position: absolute;
    left: 67px;
    top: 9px;
    font-size: 16px;
    font-weight: 300;
    letter-spacing: 0.5px;
    text-align: left;
  }
  .total-duration {
    opacity: .75;
    margin-top: 4px;
    margin-left: 3px;
    font-weight: bold;
    font-size: 8px;
    letter-spacing: 0.5px;
    line-height: 6px;
    border-left: 1px solid currentColor;
    padding-left: 4px;
  }
  .progress-circle {
    opacity: .7;
    width: 14px;
    height: 14px;
    margin-left: 10px;
  }
  .time-ruller {
    overflow: hidden;
    pointer-events: none;
    align-items: center;
    justify-content: flex-start;
    position: absolute;
    top: 0;
    left: 0;
    height: ${tlScrubberHeight}px;
    color: ${whiteAlpha3Color};
    background-color: ${blackColor}AA;
    backdrop-filter: blur(8px);
  }
  .time-ruller-digit {
    justify-content: flex-start;
    width: ${msToEm(500)};
    height: ${tlScrubberHeight}px;
    padding-left: 4px;
    text-align: center;
  }
  .time-ruller-digit span {
    font-weight: bold;
    font-size: 10px;
    margin-top: 2px;
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
  .iteration-block.is-reversed .iteration-label {
    right: 0;
    transform: translateX(100%);
  }
  .line-block {
    height: ${tlLineHeight}px;
    margin-top: 1px;
    margin-bottom: 1px;
    opacity: .87;
    cursor: pointer;
  }
  .line-block:hover {
    opacity: 1;
    filter: saturate(1.2);
  }
  .line-block:before {
    content: "";
    display: block;
    position: absolute;
    left: 0;
    top: -1px;
    right: 0;
    bottom: -1px;
    background-color: transparent;
  }
  .iteration-line-block {
    border-radius: 4px;
    background-color: currentColor;
  }
  .iteration-background-block {
    position: absolute;
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
    border-radius: ${tlLineHeight / 2}px;
  }
  .tween-block {
    background-color: currentColor;
    border-radius: ${tlLineHeight / 2}px;
  }
  .tween-block-item {
    height: ${tlLineHeight}px;
  }
  .tween-background-block {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: ${blackAlpha1Color};
    border-radius: ${tlLineHeight / 2}px;
  }
  .tween-duration-block {
    overflow: hidden;
    justify-content: space-between;
    background-color: currentColor;
    border-radius: ${tlLineHeight / 2}px;
  }
  .tween-skipped-duration-block {
    position: absolute;
    top: 0;
    right: 0;
    border-radius: 0px 7px 7px 0px;
    background-image: linear-gradient(
      45deg,
      transparent  25%, ${blackAlpha2Color} 25%, ${blackAlpha2Color} 50%,
      transparent  50%, transparent  75%, ${blackAlpha2Color} 75%,
      ${blackAlpha2Color} 100%
    );
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
    letter-spacing: .05em;
    white-space: pre;
  }
  .tl-label-block {
    pointer-events: auto;
    position: absolute;
    z-index: 1;
    top: 0px;
    height: 100%;
    background-color: ${colors[0]}77;
    backdrop-filter: blur(8px);
    cursor: pointer;
  }
  .tl-label-block:after {
    pointer-events: none;
    content: "";
    display: block;
    position: absolute;
    top: 0px;
    left: -1px;
    width: 0px;
    height: var(--anime-gui-tl-height);
    border-left: 1px dotted ${colors[0]}77;
  }
  .tl-label-block .label-block {
    color: ${whiteAlpha3Color};
  }
  .tl-label-block:hover .label-block {
    color: ${whiteColor};
  }
  .tween-line-block .label-block {
    opacity: 0;
  }
  .tween-block-item > .label-block {
    color: ${blackColor};
  }
  .iteration-line-block > .label-block,
  .tween-block > .label-block {
    opacity: .4;
    position: absolute;
    left: 0;
    top: 0;
    color: currentColor;
    transform: translateX(calc(-100% + 4px));
  }
  .iterations-block:first-child:hover > .iteration-block-item > .iteration-line-block .label-block,
  .animation-block:hover > .iterations-block:first-child .tween-line-block:hover .label-block,
  .tween-line-block:hover .label-block {
    opacity: 1!important;
    transition-duration: 0s;
  }
  .iteration-block:before {
    content: "";
    position: absolute;
    opacity: 0;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background-color: currentColor;
    transition: opacity .25s ease-out;
  }
  .is-highlighted {
    filter: brightness(2);
  }
  .highlight {
    opacity: 0;
    position: absolute;
    zIndex: 9999;
    box-shadow: 0 0 0 1px #0008, 0 0 0 3px currentColor, 0 0 0 4px #0008;
    border-radius: 2px;
  }
  .highlight:before {
    content: "";
    opacity: .25;
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    zIndex: 9999;
    border-radius: 3px;
    background-color: currentColor;
  }
`;
