const input = require('./data/input.json');
const output = require('./data/output.json');
const { getScheduleDevices } = require('../index');

describe('getScheduleDevices', () => {
  let result = getScheduleDevices(input.correctData[0]);
  let outputCorrectData = output.correctData[0];

  test('get correct value in schedule', () => {
    Object.keys(outputCorrectData.schedule).forEach(hour => {
      expect(result.schedule[hour].length === outputCorrectData.schedule[hour].length).toBe(true);
      outputCorrectData.schedule[hour].forEach(deviceId => {
        expect(result.schedule[hour].includes(deviceId)).toBe(true);
      });
    });
  });

  test('get correct sum value', () => {
    expect(result.consumedEnergy.value === outputCorrectData.consumedEnergy.value).toBe(true);
  });

  test('get correct sum devices value', () => {
    Object.keys(outputCorrectData.consumedEnergy.devices).forEach(deviceId => {
      expect(
        outputCorrectData.consumedEnergy.devices[deviceId] ===
          result.consumedEnergy.devices[deviceId]
      ).toBe(true);
    });
  });
});

describe('getScheduleDevices Exceptions', () => {
  test('data is object', () => {
    input.wrongData[0].forEach(input => {
      expect(() => getScheduleDevices(input)).toThrow(output.wrongData[0]);
    });
  });

  test('maxPower is number', () => {
    input.wrongData[1].forEach(input => {
      expect(() => getScheduleDevices(input)).toThrow(output.wrongData[1]);
    });
  });

  test('devices is array', () => {
    input.wrongData[2].forEach(input => {
      expect(() => getScheduleDevices(input)).toThrow(output.wrongData[2]);
    });
  });

  test('rates is array', () => {
    input.wrongData[3].forEach(input => {
      expect(() => getScheduleDevices(input)).toThrow(output.wrongData[3]);
    });
  });

  test('rates[i] is object', () => {
    input.wrongData[4].forEach(input => {
      expect(() => getScheduleDevices(input)).toThrow(output.wrongData[4]);
    });
  });

  test('rates[i].from is number', () => {
    input.wrongData[5].forEach(input => {
      expect(() => getScheduleDevices(input)).toThrow(output.wrongData[5]);
    });
  });

  test('rates[i].to is number', () => {
    input.wrongData[6].forEach(input => {
      expect(() => getScheduleDevices(input)).toThrow(output.wrongData[6]);
    });
  });

  test('rates[i].value is number', () => {
    input.wrongData[7].forEach(input => {
      expect(() => getScheduleDevices(input)).toThrow(output.wrongData[7]);
    });
  });

  test('Not correct rates grid', () => {
    input.wrongData[8].forEach(input => {
      expect(() => getScheduleDevices(input)).toThrow(output.wrongData[8]);
    });
  });

  test('device[i] is object', () => {
    input.wrongData[9].forEach(input => {
      expect(() => getScheduleDevices(input)).toThrow(output.wrongData[9]);
    });
  });

  test('device[i].power is number', () => {
    input.wrongData[10].forEach(input => {
      expect(() => getScheduleDevices(input)).toThrow(output.wrongData[10]);
    });
  });

  test('device[i].duration is number', () => {
    input.wrongData[11].forEach(input => {
      expect(() => getScheduleDevices(input)).toThrow(output.wrongData[11]);
    });
  });

  test('device[i].name is string', () => {
    input.wrongData[12].forEach(input => {
      expect(() => getScheduleDevices(input)).toThrow(output.wrongData[12]);
    });
  });

  test('device[i].id is string', () => {
    input.wrongData[13].forEach(input => {
      expect(() => getScheduleDevices(input)).toThrow(output.wrongData[13]);
    });
  });

  test('device[i].duration > 24', () => {
    input.wrongData[14].forEach(input => {
      expect(() => getScheduleDevices(input)).toThrow(output.wrongData[14]);
    });
  });

  test('device[i].mode not correct value', () => {
    input.wrongData[15].forEach(input => {
      expect(() => getScheduleDevices(input)).toThrow(output.wrongData[15]);
    });
  });

  test('device[i].duration not correct with mode', () => {
    input.wrongData[16].forEach(input => {
      expect(() => getScheduleDevices(input)).toThrow(output.wrongData[16]);
    });
  });

  test('Low power limit', () => {
    input.wrongData[17].forEach(input => {
      expect(() => getScheduleDevices(input)).toThrow(output.wrongData[17]);
    });
  });

  test('Not set', () => {
    input.wrongData[18].forEach(input => {
      expect(() => getScheduleDevices(input)).toThrow(output.wrongData[18]);
    });
  });
});
