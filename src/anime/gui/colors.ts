export const blackColor = '#1B1B1B';
export const whiteColor = '#F6F4F2';
export const whiteAlpha1Color = 'rgba(246, 244, 242, .05)';
export const whiteAlpha2Color = 'rgba(246, 244, 242, .5)';
export const whiteAlpha3Color = 'rgba(246, 244, 242, .75)';
export const blackAlpha1Color = 'rgba(46, 44, 44, .75)';
export const blackAlpha2Color = 'rgba(46, 44, 44, .9)';

export const colors = ['#FF4B4B','#FF8F42','#FFC730','#F6FF56','#A4FF4F','#18FF74','#00D672','#3CFFEC','#61C3FF','#5A87FF','#8453E3','#C26EFF','#FB89FB'];
// const colors = [...Array(32)].map((c, i) => 'hsl(' + Math.round(360 / 32 * i) + ', 88%, 62%)');
const colorLength = colors.length;
const colorIds = {};
let colorIndex = 0;

function getNextColor() {
  const color = colors[colorIndex++];
  if (colorIndex > colorLength - 1) colorIndex = 0;
  return color;
}

export function getColor(id) {
  if (id) {
    const idColor = colorIds[id];
    if (idColor) {
      return idColor;
    } else {
      return colorIds[id] = getNextColor();
    }
  } else {
    return getNextColor();
  }
}
