import { isNum, isUnd, isNil } from "../helpers";

import { toolbarHeight } from "./consts";

export const instances = [];

export const parameters = {
  active: null,
  $container: document.body,
  highlightSiblings: true,
  showTweenId: true,
  startTime: 0,
  endTime: null,
  time: 0,
  speed: 1,
  loop: false,
  scrollX: 0,
  scrollY: 0,
  height: toolbarHeight,
  minified: window.innerHeight * 0.4,
  clamped: false,
};

export function getActiveInstance() {
  return instances[parameters.active];
}

const url = new URL(window.location.href);

const urlParams = url.searchParams;

function getParsedParameter(paramName, userParams) {
  const fromUrl = urlParams.get(paramName);
  const fromUser = userParams[paramName];
  let param;
  if (!isUnd(fromUrl)) {
    param = fromUrl;
  } else if (!isUnd(fromUser)) {
    urlParams.set(paramName, fromUser);
    param = fromUser;
  }
  if (param === "true") {
    param = true;
  } else if (param === "false") {
    param = false;
  } else {
    const numParam = parseFloat(param);
    if (isNum(numParam)) {
      param = numParam;
    }
  }
  return param;
}

export function parseParameters(userParams) {
  for (let paramName in parameters) {
    const parsedParam = getParsedParameter(paramName, userParams);
    if (!isNil(parsedParam)) {
      parameters[paramName] = parsedParam;
    }
  }
}

let setUrlParamTimeout;

export function setParameter(param, value) {
  parameters[param] = value;
  url.searchParams.set(param, value);
  clearTimeout(setUrlParamTimeout);
  setUrlParamTimeout = setTimeout(() => {
    window.history.replaceState(null, "", url);
  }, 66);
}
