import { dateAdd } from '../src/date';

describe('date', () => {
  it('add', () => {
    const d = new Date(2018, 0, 1);
    expect(dateAdd(d, 'yyyy', 1).toJSON()).toMatchInlineSnapshot(
      `"2019-01-01T00:00:00.000Z"`
    );
    expect(dateAdd(d, 'MM', 1).toJSON()).toMatchInlineSnapshot(
      `"2018-02-01T00:00:00.000Z"`
    );
    expect(dateAdd(d, 'dd', 1).toJSON()).toMatchInlineSnapshot(
      `"2018-01-02T00:00:00.000Z"`
    );
    expect(dateAdd(d, 'HH', 1).toJSON()).toMatchInlineSnapshot(
      `"2018-01-01T01:00:00.000Z"`
    );
    expect(dateAdd(d, 'mm', 1).toJSON()).toMatchInlineSnapshot(
      `"2018-01-01T00:01:00.000Z"`
    );
    expect(dateAdd(d, 'ss', 1).toJSON()).toMatchInlineSnapshot(
      `"2018-01-01T00:00:01.000Z"`
    );
    expect(dateAdd(d, 'fff', 1).toJSON()).toMatchInlineSnapshot(
      `"2018-01-01T00:00:00.001Z"`
    );
  });

  it('subtracts', () => {
    const d = new Date(2018, 0, 1);
    expect(dateAdd(d, 'yyyy', -1).toJSON()).toMatchInlineSnapshot(
      `"2017-01-01T00:00:00.000Z"`
    );
    expect(dateAdd(d, 'MM', -1).toJSON()).toMatchInlineSnapshot(
      `"2017-12-01T00:00:00.000Z"`
    );
    expect(dateAdd(d, 'dd', -1).toJSON()).toMatchInlineSnapshot(
      `"2017-12-31T00:00:00.000Z"`
    );
    expect(dateAdd(d, 'HH', -1).toJSON()).toMatchInlineSnapshot(
      `"2017-12-31T23:00:00.000Z"`
    );
    expect(dateAdd(d, 'mm', -1).toJSON()).toMatchInlineSnapshot(
      `"2017-12-31T23:59:00.000Z"`
    );
    expect(dateAdd(d, 'ss', -1).toJSON()).toMatchInlineSnapshot(
      `"2017-12-31T23:59:59.000Z"`
    );
    expect(dateAdd(d, 'fff', -1).toJSON()).toMatchInlineSnapshot(
      `"2017-12-31T23:59:59.999Z"`
    );
  });

  it('works in february', () => {
    const d = new Date(2018, 2, 1);
    expect(dateAdd(d, 'yyyy', -1).toJSON()).toMatchInlineSnapshot(
      `"2017-03-01T00:00:00.000Z"`
    );
    expect(dateAdd(d, 'MM', -1).toJSON()).toMatchInlineSnapshot(
      `"2018-02-01T00:00:00.000Z"`
    );
    expect(dateAdd(d, 'dd', -1).toJSON()).toMatchInlineSnapshot(
      `"2018-02-28T00:00:00.000Z"`
    );
    expect(dateAdd(d, 'HH', -1).toJSON()).toMatchInlineSnapshot(
      `"2018-02-28T23:00:00.000Z"`
    );
    expect(dateAdd(d, 'mm', -1).toJSON()).toMatchInlineSnapshot(
      `"2018-02-28T23:59:00.000Z"`
    );
    expect(dateAdd(d, 'ss', -1).toJSON()).toMatchInlineSnapshot(
      `"2018-02-28T23:59:59.000Z"`
    );
    expect(dateAdd(d, 'fff', -1).toJSON()).toMatchInlineSnapshot(
      `"2018-02-28T23:59:59.999Z"`
    );
  });
});
