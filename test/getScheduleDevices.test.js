const input = require('./data/input.json');
const output = require('./data/output.json');
const { getScheduleDevices } = require('../index');

describe('setDevices', () => {
  let result = getScheduleDevices(input);

  test('get correct value in schedule', () => {
    Object.keys(output.schedule).forEach(hour => {
      expect(result.schedule[hour].length === output.schedule[hour].length).toBe(true);
      output.schedule[hour].forEach(deviceId => {
        expect(result.schedule[hour].includes(deviceId)).toBe(true);
      });
    });
  });

  test('get correct sum value', () => {
    expect(result.consumedEnergy.value === output.consumedEnergy.value).toBe(true);
  });

  test('get correct sum devices value', () => {
    Object.keys(output.consumedEnergy.devices).forEach(deviceId => {
      expect(
        output.consumedEnergy.devices[deviceId] === result.consumedEnergy.devices[deviceId]
      ).toBe(true);
    });
  });
});
