import { describe, expect } from '@jest/globals';
import { JobInformation } from '../../src/models/job-information';
import { Currency } from '../../src/models/currency.enum';
import { TimeConvertion } from '../../src/models/time-convertion';

describe('getTimeConvertion ', () => {
  const pesosSalary = 130000;
  const usdSalary = 1000;
  const currency = Currency.ARS;
  const jobInformation = new JobInformation(
    5,
    8,
    currency,
    pesosSalary,
    usdSalary,
  );

  const data: {
    price: number;
    currency: Currency;
    expcetedConvertion: TimeConvertion;
  }[] = [
    {
      price: 130000,
      currency: Currency.ARS,
      expcetedConvertion: new TimeConvertion(0, 1, 0, 0, 0, 0),
    },
    {
      price: 13123,
      currency: Currency.ARS,
      expcetedConvertion: new TimeConvertion(0, 0, 0, 2, 0, 10),
    },
  ];

  describe.each(data)(
    `A convertion with ${pesosSalary} ${currency} salary`,
    (params) => {
      it(`from ${params.price} ${params.currency} price should be ${params.expcetedConvertion.toFullStringRepresentation()}`, () => {
        const result = jobInformation.getTimeConvertion(
          params.price,
          params.currency,
        );

        expect(result).toEqual(params.expcetedConvertion);
      });
    },
  );
});
