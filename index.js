function getScheduleDevices(data) {
  const { maxPower } = data;
  const devices = data.devices.slice(); // копируем для защиты от мутации
  const rates = data.rates.slice(); // копируем для защиты от мутации
  const timeShift = 7; // сдвигаем массив на начало дневного периода
  const state = {
    getTime: getCorrectTime(7),
    schedule: createResultObject().schedule,
    allowPower: Array(24).fill(data.maxPower),
  };

  /*
    Составляем таблицу оптимальных периодов для работы приборов
    с разной продолжительностью
  */
  const resultObject = createResultObject();
  const ratesArray = getRateArray(rates, timeShift);
  const ratesAmount = getRatesAmount(ratesArray);
  let notSetDevices = filterDevices(devices, state);
  const hashOptimalCosts = getOptimalTimeHash(notSetDevices, ratesAmount);

  /*
    сортируем по мощности так как приборы с большой потребляемой мощностью следует
    установить в самые выгодные позиции
  */
  notSetDevices.sort((a, b) => b.power - a.power);
}

/*
  Вспомогательные функции
*/
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

function getRateArray(rateRanges, timeShift) {
  const rates = [];
  rateRanges.forEach(range => {
    if (range.from > range.to) {
      let shift = 24 - (24 - range.from + range.to);

      for (let i = shift; i <= 23; i++) {
        rates[i] = range.value;
      }
    }

    for (let i = range.from; i < range.to; i++) {
      rates[i - timeShift] = range.value;
    }
  });

  return rates;
}

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

function getCorrectTime(timeShift) {
  return time => {
    let resultTime = time + timeShift;
    if (resultTime > 23) {
      resultTime -= 24;
    }
    return resultTime;
  };
}

function getShiftTime(unShiftTime) {
  return time => {
    let resultTime = time - unShiftTime;
    if (resultTime < 0) {
      resultTime = 24 - resultTime;
    }
    return resultTime;
  };
}

function setInSchedule(option) {
  const { device, time, state } = option;
  for (let hour = time.from; hour < time.to; hour++) {
    const index = hour;
    state.schedule[index].push(device);
    state.allowPower[index] -= device.power;
  }
}

/*
	Раскидаем устройства которые работают круглосуточно или 12 часов
  с одним из режимов
*/
function filterDevices(devices, state) {
  return devices.filter(device => {
    const isInfinityWork = device.duration === 24;
    const isFullDayWork = device.mode === 'day' && device.duration === 14;
    const isFullNightWork = device.mode === 'night' && device.duration === 10;
    if (isInfinityWork) {
      setInSchedule({
        device,
        time: { from: 0, to: 24 },
        state,
      });

      return false;
    } else if (isFullDayWork) {
      setInSchedule({
        device,
        time: { from: 0, to: 14 },
        state,
      });

      return false;
    } else if (isFullNightWork) {
      setInSchedule({
        device,
        time: { from: 14, to: 24 },
        state,
      });
      /* 	      } else {
	        console.warn('Not correct device mode');
	      } */

      return false;
    } else {
      return true;
    }
  });
}

function getOptimalTimeHash(devices, ratesAmount) {
  const hashCosts = [];
  devices.forEach(device => {
    let duration = device.duration;
    // if (duration > 12) {
    //   duration = 24 - 12;
    // }

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

function setDevices(devices, hashOptimalCosts, state, options = { checkMode: false }) {
  let allDevicesSet = true;

  devices.forEach(device => {
    let optimalPositions = hashOptimalCosts[device.duration];

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
      const position = optimalPositions[i];
      // добавить чтение мода на приборов
      let isAllow = true;

      for (let time = position.from; time < position.to; time++) {
        if (state.allowPower[time] < device.power) {
          isAllow = false;
        }
      }

      if (isAllow) {
        deviceIsSet = true;
        setInSchedule({
          device,
          time: { from: position.from, to: position.to },
          state,
        });

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

function findSwitchOption(device, hashOptimalCosts, state) {
  // определяем можно ли переставить
  // находим часы в которые не укладывается устройство
  let targetHour = [];
  state.allowPower.forEach((power, i) => {
    if (power < device.power) {
      targetHour.push(i);
    }
  });

  let targetDevices = {
    array: [],
  };
  targetHour.forEach(hour => {
    state.schedule[hour].forEach(device => {
      const isInfinityWork = device.duration === 24;
      const isFullDayWork = device.mode === 'day' && device.duration === 14;
      const isFullNightWork = device.mode === 'night' && device.duration === 10;
      if (!(isInfinityWork || isFullNightWork || isFullDayWork || device.id in targetDevices)) {
        targetDevices[device.id] = device;
        targetDevices[device.id].hour = hour;
        targetDevices.array.push(device);
      }
    });
  });

  targetDevices.array.sort((a, b) => a.power - b.power);

  let findSwipe = false;
  for (let i = 0; i < targetDevices.array.length; i++) {
    findSwipe = checkSwipeOpportunity(targetDevices.array[i], device, hashOptimalCosts, state);
    if (findSwipe) break;
  }

  if (!findSwipe) {
    throw Error(
      'Нет возможности установить работу всех приборов с заданной максимальной мощностью.'
    );
  }
}

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

function removeDeviceFromSchedule(device, schedule) {
  let newSchedule = {};
  Object.keys(schedule).forEach(key => {
    newSchedule[key] = schedule[key].slice();
    newSchedule[key] = schedule[key].filter(id => id !== device.id);
  });

  return newSchedule;
}

function removeDeviceFromPowerArray(device, allowPower) {
  let newAllowPower = allowPower.slice();
  for (let hour = device.hour; hour < device.hour + device.duration; hour++) {
    newAllowPower[hour] += device.power;
  }

  return newAllowPower;
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
};
