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
    resultObject: createResultObject(),
    allowPower: Array(24).fill(2100),
  };
  const devices = input.devices.slice();
  const ratesArray = getRateArray(input.rates, 7);
  const ratesAmount = getRatesAmount(ratesArray);
  let notSetDevices = filterDevices(devices, state);
  const hashOptimalCosts = getOptimalTimeHash(notSetDevices, ratesAmount);
  notSetDevices.sort((a, b) => b.power - a.power);

  const resultSchedule = {
    '0': [
      '02DDD23A85DADDD71198305330CC386D',
      '1E6276CC231716FE8EE8BC908486D41E',
      'F972B82BA56A70CC579945773B6866FB',
    ],
    '1': [
      '02DDD23A85DADDD71198305330CC386D',
      '1E6276CC231716FE8EE8BC908486D41E',
      'F972B82BA56A70CC579945773B6866FB',
    ],
    '2': ['02DDD23A85DADDD71198305330CC386D', '1E6276CC231716FE8EE8BC908486D41E'],
    '3': ['02DDD23A85DADDD71198305330CC386D', '1E6276CC231716FE8EE8BC908486D41E'],
    '4': ['02DDD23A85DADDD71198305330CC386D', '1E6276CC231716FE8EE8BC908486D41E'],
    '5': ['02DDD23A85DADDD71198305330CC386D', '1E6276CC231716FE8EE8BC908486D41E'],
    '6': ['02DDD23A85DADDD71198305330CC386D', '1E6276CC231716FE8EE8BC908486D41E'],
    '7': ['02DDD23A85DADDD71198305330CC386D', '1E6276CC231716FE8EE8BC908486D41E'],
    '8': ['02DDD23A85DADDD71198305330CC386D', '1E6276CC231716FE8EE8BC908486D41E'],
    '9': ['02DDD23A85DADDD71198305330CC386D', '1E6276CC231716FE8EE8BC908486D41E'],
    '10': [
      '02DDD23A85DADDD71198305330CC386D',
      '1E6276CC231716FE8EE8BC908486D41E',
      'C515D887EDBBE669B2FDAC62F571E9E9',
    ],
    '11': [
      '02DDD23A85DADDD71198305330CC386D',
      '1E6276CC231716FE8EE8BC908486D41E',
      'C515D887EDBBE669B2FDAC62F571E9E9',
    ],
    '12': ['02DDD23A85DADDD71198305330CC386D', '1E6276CC231716FE8EE8BC908486D41E'],
    '13': ['02DDD23A85DADDD71198305330CC386D', '1E6276CC231716FE8EE8BC908486D41E'],
    '14': ['02DDD23A85DADDD71198305330CC386D', '1E6276CC231716FE8EE8BC908486D41E'],
    '15': ['02DDD23A85DADDD71198305330CC386D', '1E6276CC231716FE8EE8BC908486D41E'],
    '16': ['02DDD23A85DADDD71198305330CC386D', '1E6276CC231716FE8EE8BC908486D41E'],
    '17': ['02DDD23A85DADDD71198305330CC386D', '1E6276CC231716FE8EE8BC908486D41E'],
    '18': ['02DDD23A85DADDD71198305330CC386D', '1E6276CC231716FE8EE8BC908486D41E'],
    '19': ['02DDD23A85DADDD71198305330CC386D', '1E6276CC231716FE8EE8BC908486D41E'],
    '20': ['02DDD23A85DADDD71198305330CC386D', '1E6276CC231716FE8EE8BC908486D41E'],
    '21': ['02DDD23A85DADDD71198305330CC386D', '1E6276CC231716FE8EE8BC908486D41E'],
    '22': ['02DDD23A85DADDD71198305330CC386D', '1E6276CC231716FE8EE8BC908486D41E'],
    '23': [
      '02DDD23A85DADDD71198305330CC386D',
      '1E6276CC231716FE8EE8BC908486D41E',
      '7D9DC84AD110500D284B33C82FE6E85E',
      'F972B82BA56A70CC579945773B6866FB',
    ],
  };

  setDevices(notSetDevices, hashOptimalCosts, state);

  test('find correct schedule simple variation', () => {
    Object.keys(resultSchedule).forEach(hour => {
      resultSchedule[hour].forEach((deviceId, i) => {
        expect(state.resultObject.schedule[hour].includes(deviceId)).toBe(true);
      });
    });
  });

  test('consumed evergy check', () => {
    const devicesById = {
      '02DDD23A85DADDD71198305330CC386D': 50,
      '1E6276CC231716FE8EE8BC908486D41E': 50,
      '7D9DC84AD110500D284B33C82FE6E85E': 850,
      C515D887EDBBE669B2FDAC62F571E9E9: 2000,
      F972B82BA56A70CC579945773B6866FB: 950,
    };

    let sum = 0;
    let sumDevices = {
      '02DDD23A85DADDD71198305330CC386D': 0,
      '1E6276CC231716FE8EE8BC908486D41E': 0,
      '7D9DC84AD110500D284B33C82FE6E85E': 0,
      C515D887EDBBE669B2FDAC62F571E9E9: 0,
      F972B82BA56A70CC579945773B6866FB: 0,
    };

    const ratesForTest = [
      1.79,
      1.79,
      1.79,
      1.79,
      1.79,
      1.79,
      1.79,
      6.46,
      6.46,
      6.46,
      5.38,
      5.38,
      5.38,
      5.38,
      5.38,
      5.38,
      5.38,
      6.46,
      6.46,
      6.46,
      6.46,
      5.38,
      5.38,
      1.79,
    ];

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
      state.resultObject.schedule[index].forEach(id => {
        sum += (ratesForTest[index] * devicesById[id]) / 1000;
        sum = Number(sum.toFixed(4));
        sumDevices[id] += (ratesForTest[index] * devicesById[id]) / 1000;
        sumDevices[id] = Number(sumDevices[id].toFixed(4));
      });
    });
    expect(expectedConsumedEnergy.value === sum).toBe(true);
    Object.keys(expectedConsumedEnergy.devices).forEach(id => {
      expect(expectedConsumedEnergy.devices[id] === sumDevices[id]).toBe(true);
    });
  });
});
