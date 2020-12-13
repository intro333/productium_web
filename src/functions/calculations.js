export function getModalPositionFunc(refObj, isRight = null, modalWidth=0) {
  const bClient = refObj.getBoundingClientRect();
  const top = bClient.top + refObj.clientHeight + 10;
  let left = 0;
  if (isRight) {
    left = bClient.left - modalWidth + refObj.clientWidth;
  } else {
    left = bClient.left + ((refObj.clientWidth / 2) - 25);
  }

  return { top, left };
}
/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
export function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.round(max);
  return Math.round(Math.random() * (max - min + 1)) + min;
}

export function calcTextareaHeight(value) {
  let numberOfLineBreaks = (value.match(/\n/g) || []).length;
  /* min-height + lines x line-height */
  let newHeight = 31 + numberOfLineBreaks * 14;
  return newHeight;
}
/* Радиус окружности по площади */
export function getCircleRadiusByTriangleArea(width, height) {
  return Math.sqrt((height * width) / Math.PI);
}
/* Периметр окружности */
export function getCirclePerimeter(width, height) {
  return 2 * Math.PI * (Math.sqrt(
    (
      (width * 2) +
      (height * 2)
    ) / 8) );
}