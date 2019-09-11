import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { useDateInput, DateRange } from '../src/index';

function DateInput() {
  const [date, setDate] = React.useState<Date | undefined>(/* new Date() */);
  const ref = useDateInput({
    value: date,
    onChange: setDate,
    pattern: 'yyyy-MM-dd',
    placeholderChar: '_',
  });
  return (
    <div>
      <input ref={ref} />
      {date && date.toISOString()}
    </div>
  );
}

function DateRangeInput() {
  const [date, setDate] = React.useState<DateRange | undefined>([new Date(), new Date()]);
  const ref = useDateInput({
    value: date,
    onChange: setDate,
    pattern: 'yyyy-MM-dd',
    placeholderChar: '_',
    range: ' - ',
  });
  return <input ref={ref} />;
}

const App = () => {
  return (
    <div>
      <DateInput />
      <DateRangeInput />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
