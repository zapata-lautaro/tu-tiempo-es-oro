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
        <span class="andes-money-amount__currency-symbol">$</span>
        <span class="andes-money-amount__fraction">500</span>
        <span class="andes-money-amount__cents">44</span>
    </span>
`;

const convertedMeliHtml = `
    <span class="andes-money-amount" aria-label="1000000 pesos">
        <span class="andes-money-amount__currency-symbol time-convertion">⏱️</span><span class="andes-money-amount__currency-symbol original">$</span>
        <span class="andes-money-amount__fraction time-convertion">10 Meses</span><span class="andes-money-amount__fraction original">1.000.000</span>
        <span class="andes-money-amount__cents original">44</span>
    </span>
`;

describe('convert', () => {
  const jobInformation = new JobInformation(5, 8, Currency.ARS, 100000, 1000);

  it('should replace prices and currency simbols', () => {
    document.body.innerHTML = originalMeliPesosHtml;

    const meliPriceConverter = new MeliPriceConverter(document, jobInformation);
    meliPriceConverter.convert();

    expect(document.body.innerHTML).toMatchSnapshot();
  });

  it('should replace prices in usd and currency simbols', () => {
    document.body.innerHTML = originalMeliDolaresHtml;

    const meliPriceConverter = new MeliPriceConverter(document, jobInformation);
    meliPriceConverter.convert();

    expect(document.body.innerHTML).toMatchSnapshot();
  });

  it('should not modify nothing if ther arent prices', () => {
    document.body.innerHTML = meliNoPrices;

    const meliPriceConverter = new MeliPriceConverter(document, jobInformation);
    meliPriceConverter.convert();

    expect(document.body.innerHTML).toBe(meliNoPrices);
  });
});

describe('revert', () => {
  const jobInformation = new JobInformation(5, 8, Currency.ARS, 100000, 1000);

  it('should remove converted elements and remove classes from original ones', () => {
    document.body.innerHTML = convertedMeliHtml;

    const meliPriceConverter = new MeliPriceConverter(document, jobInformation);
    meliPriceConverter.revert();

    expect(document.body.innerHTML).toMatchSnapshot();
  });
});
