import { Currency } from '../../models/currency.enum';
import { JobInformation } from '../../models/job-information';

export const TIME_SYMBOL = `⏱️`;
export const ORIGINAL_VALUE_ATTRIBUTE = 'data-original-value';
export const CONVERTED_TAG = 'converted';
export const HIDE_CLASS = 'time-convertion-hide';

export interface PriceSelector {
  selector: string;
  includeSymbol: boolean;
}

export abstract class PriceConverter {
  constructor(
    private _document: Document,
    private _priceValueSelectors: PriceSelector[],
    private _priceSymbolSelectors: string[],
    private _centsSelectors: string[],
    private _defaultCurrency: Currency,
  ) {}

  public async convert(jobInformation: JobInformation): Promise<void> {
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
    this._priceValueSelectors.forEach(async (priceSelector) => {
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
            this.priceElementCurrencyGetter(priceElement),
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected priceElementCurrencyGetter(element: Element): Currency {
    return this._defaultCurrency;
  }

  private async replaceSymbols(): Promise<void> {
    const filteredCurrencySimbols = this._document.querySelectorAll(
      this._priceSymbolSelectors.join(','),
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
      this._centsSelectors
        .map((selector) => `${selector}:not(.${HIDE_CLASS})`)
        .join(','),
    );
    cents.forEach((cent) => {
      cent.classList.add(HIDE_CLASS);
    });
  }

  private async showCents() {
    const cents = this._document.querySelectorAll(
      this._centsSelectors.join(','),
    );
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
