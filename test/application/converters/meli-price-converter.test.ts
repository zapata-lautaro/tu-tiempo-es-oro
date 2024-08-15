/**
 * @jest-environment jsdom
 */

import { MeliPriceConverter } from '../../../src/application/converters/meli-price-converter';
import { Currency } from '../../../src/models/currency.enum';
import { JobInformation } from '../../../src/models/job-information';

const meliNoPrices = `
    <span class="andes-money-amount" aria-label="1000000 pesos"></span>
`;

const originalMeliPesosHtml = `
    <span class="andes-money-amount" aria-label="1000000 pesos">
        <span class="andes-money-amount__currency-symbol">$</span>
        <span class="andes-money-amount__fraction">1.000.000</span>
        <span class="andes-money-amount__cents">44</span>
    </span>
`;

const originalMeliDolaresHtml = `
    <span class="andes-money-amount" aria-label="500 dólares">
        <span class="andes-money-amount__currency-symbol">U$D</span>
        <span class="andes-money-amount__fraction">500</span>
        <span class="andes-money-amount__cents">44</span>
    </span>
`;

const convertedMeliHtml = `
    <span class="andes-money-amount" aria-label="500 dólares">
        <span class="andes-money-amount__currency-symbol" data-original-value="U$D">⏱️</span>
        <span class="andes-money-amount__fraction" data-original-value="500">2 Semanas</span>
        <span class="andes-money-amount__cents time-convertion-hide">44</span>
    </span>
`;

describe('convert', () => {
  const jobInformation = new JobInformation(5, 8, Currency.ARS, 100000, 1000);

  it('should replace prices and currency simbols', async () => {
    document.body.innerHTML = originalMeliPesosHtml;

    const meliPriceConverter = new MeliPriceConverter(document);
    await meliPriceConverter.convert(jobInformation);

    expect(document.body.innerHTML).toMatchSnapshot();
  });

  it('should replace prices in usd and currency simbols', async () => {
    document.body.innerHTML = originalMeliDolaresHtml;

    const meliPriceConverter = new MeliPriceConverter(document);
    await meliPriceConverter.convert(jobInformation);

    expect(document.body.innerHTML).toMatchSnapshot();
  });

  it('should not modify nothing if there arent prices', async () => {
    document.body.innerHTML = meliNoPrices;

    const meliPriceConverter = new MeliPriceConverter(document);
    await meliPriceConverter.convert(jobInformation);

    expect(document.body.innerHTML).toBe(meliNoPrices);
  });

  it('should not modify nothing if the salary is 0', async () => {
    document.body.innerHTML = originalMeliPesosHtml;
    const jobInformationWithoutSalary = new JobInformation(
      1,
      1,
      Currency.ARS,
      0,
      0,
    );

    const meliPriceConverter = new MeliPriceConverter(document);
    meliPriceConverter.convert(jobInformationWithoutSalary);

    expect(document.body.innerHTML).toBe(originalMeliPesosHtml);
  });
});

describe('revert', () => {
  it('should leave document as orignial without attributes or classes', () => {
    document.body.innerHTML = convertedMeliHtml;

    const meliPriceConverter = new MeliPriceConverter(document);
    meliPriceConverter.revert();

    expect(document.body.innerHTML).toMatchSnapshot();
  });
});
