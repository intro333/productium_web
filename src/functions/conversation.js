import {getRandomInt} from "@/functions/calculations";
import {pickerColors} from "@/data/consts";
import { v4 as uuidv4 } from 'uuid';

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

export function sortCasesComments(a, b) {
  if (a.niStatus !== 'notRead' && b.niStatus === 'notRead') {
    return 1;
  }
  if (b.niStatus !== 'notRead' && a.niStatus === 'notRead') {
    return -1;
  }
  return 0;
}
export function sortSlidesByOrder(a, b) {
  return parseFloat(a.order) - parseFloat(b.order);
}
export function shortFullName(fullName) {
  const names = fullName.split(' ');
  return `${names[0][0]}${names[1][0]}`;
}
export function uuidHash() {
  // return uuidv4().replace('-', '');
  return uuidv4();
}
export function bytesToSize(bytes) {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 Byte';
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}
