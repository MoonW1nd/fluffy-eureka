const {
  setInSchedule,
  createResultObject,
  getCorrectTime,
  getRateArray,
  getRatesAmount,
  getOptimalTimeHash,
  filterDevices,
  setDevices,
  findSwitchOption,
} = require('../../index');
const input = require('./data/input.json');
const output = require('./data/output.json');

describe('findSwitchOption', () => {
  const state = {
    getTime: getCorrectTime(7),
    schedule: createResultObject().schedule,
    allowPower: Array(24).fill(2100),
  };
  const devices = input.devices.slice();

  const setDevice = {
    id: 'TEST',
    name: 'TEST',
    power: 900,
    duration: 16,
  };

  devices.push(setDevice);
  const ratesArray = getRateArray(input.rates, 7);
  const ratesAmount = getRatesAmount(ratesArray);
  let notSetDevices = filterDevices(devices, state);
  const hashOptimalCosts = getOptimalTimeHash(notSetDevices, ratesAmount);
  notSetDevices.sort((a, b) => b.power - a.power);

  state.schedule = input.schedule;
  state.allowPower = input.allowPower;

  test('find correct schedule', () => {
    findSwitchOption(setDevice, hashOptimalCosts, state);
    Object.keys(output).forEach(hour => {
      expect(state.schedule[hour].length === output[hour].length).toBe(true);
      state.schedule[hour].forEach((device, i) => {
        expect(output[hour][i].id === device.id).toBe(true);
      });
    });
  });
});
