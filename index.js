function getScheduleDevices(data) {
  if (Object(data) !== data) {
    throw Error(
      'Некорректный тип входных данных, входные данные должны передаваться в виде объекта JS'
    );
  }
  if (typeof data.maxPower !== 'number' || Number.isNaN(data.maxPower)) {
    throw Error('Не корректный тип значения maxPower');
  }
  if (!Array.isArray(data.devices)) {
    throw Error('Не корректный тип значения devices');
  }
  if (!Array.isArray(data.rates)) {
    throw Error('Не корректный тип значения rates');
  }

  const { maxPower } = data;
  const devices = data.devices.slice();
  const rates = data.rates.slice();
  const timeShift = 7;
  const state = {
    getTime: getCorrectTime(7),
    schedule: createResultObject().schedule,
    allowPower: Array(24).fill(data.maxPower),
  };

  const ratesArray = getRateArray(rates, timeShift);
  const ratesAmount = getRatesAmount(ratesArray);
  let notSetDevices = filterDevices(devices, state);
  const hashOptimalCosts = getOptimalTimeHash(notSetDevices, ratesAmount);

  notSetDevices.sort((a, b) => b.power - a.power);

  setDevices(notSetDevices, hashOptimalCosts, state);
  return fillResultObject(state, devices, ratesArray);
}

/*
  Вспомогательные функции
*/

// Создает каркас объекта для заполнения при выводе
function createResultObject() {
  const resultObject = {
    schedule: {},
    consumedEnergy: {
      value: 0,
      devices: {},
    },
  };

  for (let hour = 0; hour <= 23; hour++) {
    resultObject.schedule[hour] = [];
  }

  return resultObject;
}

/*
  Переводит значения в периодах из rates в массив из 24 значений
  для более удобной работы
 */
function getRateArray(rateRanges, timeShift) {
  const rates = [];
  let sum = 0;
  rateRanges.forEach((range, index) => {
    // проверка типов в ranges
    if (Object(range) !== range) {
      throw Error(`Не корректный тип значения rates[${index}]`);
    }
    if (typeof range.from !== 'number' || Number.isNaN(range.from)) {
      throw Error(`Не корректный тип значения rates[${index}].from`);
    }
    if (typeof range.to !== 'number' || Number.isNaN(range.to)) {
      throw Error(`Не корректный тип значения rates[${index}].to`);
    }
    if (typeof range.value !== 'number' || Number.isNaN(range.value)) {
      throw Error(`Не корректный тип значения rates[${index}].value`);
    }

    if (range.from > range.to) {
      sum += 24 - range.from;
      sum += range.to;
      let shift = 24 - (24 - range.from + range.to);

      for (let i = shift; i <= 23; i++) {
        rates[i] = range.value;
      }
    } else {
      sum += range.to - range.from;

      for (let i = range.from; i < range.to; i++) {
        rates[i - timeShift] = range.value;
      }
    }
  });

  if (rates.length !== 24 || sum !== 24) {
    throw Error('Не корректно задана сетка тарифов');
  }

  return rates;
}

/*
  Считает сумму всех всех значений тарифов по часам и сохраняет ее
  для удобного определения тарифа на периоде, rateOnPeriod = ratesAmount[time.from] - ratesAmount[time.to]
*/
function getRatesAmount(rates) {
  const amount = [];

  rates.forEach((rate, index) => {
    if (index === 0) {
      amount[0] = 0;
      amount[1] = rate;
    } else {
      amount[index + 1] = amount[index] + rate;
      amount[index + 1] = Number(amount[index + 1].toFixed(4));
    }
  });

  return amount;
}

/*
  Функция для перевода смещенного времени к начальному состоянию
*/
function getCorrectTime(timeShift) {
  return time => {
    let resultTime = time + timeShift;
    if (resultTime > 23) {
      resultTime -= 24;
    }
    return resultTime;
  };
}

/*
  Функция установки устройства в расписание, и уменьшения доступной мощности на периоде
*/
function setInSchedule(option) {
  const { device, time, state } = option;
  for (let hour = time.from; hour < time.to; hour++) {
    const index = hour;
    state.schedule[index].push(device);
    state.allowPower[index] -= device.power;
  }
}

/*
  Функция которая сразу устанавливает устройства которые должны работать полный период.
  То есть для них не нужно искать оптимального времени.
*/
function filterDevices(devices, state) {
  return devices.filter((device, index) => {
    // проверка типов и условий поля devices
    if (Object(device) !== device) {
      throw Error(`Не корректный тип значения device[${index}]`);
    }
    if (typeof device.power !== 'number' || Number.isNaN(device.power)) {
      throw Error(`Не корректный тип значения device[${index}].power`);
    }
    if (typeof device.duration !== 'number' || Number.isNaN(device.duration)) {
      throw Error(`Не корректный тип значения device[${index}].duration`);
    }
    if (typeof device.name !== 'string') {
      throw Error(`Не корректный тип значения device[${index}].name`);
    }
    if (typeof device.id !== 'string') {
      throw Error(`Не корректный тип значения device[${index}].id`);
    }

    if (device.duration > 24) {
      throw Error(
        `В устройстве с id: ${
          device.id
        } не корректно задана продолжительность работы, она не может быть больше 24 часов в сутки`
      );
    }

    if (device.mode != null && !['day', 'night'].includes(device.mode)) {
      throw Error(`В устройстве с id: ${device.id} не корректно задан мод`);
    }

    if (
      (device.mode === 'day' && device.duration > 14) ||
      (device.mode === 'night' && device.duration > 10)
    ) {
      throw Error(
        `В устройстве с id: ${device.id} продолжительность работы больше чем позволяет мод`
      );
    }

    const isInfinityWork = device.duration === 24;
    const isFullDayWork = device.mode === 'day' && device.duration === 14;
    const isFullNightWork = device.mode === 'night' && device.duration === 10;

    if (isInfinityWork) {
      if (!checkAllowSetForPower(0, 24, device.power, state.allowPower)) {
        throw Error(
          `Устройстве с id: ${
            device.id
          } не возможно включить в расписание так как не хватает допустимой мощности`
        );
      }

      setInSchedule({
        device,
        time: { from: 0, to: 24 },
        state,
      });

      return false;
    } else if (isFullDayWork) {
      if (!checkAllowSetForPower(0, 14, device.power, state.allowPower)) {
        throw Error(
          `Устройстве с id: ${
            device.id
          } не возможно включить в расписание так как не хватает допустимой мощности`
        );
      }

      setInSchedule({
        device,
        time: { from: 0, to: 14 },
        state,
      });

      return false;
    } else if (isFullNightWork) {
      if (!checkAllowSetForPower(14, 24, device.power, state.allowPower)) {
        throw Error(
          `Устройстве с id: ${
            device.id
          } не возможно включить в расписание так как не хватает допустимой мощности`
        );
      }

      setInSchedule({
        device,
        time: { from: 14, to: 24 },
        state,
      });

      return false;
    } else {
      return true;
    }
  });
}

/*
  Функция проверяющая возможность установки устройства в данный период по мощности
*/
function checkAllowSetForPower(from, to, setPower, allowPower) {
  let isAllowSet = true;

  for (let i = from; i < to; i++) {
    if (allowPower[i] < setPower) {
      isAllowSet = false;
    }
  }

  return isAllowSet;
}

/*
  Ищет и кеширует варианты установки для всех устройств, в периоде.
  Кэширование происходит по продолжительности работы, так как для устройств с одинаковой
  продолжительностью работы будут одинаковые варианты расстановки.
*/
function getOptimalTimeHash(devices, ratesAmount) {
  const hashCosts = [];
  devices.forEach(device => {
    let duration = device.duration;
    if (duration > 12) {
      duration = 24 - duration;
    }

    if (hashCosts[duration] == null) {
      let countIterations = ratesAmount.length - duration - 1;
      const timeArray = [];

      for (let i = 0; i <= countIterations; i++) {
        let cost = ratesAmount[i + duration] - ratesAmount[i];
        cost = Number(cost.toFixed(4));
        timeArray.push({
          from: i,
          to: i + duration,
          cost,
        });
      }

      hashCosts[duration] = timeArray;
    }
  });

  return hashCosts;
}

/*
  Функция установки устройства в оптимальное положение,
  так же может использоваться для проверки возможности установки приборов (checkMode).
*/
function setDevices(devices, hashOptimalCosts, state, options = { checkMode: false }) {
  let allDevicesSet = true;

  devices.forEach(device => {
    let { duration } = device;
    const isLargeDuration = device.duration > 12;
    if (isLargeDuration) duration = 24 - duration;
    let optimalPositions = hashOptimalCosts[duration];

    if (device.mode == 'day') {
      optimalPositions = optimalPositions.slice(0, 15 - device.duration);
    } else if (device.mode == 'night') {
      optimalPositions = optimalPositions.slice(14);
    }

    optimalPositions.sort((a, b) => {
      if (a.cost === b.cost) {
        return a.from - b.from;
      } else {
        return a.cost - b.cost;
      }
    });

    let deviceIsSet = false;

    for (let i = 0; i < optimalPositions.length; i++) {
      let position;
      if (isLargeDuration) {
        position = optimalPositions[optimalPositions.length - i - 1];
      } else {
        position = optimalPositions[i];
      }

      let isAllowSetDevice = true;

      if (isLargeDuration) {
        if (!checkAllowSetForPower(0, position.from, device.power, state.allowPower)) {
          isAllowSetDevice = false;
        }
        if (!checkAllowSetForPower(position.to, 24, device.power, state.allowPower)) {
          isAllowSetDevice = false;
        }
      } else {
        if (!checkAllowSetForPower(position.from, position.to, device.power, state.allowPower)) {
          isAllowSetDevice = false;
        }
      }

      if (isAllowSetDevice) {
        deviceIsSet = true;
        if (isLargeDuration) {
          setInSchedule({
            device,
            time: { from: 0, to: position.from },
            state,
          });

          setInSchedule({
            device,
            time: { from: position.to, to: 24 },
            state,
          });
        } else {
          setInSchedule({
            device,
            time: { from: position.from, to: position.to },
            state,
          });
        }

        break;
      }
    }

    if (!deviceIsSet) {
      allDevicesSet = false;
    }

    if (!deviceIsSet && !options.checkMode) {
      findSwitchOption(device, hashOptimalCosts, state);
    }
  });

  if (options.checkMode) {
    if (allDevicesSet) {
      options.globalState.schedule = state.schedule;
      options.globalState.allowPower = state.allowPower;
    }

    return allDevicesSet;
  }
}

/*
  Функция поиска возможности замены устройств местами, если какое-то устройство
  не может быть установлено, без сметы времени других устройств.
*/
function findSwitchOption(notSetDevice, hashOptimalCosts, state) {
  // находим часы в которые не укладывается устройство
  let targetHour = [];
  state.allowPower.forEach((power, i) => {
    if (power < notSetDevice.power) {
      targetHour.push(i);
    }
  });

  // находим устройства которые можно подвинуть
  let targetDevices = {
    array: [],
  };
  targetHour.forEach(hour => {
    state.schedule[hour].forEach(device => {
      const isInfinityWork = device.duration === 24;
      const isFullDayWork = device.mode === 'day' && device.duration === 14;
      const isFullNightWork = device.mode === 'night' && device.duration === 10;
      const isSufficientPower = state.allowPower + device.power > notSetDevice.power;

      if (
        !(
          isInfinityWork ||
          isFullNightWork ||
          isFullDayWork ||
          device.id in targetDevices ||
          isSufficientPower
        )
      ) {
        targetDevices[device.id] = device;
        targetDevices[device.id].hour = hour;
        targetDevices.array.push(device);
      }
    });
  });

  targetDevices.array.sort((a, b) => a.power - b.power);

  let findSwipe = false;
  for (let i = 0; i < targetDevices.array.length; i++) {
    findSwipe = checkSwipeOpportunity(
      targetDevices.array[i],
      notSetDevice,
      hashOptimalCosts,
      state
    );
    if (findSwipe) break;
  }

  if (!findSwipe) {
    throw Error(
      'Нет возможности установить работу всех приборов с заданной максимальной мощностью.'
    );
  }
}

/*
  Функция проверяет можно ли поменять 2 устройства местами, и если можно, то это происходит, и возвращается true;
*/
function checkSwipeOpportunity(device, setDevice, hashOptimalCosts, state) {
  let allowPower = removeDeviceFromPowerArray(device, state.allowPower);
  let schedule = removeDeviceFromSchedule(device, state.schedule);

  return setDevices(
    [setDevice, device],
    hashOptimalCosts,
    {
      allowPower,
      schedule,
    },
    { checkMode: true, globalState: state }
  );
}

/*
  Функция которая удаляет определенное устройство из расписания
*/
function removeDeviceFromSchedule(device, schedule) {
  let newSchedule = {};
  Object.keys(schedule).forEach(key => {
    newSchedule[key] = schedule[key].slice();
    newSchedule[key] = schedule[key].filter(id => id !== device.id);
  });

  return newSchedule;
}

/*
  Функция которая возвращает занятую устройством мощность обратно в массив доступной мощности
*/
function removeDeviceFromPowerArray(device, allowPower) {
  let newAllowPower = allowPower.slice();
  for (let hour = device.hour; hour < device.hour + device.duration; hour++) {
    newAllowPower[hour] += device.power;
  }

  return newAllowPower;
}

/*
  Функция формирующая результат .
*/
function fillResultObject(state, devices, ratesArray) {
  const resultObject = createResultObject();

  devices.forEach(device => {
    resultObject.consumedEnergy.devices[device.id] = 0;
  });

  ratesArray.forEach((rate, hour) => {
    state.schedule[hour].forEach(device => {
      resultObject.schedule[state.getTime(hour)].push(device.id);

      resultObject.consumedEnergy.value += (ratesArray[hour] * device.power) / 1000;
      resultObject.consumedEnergy.value = Number(resultObject.consumedEnergy.value.toFixed(4));

      resultObject.consumedEnergy.devices[device.id] += (ratesArray[hour] * device.power) / 1000;
      resultObject.consumedEnergy.devices[device.id] = Number(
        resultObject.consumedEnergy.devices[device.id].toFixed(4)
      );
    });
  });

  return resultObject;
}

module.exports = {
  getRateArray,
  getRatesAmount,
  getCorrectTime,
  filterDevices,
  setInSchedule,
  createResultObject,
  getOptimalTimeHash,
  setDevices,
  findSwitchOption,
  fillResultObject,
  getScheduleDevices,
  removeDeviceFromSchedule,
  removeDeviceFromPowerArray,
  checkAllowSetForPower,
};
