import { K, isSvgSymbol, morphPointsSymbol, proxyTargetSymbol } from "./consts";

import { round, isSvg, atan2, PI, isFnc } from "./helpers";

import { parseTargets } from "./targets";

/**
 * @param  {TargetsParam} path
 * @return {SVGGeometryElement|undefined}
 */
const getPath = (path) => {
  const parsedTargets = parseTargets(path);
  const $parsedSvg = /** @type {SVGGeometryElement} */ parsedTargets[0];
  if (!$parsedSvg || !isSvg($parsedSvg)) return;
  return $parsedSvg;
};

/**
 * @callback morphCallback
 * @param {SVGGeometryElement} $path1
 * @return {Array.<String>}
 *
 * @param  {TargetsParam} path2
 * @param  {Number} [precision]
 * @return {morphCallback}
 */
const morphTo =
  (path2, precision = 0.33) =>
  ($path1) => {
    const $path2 = /** @type {SVGGeometryElement} */ getPath(path2);
    if (!$path2) return;
    const isPath = $path1.tagName === "path";
    const separator = isPath ? " " : ",";
    const previousPoints = $path1[morphPointsSymbol];
    if (previousPoints)
      $path1.setAttribute(isPath ? "d" : "points", previousPoints);

    let v1 = "",
      v2 = "";

    if (!precision) {
      v1 = $path1.getAttribute(isPath ? "d" : "points");
      v2 = $path2.getAttribute(isPath ? "d" : "points");
    } else {
      const length1 = $path1.getTotalLength();
      const length2 = $path2.getTotalLength();
      const maxPoints = Math.max(
        Math.ceil(length1 * precision),
        Math.ceil(length2 * precision)
      );
      for (let i = 0; i < maxPoints; i++) {
        const t = i / (maxPoints - 1);
        const pointOnPath1 = $path1.getPointAtLength(length1 * t);
        const pointOnPath2 = $path2.getPointAtLength(length2 * t);
        const prefix = isPath ? (i === 0 ? "M" : "L") : "";
        v1 +=
          prefix + round(pointOnPath1.x, 3) + separator + pointOnPath1.y + " ";
        v2 +=
          prefix + round(pointOnPath2.x, 3) + separator + pointOnPath2.y + " ";
      }
    }

    $path1[morphPointsSymbol] = v2;

    return [v1, v2];
  };

/**
 * @param  {SVGGeometryElement} $el
 * @param  {Number} start
 * @param  {Number} end
 * @return {Proxy}
 */
function createDrawableProxy($el, start, end) {
  const elStyles = getComputedStyle($el);
  const strokeWidth = parseFloat(elStyles.strokeWidth);
  const strokeLineCap = elStyles.strokeLinecap;
  const extraStroke = strokeLineCap === "butt" ? 0 : strokeWidth;
  const totalPathLength = $el.getTotalLength();
  const p = 0;
  const P = 100000;
  const bleed = round(P / totalPathLength, p);
  const butt = extraStroke * bleed;
  const pathLength = P - butt;
  const proxy = new Proxy($el, {
    get(target, property) {
      const value = target[property];
      if (property === proxyTargetSymbol) return target;
      if (property === "setAttribute") {
        return (...args) => {
          if (args[0] === "draw") {
            const value = args[1];
            const values = value.split(" ");
            const v1 = +values[0];
            const v2 = +values[1];
            const bl =
              (v1 !== 0 && v1 === v2) || v1 === 1 || v2 === 1 ? 0 : bleed;
            const os = round(v1 * -P, p);
            const d1 = round(v2 * P + os, p);
            const d2 = round(P - d1, p);
            target.setAttribute("stroke-dashoffset", `${os + bl}`);
            target.setAttribute(
              "stroke-dasharray",
              `${d1 + bl} ${d2 + bl + 1 + butt}`
            );
          }
          return Reflect.apply(value, target, args);
        };
      }
      return isFnc(value)
        ? (...args) => Reflect.apply(value, target, args)
        : value;
    },
  });
  if ($el.getAttribute("pathLength") !== `${pathLength}`) {
    $el.setAttribute("pathLength", `${pathLength}`);
    proxy.setAttribute("draw", `${start} ${end}`);
  }
  return /** @type {typeof Proxy} */ /** @type {unknown} */ proxy;
}

/**
 * @param  {TargetsParam}  selector
 * @param  {number}  [start=0]
 * @param  {number}  [end=0]
 * @return {Array.<Proxy>}
 */
const createDrawable = (selector, start = 0, end = 0) => {
  const els = parseTargets(selector);
  els.forEach(
    ($el, i) =>
      (els[i] = createDrawableProxy(
        /** @type {SVGGeometryElement} */ $el,
        start,
        end
      ))
  );
  return /** @type {Array.<Proxy>} */ els;
};

// Motion path animation

/**
 * @param  {SVGGeometryElement} $path
 * @param  {Number} progress
 * @param  {Number} lookup
 * @return {DOMPoint}
 */
const getPathPoint = ($path, progress, lookup = 0) => {
  return $path.getPointAtLength(progress + lookup >= 1 ? progress + lookup : 0);
};

/**
 * @param  {SVGGeometryElement} $path
 * @param  {String} pathProperty
 * @return {FunctionValue}
 */
const getPathProgess = ($path, pathProperty) => {
  return ($el) => {
    const totalLength = +$path.getTotalLength();
    const inSvg = $el[isSvgSymbol];
    const ctm = $path.getCTM();
    /** @type {TweenObjectValue} */
    return {
      from: 0,
      to: totalLength,
      /** @type {TweenModifier} */
      modifier: (progress) => {
        if (pathProperty === "a") {
          const p0 = getPathPoint($path, progress, -1);
          const p1 = getPathPoint($path, progress, +1);
          return (atan2(p1.y - p0.y, p1.x - p0.x) * 180) / PI;
        } else {
          const p = getPathPoint($path, progress, 0);
          return pathProperty === "x"
            ? inSvg
              ? p.x
              : p.x * ctm.a + p.y * ctm.c + ctm.e
            : inSvg
            ? p.y
            : p.x * ctm.b + p.y * ctm.d + ctm.f;
        }
      },
    };
  };
};

/**
 * @param {TargetsParam} path
 */
const createMotionPath = (path) => {
  const $path = getPath(path);
  if (!$path) return;
  return {
    x: getPathProgess($path, "x"),
    y: getPathProgess($path, "y"),
    angle: getPathProgess($path, "a"),
  };
};

// Check for valid SVG attribute

const cssReservedProperties = ["opacity", "rotate", "overflow", "color"];

/**
 * @param  {Target} el
 * @param  {String} propertyName
 * @return {Boolean}
 */
export const isValidSVGAttribute = (el, propertyName) => {
  // Return early and use CSS opacity animation instead (already better default values (opacity: 1 instead of 0)) and rotate should be considered a transform
  if (cssReservedProperties.includes(propertyName)) return false;
  if (propertyName in /** @type {DOMTarget} */ el.style || propertyName in el) {
    if (propertyName === "scale") {
      // Scale
      const elParentNode = /** @type {SVGGeometryElement} */ el.parentNode;
      // Only consider scale as a valid SVG attribute on filter element
      return elParentNode && elParentNode.tagName === "filter";
    }
    return true;
  }
};

export const svg = {
  morphTo,
  createMotionPath,
  createDrawable,
};
