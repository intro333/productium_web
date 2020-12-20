import {getRandomInt} from "@/functions/calculations";
import {pickerColors} from "@/data/consts";

export function userRoleToTitle(role) {
  switch (role) {
    case 'guest':
      return 'Наблюдатель';
    case 'editor':
      return 'Редактор';
    case 'manager':
      return 'Управляющий';
    default:
      return 'Наблюдатель';
  }
}
/* Скопировать объект или массив. Там, где не работает Object.assign */
export function copyStructureDefaultState(structure) {
  const _string = JSON.stringify(structure);
  return JSON.parse(_string);
}
export function formUserLink(link) {
  return (link && (link !== '')) ? `${link}, ` : '';
}
export function generateColorFromPicker() {
  const array = Object.keys(pickerColors);
  const colorIndex = getRandomInt(0, array.length-1);
  if (array[colorIndex]) {
    return pickerColors[array[colorIndex]];
  }
  return pickerColors.black;
}

