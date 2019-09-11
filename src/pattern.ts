import { segmentRe, Segment } from './segments';

export type SegmentPosition = Record<Segment, [number, number]>;
export type SegmentState = {
  start: number;
  end: number;
  segment: Segment;
  section: 0 | 1; // beginDate | endDate
};

export interface Pattern {
  pattern: string;
  pos: (SegmentState | undefined)[];
  slices: SegmentPosition[];
}

function defaultPosByName(): SegmentPosition {
  return { yyyy: [0, 0], MM: [0, 0], dd: [0, 0], HH: [0, 0], mm: [0, 0], ss: [0, 0], fff: [0, 0] };
}
export function parsePattern(pattern: string, range?: string | false): Pattern {
  let match;
  let pat = !range ? pattern : pattern + range + pattern;
  const firstSectionSize = pattern.length + (range ? range.length : 0);

  const pos = new Array(pat.length);

  let slices: SegmentPosition[] = [defaultPosByName()];
  if (range) slices.push(defaultPosByName());

  while ((match = segmentRe.exec(pat))) {
    const start = match.index;
    const end = segmentRe.lastIndex;
    const segment = match[0] as Segment;
    const section = start >= firstSectionSize ? 1 : 0;
    const ss: SegmentState = {
      start,
      end,
      section,
      segment,
    };
    pos.fill(ss, start, end);
    slices[section][segment] = [start, end];
  }

  return {
    pattern,
    pos,
    slices,
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
  if (index >= segments.pos.length) return segments.pos[segments.pos.length - 1];

  let seg = segments.pos[index];
  let decI = index;
  let incI = index;
  while (!seg && incI < segments.pos.length && decI > -1)
    seg =
      (dir < 1 ? segments.pos[--decI] : undefined) || (dir > -1 ? segments.pos[++incI] : undefined);
  return seg;
}
