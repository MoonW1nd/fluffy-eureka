const input = require('./data/input.json');
const output = require('./data/output.json');
const { checkAllowSetForPower } = require('../../index');

describe('checkAllowSetForPower', () => {
  const { devices, allowPower } = input;

  test('allow set', () => {
    expect(
      output.expected[0] ===
        checkAllowSetForPower(devices[0].from, devices[0].to, devices[0].power, allowPower)
    ).toBe(true);
  });

  test('not allow set', () => {
    expect(
      output.expected[1] ===
        checkAllowSetForPower(devices[1].from, devices[1].to, devices[1].power, allowPower)
    ).toBe(true);
  });
});
