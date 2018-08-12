const { getCorrectTime } = require('../../index');
const input = require('./data/input.json');
const output = require('./data/output.json');

describe('getCorrectTime', () => {
  test('correct Value', () => {
    const getTime = getCorrectTime(7);

    input.timeArray.forEach((value, i) => {
      expect(getTime(value)).toBe(output.timeArray[i]);
    });
  });
});
