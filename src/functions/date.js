import moment from 'moment';

/* Стандартное отображение даты */
export function getDefaultDateFormat(dateStr) {
  return moment(dateStr).format('HH:mm DD/MM/YYYY');
}
