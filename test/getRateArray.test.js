const { getRateArray } = require('../index');
const data = require('./data/input');

describe('getRateArray', () => {
  test('output is Array', () => {
    expect(Array.isArray(getRateArray(data.rates, 7))).toBe(true);
  });

  test('correct Value', () => {
    const expected = [
      6.46,
      6.46,
      6.46,
      5.38,
      5.38,
      5.38,
      5.38,
      5.38,
      5.38,
      5.38,
      6.46,
      6.46,
      6.46,
      6.46,
      5.38,
      5.38,
      1.79,
      1.79,
      1.79,
      1.79,
      1.79,
      1.79,
      1.79,
      1.79,
    ];
    const result = getRateArray(data.rates, 7);

    result.forEach((value, i) => {
      expect(value).toBe(expected[i]);
    });
  });
});
