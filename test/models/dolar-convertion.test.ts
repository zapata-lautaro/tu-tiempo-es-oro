import { describe, expect } from '@jest/globals';
import { DolarConvertion } from '../../src/models/dolar-convertion';

describe('isOutdated', () => {
  it('Should return true if is outdated', () => {
    const today = new Date(2024, 1, 20);
    const yesterday = new Date(2024, 1, 19);
    const dolarConvertion = new DolarConvertion(yesterday.getTime(), 1, 1);

    expect(dolarConvertion.IsOutdated(today)).toBeTruthy();
  });

  it('Should return false if isnt outdated', () => {
    const today = new Date(2024, 1, 20, 20);
    const someHoursAgo = new Date(2024, 1, 20, 5);
    const dolarConvertion = new DolarConvertion(someHoursAgo.getTime(), 1, 1);

    expect(dolarConvertion.IsOutdated(today)).toBeFalsy();
  });
});

describe('convertToUsd', () => {
  it('Should return convertion using ask value', () => {
    const pesos = 150;
    const dolarConvertion = new DolarConvertion(Date.now(), 1, 150);
    const expectedConvertion = 1;

    expect(dolarConvertion.convertToUsd(pesos)).toBe(expectedConvertion);
  });
});

describe('convertToArs', () => {
  it('Should return convertion using bid value', () => {
    const usd = 150;
    const dolarConvertion = new DolarConvertion(Date.now(), 1000, 1);
    const expectedConvertion = 150000;

    expect(dolarConvertion.convertToArs(usd)).toBe(expectedConvertion);
  });
});
