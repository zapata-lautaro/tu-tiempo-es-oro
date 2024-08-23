/**
 * @jest-environment jsdom
 */

import { AmazonPriceConverter } from '../../../src/application/converters/amazon-price-converter';
import { MeliPriceConverter } from '../../../src/application/converters/meli-price-converter';
import { PriceConverter } from '../../../src/application/converters/price-converter';
import { Currency } from '../../../src/models/currency.enum';
import { JobInformation } from '../../../src/models/job-information';
import { FakePriceConverter } from '../fake-price-converter';

describe('convert', () => {
  const jobInformation = new JobInformation(5, 8, Currency.ARS, 1000000, 1000);
  const data: {
    caseDescription: string;
    converter: PriceConverter;
    html: string;
    expectedHtml: string;
  }[] = [
    {
      caseDescription:
        'should replace elements according to converter configuration',
      converter: new FakePriceConverter(
        document,
        [
          {
            selector: '.price-value-without-symbol span:nth-child(2)',
            includeSymbol: false,
          },
          { selector: '.price-value-with-symbol span', includeSymbol: true },
        ],
        ['.price-symbol'],
        ['.cents'],
        Currency.ARS,
        ',',
      ),
      html: `
        <div class="price-value-without-symbol">
            <span class="price-symbol">$</span>
            <span>1.000.000,000</span>
            <span class="cents">99</span>
        </div>
        <div class="price-value-with-symbol">
            <span>$1.000.000,000</span>
        </div>`,
      expectedHtml: `
        <div class="price-value-without-symbol">
            <span class="price-symbol" data-original-value="$">⏱️<converted></converted></span>
            <span data-original-value="1.000.000,000">1 Mes<converted></converted></span>
            <span class="cents time-convertion-hide">99</span>
        </div>
        <div class="price-value-with-symbol">
            <span data-original-value="$1.000.000,000">⏱️ 1 Mes<converted></converted></span>
        </div>`,
    },
    {
      caseDescription:
        'should replace using custom decimal separator and currency',
      converter: new FakePriceConverter(
        document,
        [{ selector: '.price-value', includeSymbol: false }],
        [],
        [],
        Currency.USD,
        '.',
      ),
      html: `<span class="price-value">$1,000.00</span>`,
      expectedHtml: `
        <span class="price-value" data-original-value="$1,000.00">
          1 Mes<converted></converted>
        </span>`,
    },
    {
      caseDescription: 'with AmazonConverter should change to ARS',
      converter: new AmazonPriceConverter(document),
      html: `
        <span class="a-price a-text-price">
          <span class="a-offscreen">ARS&nbsp;1,000,000.00</span>
          <span aria-hidden="true">ARS1,000,000.00</span>
        </span>`,
      expectedHtml: `
        <span class="a-price a-text-price">
          <span class="a-offscreen">ARS&nbsp;1,000,000.00</span>
          <span aria-hidden="true" data-original-value="ARS1,000,000.00">
            1 Mes<converted></converted>
          </span>
        </span>`,
    },
  ];

  describe.each(data)(`Convert `, (params) => {
    it(params.caseDescription, async () => {
      document.body.innerHTML = params.html;

      await params.converter.convert(jobInformation);

      expect(removeTabsAndNewLines(document.body.innerHTML)).toBe(
        removeTabsAndNewLines(params.expectedHtml),
      );
    });
  });
});

describe('revert', () => {
  it('should leave document as orignial without attributes or classes', async () => {
    document.body.innerHTML = `
    <div class="price-value-without-symbol">
        <span class="price-symbol" data-original-value="$">⏱️<converted></converted></span>
        <span data-original-value="1.000.000,000">1 mes<converted></converted></span>
        <span class="cents time-convertion-hide">99</span>
    </span>`;
    const expectedHtml = `
    <div class="price-value-without-symbol">
        <span class="price-symbol">$</span>
        <span>1.000.000,000</span>
        <span class="cents time-convertion-hide">99</span>
    </div>`; // TODO: fix showCents function

    const meliPriceConverter = new MeliPriceConverter(document);
    await meliPriceConverter.revert();

    expect(document.body.innerHTML).toBe(expectedHtml);
  });
});

function removeTabsAndNewLines(str: string): string {
  return str.replace(/ {2}|\r\n|\n|\r/gm, '');
}
