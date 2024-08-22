import { Currency } from '../../models/currency.enum';
import { PriceConverter, PriceSelector } from './price-converter';

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
const CENTS_SELECTORS = ['.mus-pro-quotes-decimals'];

export class MusimundoPriceConverter extends PriceConverter {
  constructor(document: Document) {
    super(
      document,
      PRICE_VALUE_SELECTORS,
      PRICE_SYMBOL_SELECTORS,
      CENTS_SELECTORS,
      Currency.ARS,
    );
  }
}
