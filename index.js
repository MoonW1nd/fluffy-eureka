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
    if (duration > 12) {
      duration = 24 - 12;
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

function setDevices(devices, hashOptimalCosts, state) {
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

    if (deviceIsSet) {
      // findSwitchOption();
    }
  });
}

/*
  Какая нужна структура алгоритма?
  schedule {
    0: [{
      id,
      power,
    }]
  }
*/

function findSwitchOption(device, state) {
  // определяем можно ли переставить
  // находим часы в которые не укладывается устройство
  // let targetHour = [];
  // state.allowPower.forEach((power, i) => {
  //   if (power < device.power) {
  //     targetHour.push(i);
  //   }
  // })
  // Стоит смотреть часы только те, в которые не влезает device
  // сравниваем по занимаем мощности (allowPower - itemPoser) > device.poWer и есть ли место для этого элемента в системе так же это нужно учитывать с учетом элемента который ты хочешь поставить в замен
  // переставить  на ближнюю оптимальную позицию с учетом его максимальной мощности: tate.allowPower[state.getTime(time)] - поправка < device.power
  // если возможно то удаляем прибор ото всюду из расписания и заново вызываем функцию setDevices с этими 2-мя приборами
  // если не возможно переместить - кидаем ошибку
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
};
