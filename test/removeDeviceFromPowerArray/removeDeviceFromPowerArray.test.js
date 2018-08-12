const input = require('./data/input.json');
const output = require('./data/output.json');
const { removeDeviceFromPowerArray } = require('../../index');

describe('removeDeviceFromPowerArray', () => {
  const result = removeDeviceFromPowerArray(input.device, input.allowPower);
  test('device removed', () => {
    output.allowPower.forEach((power, i) => {
      expect(result[i] === power).toBe(true);
    });
  });
});
