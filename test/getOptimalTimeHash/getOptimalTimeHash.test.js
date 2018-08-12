const { getRatesAmount, getRateArray, getOptimalTimeHash } = require('../../index');
const input = require('./data/input');
const output = require('./data/output');
const ratesArray = getRateArray(input.rates, 7);
const ratesAmount = getRatesAmount(ratesArray);
const devices = input.devices.slice(0, 1);

describe('getOptimalTimeHash', () => {
  test('correct find time', () => {
    const result = [];
    result[3] = output.expected;

    const optimalTime = getOptimalTimeHash(devices, ratesAmount);
    optimalTime[3].forEach((variant, i) => {
      expect(variant.from === result[3][i].from).toBe(true);
      expect(variant.to === result[3][i].to).toBe(true);
      expect(variant.cost === result[3][i].cost).toBe(true);
    });
  });
});
