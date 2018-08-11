const { getRatesAmount, getRateArray, findOptimalTime } = require('../index');
const data = require('./data/input');
const ratesArray = getRateArray(data.rates, 7);
const ratesAmount = getRatesAmount(ratesArray);
const devices = [
  {
    id: 'F972B82BA56A70CC579945773B6866FB',
    name: 'Посудомоечная машина',
    power: 950,
    duration: 3,
    mode: 'night',
  },
];

describe('findOptimalTime', () => {
  test('correct find time', () => {
    const result = [];
    result[3] = [
      { from: 0, to: 3, cost: 19.38 },
      { from: 20, to: 23, cost: 5.37 },
      { from: 2, to: 5, cost: 17.22 },
      { from: 3, to: 6, cost: 16.14 },
      { from: 4, to: 7, cost: 16.14 },
      { from: 5, to: 8, cost: 16.14 },
      { from: 6, to: 9, cost: 16.14 },
      { from: 7, to: 10, cost: 16.14 },
      { from: 8, to: 11, cost: 17.22 },
      { from: 9, to: 12, cost: 18.3 },
      { from: 1, to: 4, cost: 18.3 },
      { from: 11, to: 14, cost: 19.38 },
      { from: 12, to: 15, cost: 18.3 },
      { from: 13, to: 16, cost: 17.22 },
      { from: 14, to: 17, cost: 12.55 },
      { from: 15, to: 18, cost: 8.96 },
      { from: 16, to: 19, cost: 5.37 },
      { from: 17, to: 20, cost: 5.37 },
      { from: 18, to: 21, cost: 5.37 },
      { from: 19, to: 22, cost: 5.37 },
      { from: 10, to: 13, cost: 19.38 },
    ];
    const optimalTime = findOptimalTime(devices, ratesAmount);
    optimalTime[3].forEach((variant, i) => {
      expect(variant.from === result[3][i].from).toBe(true);
      expect(variant.to === result[3][i].to).toBe(true);
      expect(variant.cost === result[3][i].cost).toBe(true);
    });
  });
});
