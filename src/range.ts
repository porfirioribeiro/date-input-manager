export type DateRange = [Date | undefined, Date | undefined];
export type DateOrRange = Date | DateRange | undefined;

export function drGet(value: DateOrRange, section: number): Date | undefined {
  return Array.isArray(value) ? value[section] : value;
}

export function drSet(value: DateOrRange, section: number, date: Date | undefined): DateOrRange {
  if (Array.isArray(value)) {
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
  if (Array.isArray(a) && Array.isArray(b)) return drIsEqual(a[0], b[0]) && drIsEqual(a[1], b[1]);
  if (a instanceof Date && b instanceof Date) return a.getTime() === b.getTime();
  return false;
}

export function drIsValid(dr: DateOrRange): boolean {
  return (
    !!dr &&
    ((dr instanceof Date && !isNaN(dr.getTime())) ||
      (Array.isArray(dr) && drIsValid(dr[0]) && drIsValid(dr[1])))
  );
}
