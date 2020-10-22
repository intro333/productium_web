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
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}