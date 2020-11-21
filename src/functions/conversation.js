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