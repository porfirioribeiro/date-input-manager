import { Segment } from './segments';

const SECCOND_MS = 1000;
const MINUTE_MS = 60000;
const HOUR_MS = 3.6e6;
const DAY_MS = 8.64e7;

export function dateGet(d: Date, segment: Segment) {
  return segment === 'yyyy'
    ? d.getFullYear()
    : segment === 'MM'
    ? d.getMonth() + 1
    : segment === 'dd'
    ? d.getDate()
    : segment === 'HH'
    ? d.getHours()
    : segment === 'mm'
    ? d.getMinutes()
    : segment === 'ss'
    ? d.getSeconds()
    : /* segment==='fff'?  */ d.getMilliseconds();
}

export function dateSet(old: Date, segment: Segment, value: number) {
  const d = new Date(old.getTime());
  segment === 'yyyy'
    ? d.setFullYear(value)
    : segment === 'MM'
    ? d.setMonth(value - 1)
    : segment === 'dd'
    ? d.setDate(value)
    : segment === 'HH'
    ? d.setHours(value)
    : segment === 'mm'
    ? d.setMinutes(value)
    : segment === 'ss'
    ? d.setSeconds(value)
    : /* segment==='fff'?  */ d.setMilliseconds(value);
  return d;
}

export function dateAdd(d: Date, segment: Segment, value: number) {
  return segment === 'yyyy'
    ? dateAddMonths(d, value * 12)
    : segment === 'MM'
    ? dateAddMonths(d, value)
    : new Date(
        d.getTime() +
          value *
            (segment === 'dd'
              ? DAY_MS
              : segment === 'HH'
              ? HOUR_MS
              : segment === 'mm'
              ? MINUTE_MS
              : segment === 'ss'
              ? SECCOND_MS
              : /* segment==='fff'?  */ 1)
      );
}

function dateAddMonths(d: Date, v: number): Date {
  const date = new Date(d.getTime());
  var n = date.getDate();
  date.setDate(1);
  date.setMonth(date.getMonth() + v);
  date.setDate(Math.min(n, dateGetDaysInMonth(date)));
  return date;
}

function dateGetDaysInMonth(d: Date) {
  var year = d.getFullYear();
  var monthIndex = d.getMonth();
  var lastDayOfMonth = new Date(0);
  lastDayOfMonth.setFullYear(year, monthIndex + 1, 0);
  lastDayOfMonth.setHours(0, 0, 0, 0);
  return lastDayOfMonth.getDate();
}
