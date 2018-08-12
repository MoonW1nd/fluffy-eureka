const { setInSchedule, createResultObject, getCorrectTime, filterDevices } = require('../../index');
const input = require('./data/input');
const output = require('./data/output');

describe('filterDevices', () => {
  const state = {
    getTime: getCorrectTime(7),
    schedule: createResultObject().schedule,
    allowPower: Array(24).fill(2100),
  };
  const device = input.devices.slice();
  const { expectedIdDevices } = output;

  const notSetDevices = filterDevices(device, state);

  test('correct device length', () => {
    notSetDevices.forEach(device => {
      expect(notSetDevices.length).toBe(3);
    });
  });

  test('correct Value', () => {
    notSetDevices.forEach(device => {
      expect(expectedIdDevices.includes(device.id)).toBe(true);
    });
  });
});
