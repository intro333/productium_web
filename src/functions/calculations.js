export function getModalPositionFunc(refObj) {
  const bClient = refObj.getBoundingClientRect();
  const top = bClient.top + refObj.clientHeight + 10;
  const left = bClient.left + ((refObj.clientWidth / 2) - 25);

  return { top, left };
}