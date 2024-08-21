import { Currency } from '../../models/currency.enum';
import { JobInformation } from '../../models/job-information';
import { PriceConverter } from './price-converter.interface';

const PRICE_VALUE_SELECTORS = [
  '.andes-money-amount__fraction',
  '.dynamic-carousel__price span',
];
const PRICE_SYMBOL_SELECTOR = '.andes-money-amount__currency-symbol';
const CENTS_SELECTOR = '.andes-money-amount__cents';
const TIME_SYMBOL = `⏱️`;
const ORIGINAL_VALUE_ATTRIBUTE = 'data-original-value';
const CONVERTED_TAG = 'converted';
const HIDE_CLASS = 'time-convertion-hide';
const USD_KEYWORD = 'dólares';

export class MeliPriceConverter implements PriceConverter {
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
        const regex = /\d+/g;
        const matches = originalValue.match(regex);
        const price = +matches.join('');
        const priceConvertion = jobInformation.getTimeConvertion(
          price,
          await this.getElementCurrency(priceElement),
        );

        return this.convertElement(
          priceElement,
          originalValue,
          priceConvertion.toShortStringRepresentation(),
        );
      }),
    );
  }

  private async getElementCurrency(element: Element): Promise<Currency> {
    const isPriceInDolars = element.parentElement
      ?.getAttribute('aria-label')
      ?.includes(USD_KEYWORD);

    return isPriceInDolars ? Currency.USD : Currency.ARS;
  }

  private async replaceSymbols(): Promise<void> {
    const filteredCurrencySimbols = this._document.querySelectorAll(
      PRICE_SYMBOL_SELECTOR,
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
