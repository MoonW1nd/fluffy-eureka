const input = require('./data/input.json');
const output = require('./data/output.json');
const { removeDeviceFromSchedule } = require('../../index');

describe('removeDeviceFromSchedule', () => {
  const result = removeDeviceFromSchedule(input.device, input.schedule);
  test('device removed', () => {
    Object.keys(output.schedule).forEach(hour => {
      expect(result[hour].length === output.schedule[hour].length).toBe(true);
      output.schedule[hour].forEach((device, i) => {
        expect(result[hour][i].id === device.id).toBe(true);
      });
    });
  });
});
