import { Pattern, parsePattern, SegmentState, closestSegment } from './pattern';
import { K_RIGHT, K_LEFT, K_UP, K_DOWN, K_ESC, K_SPACE, K_TAB, K_BACKSPACE } from './const';
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
      input.setSelectionRange(segment._start, segment._end);
    }
  }

  function formatPartsImpl(parts: Parts, section: number) {
    return pattern.replace(segmentRe, segment => {
      const part = parts[segment as Segment];
      if (
        edit !== undefined &&
        selected &&
        segment == selected._segment &&
        section === selected._section
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

    const { _section: section, _segment: segment } = selected;
    const date = drGet(value, section);

    if (date) setValue(drSet(value, section, dateAdd(date, segment, ammount)));
  }

  function editCurrentSegment(key: string) {
    if (!selected) return;
    const { _section: section, _segment: segment } = selected;

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
      select(closestSegment(patternObj, selected._end, 1));
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

  function setPartData(
    { _segment: segment, _section: section }: SegmentState,
    data: string
  ): boolean {
    const did = !isNaN(+data) && data.length <= segment.length;
    if (did) partsSection[section]![segment] = +data;
    return did;
  }

  const events: Record<string, any> = {
    mousedown() {
      mouseDown = true;
    },
    mouseup(e: MouseEvent) {
      mouseDown = false;
      select(closestSegment(patternObj, input.selectionStart!));
      e.preventDefault();
    },
    focus() {
      if (!mouseDown) requestAnimationFrame(() => select(patternObj._pos[0]));
    },
    blur() {
      mouseDown = false;
      selected = undefined;
      //Set the edited value or reset
      finishEdit();
    },
    cut(e: Event) {
      e.preventDefault();
    },
    copy() {
      const { selectionStart, selectionEnd } = input;
      input.setSelectionRange(0, input.value.length);
      setTimeout(() => input.setSelectionRange(selectionStart!, selectionEnd!), 300);
    },
    paste(e: ClipboardEvent) {
      e.preventDefault();
      if (e.clipboardData) {
        const data = e.clipboardData.getData('text/plain');
        if (!selected || !setPartData(selected, data)) {
          patternObj._all.some(ss => {
            const done = ss._end > data.length;
            if (!done) setPartData(ss, data.substring(ss._start, ss._end));
            return done;
          });
        }
        setInputValue();
        finishEdit(false);
      }
    },
    keydown(e: KeyboardEvent) {
      const code = e.keyCode;
      const ctrl = e.ctrlKey || e.metaKey;
      const key = e.key;
      if (!selected || code === K_TAB) return;
      if (code === K_RIGHT) !edit && select(closestSegment(patternObj, selected._end, 1));
      else if (code === K_LEFT)
        !edit && select(closestSegment(patternObj, selected._start - 1, -1));
      else if (code === K_UP) increaseCurrentSegment(1);
      else if (code === K_DOWN) increaseCurrentSegment(-1);
      else if (code === K_ESC) finishEdit();
      else if (code === K_BACKSPACE) finishEdit();
      else if (code !== K_SPACE && !isNaN(+key)) editCurrentSegment(key);
      else if (key === 'c' && ctrl) return;
      // copyAll();
      else if (key === 'v' && ctrl) return;
      e.preventDefault();
    },
  };

  const eventList = Object.keys(events) as (keyof HTMLElementEventMap)[];
  eventList.forEach(name => input.addEventListener(name, events[name]));

  function dispose() {
    eventList.forEach(name => input.removeEventListener(name, events[name]));
  }

  return {
    dispose,
    set,
  };
}
