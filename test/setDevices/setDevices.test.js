const {
  setInSchedule,
  createResultObject,
  getCorrectTime,
  getRateArray,
  getRatesAmount,
  getOptimalTimeHash,
  filterDevices,
  setDevices,
} = require('../../index');
const input = require('./data/input.json');
const output = require('./data/output.json');

describe('setDevices', () => {
  const state = {
    getTime: getCorrectTime(7),
    schedule: createResultObject().schedule,
    allowPower: Array(24).fill(2100),
  };
  const devices = input.devices.slice();
  const ratesArray = getRateArray(input.rates, 7);
  const ratesAmount = getRatesAmount(ratesArray);
  let notSetDevices = filterDevices(devices, state);
  const hashOptimalCosts = getOptimalTimeHash(notSetDevices, ratesAmount);
  notSetDevices.sort((a, b) => b.power - a.power);

  const resultSchedule = output.expected.schedule;

  setDevices(notSetDevices, hashOptimalCosts, state);

  test('find correct schedule simple variation', () => {
    Object.keys(resultSchedule).forEach(hour => {
      expect(state.schedule[hour].length === resultSchedule[hour].length).toBe(true);
      state.schedule[hour].forEach(device => {
        expect(resultSchedule[hour].includes(device.id)).toBe(true);
      });
    });
  });

  test('consumed energy check', () => {
    let sum = 0;
    let sumDevices = {
      '02DDD23A85DADDD71198305330CC386D': 0,
      '1E6276CC231716FE8EE8BC908486D41E': 0,
      '7D9DC84AD110500D284B33C82FE6E85E': 0,
      C515D887EDBBE669B2FDAC62F571E9E9: 0,
      F972B82BA56A70CC579945773B6866FB: 0,
    };

    const { expectedConsumedEnergy } = output.expected;

    ratesArray.forEach((rate, index) => {
      state.schedule[index].forEach(device => {
        sum += (ratesArray[index] * device.power) / 1000;
        sum = Number(sum.toFixed(4));
        sumDevices[device.id] += (ratesArray[index] * device.power) / 1000;
        sumDevices[device.id] = Number(sumDevices[device.id].toFixed(4));
      });
    });
    expect(expectedConsumedEnergy.value === sum).toBe(true);
    Object.keys(expectedConsumedEnergy.devices).forEach(id => {
      expect(expectedConsumedEnergy.devices[id] === sumDevices[id]).toBe(true);
    });
  });
});
