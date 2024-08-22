import { Currency } from '../../models/currency.enum';
import { JobInformation } from '../../models/job-information';
import {
  PriceConverter,
  CONVERTED_TAG,
  ORIGINAL_VALUE_ATTRIBUTE,
  TIME_SYMBOL,
  HIDE_CLASS,
} from './price-converter.interface';

interface PriceSelector {
  selector: string;
  includeSymbol: boolean;
}

const PRICE_VALUE_SELECTORS: PriceSelector[] = [
  {
    selector: '.mus-pro-price-save',
    includeSymbol: true,
  },
  {
    selector: '.mus-pro-price-price',
    includeSymbol: true,
  },
  {
    selector: '.mus-pro-price-number span',
    includeSymbol: true,
  },
  {
    selector: '.mus-pro-quotes-price',
    includeSymbol: false,
  },
];
const PRICE_SYMBOL_SELECTORS = ['.mus-pro-quotes-currency'];
const CENTS_SELECTOR = '.mus-pro-quotes-decimals';

export class MusimundoPriceConverter implements PriceConverter {
  constructor(private _document: Document) {}

  async convert(jobInformation: JobInformation): Promise<void> {
    if (jobInformation.hasMissingData()) {
      return;
    }

    await this.replacePrices(jobInformation);
    await this.replaceSymbols();
    await this.removeCents();
  }

  async revert(): Promise<void> {
    await this.revertConvertedElements();
    await this.showCents();
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
    PRICE_VALUE_SELECTORS.forEach(async (priceSelector) => {
      const filteredPrices = this._document.querySelectorAll(
        priceSelector.selector,
      );
      const prices = Array.from(filteredPrices).filter((element) => {
        return !element.querySelector(CONVERTED_TAG);
      });

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
            (priceSelector.includeSymbol ? `${TIME_SYMBOL} ` : '') +
              priceConvertion.toShortStringRepresentation(),
          );
        }),
      );
    });
  }

  private async replaceSymbols(): Promise<void> {
    const filteredCurrencySimbols = this._document.querySelectorAll(
      PRICE_SYMBOL_SELECTORS.join(','),
    );
    const currencySimbols = Array.from(filteredCurrencySimbols).filter(
      (element) => {
        return !element.querySelector(CONVERTED_TAG);
      },
    );
    await Promise.all(
      Array.from(currencySimbols, (symbolElement) => {
        const originalValue = symbolElement.textContent;
        this.convertElement(symbolElement, originalValue, TIME_SYMBOL);
      }),
    );
  }

  private async removeCents() {
    const cents = this._document.querySelectorAll(
      `${CENTS_SELECTOR}:not(.${HIDE_CLASS})`,
    );
    cents.forEach((cent) => {
      cent.classList.add(HIDE_CLASS);
    });
  }

  private async showCents() {
    const cents = this._document.querySelectorAll(CENTS_SELECTOR);
    cents.forEach((cent) => {
      cent.classList.remove(HIDE_CLASS);
    });
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
