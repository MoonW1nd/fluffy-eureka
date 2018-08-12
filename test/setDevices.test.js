const {
  setInSchedule,
  createResultObject,
  getCorrectTime,
  getRateArray,
  getRatesAmount,
  getOptimalTimeHash,
  filterDevices,
  setDevices,
} = require('../index');
const input = require('./data/input.json');

describe('getCorrectTime', () => {
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

  const resultSchedule = {
    '0': ['02DDD23A85DADDD71198305330CC386D', '1E6276CC231716FE8EE8BC908486D41E'],
    '1': ['02DDD23A85DADDD71198305330CC386D', '1E6276CC231716FE8EE8BC908486D41E'],
    '2': ['02DDD23A85DADDD71198305330CC386D', '1E6276CC231716FE8EE8BC908486D41E'],
    '3': [
      '02DDD23A85DADDD71198305330CC386D',
      '1E6276CC231716FE8EE8BC908486D41E',
      'C515D887EDBBE669B2FDAC62F571E9E9',
    ],
    '4': [
      '02DDD23A85DADDD71198305330CC386D',
      '1E6276CC231716FE8EE8BC908486D41E',
      'C515D887EDBBE669B2FDAC62F571E9E9',
    ],
    '5': ['02DDD23A85DADDD71198305330CC386D', '1E6276CC231716FE8EE8BC908486D41E'],
    '6': ['02DDD23A85DADDD71198305330CC386D', '1E6276CC231716FE8EE8BC908486D41E'],
    '7': ['02DDD23A85DADDD71198305330CC386D', '1E6276CC231716FE8EE8BC908486D41E'],
    '8': ['02DDD23A85DADDD71198305330CC386D', '1E6276CC231716FE8EE8BC908486D41E'],
    '9': ['02DDD23A85DADDD71198305330CC386D', '1E6276CC231716FE8EE8BC908486D41E'],
    '10': ['02DDD23A85DADDD71198305330CC386D', '1E6276CC231716FE8EE8BC908486D41E'],
    '11': ['02DDD23A85DADDD71198305330CC386D', '1E6276CC231716FE8EE8BC908486D41E'],
    '12': ['02DDD23A85DADDD71198305330CC386D', '1E6276CC231716FE8EE8BC908486D41E'],
    '13': ['02DDD23A85DADDD71198305330CC386D', '1E6276CC231716FE8EE8BC908486D41E'],
    '14': ['02DDD23A85DADDD71198305330CC386D', '1E6276CC231716FE8EE8BC908486D41E'],
    '15': ['02DDD23A85DADDD71198305330CC386D', '1E6276CC231716FE8EE8BC908486D41E'],
    '16': [
      '02DDD23A85DADDD71198305330CC386D',
      '1E6276CC231716FE8EE8BC908486D41E',
      '7D9DC84AD110500D284B33C82FE6E85E',
      'F972B82BA56A70CC579945773B6866FB',
    ],
    '17': [
      '02DDD23A85DADDD71198305330CC386D',
      '1E6276CC231716FE8EE8BC908486D41E',
      'F972B82BA56A70CC579945773B6866FB',
    ],
    '18': [
      '02DDD23A85DADDD71198305330CC386D',
      '1E6276CC231716FE8EE8BC908486D41E',
      'F972B82BA56A70CC579945773B6866FB',
    ],
    '19': ['02DDD23A85DADDD71198305330CC386D', '1E6276CC231716FE8EE8BC908486D41E'],
    '20': ['02DDD23A85DADDD71198305330CC386D', '1E6276CC231716FE8EE8BC908486D41E'],
    '21': ['02DDD23A85DADDD71198305330CC386D', '1E6276CC231716FE8EE8BC908486D41E'],
    '22': ['02DDD23A85DADDD71198305330CC386D', '1E6276CC231716FE8EE8BC908486D41E'],
    '23': ['02DDD23A85DADDD71198305330CC386D', '1E6276CC231716FE8EE8BC908486D41E'],
  };

  setDevices(notSetDevices, hashOptimalCosts, state);

  test('find correct schedule simple variation', () => {
    Object.keys(resultSchedule).forEach(hour => {
      expect(state.schedule[hour].length === resultSchedule[hour]);
      state.schedule[hour].forEach(device => {
        expect(resultSchedule[hour].includes(device.id));
      });
    });
  });

  test('consumed evergy check', () => {
    let sum = 0;
    let sumDevices = {
      '02DDD23A85DADDD71198305330CC386D': 0,
      '1E6276CC231716FE8EE8BC908486D41E': 0,
      '7D9DC84AD110500D284B33C82FE6E85E': 0,
      C515D887EDBBE669B2FDAC62F571E9E9: 0,
      F972B82BA56A70CC579945773B6866FB: 0,
    };

    const expectedConsumedEnergy = {
      value: 38.939,
      devices: {
        F972B82BA56A70CC579945773B6866FB: 5.1015,
        C515D887EDBBE669B2FDAC62F571E9E9: 21.52,
        '02DDD23A85DADDD71198305330CC386D': 5.398,
        '1E6276CC231716FE8EE8BC908486D41E': 5.398,
        '7D9DC84AD110500D284B33C82FE6E85E': 1.5215,
      },
    };

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
