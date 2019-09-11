import { Pattern, parsePattern, SegmentState, closestSegment } from './pattern';
import { K_RIGHT, K_LEFT, K_UP, K_DOWN, K_ESC, K_SPACE } from './const';
import { Parts, PartsSection, drToParts, partsToDr } from './parts';
import { segmentRe, Segment, formatSegment, segmentMax } from './segments';
import { DateRange, DateOrRange, drGet, drSet, drIsEqual, drIsValid } from './range';
import { dateAdd } from './date';

export type DateInputManager = ReturnType<typeof dateInputManager>;

export type DateInputOptions = {
  pattern: string;
  placeholderChar: string;
} & (
  | {
      range?: false;
      onChange(date: Date | undefined): void;
      value?: Date;
    }
  | {
      range: string;
      onChange(date: DateRange | undefined): void;
      value?: DateRange;
    });

export function dateInputManager(input: HTMLInputElement) {
  let mouseDown = false;
  let patternObj: Pattern;
  let pattern: string;
  let placeholderChar: string;
  let range: string | false | undefined;
  let selected: SegmentState | undefined;
  let partsSection: PartsSection;
  let edit: string | undefined;
  let value: DateOrRange | undefined;
  let onChange: (date: any) => void;

  function set(o: DateInputOptions) {
    if (o.pattern !== pattern || o.range !== range) patternObj = parsePattern(o.pattern, o.range);
    ({ pattern, range, placeholderChar, value, onChange } = o);
    setValue(o.value);
  }

  function select(segment?: SegmentState) {
    if (segment) {
      selected = segment;
      input.setSelectionRange(segment.start, segment.end);
    }
  }

  function formatPartsImpl(parts: Parts, section: number) {
    return pattern.replace(segmentRe, segment => {
      const part = parts[segment as Segment];
      if (
        edit !== undefined &&
        selected &&
        segment == selected.segment &&
        section === selected.section
      )
        return edit.padStart(segment.length, placeholderChar);

      return part === undefined
        ? placeholderChar.repeat(segment.length)
        : formatSegment(part, segment as Segment);
    });
  }

  function setInputValue() {
    input.value =
      partsSection.length === 2
        ? formatPartsImpl(partsSection[0], 0) + range + formatPartsImpl(partsSection[1], 1)
        : formatPartsImpl(partsSection[0], 0);
    select(selected);
  }

  function setValue(v: DateOrRange) {
    if (!drIsEqual(value, v)) onChange(v);
    value = v;
    partsSection = drToParts(v, range);
    setInputValue();
  }

  function increaseCurrentSegment(ammount: number = 1) {
    if (edit || !selected) return;

    const { section, segment } = selected;
    const date = drGet(value, section);

    if (date) setValue(drSet(value, section, dateAdd(date, segment, ammount)));
  }

  function editCurrentSegment(key: string) {
    if (!selected) return;
    const { section, segment } = selected;

    // const parts = partsSection.slice(0) as PartsSection;
    const max = segmentMax[segment];
    // let segmentValue = ''; // = partsSection[section]![segment] || '';
    let moveToNext: boolean;

    if (edit === undefined) {
      moveToNext = +key > +max[0];
      edit = moveToNext ? key.padStart(max.length, '0') : key;
    } else {
      const newValue = edit + key;
      edit = +newValue < +max ? newValue : max;
      moveToNext = edit.length === max.length;
    }

    setInputValue();

    if (moveToNext) {
      partsSection[section]![segment] = +edit;
      finishEdit(false);
      select(closestSegment(patternObj, selected.end, 1));
    }
  }

  function finishEdit(end = true) {
    edit = undefined;
    const dr = partsToDr(partsSection, range);
    if (end) {
      setValue(drIsValid(dr) ? dr : value);
    } else {
      if (drIsValid(dr)) {
        setValue(dr);
      }
    }
  }

  function copyAll() {
    const { selectionStart, selectionEnd } = input;
    input.setSelectionRange(0, input.value.length);
    setTimeout(() => input.setSelectionRange(selectionStart!, selectionEnd!), 300);
  }

  function handleMouseDown() {
    mouseDown = true;
  }

  function handleMouseUp(e: MouseEvent) {
    mouseDown = false;
    select(closestSegment(patternObj, input.selectionStart!));
    e.preventDefault();
  }

  function handleKeyDown(e: KeyboardEvent) {
    console.log(e.key, e.keyCode, +e.key);

    if (!selected) return;
    if (e.keyCode === K_RIGHT) !edit && select(closestSegment(patternObj, selected.end, 1));
    else if (e.keyCode === K_LEFT)
      !edit && select(closestSegment(patternObj, selected.start - 1, -1));
    else if (e.keyCode === K_UP) increaseCurrentSegment(1);
    else if (e.keyCode === K_DOWN) increaseCurrentSegment(-1);
    else if (e.keyCode === K_ESC) finishEdit();
    // else if (e.keyCode === K_BACKSPACE) finishEdit();
    else if (e.keyCode !== K_SPACE && !isNaN(+e.key)) editCurrentSegment(e.key);
    else if (e.key === 'c' && (e.ctrlKey || e.metaKey)) return copyAll();

    // else return;
    e.preventDefault();
  }

  function handleFocus() {
    if (!mouseDown) select(patternObj.pos[0]);
  }
  function handleBlur() {
    mouseDown = false;
    selected = undefined;
    //Set the edited value or reset
    finishEdit();
  }

  input.addEventListener('mousedown', handleMouseDown);
  input.addEventListener('keydown', handleKeyDown);
  input.addEventListener('mouseup', handleMouseUp);
  input.addEventListener('focus', handleFocus);
  input.addEventListener('blur', handleBlur);

  function dispose() {
    input.removeEventListener('mousedown', handleMouseDown);
    input.removeEventListener('keydown', handleKeyDown);
    input.removeEventListener('mouseup', handleMouseUp);
    input.removeEventListener('focus', handleFocus);
    input.removeEventListener('blur', handleBlur);
  }

  return {
    dispose,
    set,
  };
}
