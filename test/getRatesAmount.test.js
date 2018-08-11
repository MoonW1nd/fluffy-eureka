const { getRatesAmount, getRateArray } = require('../index');
const data = require('./data/input');
const ratesArray = getRateArray(data.rates, 7);

describe('getRatesAmount', () => {
  test('output is Array', () => {
    expect(Array.isArray(getRatesAmount(ratesArray))).toBe(true);
  });

  test('correct Value', () => {
    const expected = [
      0,
      6.46,
      12.92,
      19.38,
      24.76,
      30.14,
      35.52,
      40.9,
      46.28,
      51.66,
      57.04,
      63.5,
      69.96,
      76.42,
      82.88,
      88.26,
      93.64,
      95.43,
      97.22,
      99.01,
      100.8,
      102.59,
      104.38,
      106.17,
      107.96,
    ];
    const result = getRatesAmount(ratesArray);

    result.forEach((value, i) => {
      expect(value).toBe(expected[i]);
    });
  });
});
