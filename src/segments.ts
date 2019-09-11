export type Segment = 'yyyy' | 'MM' | 'dd' | 'HH' | 'mm' | 'ss' | 'fff';

export const segmentList: Segment[] = ['yyyy', 'MM', 'dd', 'HH', 'mm', 'ss', 'fff'];

export const segmentMax: Record<Segment, string> = {
  yyyy: '5000',
  MM: '12',
  dd: '31',
  HH: '23',
  mm: '59',
  ss: '59',
  fff: '999',
};

export const segmentRe = /(yyyy|MM|dd|HH|mm|ss|fff)/g;

export function formatSegment(value: string | number = '', segment: Segment) {
  return `${value}`.padStart(segment.length, '0');
}
