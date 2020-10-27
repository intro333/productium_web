import moment from 'moment';

/* Стандартное отображение даты */
export function getDefaultDateFormat(dateStr) {
  return moment(dateStr).format('HH:mm DD/MM/YYYY');
}

/* Вернуть день (вчера, сегодня) или дату */
export function getNearestWeekdayOrDate(momentDate) {
  let result = '';
  const f = 'YYYY-MM-DD';
  const isToday = moment().format(f) === momentDate.format(f);
  const isYesterday = moment().add(-1, 'days')
      .format(f) === momentDate.format(f);
  if (isToday) {
    result = 'сегодня';
  } else if (isYesterday) {
    result = 'вчера';
  } else {
    result = momentDate.locale('ru').format('DD MMMM');
  }

  return result;
}

/* Вернуть формат даты "сегодня 18:24" */
export function getNearestWeekdayWithTime(dateStr) {
  const mDate = moment(dateStr);
  const day = getNearestWeekdayOrDate(mDate);
  const time = mDate.format('HH:mm');
  return `${day} ${time}`;
}