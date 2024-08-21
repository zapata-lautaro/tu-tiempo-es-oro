import { Currency } from '../../models/currency.enum';
import { JobInformation } from '../../models/job-information';
import {
  PriceConverter,
  CONVERTED_TAG,
  ORIGINAL_VALUE_ATTRIBUTE,
  TIME_SYMBOL,
} from './price-converter.interface';

const PRICE_VALUE_SELECTORS = [
  'div[data-test-id="product-price"] span:not([data-test-id="discount-tag"])',
  'div[data-test-id="price-wrapper"] span:not(:nth-child(3))',
];

export class FravegaPriceConverter implements PriceConverter {
  constructor(private _document: Document) {}

  async convert(jobInformation: JobInformation): Promise<void> {
    if (jobInformation.hasMissingData()) {
      return;
    }

    await this.replacePrices(jobInformation);
  }

  async revert(): Promise<void> {
    await this.revertConvertedElements();
  }

  private async revertConvertedElements() {
    const convertedElements = this._document.querySelectorAll(
      `[${ORIGINAL_VALUE_ATTRIBUTE}]`,
    );
    convertedElements.forEach((convertedElement) => {
      const originalValue = convertedElement.getAttribute(
        ORIGINAL_VALUE_ATTRIBUTE,
      );
      convertedElement.removeAttribute(ORIGINAL_VALUE_ATTRIBUTE);
      convertedElement.textContent = originalValue;
    });
  }

  private async replacePrices(jobInformation: JobInformation): Promise<void> {
    const filteredPrices = this._document.querySelectorAll(
      PRICE_VALUE_SELECTORS.join(','),
    );
    const prices = Array.from(filteredPrices).filter((element) => {
      return !element.querySelector(CONVERTED_TAG);
    });

    if (!prices) return;

    await Promise.all(
      Array.from(prices, async (priceElement) => {
        const originalValue = priceElement!.textContent;
        const regex = /(?<!,)\b\d+/g;
        const matches = originalValue.match(regex);
        const price = +matches.join('');
        const priceConvertion = jobInformation.getTimeConvertion(
          price,
          Currency.ARS,
        );

        return this.convertElement(
          priceElement,
          originalValue,
          `${TIME_SYMBOL} ${priceConvertion.toShortStringRepresentation()}`,
        );
      }),
    );
  }

  private async convertElement(
    element: Element,
    originalContent: string,
    newContent: string,
  ) {
    element.setAttribute(ORIGINAL_VALUE_ATTRIBUTE, originalContent);
    element.innerHTML = newContent + `<${CONVERTED_TAG}>`;
  }
}
