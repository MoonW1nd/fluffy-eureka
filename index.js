function getScheduleDevices(data) {
  const { maxPower } = data;
  const devices = data.devices.slice(); // копируем для защиты от мутации
  const rates = data.rates.slice(); // копируем для защиты от мутации
  const timeShift = 7; // сдвигаем массив на начало дневного периода
  const allowPower = Array(24).fill(data.maxPower); // массив оставшегося кол-во мощности

  /*
    Составляем таблицу оптимальных периодов для работы приборов
    с разной продолжительностью
  */
  const ratesArray = getRateArray(rates, timeShift);
  const ratesAmount = getRatesAmount(ratesArray);
}

/*
  Вспомогательные функции
*/

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

module.exports = {
  getRateArray,
  getRatesAmount,
};
