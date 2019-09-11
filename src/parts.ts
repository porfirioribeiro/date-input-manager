import { Segment, segmentList } from './segments';
import { dateGet } from './date';
import { DateOrRange } from './range';

export type Parts = Record<Segment, number | undefined>;
export type PartsSection = [Parts] | [Parts, Parts];

function getPartsOfDate(date?: Date): Parts {
  return segmentList.reduce(
    (parts, segment) => ({
      ...parts,
      [segment]: date && dateGet(date, segment),
    }),
    {}
  ) as Parts;
}

export function drToParts(date: DateOrRange | undefined, range?: string | false): PartsSection {
  return range
    ? Array.isArray(date)
      ? [getPartsOfDate(date[0]), getPartsOfDate(date[1])]
      : [getPartsOfDate(), getPartsOfDate()]
    : [getPartsOfDate(Array.isArray(date) ? date[0] : date)];
}

export function partsToDr(
  parts: PartsSection,
  range: string | false | undefined
): DateOrRange | undefined {
  const d = parts.reduce(
    (acc, p) => {
      const v =
        p.yyyy !== undefined && p.MM !== undefined && p.dd !== undefined
          ? new Date(p.yyyy, p.MM - 1, p.dd, p.HH || 0, p.mm || 0, p.ss || 0, p.fff || 0)
          : undefined;

      return range ? (acc || []).concat(v) : v;
    },
    undefined as any
  );
  return d;
}
