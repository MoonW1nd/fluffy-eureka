const { setInSchedule, createResultObject, getCorrectTime } = require('../../index');
const input = require('./data/input.json');
const output = require('./data/output.json');

describe('getCorrectTime', () => {
  const state = {
    getTime: getCorrectTime(7),
    schedule: createResultObject().schedule,
    allowPower: Array(24).fill(2100),
  };

  test('correct Value', () => {
    const expectedScheduleId = output.expected.schedule;
    const { devices, ranges } = input;

    devices.forEach((device, index) => {
      setInSchedule({
        device,
        time: ranges[index],
        state,
      });
    });

    Object.keys(expectedScheduleId).forEach(key => {
      expectedScheduleId[key].forEach((id, i) => {
        expect(state.schedule[key][i].id === id).toBe(true);
      });
    });
  });
});
