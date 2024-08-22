import { Currency } from '../../models/currency.enum';
import {
  ORIGINAL_VALUE_ATTRIBUTE,
  PriceConverter,
  PriceSelector,
} from './price-converter';

const PRICE_VALUE_SELECTORS: PriceSelector[] = [
  {
    selector: '.a-price-whole',
    includeSymbol: false,
  },
  {
    selector: '.a-text-price span:last-child',
    includeSymbol: false,
  },
];
const PRICE_SYMBOL_SELECTORS = ['.a-price-symbol'];
const CENTS_SELECTORS = ['.a-price-fraction'];
const DECIMAL_SEPARATOR = '.';
const ARS_KEYWORD = 'ARS';

export class AmazonPriceConverter extends PriceConverter {
  constructor(document: Document) {
    super(
      document,
      PRICE_VALUE_SELECTORS,
      PRICE_SYMBOL_SELECTORS,
      CENTS_SELECTORS,
      Currency.USD,
      DECIMAL_SEPARATOR,
    );
  }

  protected override priceElementCurrencyGetter(element: Element): Currency {
    let isPriceInArs = element.parentElement
      .querySelector(PRICE_SYMBOL_SELECTORS[0])
      ?.textContent.toUpperCase()
      ?.includes(ARS_KEYWORD);

    isPriceInArs = isPriceInArs || element.textContent?.includes(ARS_KEYWORD);

    return isPriceInArs ? Currency.ARS : Currency.USD;
  }
}
