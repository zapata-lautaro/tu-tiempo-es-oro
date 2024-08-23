import { Currency } from '../../models/currency.enum';
import { PriceConverter, PriceSelector } from './price-converter';

const PRICE_VALUE_SELECTORS: PriceSelector[] = [
  { selector: '.price span:last-child', includeSymbol: false },
  {
    selector: '.text-no-wrap.grey--text.font-2 span:last-child',
    includeSymbol: false,
  },
  { selector: '.discount-tag-price', includeSymbol: false },
  {
    selector:
      'div[alternativediscountposition] .text-no-wrap.grey--text span:last-child',
    includeSymbol: false,
  },
];
const PRICE_SYMBOL_SELECTORS = [
  '.price span:nth-child(2)',
  '.text-no-wrap.grey--text.font-2 span:nth-child(2)',
  'div[alternativediscountposition] .text-no-wrap.grey--text span:nth-child(2)',
];

export class GarbarinoPriceConverter extends PriceConverter {
  constructor(document: Document) {
    super(
      document,
      PRICE_VALUE_SELECTORS,
      PRICE_SYMBOL_SELECTORS,
      [],
      Currency.ARS,
    );
  }
}
