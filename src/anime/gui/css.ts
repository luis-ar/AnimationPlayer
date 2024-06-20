export function msToEm(ms) {
  return ms / 125 + 'em';
}

export const prefix = 'anime-gui-';

const dot = '.';
const classPrefix = dot + prefix;
const prefixRgx = /\.-?[_a-zA-Z\-]+[\w\-:\[\]]*/gm;
const commentsRgx = /\/\*.*?\*\//g;
const spacesRgx = /\s{3,}/g;

function prefixCSS(styles) {
  let prefixed = styles;
  styles.match(prefixRgx).forEach(match => prefixed = prefixed.replace(match, match.replace(dot, classPrefix)));
  return prefixed;
}

function minifyCSS(styles) {
  return styles.replace(commentsRgx, '').replace(spacesRgx, ''); // Remove comments then remove 3 or more consecutive spaces
}

export function appendStyles(styles) {
  const styleEl = document.createElement('style');
  styleEl.setAttribute('id', prefix + 'styles');
  styleEl.innerHTML = minifyCSS(prefixCSS(styles));
  document.head.appendChild(styleEl);
}
