export function getHorizModalPositionFunc(refObj, isRight = null, modalWidth=0) {
  const bClient = refObj.getBoundingClientRect();
  const top = (bClient.top + refObj.clientHeight / 2) - 15;
  let left = 0;
  if (isRight) {
    left = bClient.left - modalWidth + refObj.clientWidth;
  } else {
    left = bClient.left + refObj.clientWidth + 10;
  }

  return { top, left };
}
export function getModalPositionFunc(refObj, isRight = null, modalWidth=0, topPlus = 15) {
  const bClient = refObj.getBoundingClientRect();
  const top = bClient.top + refObj.clientHeight + topPlus;
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
export function getOffsetByZoom(z, offset) {
  if (z > 1) {
    return offset * z;
  } else if(z < 1) {
    return offset / z;
  } else {
    return offset;
  }
}
export function getObjectOffsetByZoom(z, offset) {
  if (z > 1) {
    return offset / z;
  } else if(z < 1) {
    return offset * z;
  } else {
    return offset;
  }
}

export function imageSize (image) {
  return new Promise((resolve, reject) => {
    try {
      const fileReader = new FileReader()
      fileReader.onload = () => {
        const img = new Image()
        img.onload = () => {
          resolve({ width: img.width, height: img.height, src: img.src })
        }
        img.src = fileReader.result;
      }
      fileReader.readAsDataURL(image);
    } catch (e) {
      reject(e)
    }
  })
}