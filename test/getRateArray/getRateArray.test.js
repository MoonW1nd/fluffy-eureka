const { getRateArray } = require('../../index');
const input = require('./data/input');
const output = require('./data/output');

describe('getRateArray', () => {
  test('output is Array', () => {
    expect(Array.isArray(getRateArray(input.rates, 7))).toBe(true);
  });

  test('correct Value', () => {
    const result = getRateArray(input.rates, 7);

    result.forEach((value, i) => {
      expect(value).toBe(output.expected[i]);
    });
  });
});
