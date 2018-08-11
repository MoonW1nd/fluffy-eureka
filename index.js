function getScheduleDevices(data) {
  const { maxPower } = data;
  const devices = data.devices.slice(); // копируем для защиты от мутации
  const rates = data.rates.slice(); // копируем для защиты от мутации
  const timeShift = 7; // сдвигаем массив на начало дневного периода
  const state = {
    getTime: getCorrectTime(7),
    resultObject: createResultObject(),
    allowPower: Array(24).fill(data.maxPower),
  };

  /*
    Составляем таблицу оптимальных периодов для работы приборов
    с разной продолжительностью
  */
  const ratesArray = getRateArray(rates, timeShift);
  const ratesAmount = getRatesAmount(ratesArray);
  let notSetDevices = filterDevices(devices, state);
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
      amount[0] = rate;
    } else {
      amount[index] = amount[index - 1] + rate;
      amount[index] = Number(amount[index].toFixed(2));
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

function setInSchedule(option) {
  const { device, time, state } = option;
  for (let hour = time.from; hour <= time.to; hour++) {
    const index = state.getTime(hour);
    state.resultObject.schedule[index].push(device.id);
    state.allowPower[index] -= device.power;
  }
}

function filterDevices(devices, state) {
  return devices.filter(device => {
    const isInfinityWork = device.duration === 24;
    const isFullDayWork = device.mode === 'day' && device.duration === 14;
    const isFullNightWork = device.mode === 'night' && device.duration === 10;
    if (isInfinityWork) {
      setInSchedule({
        device,
        time: { from: 0, to: 23 },
        state,
      });

      return false;
    } else if (isFullDayWork) {
      setInSchedule({
        device,
        time: { from: 0, to: 13 },
        state,
      });

      return false;
    } else if (isFullNightWork) {
      setInSchedule({
        device,
        time: { from: 14, to: 23 },
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

module.exports = {
  getRateArray,
  getRatesAmount,
  getCorrectTime,
  filterDevices,
  setInSchedule,
  createResultObject,
};
