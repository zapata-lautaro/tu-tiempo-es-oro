import { Currency } from '../../models/currency.enum';
import { PriceConverter, PriceSelector } from './price-converter';

const PRICE_VALUE_SELECTORS: PriceSelector[] = [
  { selector: '.andes-money-amount__fraction', includeSymbol: false },
  { selector: '.dynamic-carousel__price span', includeSymbol: false },
];
const PRICE_SYMBOL_SELECTORS = ['.andes-money-amount__currency-symbol'];
const CENTS_SELECTORS = ['.andes-money-amount__cents'];
const USD_KEYWORD = 'dólares';

export class MeliPriceConverter extends PriceConverter {
  constructor(document: Document) {
    super(
      document,
      PRICE_VALUE_SELECTORS,
      PRICE_SYMBOL_SELECTORS,
      CENTS_SELECTORS,
      Currency.ARS,
    );
  }

  protected override priceElementCurrencyGetter(element: Element): Currency {
    const isPriceInDolars = element.parentElement
      ?.getAttribute('aria-label')
      ?.includes(USD_KEYWORD);

    return isPriceInDolars ? Currency.USD : Currency.ARS;
  }
}
