const { getRatesAmount, getRateArray } = require('../../index');
const input = require('./data/input');
const output = require('./data/output');
const ratesArray = getRateArray(input.rates, 7);

describe('getRatesAmount', () => {
  test('output is Array', () => {
    expect(Array.isArray(getRatesAmount(ratesArray))).toBe(true);
  });

  test('correct Value', () => {
    const result = getRatesAmount(ratesArray);

    result.forEach((value, i) => {
      expect(value).toBe(output.expected[i]);
    });
  });
});
