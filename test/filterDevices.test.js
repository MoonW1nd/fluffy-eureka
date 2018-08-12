const { setInSchedule, createResultObject, getCorrectTime, filterDevices } = require('../index');
const data = require('./data/input');

describe('filterDevices', () => {
  const state = {
    getTime: getCorrectTime(7),
    schedule: createResultObject().schedule,
    allowPower: Array(24).fill(2100),
  };
  const device = data.devices.slice();
  const expectedIdDevices = [
    'F972B82BA56A70CC579945773B6866FB',
    'C515D887EDBBE669B2FDAC62F571E9E9',
    '7D9DC84AD110500D284B33C82FE6E85E',
  ];

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
