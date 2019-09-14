export type DateRange = [Date | undefined, Date | undefined];
export type DateOrRange = Date | DateRange | undefined;

export const isArray = Array.isArray;

export function drGet(value: DateOrRange, section: number): Date | undefined {
  return isArray(value) ? value[section] : value;
}

export function drSet(value: DateOrRange, section: number, date: Date | undefined): DateOrRange {
  if (isArray(value)) {
    let newValue: DateOrRange;
    newValue = value.slice(0) as DateRange;
    newValue[section] = date;
    return newValue;
  } else {
    return date;
  }
}

export function drIsEqual(a: DateOrRange, b: DateOrRange): boolean {
  if (a === b) return true;
  if (isArray(a) && isArray(b)) return drIsEqual(a[0], b[0]) && drIsEqual(a[1], b[1]);
  if (a instanceof Date && b instanceof Date) return a.getTime() === b.getTime();
  return false;
}

export function drIsValid(dr: DateOrRange): boolean {
  return (
    !!dr &&
    ((dr instanceof Date && !isNaN(dr.getTime())) ||
      (isArray(dr) && drIsValid(dr[0]) && drIsValid(dr[1])))
  );
}
