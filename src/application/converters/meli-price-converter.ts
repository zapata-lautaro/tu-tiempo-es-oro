import { Currency } from '../../models/currency.enum';
import { JobInformation } from '../../models/job-information';
import { PriceConverter } from './price-converter.interface';

const PRICE_VALUE_SELECTOR = '.andes-money-amount__fraction';
const PRICE_SYMBOL_SELECTOR = '.andes-money-amount__currency-symbol';
const CENTS_SELECTOR = '.andes-money-amount__cents';
const TIME_SYMBOL = `⏱️`;
const CONVERTED_ELEMENT_CLASS = 'time-convertion';
const ORIGINAL_ELEMENT_CLASS = 'original';
const USD_KEYWORD = 'dólares';

export class MeliPriceConverter implements PriceConverter {
  constructor(
    private _document: Document,
    private _jobInformation: JobInformation,
  ) {}

  convert(): void {
    this.replacePrices();
    this.replaceSymbols();

    const cents = this._document.querySelectorAll(CENTS_SELECTOR);
    cents.forEach((centElement) => {
      (centElement as HTMLElement).classList.add(ORIGINAL_ELEMENT_CLASS);
    });
  }

  revert(): void {
    const convertedElements = this._document.querySelectorAll(
      `.${CONVERTED_ELEMENT_CLASS}`,
    );
    convertedElements.forEach((convertedElement) => {
      convertedElement.remove();
    });

    const originalElements = this._document.querySelectorAll(
      `.${ORIGINAL_ELEMENT_CLASS}`,
    );
    originalElements.forEach((originalElement) => {
      originalElement.classList.remove(ORIGINAL_ELEMENT_CLASS);
    });
  }

  private replacePrices(): void {
    const prices = this._document.querySelectorAll(
      `${PRICE_VALUE_SELECTOR}:not(.${ORIGINAL_ELEMENT_CLASS}, .${CONVERTED_ELEMENT_CLASS})`,
    );

    if (!prices) return;

    prices.forEach((priceElement: Element) => {
      const price = +priceElement!.textContent!.replace(/\./g, '');
      const priceConvertion = this._jobInformation.getTimeConvertion(
        price,
        this.getElementCurrency(priceElement),
      );

      this.convertElement(
        priceElement,
        priceConvertion.toShortStringRepresentation(),
        ORIGINAL_ELEMENT_CLASS,
        CONVERTED_ELEMENT_CLASS,
      );
    });
  }

  private getElementCurrency(element: Element): Currency {
    const isPriceInDolars = element.parentElement
      ?.getAttribute('aria-label')
      .includes(USD_KEYWORD);

    return isPriceInDolars ? Currency.USD : Currency.ARS;
  }

  private replaceSymbols(): void {
    const currencySimbols = this._document.querySelectorAll(
      PRICE_SYMBOL_SELECTOR,
    );
    currencySimbols.forEach((symbolElement) => {
      this.convertElement(
        symbolElement,
        TIME_SYMBOL,
        ORIGINAL_ELEMENT_CLASS,
        CONVERTED_ELEMENT_CLASS,
      );
    });
  }

  private convertElement(
    element: Element,
    content: string,
    oldElementClass: string,
    convertedElementClass: string,
  ) {
    const convertedElement = element.cloneNode() as Element;
    element.classList.add(oldElementClass);

    convertedElement.classList.add(convertedElementClass);
    convertedElement.textContent = content;

    element.insertAdjacentElement('beforebegin', convertedElement);
  }
}
