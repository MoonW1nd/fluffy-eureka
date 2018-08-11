const { getCorrectTime } = require('../index');

describe('getCorrectTime', () => {
  test('correct Value', () => {
    const expected = [
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      0,
      1,
      2,
      3,
      4,
      5,
      6,
    ];
    const input = [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
    ];
    const getTime = getCorrectTime(7);

    input.forEach((value, i) => {
      expect(getTime(value)).toBe(expected[i]);
    });
  });
});
