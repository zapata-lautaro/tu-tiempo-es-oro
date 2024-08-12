import { describe, test, expect } from '@jest/globals';
import { JobInformation } from '../../src/models/job-information';
import { Currency } from '../../src/models/currency.enum';
import { TimeConvertion } from '../../src/models/time-convertion';

describe('Job information', () => {
  test('Returns correct time convertion for price', () => {
    const jobInformation = new JobInformation(5, 8, Currency.ARS, 130000, 1000);
    const result = jobInformation.getTimeConvertion(130000, Currency.ARS);
    const expectedTimeConvertion = new TimeConvertion(0, 1, 0, 0, 0, 0);
    expect(result).toEqual(expectedTimeConvertion);
  });

  test('Returns correct time convertion for price', () => {
    const jobInformation = new JobInformation(5, 8, Currency.ARS, 130000, 1000);
    const result = jobInformation.getTimeConvertion(66625, Currency.ARS);
    const expectedTimeConvertion = new TimeConvertion(0, 0, 2, 0, 2, 0);
    expect(result).toEqual(expectedTimeConvertion);
  });
});
