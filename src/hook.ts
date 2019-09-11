import { useRef, useLayoutEffect } from 'react';
import {
  dateInputManager,
  DateInputManager,
  DateInputOptions,
} from './manager';

export function useDateInput(o: DateInputOptions) {
  const inputRef = useRef<HTMLInputElement>(null);
  const dimRef = useRef<DateInputManager>();

  useLayoutEffect(
    () => (dimRef.current = dateInputManager(inputRef.current!)).dispose,
    []
  );
  useLayoutEffect(() => dimRef.current && dimRef.current.set(o), [
    o.value,
    o.onChange,
  ]);
  return inputRef;
}
