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
} = require('../index');
const input = require('./data/input.json');

describe('getCorrectTime', () => {
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

  const resultSchedule = {
    '0': [
      {
        id: '02DDD23A85DADDD71198305330CC386D',
        name: 'Холодильник',
        power: 50,
        duration: 24,
      },
      {
        id: '1E6276CC231716FE8EE8BC908486D41E',
        name: 'Термостат',
        power: 50,
        duration: 24,
      },
    ],
    '1': [
      {
        id: '02DDD23A85DADDD71198305330CC386D',
        name: 'Холодильник',
        power: 50,
        duration: 24,
      },
      {
        id: '1E6276CC231716FE8EE8BC908486D41E',
        name: 'Термостат',
        power: 50,
        duration: 24,
      },
    ],
    '2': [
      {
        id: '02DDD23A85DADDD71198305330CC386D',
        name: 'Холодильник',
        power: 50,
        duration: 24,
      },
      {
        id: '1E6276CC231716FE8EE8BC908486D41E',
        name: 'Термостат',
        power: 50,
        duration: 24,
      },
    ],
    '3': [
      {
        id: '02DDD23A85DADDD71198305330CC386D',
        name: 'Холодильник',
        power: 50,
        duration: 24,
      },
      {
        id: '1E6276CC231716FE8EE8BC908486D41E',
        name: 'Термостат',
        power: 50,
        duration: 24,
      },
      {
        id: 'C515D887EDBBE669B2FDAC62F571E9E9',
        name: 'Духовка',
        power: 2000,
        duration: 2,
        mode: 'day',
      },
    ],
    '4': [
      {
        id: '02DDD23A85DADDD71198305330CC386D',
        name: 'Холодильник',
        power: 50,
        duration: 24,
      },
      {
        id: '1E6276CC231716FE8EE8BC908486D41E',
        name: 'Термостат',
        power: 50,
        duration: 24,
      },
      {
        id: 'C515D887EDBBE669B2FDAC62F571E9E9',
        name: 'Духовка',
        power: 2000,
        duration: 2,
        mode: 'day',
      },
    ],
    '5': [
      {
        id: '02DDD23A85DADDD71198305330CC386D',
        name: 'Холодильник',
        power: 50,
        duration: 24,
      },
      {
        id: '1E6276CC231716FE8EE8BC908486D41E',
        name: 'Термостат',
        power: 50,
        duration: 24,
      },
    ],
    '6': [
      {
        id: '02DDD23A85DADDD71198305330CC386D',
        name: 'Холодильник',
        power: 50,
        duration: 24,
      },
      {
        id: '1E6276CC231716FE8EE8BC908486D41E',
        name: 'Термостат',
        power: 50,
        duration: 24,
      },
    ],
    '7': [
      {
        id: '02DDD23A85DADDD71198305330CC386D',
        name: 'Холодильник',
        power: 50,
        duration: 24,
      },
      {
        id: '1E6276CC231716FE8EE8BC908486D41E',
        name: 'Термостат',
        power: 50,
        duration: 24,
      },
    ],
    '8': [
      {
        id: '02DDD23A85DADDD71198305330CC386D',
        name: 'Холодильник',
        power: 50,
        duration: 24,
      },
      {
        id: '1E6276CC231716FE8EE8BC908486D41E',
        name: 'Термостат',
        power: 50,
        duration: 24,
      },
    ],
    '9': [
      {
        id: '02DDD23A85DADDD71198305330CC386D',
        name: 'Холодильник',
        power: 50,
        duration: 24,
      },
      {
        id: '1E6276CC231716FE8EE8BC908486D41E',
        name: 'Термостат',
        power: 50,
        duration: 24,
      },
    ],
    '10': [
      {
        id: '02DDD23A85DADDD71198305330CC386D',
        name: 'Холодильник',
        power: 50,
        duration: 24,
      },
      {
        id: '1E6276CC231716FE8EE8BC908486D41E',
        name: 'Термостат',
        power: 50,
        duration: 24,
      },
    ],
    '11': [
      {
        id: '02DDD23A85DADDD71198305330CC386D',
        name: 'Холодильник',
        power: 50,
        duration: 24,
      },
      {
        id: '1E6276CC231716FE8EE8BC908486D41E',
        name: 'Термостат',
        power: 50,
        duration: 24,
      },
    ],
    '12': [
      {
        id: '02DDD23A85DADDD71198305330CC386D',
        name: 'Холодильник',
        power: 50,
        duration: 24,
      },
      {
        id: '1E6276CC231716FE8EE8BC908486D41E',
        name: 'Термостат',
        power: 50,
        duration: 24,
      },
    ],
    '13': [
      {
        id: '02DDD23A85DADDD71198305330CC386D',
        name: 'Холодильник',
        power: 50,
        duration: 24,
      },
      {
        id: '1E6276CC231716FE8EE8BC908486D41E',
        name: 'Термостат',
        power: 50,
        duration: 24,
      },
    ],
    '14': [
      {
        id: '02DDD23A85DADDD71198305330CC386D',
        name: 'Холодильник',
        power: 50,
        duration: 24,
      },
      {
        id: '1E6276CC231716FE8EE8BC908486D41E',
        name: 'Термостат',
        power: 50,
        duration: 24,
      },
    ],
    '15': [
      {
        id: '02DDD23A85DADDD71198305330CC386D',
        name: 'Холодильник',
        power: 50,
        duration: 24,
      },
      {
        id: '1E6276CC231716FE8EE8BC908486D41E',
        name: 'Термостат',
        power: 50,
        duration: 24,
      },
    ],
    '16': [
      {
        id: '02DDD23A85DADDD71198305330CC386D',
        name: 'Холодильник',
        power: 50,
        duration: 24,
      },
      {
        id: '1E6276CC231716FE8EE8BC908486D41E',
        name: 'Термостат',
        power: 50,
        duration: 24,
      },
      {
        id: 'F972B82BA56A70CC579945773B6866FB',
        name: 'Посудомоечная машина',
        power: 950,
        duration: 3,
        mode: 'night',
      },
      {
        id: '7D9DC84AD110500D284B33C82FE6E85E',
        name: 'Кондиционер',
        power: 850,
        duration: 1,
      },
    ],
    '17': [
      {
        id: '02DDD23A85DADDD71198305330CC386D',
        name: 'Холодильник',
        power: 50,
        duration: 24,
      },
      {
        id: '1E6276CC231716FE8EE8BC908486D41E',
        name: 'Термостат',
        power: 50,
        duration: 24,
      },
      {
        id: 'F972B82BA56A70CC579945773B6866FB',
        name: 'Посудомоечная машина',
        power: 950,
        duration: 3,
        mode: 'night',
      },
    ],
    '18': [
      {
        id: '02DDD23A85DADDD71198305330CC386D',
        name: 'Холодильник',
        power: 50,
        duration: 24,
      },
      {
        id: '1E6276CC231716FE8EE8BC908486D41E',
        name: 'Термостат',
        power: 50,
        duration: 24,
      },
      {
        id: 'F972B82BA56A70CC579945773B6866FB',
        name: 'Посудомоечная машина',
        power: 950,
        duration: 3,
        mode: 'night',
      },
    ],
    '19': [
      {
        id: '02DDD23A85DADDD71198305330CC386D',
        name: 'Холодильник',
        power: 50,
        duration: 24,
      },
      {
        id: '1E6276CC231716FE8EE8BC908486D41E',
        name: 'Термостат',
        power: 50,
        duration: 24,
      },
    ],
    '20': [
      {
        id: '02DDD23A85DADDD71198305330CC386D',
        name: 'Холодильник',
        power: 50,
        duration: 24,
      },
      {
        id: '1E6276CC231716FE8EE8BC908486D41E',
        name: 'Термостат',
        power: 50,
        duration: 24,
      },
    ],
    '21': [
      {
        id: '02DDD23A85DADDD71198305330CC386D',
        name: 'Холодильник',
        power: 50,
        duration: 24,
      },
      {
        id: '1E6276CC231716FE8EE8BC908486D41E',
        name: 'Термостат',
        power: 50,
        duration: 24,
      },
    ],
    '22': [
      {
        id: '02DDD23A85DADDD71198305330CC386D',
        name: 'Холодильник',
        power: 50,
        duration: 24,
      },
      {
        id: '1E6276CC231716FE8EE8BC908486D41E',
        name: 'Термостат',
        power: 50,
        duration: 24,
      },
    ],
    '23': [
      {
        id: '02DDD23A85DADDD71198305330CC386D',
        name: 'Холодильник',
        power: 50,
        duration: 24,
      },
      {
        id: '1E6276CC231716FE8EE8BC908486D41E',
        name: 'Термостат',
        power: 50,
        duration: 24,
      },
    ],
  };

  state.allowPower = [
    2000,
    2000,
    2000,
    0,
    0,
    2000,
    2000,
    2000,
    2000,
    2000,
    2000,
    2000,
    2000,
    2000,
    2000,
    2000,
    200,
    1050,
    1050,
    2000,
    2000,
    2000,
    2000,
    2000,
  ];

  let output = {
    '0': [
      {
        id: '02DDD23A85DADDD71198305330CC386D',
        name: 'Холодильник',
        power: 50,
        duration: 24,
      },
      {
        id: '1E6276CC231716FE8EE8BC908486D41E',
        name: 'Термостат',
        power: 50,
        duration: 24,
      },
    ],
    '1': [
      {
        id: '02DDD23A85DADDD71198305330CC386D',
        name: 'Холодильник',
        power: 50,
        duration: 24,
      },
      {
        id: '1E6276CC231716FE8EE8BC908486D41E',
        name: 'Термостат',
        power: 50,
        duration: 24,
      },
    ],
    '2': [
      {
        id: '02DDD23A85DADDD71198305330CC386D',
        name: 'Холодильник',
        power: 50,
        duration: 24,
      },
      {
        id: '1E6276CC231716FE8EE8BC908486D41E',
        name: 'Термостат',
        power: 50,
        duration: 24,
      },
    ],
    '3': [
      {
        id: '02DDD23A85DADDD71198305330CC386D',
        name: 'Холодильник',
        power: 50,
        duration: 24,
      },
      {
        id: '1E6276CC231716FE8EE8BC908486D41E',
        name: 'Термостат',
        power: 50,
        duration: 24,
      },
      {
        id: 'C515D887EDBBE669B2FDAC62F571E9E9',
        name: 'Духовка',
        power: 2000,
        duration: 2,
        mode: 'day',
        hour: 3,
      },
    ],
    '4': [
      {
        id: '02DDD23A85DADDD71198305330CC386D',
        name: 'Холодильник',
        power: 50,
        duration: 24,
      },
      {
        id: '1E6276CC231716FE8EE8BC908486D41E',
        name: 'Термостат',
        power: 50,
        duration: 24,
      },
      {
        id: 'C515D887EDBBE669B2FDAC62F571E9E9',
        name: 'Духовка',
        power: 2000,
        duration: 2,
        mode: 'day',
      },
    ],
    '5': [
      {
        id: '02DDD23A85DADDD71198305330CC386D',
        name: 'Холодильник',
        power: 50,
        duration: 24,
      },
      {
        id: '1E6276CC231716FE8EE8BC908486D41E',
        name: 'Термостат',
        power: 50,
        duration: 24,
      },
    ],
    '6': [
      {
        id: '02DDD23A85DADDD71198305330CC386D',
        name: 'Холодильник',
        power: 50,
        duration: 24,
      },
      {
        id: '1E6276CC231716FE8EE8BC908486D41E',
        name: 'Термостат',
        power: 50,
        duration: 24,
      },
    ],
    '7': [
      {
        id: '02DDD23A85DADDD71198305330CC386D',
        name: 'Холодильник',
        power: 50,
        duration: 24,
      },
      {
        id: '1E6276CC231716FE8EE8BC908486D41E',
        name: 'Термостат',
        power: 50,
        duration: 24,
      },
    ],
    '8': [
      {
        id: '02DDD23A85DADDD71198305330CC386D',
        name: 'Холодильник',
        power: 50,
        duration: 24,
      },
      {
        id: '1E6276CC231716FE8EE8BC908486D41E',
        name: 'Термостат',
        power: 50,
        duration: 24,
      },
      { id: 'TEST', name: 'TEST', power: 900, duration: 16 },
    ],
    '9': [
      {
        id: '02DDD23A85DADDD71198305330CC386D',
        name: 'Холодильник',
        power: 50,
        duration: 24,
      },
      {
        id: '1E6276CC231716FE8EE8BC908486D41E',
        name: 'Термостат',
        power: 50,
        duration: 24,
      },
      { id: 'TEST', name: 'TEST', power: 900, duration: 16 },
    ],
    '10': [
      {
        id: '02DDD23A85DADDD71198305330CC386D',
        name: 'Холодильник',
        power: 50,
        duration: 24,
      },
      {
        id: '1E6276CC231716FE8EE8BC908486D41E',
        name: 'Термостат',
        power: 50,
        duration: 24,
      },
      { id: 'TEST', name: 'TEST', power: 900, duration: 16 },
    ],
    '11': [
      {
        id: '02DDD23A85DADDD71198305330CC386D',
        name: 'Холодильник',
        power: 50,
        duration: 24,
      },
      {
        id: '1E6276CC231716FE8EE8BC908486D41E',
        name: 'Термостат',
        power: 50,
        duration: 24,
      },
      { id: 'TEST', name: 'TEST', power: 900, duration: 16 },
    ],
    '12': [
      {
        id: '02DDD23A85DADDD71198305330CC386D',
        name: 'Холодильник',
        power: 50,
        duration: 24,
      },
      {
        id: '1E6276CC231716FE8EE8BC908486D41E',
        name: 'Термостат',
        power: 50,
        duration: 24,
      },
      { id: 'TEST', name: 'TEST', power: 900, duration: 16 },
    ],
    '13': [
      {
        id: '02DDD23A85DADDD71198305330CC386D',
        name: 'Холодильник',
        power: 50,
        duration: 24,
      },
      {
        id: '1E6276CC231716FE8EE8BC908486D41E',
        name: 'Термостат',
        power: 50,
        duration: 24,
      },
      { id: 'TEST', name: 'TEST', power: 900, duration: 16 },
    ],
    '14': [
      {
        id: '02DDD23A85DADDD71198305330CC386D',
        name: 'Холодильник',
        power: 50,
        duration: 24,
      },
      {
        id: '1E6276CC231716FE8EE8BC908486D41E',
        name: 'Термостат',
        power: 50,
        duration: 24,
      },
      { id: 'TEST', name: 'TEST', power: 900, duration: 16 },
    ],
    '15': [
      {
        id: '02DDD23A85DADDD71198305330CC386D',
        name: 'Холодильник',
        power: 50,
        duration: 24,
      },
      {
        id: '1E6276CC231716FE8EE8BC908486D41E',
        name: 'Термостат',
        power: 50,
        duration: 24,
      },
      { id: 'TEST', name: 'TEST', power: 900, duration: 16 },
    ],
    '16': [
      {
        id: '02DDD23A85DADDD71198305330CC386D',
        name: 'Холодильник',
        power: 50,
        duration: 24,
      },
      {
        id: '1E6276CC231716FE8EE8BC908486D41E',
        name: 'Термостат',
        power: 50,
        duration: 24,
      },
      {
        id: 'F972B82BA56A70CC579945773B6866FB',
        name: 'Посудомоечная машина',
        power: 950,
        duration: 3,
        mode: 'night',
        hour: 16,
      },
      {
        id: '7D9DC84AD110500D284B33C82FE6E85E',
        name: 'Кондиционер',
        power: 850,
        duration: 1,
        hour: 16,
      },
      { id: 'TEST', name: 'TEST', power: 900, duration: 16 },
    ],
    '17': [
      {
        id: '02DDD23A85DADDD71198305330CC386D',
        name: 'Холодильник',
        power: 50,
        duration: 24,
      },
      {
        id: '1E6276CC231716FE8EE8BC908486D41E',
        name: 'Термостат',
        power: 50,
        duration: 24,
      },
      {
        id: 'F972B82BA56A70CC579945773B6866FB',
        name: 'Посудомоечная машина',
        power: 950,
        duration: 3,
        mode: 'night',
      },
      { id: 'TEST', name: 'TEST', power: 900, duration: 16 },
    ],
    '18': [
      {
        id: '02DDD23A85DADDD71198305330CC386D',
        name: 'Холодильник',
        power: 50,
        duration: 24,
      },
      {
        id: '1E6276CC231716FE8EE8BC908486D41E',
        name: 'Термостат',
        power: 50,
        duration: 24,
      },
      {
        id: 'F972B82BA56A70CC579945773B6866FB',
        name: 'Посудомоечная машина',
        power: 950,
        duration: 3,
        mode: 'night',
      },
      { id: 'TEST', name: 'TEST', power: 900, duration: 16 },
    ],
    '19': [
      {
        id: '02DDD23A85DADDD71198305330CC386D',
        name: 'Холодильник',
        power: 50,
        duration: 24,
      },
      {
        id: '1E6276CC231716FE8EE8BC908486D41E',
        name: 'Термостат',
        power: 50,
        duration: 24,
      },
      { id: 'TEST', name: 'TEST', power: 900, duration: 16 },
      {
        id: '7D9DC84AD110500D284B33C82FE6E85E',
        name: 'Кондиционер',
        power: 850,
        duration: 1,
        hour: 16,
      },
    ],
    '20': [
      {
        id: '02DDD23A85DADDD71198305330CC386D',
        name: 'Холодильник',
        power: 50,
        duration: 24,
      },
      {
        id: '1E6276CC231716FE8EE8BC908486D41E',
        name: 'Термостат',
        power: 50,
        duration: 24,
      },
      { id: 'TEST', name: 'TEST', power: 900, duration: 16 },
    ],
    '21': [
      {
        id: '02DDD23A85DADDD71198305330CC386D',
        name: 'Холодильник',
        power: 50,
        duration: 24,
      },
      {
        id: '1E6276CC231716FE8EE8BC908486D41E',
        name: 'Термостат',
        power: 50,
        duration: 24,
      },
      { id: 'TEST', name: 'TEST', power: 900, duration: 16 },
    ],
    '22': [
      {
        id: '02DDD23A85DADDD71198305330CC386D',
        name: 'Холодильник',
        power: 50,
        duration: 24,
      },
      {
        id: '1E6276CC231716FE8EE8BC908486D41E',
        name: 'Термостат',
        power: 50,
        duration: 24,
      },
      { id: 'TEST', name: 'TEST', power: 900, duration: 16 },
    ],
    '23': [
      {
        id: '02DDD23A85DADDD71198305330CC386D',
        name: 'Холодильник',
        power: 50,
        duration: 24,
      },
      {
        id: '1E6276CC231716FE8EE8BC908486D41E',
        name: 'Термостат',
        power: 50,
        duration: 24,
      },
      { id: 'TEST', name: 'TEST', power: 900, duration: 16 },
    ],
  };

  state.schedule = resultSchedule;

  test('find correct schedule simple variation', () => {
    findSwitchOption(setDevice, hashOptimalCosts, state);
    Object.keys(output).forEach(hour => {
      expect(state.schedule[hour].length === output[hour].length).toBe(true);
      state.schedule[hour].forEach((device, i) => {
        expect(output[hour][i].id === device.id).toBe(true);
      });
    });
  });
});
