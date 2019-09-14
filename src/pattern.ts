import { segmentRe, Segment } from './segments';

export type SegmentPosition = Record<Segment, [number, number]>;
export type SegmentState = {
  _start: number;
  _end: number;
  _segment: Segment;
  _section: 0 | 1; // beginDate | endDate
};

export interface Pattern {
  _pattern: string;
  _pos: (SegmentState | undefined)[];
  _all: SegmentState[];
  _slices: SegmentPosition[];
}

function defaultPosByName(): SegmentPosition {
  return { yyyy: [0, 0], MM: [0, 0], dd: [0, 0], HH: [0, 0], mm: [0, 0], ss: [0, 0], fff: [0, 0] };
}
export function parsePattern(pattern: string, range?: string | false): Pattern {
  let match;
  let pat = !range ? pattern : pattern + range + pattern;
  const firstSectionSize = pattern.length + (range ? range.length : 0);

  const pos = new Array(pat.length);
  const all: SegmentState[] = [];
  let slices: SegmentPosition[] = [defaultPosByName()];
  if (range) slices.push(defaultPosByName());

  while ((match = segmentRe.exec(pat))) {
    const start = match.index;
    const end = segmentRe.lastIndex;
    const segment = match[0] as Segment;
    const section = start >= firstSectionSize ? 1 : 0;
    const ss: SegmentState = {
      _start: start,
      _end: end,
      _section: section,
      _segment: segment,
    };
    pos.fill(ss, start, end);
    all.push(ss);
    slices[section][segment] = [start, end];
  }

  return {
    _pattern: pattern,
    _all: all,
    _pos: pos,
    _slices: slices,
  };
}

/**
 *
 *  -1: find previous segment
 *  1 : find next segment
 *  0 : find closest segment both ways
 */
export function closestSegment(
  segments: Pattern,
  index: number,
  dir: 1 | 0 | -1 = 0
): SegmentState | undefined {
  // return last segment if index is bigger or equals than the lenght of the patters
  if (index >= segments._pos.length) return segments._pos[segments._pos.length - 1];

  let seg = segments._pos[index];
  let decI = index;
  let incI = index;
  while (!seg && incI < segments._pos.length && decI > -1)
    seg =
      (dir < 1 ? segments._pos[--decI] : undefined) ||
      (dir > -1 ? segments._pos[++incI] : undefined);
  return seg;
}
